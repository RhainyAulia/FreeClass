import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import HeaderLogo from '../components/HeaderLogo.js';
import RoomCarousel from '../components/RoomCarousel.js';
import axios from 'axios';
import { getApiUrl } from '../src/getApiUrl.js';

const HomeScreen = ({ navigation }) => {
  const [kodePinjam, setKodePinjam] = useState('');
  const [currentTime, setCurrentTime] = useState(moment());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  //SearchBar
  const handleCariKode = async () => {
    if (!kodePinjam.trim()) {
      alert('Masukkan kode peminjaman terlebih dahulu');
      return;
    }

    try {
      const apiUrl = await getApiUrl();
      const response = await axios.get(`${apiUrl}/api/peminjaman/${kodePinjam.trim()}`);

      const dataPeminjaman = response.data.data;
      navigation.navigate('Status', { dataPeminjaman });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('Kode peminjaman tidak ditemukan.');
      } else {
        alert('Terjadi kesalahan saat mencari data.');
        console.error('Cari kode error:', error.message);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderLogo />

      <Text style={styles.heading}>Dashboard</Text>

<View style={styles.searchRow}>
  <TextInput
    style={styles.inputInline}
    placeholder="Masukkan Kode Pinjam"
    value={kodePinjam}
    onChangeText={setKodePinjam}
  />
  <TouchableOpacity style={styles.searchButton} onPress={handleCariKode}>
    <Text style={styles.buttonText}>Cek</Text>
  </TouchableOpacity>
</View>


      <View style={styles.card}>
        <Text style={styles.date}>{currentTime.format('dddd, D MMMM YYYY')}</Text>
        <Text style={styles.time}>{currentTime.format('HH : mm')} WIB</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Form')}
        >
          <Text style={styles.buttonText}>Pinjam Kelas</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    flexGrow: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  input: {
    color: 'grey',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  date: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
  },
  time: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4ADE80',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A855F7',
    marginBottom: 12,
  },
  roomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  roomName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  roomTime: {
    fontSize: 14,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
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

  searchRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 16,
},
inputInline: {
  flex: 1,
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 12,
  elevation: 2,
  marginRight: 8,
},
searchButton: {
  backgroundColor: '#6366F1',
  borderRadius: 10,
  paddingVertical: 12,
  paddingHorizontal: 16,
},

});
