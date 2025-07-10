import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const StatusScreen = ({ route, navigation }) => {
  const { dataPeminjaman } = route.params;

  if (!dataPeminjaman) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Data tidak ditemukan</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
          <Text style={styles.buttonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Status Peminjaman</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Kode: {dataPeminjaman.kode_peminjaman}</Text>
        <Text>Nama: {dataPeminjaman.nama_peminjam}</Text>
        <Text>Jabatan: {dataPeminjaman.jabatan}</Text>
        <Text>Tanggal: {dataPeminjaman.tanggal}</Text>
        <Text>Jam: {dataPeminjaman.jam_mulai} - {dataPeminjaman.jam_selesai}</Text>
        <Text>ID Ruangan: {dataPeminjaman.id_ruangan}</Text>
        <Text>Tujuan: {dataPeminjaman.tujuan}</Text>
        <Text>Jumlah Orang: {dataPeminjaman.jumlah_orang}</Text>
        <Text
          style={[
            styles.status,
            dataPeminjaman.status === 'Disetujui' ? styles.approved :
            dataPeminjaman.status === 'Ditolak' ? styles.rejected :
            styles.pending
          ]}
        >
          Status: {dataPeminjaman.status}
        </Text>
      </View>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
        <Text style={styles.buttonText}>Kembali</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  status: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
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
  button: {
    backgroundColor: '#8B5CF6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
