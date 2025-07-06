import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StatusScreen = () => {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState([]);

  const handleSearch = async () => {
    try {
      const data = await AsyncStorage.getItem('peminjaman');
      const list = data ? JSON.parse(data) : [];

      const filtered = list.filter(
        (item) =>
          item.nama.toLowerCase().includes(keyword.toLowerCase()) ||
          item.id.toString() === keyword
      );

      if (filtered.length === 0) {
        alert('Tidak ditemukan', 'Tidak ada peminjaman yang sesuai.');
      }

      setResult(filtered);
    } catch (error) {
      alert('Error', 'Gagal memuat data.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.label}>ID: {item.id}</Text>
      <Text>Nama: {item.nama}</Text>
      <Text>Ruangan: {item.ruangan}</Text>
      <Text>Tanggal: {item.tanggal}</Text>
      <Text>Jam: {item.jamMulai} - {item.jamSelesai}</Text>
      <Text style={[
        styles.status,
        item.status === 'Disetujui' ? styles.approved :
        item.status === 'Ditolak' ? styles.rejected :
        styles.pending
      ]}>
        Status: {item.status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cek Status Peminjaman</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan Nama atau ID"
        value={keyword}
        onChangeText={setKeyword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Cek Status</Text>
      </TouchableOpacity>

      <FlatList
        data={result}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 20 }}
      />
    </View>
  );
};

export default StatusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#8B5CF6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  status: {
    marginTop: 6,
    fontWeight: 'bold',
  },
  approved: {
    color: 'green',
  },
  rejected: {
    color: 'red',
  },
  pending: {
    color: 'orange',
  },
});
