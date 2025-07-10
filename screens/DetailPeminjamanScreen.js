import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import axios from 'axios';
import { getApiUrl } from '../src/getApiUrl.js';
import HeaderLogo from '../components/HeaderLogo.js';

const DetailPeminjamanScreen = ({ navigation, route }) => {
  const kode = route?.params?.dataPeminjaman?.kode_peminjaman;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = await getApiUrl();
        const response = await axios.get(`${apiUrl}/api/peminjaman/${kode}`);
        setData(response.data.data);
      } catch (err) {
        Alert.alert('Gagal mengambil data', err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kode]);

  const handleCopy = () => {
    Clipboard.setString(data.kode_peminjaman);
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
              const res = await axios.put(`${apiUrl}/api/peminjaman/${kode}/batal`);
              Alert.alert('Berhasil', res.data.message);
              navigation.navigate('Dashboard');
            } catch (err) {
              Alert.alert('Gagal', err.response?.data?.message || 'Kesalahan server');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#EF4444' }}>Data peminjaman tidak ditemukan.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const waktu = `${data.jam_mulai?.slice(0, 5)} - ${data.jam_selesai?.slice(0, 5)}`;
  const tanggalFormatted = new Date(data.tanggal).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Detail Peminjaman</Text>
      </View>

      <HeaderLogo />

      <View style={styles.card}>
        <Text style={styles.label}>Status</Text>
        <Text style={[styles.value, styles.status]}>
          {data.status === 'menunggu' ? 'PENDING' : data.status.toUpperCase()}
        </Text>

        <View style={styles.kodeRow}>
          <View>
            <Text style={styles.label}>Kode Peminjaman</Text>
            <Text style={styles.kode}>{data.kode_peminjaman}</Text>
          </View>
          <TouchableOpacity onPress={handleCopy}>
            <Text style={styles.copyText}>📋</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.bold}>Nama Peminjam</Text>
        <Text style={styles.normal}>{data.nama_peminjam}</Text>

        <Text style={styles.bold}>Tanggal</Text>
        <Text style={styles.normal}>{tanggalFormatted}</Text>

        <Text style={styles.bold}>Waktu</Text>
        <Text style={styles.normal}>{waktu}</Text>

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
