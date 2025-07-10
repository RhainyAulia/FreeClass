import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { getApiUrl } from '../src/getApiUrl.js';

const JAM_MULAI = ['07:30', '10:15', '13:00', '15:45', '18:30', '20:30'];
const JAM_SELESAI = ['10:15', '13:00', '15:45', '18:30', '20:30', '22:00'];

const SLOT_WAKTU = {
  '07:30': 1,
  '10:15': 2,
  '13:00': 3,
  '15:45': 4,
  '18:30': 5,
  '20:30': 6,
};

const FormScreen = () => {
  const navigation = useNavigation();

  const [namaPeminjam, setNamaPeminjam] = useState('');
  const [npm, setNpm] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [tanggal, setTanggal] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tujuan, setTujuan] = useState('');
  const [jumlahOrang, setJumlahOrang] = useState('');

  const [jamMulai, setJamMulai] = useState(null);
  const [jamSelesai, setJamSelesai] = useState(null);
  const [openMulai, setOpenMulai] = useState(false);
  const [openSelesai, setOpenSelesai] = useState(false);
  const [itemsMulai, setItemsMulai] = useState(JAM_MULAI.map(jam => ({ label: jam, value: jam })));
  const [itemsSelesai, setItemsSelesai] = useState(JAM_SELESAI.map(jam => ({ label: jam, value: jam })));

  useEffect(() => {
    if (!jamMulai) {
      setItemsSelesai(JAM_SELESAI.map(jam => ({ label: jam, value: jam })));
      return;
    }

    const filtered = JAM_SELESAI.filter(jam => {
      const [jmH, jmM] = jamMulai.split(':').map(Number);
      const [jsH, jsM] = jam.split(':').map(Number);
      const jamMulaiMenit = jmH * 60 + jmM;
      const jamSelesaiMenit = jsH * 60 + jsM;
      return jamSelesaiMenit > jamMulaiMenit;
    });

    setItemsSelesai(filtered.map(jam => ({ label: jam, value: jam })));

    if (jamSelesai) {
      const [jmH, jmM] = jamMulai.split(':').map(Number);
      const [jsH, jsM] = jamSelesai.split(':').map(Number);
      const jamMulaiMenit = jmH * 60 + jmM;
      const jamSelesaiMenit = jsH * 60 + jsM;

      if (jamSelesaiMenit <= jamMulaiMenit) {
        setJamSelesai(null);
      }
    }
  }, [jamMulai]);

const handleSubmit = async () => {
  if (
    !namaPeminjam || !npm || !jabatan || !tujuan || !jumlahOrang ||
    !jamMulai || !jamSelesai
  ) {
    alert('Semua kolom wajib diisi!');
    return;
  }

  const slotId = SLOT_WAKTU[jamMulai];
  const idRuangan = 16; // sementara default ruangan

  const data = {
    nama_peminjam: namaPeminjam,
    jabatan: jabatan,
    tanggal: tanggal.toISOString().split('T')[0],
    jam_mulai: jamMulai,
    jam_selesai: jamSelesai,
    id_ruangan: idRuangan,
    id_slot: slotId,
    tujuan: tujuan,
    jumlah_orang: parseInt(jumlahOrang),
  };

  try {
    const apiUrl = await getApiUrl(); // Ambil URL dari api_url.json
    const response = await axios.post(`${apiUrl}/api/peminjaman`, data);

    const dataPeminjaman = response.data.data;
    const kode = response.data.kode_peminjaman;

    // Navigasi ke StatusScreen, kirim data peminjaman dan kode
    navigation.navigate('StatusScreen', { dataPeminjaman, kode });
  } catch (error) {
    console.error('Gagal kirim data:', error.response?.data || error.message);
    alert('Gagal mengirim data. Silakan coba lagi.');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerPurple}>
        <Text style={styles.heading}>Pinjam Kelas</Text>
      </View>

      <View style={styles.formWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Kembali ke Dashboard</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Nama Peminjam</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          placeholderTextColor="#9CA3AF"
          value={namaPeminjam}
          onChangeText={setNamaPeminjam}
        />

        <Text style={styles.label}>Jabatan / Posisi</Text>
        <TextInput
          style={styles.input}
          placeholder="Mahasiswa / Dosen"
          placeholderTextColor="#9CA3AF"
          value={jabatan}
          onChangeText={setJabatan}
        />

        <Text style={styles.label}>NPM / NIP</Text>
        <TextInput
          style={styles.input}
          placeholder="232310000"
          placeholderTextColor="#9CA3AF"
          value={npm}
          onChangeText={setNpm}
        />

        <Text style={styles.label}>Tanggal</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text>{tanggal.toLocaleDateString('id-ID')}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={tanggal}
            mode="date"
            display="calendar"
            minimumDate={new Date()}
            maximumDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setTanggal(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Waktu</Text>
        <View style={[styles.rowTime, { zIndex: 999 }]}>
          <View style={{ flex: 1, marginRight: 8, zIndex: openMulai ? 1000 : 1 }}>
            <DropDownPicker
              open={openMulai}
              value={jamMulai}
              items={itemsMulai}
              setOpen={setOpenMulai}
              setValue={setJamMulai}
              setItems={setItemsMulai}
              placeholder="Jam Mulai"
              placeholderTextColor="#9CA3AF"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              selectedItemContainerStyle={{ backgroundColor: '#C4B5FD' }}
              selectedItemLabelStyle={{ color: '#4C1D95', fontWeight: 'bold' }}
            />
          </View>

          <View style={{ flex: 1, zIndex: openSelesai ? 999 : 0 }}>
            <DropDownPicker
              open={openSelesai}
              value={jamSelesai}
              items={itemsSelesai}
              setOpen={setOpenSelesai}
              setValue={setJamSelesai}
              setItems={setItemsSelesai}
              placeholder="Jam Selesai"
              placeholderTextColor="#9CA3AF"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              selectedItemContainerStyle={{ backgroundColor: '#C4B5FD' }}
              selectedItemLabelStyle={{ color: '#4C1D95', fontWeight: 'bold' }}
            />
          </View>
        </View>

        <Text style={styles.label}>Tujuan Peminjaman</Text>
        <TextInput
          style={styles.input}
          placeholder="Belajar Bersama"
          placeholderTextColor="#9CA3AF"
          value={tujuan}
          onChangeText={setTujuan}
        />

        <Text style={styles.label}>Jumlah Orang</Text>
        <TextInput
          style={styles.input}
          placeholder="30"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={jumlahOrang}
          onChangeText={setJumlahOrang}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Ajukan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FormScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
  },
  headerPurple: {
    backgroundColor: '#A78BFA',
    paddingVertical: 24,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  formWrapper: {
    padding: 20,
  },
  label: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  rowTime: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  dropdown: {
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  dropdownContainer: {
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#fff',
    zIndex: 9999,
  },
  button: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    marginBottom: 16,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
  },
});
