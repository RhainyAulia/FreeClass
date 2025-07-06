import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '../env';

fetch(`${API_URL}/ruangan-terpakai`)
  .then(response => response.json())
  .then(data => {
    // proses data di sini
  })
  .catch(error => {
    // handle error
  });

const response = await axios.get(
  `${API_URL}/ruangan-terpakai?date=${currentDate}&slot=${slot}`
);
  
const groupRooms = (data, size) => {
  const grouped = [];
  for (let i = 0; i < data.length; i += size) {
    grouped.push(data.slice(i, i + size));
  }
  return grouped;
};

const { width } = Dimensions.get('window');
const cardSize = (width - 60) / 2;

const RoomCarousel = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date();
      const currentDate = now.toISOString().split('T')[0]; // format YYYY-MM-DD

      // JAM SLOT LOGIC (customize sesuai slot sistemmu)
      const currentHour = now.getHours();
      let slot = 1;
      if (currentHour >= 7 && currentHour < 10) slot = 1;
      else if (currentHour >= 10 && currentHour < 13) slot = 2;
      else if (currentHour >= 13 && currentHour < 15) slot = 3;
      else if (currentHour >= 15 && currentHour < 18) slot = 4;
      else if (currentHour >= 18 && currentHour < 20) slot = 5;

      // Ganti URL API kamu di sini:
      const response = await axios.get(
        `${API_URL}/ruangan-terpakai?date=${currentDate}&slot=${slot}`
      );

      const data = response.data;

      if (!Array.isArray(data)) {
        throw new Error('Format data tidak valid. Harus array.');
      }

      setRooms(data);
    } catch (err) {
      console.error('Gagal mengambil data ruangan:', err.message);
      setError('Gagal memuat data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const groupedRooms = groupRooms(rooms, 4);

  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      {Array.isArray(item) ? (
        item.map((room, idx) => (
          <View style={styles.card} key={room.id || idx}>
            <Text style={styles.name}>{room.nama_ruangan || '-'}</Text>
            <Text style={styles.time}>{room.waktu || '-'}</Text>
          </View>
        ))
      ) : (
        <Text style={{ color: 'red' }}>Data tidak valid</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#A855F7" />
        <Text style={{ marginTop: 10 }}>Memuat data ruangan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
        <Text onPress={fetchRooms} style={{ color: '#6366F1', textDecorationLine: 'underline' }}>
          Coba lagi
        </Text>
      </View>
    );
  }

  if (!rooms.length) {
    return (
      <View style={styles.loading}>
        <Text>Tidak ada ruangan yang terpakai saat ini.</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={groupedRooms}
        renderItem={renderSlide}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <View style={styles.pagination}>
        {groupedRooms.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

export default RoomCarousel;

const styles = StyleSheet.create({
  slide: {
    width: width,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  card: {
    width: cardSize,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    elevation: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  time: {
    fontSize: 12,
    marginTop: 4,
    color: '#4B5563',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#A855F7',
  },
  loading: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
