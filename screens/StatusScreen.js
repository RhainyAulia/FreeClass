import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getApiUrl } from '../src/getApiUrl';

const StatusScreen = ({ route }) => {
  const { dataPeminjaman: initialData } = route.params;
  const navigation = useNavigation();
  const [dataPeminjaman, setDataPeminjaman] = useState(initialData);
  const [loading, setLoading] = useState(false);

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

  const salinKode = async () => {
    await Clipboard.setStringAsync(dataPeminjaman.kode_peminjaman);
    Alert.alert('Disalin', 'Kode peminjaman telah disalin ke clipboard.');
  };

  const konfirmasiPembatalan = () => {
    Alert.alert(
      'Batalkan Peminjaman',
      'Apakah kamu yakin ingin membatalkan peminjaman ini?',
      [
        { text: 'Tidak', style: 'cancel' },
        {
          text: 'Ya, Batalkan',
          style: 'destructive',
          onPress: async () => {
            try {
              const apiUrl = await getApiUrl();
              const kode = dataPeminjaman.kode_peminjaman;
              await axios.put(`${apiUrl}/api/peminjaman/${kode}/batal`);
              Alert.alert('Berhasil', 'Peminjaman berhasil dibatalkan.');
              navigation.navigate('Dashboard');
            } catch (error) {
              Alert.alert('Gagal', 'Peminjaman tidak bisa dibatalkan.');
            }
          },
        },
      ]
    );
  };

  const refreshStatus = async () => {
    try {
      setLoading(true);
      const apiUrl = await getApiUrl();
      const response = await axios.get(`${apiUrl}/api/peminjaman/${dataPeminjaman.kode_peminjaman}`);
      setDataPeminjaman(response.data.data);
    } catch (error) {
      Alert.alert('Gagal Memuat', 'Gagal memperbarui status peminjaman.');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = {
    menunggu: '#8B5CF6',
    disetujui: 'green',
    dibatalkan: 'red',
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Status Peminjaman</Text>
      </View>

      <Image
        source={require('../assets/FREECLASS_SEC_LOGO.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.codeText}>{dataPeminjaman.kode_peminjaman}</Text>

      <View style={styles.detailCard}>
        <Text style={styles.detailLabel}>Nama Peminjam</Text>
        <Text style={styles.detailText}>{dataPeminjaman.nama_peminjam}</Text>

        <Text style={styles.detailLabel}>Tanggal</Text>
        <Text style={styles.detailText}>{dataPeminjaman.tanggal}</Text>

        <Text style={styles.detailLabel}>Waktu</Text>
        <Text style={styles.detailText}>
          {dataPeminjaman.jam_mulai} - {dataPeminjaman.jam_selesai} WIB
        </Text>

        <Text style={styles.detailLabel}>Tujuan Pinjam</Text>
        <Text style={styles.detailText}>{dataPeminjaman.tujuan}</Text>
      </View>

      <View style={styles.rowCard}>
        <View style={styles.rowItem}>
          <Text style={styles.rowLabel}>Ruang</Text>
          <Text style={styles.roomText}>{dataPeminjaman.kode_ruangan}</Text>
        </View>
        <View style={styles.rowItem}>
          <Text style={styles.rowLabel}>Status</Text>
          <Text style={{ fontWeight: 'bold', color: statusColor[dataPeminjaman.status] || '#8B5CF6' }}>
            {dataPeminjaman.status?.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.detailLabel}>Catatan</Text>
        <Text style={styles.detailText}>{dataPeminjaman.catatan || '-'}</Text>
      </View>

      <TouchableOpacity style={styles.cancelButton} onPress={konfirmasiPembatalan}>
        <Text style={styles.cancelButtonText}>Batalkan Peminjaman</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.cancelButton, { backgroundColor: '#6B7280', marginTop: 10 }]}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.cancelButtonText}>Kembali ke Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.cancelButton, { backgroundColor: '#10B981', marginTop: 10 }]}
        onPress={refreshStatus}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.cancelButtonText}>Refresh Status</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default StatusScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#C4B5FD',
    width: '100%',
    paddingVertical: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logo: {
    width: 160,
    height: 60,
    marginVertical: 8,
  },
  codeText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
    fontWeight: '500',
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 8,
  },
  detailText: {
    color: '#111827',
    fontSize: 15,
    marginBottom: 4,
  },
  rowCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  rowItem: {
    flex: 1,
    alignItems: 'center',
  },
  rowLabel: {
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  roomText: {
    fontWeight: 'bold',
    color: '#8B5CF6',
    fontSize: 16,
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
