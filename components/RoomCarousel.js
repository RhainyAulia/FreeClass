import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { getApiUrl } from '../src/getApiUrl.js';

const { width } = Dimensions.get('window');
const cardSize = (width - 60) / 2;

const groupRooms = (data, size) => {
  const grouped = [];
  for (let i = 0; i < data.length; i += size) {
    grouped.push(data.slice(i, i + size));
  }
  return grouped;
};

const RoomCarousel = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_URL = await getApiUrl();
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentHour = now.getHours();

      let slot = 1;
      if (currentHour >= 10 && currentHour < 13) slot = 2;
      else if (currentHour >= 13 && currentHour < 15) slot = 3;
      else if (currentHour >= 15 && currentHour < 18) slot = 4;
      else if (currentHour >= 18 && currentHour < 20) slot = 5;

      const endpoint = `${API_URL}/ruangan-terpakai?tanggal=${currentDate}&id_slot=${slot}`;
      console.log('📡 FETCH:', endpoint);
      const res = await axios.get(endpoint);
      console.log('📥 RESPONSE:', res.data);

      if (!Array.isArray(res.data)) {
        throw new Error('Format data tidak valid (bukan array)');
      }

      setRooms(res.data);
    } catch (err) {
      console.error('❌ ERROR FETCH:', err.message);
      setError('Gagal memuat data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }; // ✅ ← PENUTUP fungsi fetchRooms, ini wajib!

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
      {item.map((room, idx) => (
        <View style={styles.card} key={room.id_ruangan || idx}>
          <Text style={styles.name}>{room.nama_ruangan || '-'}</Text>
          <Text style={styles.time}>{room.waktu || '-'}</Text>
        </View>
      ))}
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
