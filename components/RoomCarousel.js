import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { getApiUrl } from '../src/getApiUrl';

const RoomCarousel = ({ onSelectRoom }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const url = await getApiUrl();
        const res = await axios.get(`${url}/api/ruangan`);
        setRooms(res.data.data);
      } catch (error) {
        console.error('Gagal memuat ruangan:', error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      {rooms.map((room) => (
        <TouchableOpacity
          key={room.id}
          style={styles.card}
          onPress={() => onSelectRoom(room)}
        >
          <Text style={styles.name}>{room.nama}</Text>
          {room.lokasi && <Text style={styles.sub}>{room.lokasi}</Text>}
          {room.kapasitas && <Text style={styles.sub}>Kapasitas: {room.kapasitas}</Text>}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default RoomCarousel;

const styles = StyleSheet.create({
  scroll: {
    marginTop: 10,
    marginBottom: 20,
    paddingLeft: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    padding: 12,
    width: 160,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sub: {
    fontSize: 14,
    color: '#6B7280',
  },
});
