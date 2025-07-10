import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getApiUrl } from '../src/getApiUrl.js';

const StatusScreen = ({ route }) => {
  const { dataPeminjaman } = route.params;
  const navigation = useNavigation();

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

              const response = await axios.put(`${apiUrl}/api/peminjaman/${kode}/batal`);
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


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Status Peminjaman</Text>
      </View>

      <Image
        source={require('../assets/FREECLASS_SEC_LOGO.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Status</Text>
        <Text style={[styles.statusText, styles[dataPeminjaman.status?.toLowerCase()] || styles.pending]}>
          {dataPeminjaman.status?.toUpperCase()}
        </Text>
      </View>

      <View style={styles.codeCard}>
        <Text style={styles.codeLabel}>Kode Peminjaman</Text>
        <Text style={styles.codeText}>{dataPeminjaman.kode_peminjaman}</Text>

        <TouchableOpacity onPress={salinKode} style={styles.copyButton}>
          <Text style={styles.copyButtonText}>Salin</Text>
        </TouchableOpacity>
      </View>

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

      <Text style={styles.note}>
        Harap mencatat kode peminjaman yang diberikan untuk mengakses status peminjaman
      </Text>

      <TouchableOpacity style={styles.cancelButton} onPress={konfirmasiPembatalan}>
        <Text style={styles.cancelButtonText}>Batalkan Peminjaman</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.cancelButton, { backgroundColor: '#6B7280', marginTop: 10 }]}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.cancelButtonText}>Kembali ke Beranda</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StatusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    backgroundColor: '#C4B5FD',
    width: '100%',
    paddingVertical: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logo: {
    width: 160,
    height: 60,
    marginVertical: 16,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontWeight: '600',
    fontSize: 16,
    color: '#6B7280',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  pending: {
    color: '#8B5CF6',
  },
  disetujui: {
    color: 'green',
  },
  ditolak: {
    color: 'red',
  },
  codeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  codeLabel: {
    color: '#6B7280',
    marginBottom: 4,
    fontSize: 14,
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#111827',
  },
  copyButton: {
    marginTop: 8,
    backgroundColor: '#8B5CF6',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  note: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
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
