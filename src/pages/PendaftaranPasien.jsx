import React, { useState } from 'react';
import '../styles/pendaftaranpasien.css';
import logoFormPendaftaranPasien from '../assets/Pendaftaran Pasien/Logo Pendaftaran Pasien.webp';
import { useNavigate } from 'react-router-dom';

const PendaftaranPasien = () => {
  const navigate = useNavigate();
  
  // State untuk menampung semua data dari form
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nik: '',
    jenisKelamin: '',
    tanggalLahir: '',
    alamat: '',
    noHandphone: '',
    poli: '',
    jamTujuan: '',
    keluhan: '',
    persetujuan: false,
  });

  // Handler untuk mengelola perubahan pada semua input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handler saat form di-submit, sekarang menjadi async
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi form kosong
    const requiredFields = ['namaLengkap', 'nik', 'jenisKelamin', 'tanggalLahir', 'alamat', 'noHandphone', 'poli', 'jamTujuan', 'keluhan'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert('Harap isi semua kolom yang wajib diisi.');
        return;
      }
    }
    if (!formData.persetujuan) {
      alert('Anda harus menyetujui persyaratan untuk mendaftar.');
      return;
    }

    // Validasi waktu
    const jamAwal = "08:30";
    const jamAkhir = "17:00";
    if (formData.jamTujuan < jamAwal || formData.jamTujuan > jamAkhir) {
        alert(`Jam tujuan pemeriksaan harus antara ${jamAwal} dan ${jamAkhir}.`);
        return;
    }

    // Mengirim data ke backend
    try {
      const response = await fetch('http://localhost:3001/api/pendaftaran', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Jika backend merespons sukses, navigasi ke halaman bukti pendaftaran
        // dan kirim data yang mungkin sudah diproses oleh backend (termasuk No. Antrian, dll.)
        navigate('/buktipendaftaran', { state: { registrationData: result.data } });
      } else {
        // Jika ada error dari backend (misal: NIK sudah terdaftar)
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Terjadi kesalahan saat mengirim pendaftaran. Silakan coba lagi.');
    }
  };

  return (
    <>
      <div id="pendaftaran-pasien">
        <div className="pendaftaran-pasien-header">
          <h5 onClick={() => navigate('/')}>Kembali</h5>
        </div>
        <div className="pendaftaran-pasien-container">
          <img src={logoFormPendaftaranPasien} alt="Logo Pendaftaran Pasien" />
          <h1>Pendaftaran Pasien</h1>

          <form onSubmit={handleSubmit} className="pendaftaran-pasien-form">
            <div className="pendaftaran-pasien-col">
              <label htmlFor="namaLengkap">Nama Lengkap</label>
              <input type="text" id="namaLengkap" name="namaLengkap" value={formData.namaLengkap} onChange={handleInputChange} />
            </div>

            <div className="pendaftaran-pasien-col">
              <label htmlFor="nik">Nomor Induk Keluarga</label>
              <input type="number" id="nik" name="nik" value={formData.nik} onChange={handleInputChange} />
            </div>

            <div className="pendaftaran-pasien-col">
              <p>Jenis Kelamin</p>
              <div className="jenis-kelamin-gender-container">
                <div className="gender-option">
                  <input className="gender-option-radio" type="radio" name="jenisKelamin" value="Pria" checked={formData.jenisKelamin === 'Pria'} onChange={handleInputChange} />
                  <span>Pria</span>
                </div>
                <div className="gender-option">
                  <input className="gender-option-radio" type="radio" name="jenisKelamin" value="Wanita" checked={formData.jenisKelamin === 'Wanita'} onChange={handleInputChange} />
                  <span>Wanita</span>
                </div>
              </div>
            </div>

            <div className="pendaftaran-pasien-col">
              <label htmlFor="tanggalLahir">Tanggal Lahir</label>
              <input type="date" id="tanggalLahir" name="tanggalLahir" className="input-tanggal" value={formData.tanggalLahir} onChange={handleInputChange} />
            </div>
            
            <div className="pendaftaran-pasien-col">
              <label htmlFor="alamat">Alamat</label>
              <textarea id="alamat" name="alamat" rows="3" value={formData.alamat} onChange={handleInputChange}></textarea>
            </div>

            <div className="pendaftaran-pasien-col">
              <label htmlFor="noHandphone">Nomor Handphone</label>
              <input type="number" id="noHandphone" name="noHandphone" value={formData.noHandphone} onChange={handleInputChange} />
            </div>

            <div className="pendaftaran-pasien-col">
              <label htmlFor="poli">Poli Tujuan</label>
              <select id="poli" name="poli" className="select-poli" value={formData.poli} onChange={handleInputChange}>
                <option value="">Pilih Poli Tujuan</option>
                <option value="Ortodonti">Poli Ortodonti</option>
                <option value="Bedah Mulut">Poli Bedah Mulut dan Maksilofasial</option>
                <option value="Gigi Umum">Poli Gigi Umum</option>
                <option value="Konservasi Gigi">Poli Konservasi Gigi</option>
                <option value="Prosthodonsia">Poli Prostodonsia</option>
                <option value="Kesehatan Gigi Anak">Poli Kedokteran Gigi Anak</option>
                <option value="Periodonsia">Poli Periodonsia</option>
                <option value="Endodonti">Poli Endodonti</option>
                <option value="Penyakit Mulut">Poli Penyakit Mulut</option>
                <option value="Radiologi Gigi dan Mulut">Poli Radiologi Gigi dan Mulut</option>
                <option value="Gigi Estetika dan Kosmetik">Poli Gigi Estetika dan Kosmetik</option>
                <option value="Gigi Geriatri">Poli Gigi Geriatri</option>
              </select>
            </div>
            
            <div className="pendaftaran-pasien-col">
              <label htmlFor="hariTujuan">Hari Tujuan Pemeriksaan</label>
              <input 
                type="date" 
                id="hariTujuan" 
                name="hariTujuan" 
                value={formData.hariTujuan} 
                onChange={handleInputChange}
              />
            </div>

            <div className="pendaftaran-pasien-col">
              <label htmlFor="jamTujuan">Jam Tujuan Pemeriksaan</label>
              <input 
                type="time" 
                id="jamTujuan" 
                name="jamTujuan" 
                value={formData.jamTujuan} 
                onChange={handleInputChange}
                min="08:30"
                max="17:00"
              />
            </div>

            <div className="pendaftaran-pasien-col">
              <label htmlFor="keluhan">Keluhan</label>
              <textarea id="keluhan" name="keluhan" rows="7" value={formData.keluhan} onChange={handleInputChange}></textarea>
            </div>

            <div className="pendaftaran-pasien-col pendaftaran-pasien-persetujuan">
              <input className="pendaftaran-pasien-persetujuan-input" type="checkbox" name="persetujuan" checked={formData.persetujuan} onChange={handleInputChange} />
              <p>Saya telah mengisi data dengan benar dan saya bersedia pihak rumah sakit memperoleh data saya</p>
            </div>

            <div className="pendaftaran-pasien-col pendaftaran-pasien-tombol-daftar">
              <button type="submit">Daftar</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PendaftaranPasien;