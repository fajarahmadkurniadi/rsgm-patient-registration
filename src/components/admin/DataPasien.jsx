import React, { useState, useEffect } from 'react';
import Clock from './Clock';
import PatientDetailOverlay from './PatientDetailOverlay';
import searchIcon from '../../assets/Icon/Search.webp'; // Impor ikon search

const DataPasien = () => {
  // State sekarang dimulai dengan array kosong, akan diisi dari API
  const [allPatientData, setAllPatientData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  // State untuk filter
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  
  // State untuk overlay
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Fungsi untuk mengambil data dari API
  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/pasien');
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari server');
      }
      const data = await response.json();
      setAllPatientData(data);
    } catch (error) {
      console.error("Gagal mengambil data pasien:", error);
      // Anda bisa menambahkan state untuk menampilkan pesan error di UI
    }
  };

  // Gunakan useEffect untuk mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchPatients();
  }, []);

  // useEffect untuk memfilter data setiap kali ada perubahan pada filter atau data utama
  useEffect(() => {
    let data = [...allPatientData];
    
    // Filter berdasarkan Nama atau No. RM
    if (searchTerm) {
      data = data.filter(pasien =>
        (pasien.nama_lengkap && pasien.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pasien.no_rm && pasien.no_rm.includes(searchTerm))
      );
    }
    
    // Filter berdasarkan Tanggal Pendaftaran
    if (searchDate) {
      // Asumsi 'tanggal' dari database adalah YYYY-MM-DD
      data = data.filter(pasien => pasien.tanggal_pendaftaran === searchDate);
    }
    
    setFilteredData(data);
  }, [searchTerm, searchDate, allPatientData]);

  const handleViewDetail = (pasien) => setSelectedPatient(pasien);
  const handleCloseOverlay = () => setSelectedPatient(null);

  // Fungsi untuk mengupdate pasien melalui API
  const handleUpdatePatient = async (updatedPatient) => {
    try {
        await fetch(`http://localhost:3001/api/pasien/${updatedPatient.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPatient)
        });
        fetchPatients(); // Ambil data lagi untuk memperbarui tabel
    } catch (error) {
        console.error("Gagal mengupdate data pasien:", error);
    } finally {
        handleCloseOverlay();
    }
  };

  // Fungsi untuk menghapus pasien melalui API
  const handleDeletePatient = async (patientId) => {
    try {
        await fetch(`http://localhost:3001/api/pasien/${patientId}`, { method: 'DELETE' });
        fetchPatients(); // Ambil data lagi untuk memperbarui tabel
    } catch (error) {
        console.error("Gagal menghapus data pasien:", error);
    } finally {
        handleCloseOverlay();
    }
  };

  return (
    <>
      <div id="data-pasien">
        <div className="data-pasien-header">
          <h1>Data Pasien</h1>
          <div className="data-pasien-header-components">
            <Clock />
          </div>
        </div>
        <div className="data-pasien-content">
          <div className="data-pasien-search-column">
            <div className="search-bar-wrapper">
              <img src={searchIcon} alt="Cari" className="search-icon"/>
              <input 
                type="text" 
                placeholder="Cari berdasarkan No. RM atau Nama Pasien" 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <input 
              type="date" 
              className="date-input"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>
          <div className="data-pasien-table">
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nama Pasien</th>
                  <th>No. RM</th>
                  <th>NIK</th>
                  <th>Tanggal Daftar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((pasien, index) => (
                    <tr key={pasien.id}>
                      <td>{index + 1}.</td>
                      <td>{pasien.nama_lengkap}</td>
                      <td>{pasien.no_rm}</td>
                      <td>{pasien.nik}</td>
                      {/* Sesuaikan dengan nama kolom dari database */}
                      <td>{new Date(pasien.tanggal_pendaftaran).toLocaleDateString('id-ID')}</td>
                      <td>
                        <button className="btn-detail" onClick={() => handleViewDetail(pasien)}>
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data-found">
                      Pasien tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="data-pasien-footer">
          <p>Menampilkan {filteredData.length} dari <span>{allPatientData.length}</span> Pasien</p>
        </div>
      </div>

      {selectedPatient && (
        <PatientDetailOverlay 
          patient={selectedPatient} 
          onClose={handleCloseOverlay} 
          onUpdate={handleUpdatePatient}
          onDelete={handleDeletePatient}
        />
      )}
    </>
  );
};

export default DataPasien;