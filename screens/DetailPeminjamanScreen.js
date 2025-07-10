import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Clipboard,
  ToastAndroid,
} from 'react-native';
import axios from 'axios';
import { getApiUrl } from '../src/getApiUrl.js';
import HeaderLogo from '../components/HeaderLogo.js';

const DetailPeminjamanScreen = ({ navigation, route }) => {
  // Data dummy dari parameter route atau props
  const data = route?.params?.data || {
    kode: 'FC20250612001',
    status: 'PENDING',
    nama: 'John Doe',
    tanggal: 'Kamis, 12 Juni 2025',
    waktu: '13.00 - 15.30 WIB',
    tujuan: 'Belajar Bersama',
  };

  const handleCopy = () => {
    Clipboard.setString(data.kode);
    ToastAndroid.show('Kode disalin ke clipboard', ToastAndroid.SHORT);
  };

  const handleCancel = () => {
    Alert.alert(
      'Batalkan Peminjaman',
        'Yakin ingin batalkan?',
        [
          { text: 'Tidak', style: 'cancel' },
          {
            text: 'Ya',
            style: 'destructive',
            onPress: async () => {
              try {
                const apiUrl = await getApiUrl();
                const kode = data.kode;
                const res = await axios.put(`${apiUrl}/api/peminjaman/${kode}/batal`);
                Alert.alert('Berhasil', res.data.message);
                navigation.navigate('Dashboard');
              } catch (err) {
                console.error('Cancel error:', err.response?.data || err.message);
                Alert.alert('Gagal', err.response?.data?.message || 'Kesalahan server');
              }
            },
          }
        ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Detail Peminjaman</Text>
      </View>

      <HeaderLogo />

      <View style={styles.card}>
        <Text style={styles.label}>Status</Text>
          <Text style={[styles.value, styles.status]}>
            {data.status?.toLowerCase() === 'Menunggu' ? 'PENDING' : data.status?.toUpperCase()}
          </Text>

        <View style={styles.kodeRow}>
          <View>
            <Text style={styles.label}>Kode Peminjaman</Text>
            <Text style={styles.kode}>{data.kode}</Text>
          </View>
          <TouchableOpacity onPress={handleCopy}>
            <Text style={styles.copyText}>📋</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.bold}>Nama Peminjam</Text>
        <Text style={styles.normal}>{data.nama}</Text>

        <Text style={styles.bold}>Tanggal</Text>
        <Text style={styles.normal}>{data.tanggal}</Text>

        <Text style={styles.bold}>Waktu</Text>
        <Text style={styles.normal}>{data.waktu}</Text>

        <Text style={styles.bold}>Tujuan Pinjam</Text>
        <Text style={styles.normal}>{data.tujuan}</Text>
      </View>

      <Text style={styles.note}>
        Harap mencatat kode peminjaman yang diberikan untuk mengakses status peminjaman
      </Text>

      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelButtonText}>Batalkan Peminjaman</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.backLink}>← Kembali ke Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DetailPeminjamanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#A78BFA',
    width: '100%',
    paddingVertical: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  brand: {
    color: '#8B5CF6',
  },
  brandBlack: {
    color: '#111827',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    color: '#8B5CF6',
    marginBottom: 12,
  },
  kodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  copyText: {
    fontSize: 20,
    color: '#8B5CF6',
    marginLeft: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
    elevation: 2,
  },
  bold: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  normal: {
    marginBottom: 4,
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 16,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backLink: {
    fontSize: 14,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
});
