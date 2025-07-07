import React, { useState, useEffect } from 'react';
import Clock from './Clock';
import AddDoctorOverlay from './AddDoctorOverlay';
import DoctorDetailOverlay from './DoctorDetailOverlay';
import searchIcon from '../../assets/Icon/Search.webp';

const DataDokter = () => {
  const [allDoctorData, setAllDoctorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/dokter');
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari server');
      }
      const data = await response.json();
      setAllDoctorData(data);
    } catch (error) {
      console.error("Gagal mengambil data dokter:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    let data = [...allDoctorData];
    if (searchTerm) {
      data = data.filter(dokter =>
        (dokter.nip && dokter.nip.includes(searchTerm)) ||
        (dokter.nama && dokter.nama.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredData(data);
  }, [searchTerm, allDoctorData]);

  // --- FUNGSI CRUD YANG DIPERBARUI ---

  const handleAddDoctor = async (newDoctor) => {
    const formData = new FormData();
    for (const key in newDoctor) {
      formData.append(key, newDoctor[key]);
    }

    try {
      const response = await fetch('http://localhost:3001/api/dokter', {
        method: 'POST',
        body: formData,
      });

      // **BAGIAN YANG DIPERBAIKI: Cek respons server**
      if (!response.ok) {
        // Jika server mengembalikan error, tampilkan pesan dan jangan lanjutkan
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menambah dokter.');
      }

      // Jika berhasil, muat ulang data dan tutup overlay
      fetchDoctors();
      setShowAddOverlay(false);
      
    } catch (error) { 
      console.error("Gagal menambah dokter:", error);
      alert(error.message); // Tampilkan pesan error yang lebih spesifik
    }
  };
  
  const handleUpdateDoctor = async (updatedDoctor) => {
    const formData = new FormData();
    for (const key in updatedDoctor) {
        formData.append(key, updatedDoctor[key]);
    }
    
    try {
        const response = await fetch(`http://localhost:3001/api/dokter/${updatedDoctor.id}`, {
            method: 'PUT',
            body: formData,
        });

        // **BAGIAN YANG DIPERBAIKI: Cek respons server**
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal memperbarui data.');
        }

        fetchDoctors();
        setSelectedDoctor(null);
    } catch (error) { 
        console.error("Gagal update dokter:", error);
        alert(error.message);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
        const response = await fetch(`http://localhost:3001/api/dokter/${doctorId}`, { 
          method: 'DELETE' 
        });

        // **BAGIAN YANG DIPERBAIKI: Cek respons server**
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal menghapus data.');
        }
        
        fetchDoctors();
        setSelectedDoctor(null);
    } catch (error) { 
        console.error("Gagal menghapus dokter:", error);
        alert(error.message);
    }
  };

  const handleViewDetail = (doctor) => setSelectedDoctor(doctor);
  const handleCloseOverlays = () => { 
    setShowAddOverlay(false); 
    setSelectedDoctor(null); 
  };

  return (
    <>
      <div id="data-dokter">
        <div className="data-dokter-header">
          <h1>Data Dokter</h1>
          <div className="data-dokter-header-components">
            <Clock/>
          </div>
        </div>
        <div className="data-dokter-content">
          <div className="data-dokter-search-column">
            <div className="search-bar-wrapper">
                <img src={searchIcon} alt="Cari" className="search-icon"/>
                <input 
                    type="text" 
                    placeholder="Cari berdasarkan NIP atau Nama Dokter" 
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button onClick={() => setShowAddOverlay(true)}>
              <span>+</span> Tambah Dokter
            </button>
          </div>
          <div className="data-dokter-table">
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nama Dokter</th>
                  <th>NIP</th>
                  <th>Spesialis</th>
                  <th>Jadwal Praktek</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((dokter, index) => (
                    <tr key={dokter.id}>
                      <td>{index + 1}.</td>
                      <td>{dokter.nama}</td>
                      <td>{dokter.nip}</td>
                      <td>{dokter.spesialis}</td>
                      <td>
                        {dokter.jadwal && dokter.jadwal.split('(').map((part, partIndex) => (
                          <React.Fragment key={partIndex}>
                            {partIndex > 0 ? `(${part}` : part}
                            {partIndex === 0 && dokter.jadwal.includes('(') && <br />} 
                          </React.Fragment>
                        ))}
                      </td>
                      <td>
                        <button className="btn-detail" onClick={() => handleViewDetail(dokter)}>
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data-found">
                      {searchTerm ? "Dokter tidak ditemukan" : "Tidak ada data dokter"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="data-dokter-footer">
          <p>Menampilkan {filteredData.length} dari <span>{allDoctorData.length}</span> Dokter</p>
        </div>
      </div>

      {showAddOverlay && (
        <AddDoctorOverlay 
            onClose={handleCloseOverlays} 
            onAddDoctor={handleAddDoctor} 
        />
      )}
      {selectedDoctor && (
        <DoctorDetailOverlay 
            doctor={selectedDoctor} 
            onClose={handleCloseOverlays} 
            onUpdate={handleUpdateDoctor} 
            onDelete={handleDeleteDoctor} 
        />
      )}
    </>
  );
};

export default DataDokter;