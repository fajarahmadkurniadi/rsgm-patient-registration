import React, { useState, useRef } from 'react';
import closeIcon from '../../assets/Navbar/Close X Button.webp';
import saveIcon from '../../assets/Icon/Simpan Data.webp';
import cameraIcon from '../../assets/Icon/add photo.webp';

// --- FUNGSI HELPER UNTUK FORMAT TANGGAL ---
// Mengubah YYYY-MM-DD (dari input date) menjadi DD/MM/YYYY (untuk data)
const formatDateForStorage = (dateStr) => {
  if (!dateStr) return ''; // Kembalikan string kosong jika tidak ada tanggal
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

const AddDoctorOverlay = ({ onClose, onAddDoctor }) => {
  // useRef untuk mengakses input file yang tersembunyi
  const fileInputRef = useRef(null);

  // State untuk menampung semua data dari form
  const [newDoctorData, setNewDoctorData] = useState({
    nama: '',
    spesialis: '',
    nip: '',
    tanggal_lahir: '', // Disimpan dalam format YYYY-MM-DD selama pengisian
    jadwal_hari: [],
    jadwal_awal: '',
    jadwal_akhir: '',
    no_str: '',
    no_hp: '',
    alamat: '',
    status: 'Aktif',
    foto: null, // Akan menyimpan objek File gambar
  });
  
  // State khusus untuk menampilkan URL preview gambar
  const [photoPreview, setPhotoPreview] = useState(null);

  // Handler untuk semua input teks, select, dan radio
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctorData(prev => ({ ...prev, [name]: value }));
  };

  // Handler untuk memilih atau membatalkan pilihan hari
  const handleDayToggle = (day) => {
    setNewDoctorData(prev => {
      const newDays = prev.jadwal_hari.includes(day)
        ? prev.jadwal_hari.filter(d => d !== day)
        : [...prev.jadwal_hari, day];
      return { ...prev, jadwal_hari: newDays };
    });
  };

  // Handler saat area foto diklik untuk memicu input file
  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  // Handler saat pengguna memilih file gambar
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDoctorData(prev => ({ ...prev, foto: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Handler saat tombol 'Simpan' diklik
  const handleSave = () => {
    // --- VALIDASI FORM DIMULAI DI SINI ---
    const requiredFields = ['nama', 'spesialis', 'nip', 'tanggal_lahir', 'no_str', 'no_hp', 'alamat'];
    for (const field of requiredFields) {
      if (!newDoctorData[field]) {
        alert('Harap isi semua form terlebih dahulu!');
        return; // Hentikan fungsi jika ada yang kosong
      }
    }
    // Validasi khusus untuk jadwal
    if (newDoctorData.jadwal_hari.length === 0 || !newDoctorData.jadwal_awal || !newDoctorData.jadwal_akhir) {
      alert('Harap isi semua form terlebih dahulu!');
      return;
    }
    // --- VALIDASI SELESAI ---

    const jadwalString = `${newDoctorData.jadwal_hari.join(', ')} (${newDoctorData.jadwal_awal} - ${newDoctorData.jadwal_akhir})`;
    const finalData = { 
      ...newDoctorData, 
      jadwal: jadwalString,
      tanggal_lahir: formatDateForStorage(newDoctorData.tanggal_lahir),
    };
    
    onAddDoctor(finalData);
  };

  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="ad-overlay-container" onClick={(e) => e.stopPropagation()}>
        <div className="ad-overlay-header">
          <div style={{ width: '36px' }} />
          <h2>Tambah Dokter</h2>
          <button className="ad-btn-close" onClick={onClose}>
            <img src={closeIcon} alt="Close" />
          </button>
        </div>
        <div className="ad-overlay-content">
          <div className="ad-upload-section">
            <div className="ad-photo-placeholder" onClick={handlePhotoClick}>
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="ad-photo-preview" />
              ) : (
                <img src={cameraIcon} alt="Upload" />
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handlePhotoChange} style={{ display: 'none' }} accept="image/*" />
          </div>
          <div className="ad-form-row"><label>Nama Lengkap</label><input type="text" name="nama" value={newDoctorData.nama} onChange={handleInputChange} /></div>
          <div className="ad-form-row">
            <label>Spesialis</label>
            <select name="spesialis" value={newDoctorData.spesialis} onChange={handleInputChange}>
              <option value="">Pilih Spesialis</option>
              <option value="Ortodonti">Ortodonti</option>
              <option value="Bedah Mulut">Bedah Mulut</option>
              <option value="Gigi Umum">Gigi Umum</option>
              <option value="Konservasi Gigi">Konservasi Gigi</option>
              <option value="Prosthodonsia">Prosthodonsia</option>
              <option value="Kesehatan Gigi Anak">Kesehatan Gigi Anak</option>
              <option value="Periodonsia">Periodonsia</option>
              <option value="Endodonti">Endodonti</option>
              <option value="Penyakit Mulut">Penyakit Mulut</option>
              <option value="Radiologi Gigi dan Mulut">Radiologi Gigi dan Mulut</option>
              <option value="Gigi Estetika dan Kosmetik">Gigi Estetika dan Kosmetik</option>
              <option value="Gigi Geriatri">Gigi Geriatri</option>
            </select>
          </div>
          <div className="ad-form-row"><label>NIP</label><input type="text" name="nip" value={newDoctorData.nip} onChange={handleInputChange} /></div>
          <div className="ad-form-row"><label>Tanggal Lahir</label><input type="date" name="tanggal_lahir" value={newDoctorData.tanggal_lahir} onChange={handleInputChange} /></div>
          <div className="ad-form-row schedule">
            <label>Jadwal Praktek</label>
            <div className="ad-schedule-inputs">
              <div className="ad-schedule-days">
                {days.map(day => (
                  <button key={day} type="button" className={`ad-day-btn ${newDoctorData.jadwal_hari.includes(day) ? 'active' : ''}`} onClick={() => handleDayToggle(day)}>{day}</button>
                ))}
              </div>
              <div className="ad-schedule-time">
                <input type="text" name="jadwal_awal" placeholder="Awal" value={newDoctorData.jadwal_awal} onChange={handleInputChange} />
                <span>—</span>
                <input type="text" name="jadwal_akhir" placeholder="Akhir" value={newDoctorData.jadwal_akhir} onChange={handleInputChange} />
              </div>
            </div>
          </div>
          <div className="ad-form-row"><label>No. STR</label><input type="text" name="no_str" value={newDoctorData.no_str} onChange={handleInputChange} /></div>
          <div className="ad-form-row"><label>No. HP</label><input type="text" name="no_hp" value={newDoctorData.no_hp} onChange={handleInputChange} /></div>
          <div className="ad-form-row"><label>Alamat</label><input type="text" name="alamat" value={newDoctorData.alamat} onChange={handleInputChange} /></div>
          <div className="ad-form-row status">
            <label>Status</label>
            <div className="ad-status-options">
              <label><input type="radio" name="status" value="Aktif" checked={newDoctorData.status === 'Aktif'} onChange={handleInputChange} />Aktif</label>
              <label><input type="radio" name="status" value="Tidak Aktif" checked={newDoctorData.status === 'Tidak Aktif'} onChange={handleInputChange} />Tidak aktif</label>
            </div>
          </div>
        </div>
        <div className="ad-overlay-actions">
          <button className="ad-btn-cancel" onClick={onClose}>Batal</button>
          <button className="ad-btn-save" onClick={handleSave}><img src={saveIcon} alt="Simpan"/> Simpan</button>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorOverlay;