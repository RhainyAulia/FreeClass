import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { getApiUrl } from '../src/getApiUrl.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Slot waktu tetap
const SLOT_ITEMS = [
  { label: '07:30 - 10:15', value: 1 },
  { label: '10:15 - 13:00', value: 2 },
  { label: '13:00 - 15:45', value: 3 },
  { label: '15:45 - 18:30', value: 4 },
  { label: '18:30 - 20:30', value: 5 },
  { label: '20:30 - 22:00', value: 6 },
];

const SLOT_TO_JAM = {
  1: { mulai: '07:30', selesai: '10:15' },
  2: { mulai: '10:15', selesai: '13:00' },
  3: { mulai: '13:00', selesai: '15:45' },
  4: { mulai: '15:45', selesai: '18:30' },
  5: { mulai: '18:30', selesai: '20:30' },
  6: { mulai: '20:30', selesai: '22:00' },
};

const FormScreen = () => {
  const navigation = useNavigation();

  const [namaPeminjam, setNamaPeminjam] = useState('');
  const [npm, setNpm] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [tanggal, setTanggal] = useState(new Date());
  const [tujuan, setTujuan] = useState('');
  const [jumlahOrang, setJumlahOrang] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [slot, setSlot] = useState(null);
  const [openSlot, setOpenSlot] = useState(false);
  const [itemsSlot, setItemsSlot] = useState(SLOT_ITEMS);

  const handleSubmit = async () => {
    if (!namaPeminjam || !npm || !jabatan || !tujuan || !jumlahOrang || !slot) {
      alert('Semua kolom wajib diisi!');
      return;
    }

    const { mulai, selesai } = SLOT_TO_JAM[slot];
    const idRuangan = 16;
    const kodePeminjaman = 'FC' + new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);

    const data = {
      kode_peminjaman: kodePeminjaman,
      nama_peminjam: namaPeminjam,
      jabatan,
      tanggal: tanggal.toISOString().split('T')[0],
      jam_mulai: mulai,
      jam_selesai: selesai,
      id_ruangan: idRuangan,
      id_slot: slot,
      tujuan,
      jumlah_orang: parseInt(jumlahOrang),
    };

    try {
      const apiUrl = await getApiUrl();
      const response = await axios.post(`${apiUrl}/api/peminjaman`, data);
      const dataPeminjaman = response.data.data;

      navigation.navigate('Detail', {
        dataPeminjaman: {
          kode_peminjaman: dataPeminjaman.kode_peminjaman,
          status: dataPeminjaman.status,
          nama_peminjam: dataPeminjaman.nama_peminjam,
          tanggal: dataPeminjaman.tanggal,
          jam_mulai: dataPeminjaman.jam_mulai,
          jam_selesai: dataPeminjaman.jam_selesai,
          tujuan: dataPeminjaman.tujuan,
        },
      });
    } catch (error) {
      console.error('Gagal kirim data:', error.response?.data || error.message);
      alert('Gagal mengirim data. Silakan coba lagi.');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={100}
      keyboardShouldPersistTaps="handled"
    >
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
          value={namaPeminjam}
          onChangeText={setNamaPeminjam}
        />

        <Text style={styles.label}>Jabatan / Posisi</Text>
        <TextInput
          style={styles.input}
          placeholder="Mahasiswa / Dosen / Staff"
          value={jabatan}
          onChangeText={setJabatan}
        />

        <Text style={styles.label}>NPM / NIP</Text>
        <TextInput
          style={styles.input}
          placeholder="232310000"
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
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            minimumDate={new Date()}
            maximumDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setTanggal(selectedDate);
            }}
          />
        )}

        {/* Z-index wrapper untuk Dropdown */}
        <View style={{ zIndex: 1000 }}>
          <Text style={styles.label}>Waktu Peminjaman</Text>
          <DropDownPicker
            open={openSlot}
            value={slot}
            items={itemsSlot}
            setOpen={setOpenSlot}
            setValue={setSlot}
            setItems={setItemsSlot}
            placeholder="Pilih Waktu"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            selectedItemContainerStyle={{ backgroundColor: '#C4B5FD' }}
            selectedItemLabelStyle={{ color: '#4C1D95', fontWeight: 'bold' }}
          />
        </View>

        <View style={{ zIndex: 1 }}>
          <Text style={styles.label}>Tujuan Peminjaman</Text>
          <TextInput
            style={styles.input}
            placeholder="Belajar Kelompok"
            value={tujuan}
            onChangeText={setTujuan}
          />

          <Text style={styles.label}>Jumlah Orang</Text>
          <TextInput
            style={styles.input}
            placeholder="30"
            keyboardType="numeric"
            value={jumlahOrang}
            onChangeText={setJumlahOrang}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Ajukan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
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
