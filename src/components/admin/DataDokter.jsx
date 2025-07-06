import React, { useState, useEffect } from 'react';
import Clock from './Clock';
import AddDoctorOverlay from './AddDoctorOverlay';
import DoctorDetailOverlay from './DoctorDetailOverlay';

// Data dummy awal. Dalam aplikasi nyata, ini akan diambil dari server/API.
const initialDoctorData = [
  { id: 1, nama: 'drg. Siti Nazifah, Sp.Ort., Subsp. OD (K)', nip: '200600193', spesialis: 'Ortodonti', jadwal: 'Senin - Rabu (08:30 - 12:00)', tanggal_lahir: '21/09/2001', no_str: 'STR202405038', no_hp: '0812-6944-9663', alamat: 'Jl. Gaperta V No. 21 Blok K, Medan', status: 'Aktif', foto: null },
  { id: 2, nama: 'drg. Andi Surya, Sp. BM', nip: '1957204830', spesialis: 'Bedah Mulut', jadwal: 'Kamis - Sabtu (08:30 - 12:00)', tanggal_lahir: '15/05/1985', no_str: 'STR202311201', no_hp: '0813-1122-3344', alamat: 'Jl. Setia Budi No. 18, Medan', status: 'Aktif', foto: null },
  { id: 3, nama: 'drg. Marsha Anjely Julius, S.K.G.', nip: '230600043', spesialis: 'Gigi Umum', jadwal: 'Senin - Rabu (13:30 - 18:00)', tanggal_lahir: '03/08/1998', no_str: 'STR202209015', no_hp: '0815-5566-7788', alamat: 'Jl. Dr. Mansyur No. 5, Medan', status: 'Aktif', foto: null },
  { id: 4, nama: 'drg. Citra Wahyuni, Sp. KG', nip: '1840965320', spesialis: 'Konservasi Gigi', jadwal: 'Kamis - Sabtu (13:30 - 18:00)', tanggal_lahir: '11/11/1990', no_str: 'STR202107331', no_hp: '0818-1111-2222', alamat: 'Jl. Iskandar Muda No. 30, Medan', status: 'Tidak Aktif', foto: null },
  { id: 5, nama: 'drg. Eka Pratama, Sp.Pros', nip: '2579103826', spesialis: 'Prosthodonsia', jadwal: 'Senin - Rabu (08:30 - 12:00)', tanggal_lahir: '28/02/1988', no_str: 'STR202002123', no_hp: '0819-3333-4444', alamat: 'Jl. Multatuli No. 12, Medan', status: 'Aktif', foto: null },
  { id: 6, nama: 'drg. Rina Amelia, M.Kes', nip: '201504881', spesialis: 'Kesehatan Gigi Anak', jadwal: 'Selasa & Kamis (09:00 - 14:00)', tanggal_lahir: '19/07/1989', no_str: 'STR201908567', no_hp: '0817-5555-9999', alamat: 'Jl. Karya Wisata, Medan', status: 'Aktif', foto: null },
  { id: 7, nama: 'drg. Ivan Zulkarnain, Sp.Perio', nip: '200911547', spesialis: 'Periodonsia', jadwal: 'Jumat & Sabtu (10:00 - 15:00)', tanggal_lahir: '30/01/1987', no_str: 'STR201803456', no_hp: '0816-2222-1111', alamat: 'Jl. Ring Road No. 88, Medan', status: 'Aktif', foto: null },
  { id: 8, nama: 'drg. Bima Sakti', nip: '210700211', spesialis: 'Gigi Umum', jadwal: 'Senin - Rabu (08:30 - 12:00)', tanggal_lahir: '05/06/1995', no_str: 'STR202401889', no_hp: '0812-8888-7777', alamat: 'Jl. Pancing No. 1, Medan', status: 'Aktif', foto: null },
];

const DataDokter = () => {
  // State untuk data dokter utama
  const [allDoctorData, setAllDoctorData] = useState(initialDoctorData);

  // State untuk filter dan data yang ditampilkan
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(allDoctorData);

  // State untuk mengontrol visibilitas overlays
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Fungsi untuk menangani penambahan dokter baru
  const handleAddDoctor = (newDoctor) => {
    setAllDoctorData(prevData => [...prevData, { ...newDoctor, id: Date.now() }]);
    setShowAddOverlay(false);
  };
  
  // Fungsi untuk memperbarui data dokter
  const handleUpdateDoctor = (updatedDoctor) => {
    setAllDoctorData(prevData => 
      prevData.map(doc => 
        doc.id === updatedDoctor.id ? updatedDoctor : doc
      )
    );
    setSelectedDoctor(null); // Menutup overlay setelah update
  };

  // Fungsi untuk menghapus data dokter
  const handleDeleteDoctor = (doctorId) => {
    setAllDoctorData(prevData => 
      prevData.filter(doc => doc.id !== doctorId)
    );
    setSelectedDoctor(null); // Menutup overlay setelah delete
  };

  // Fungsi untuk menampilkan detail dokter di overlay
  const handleViewDetail = (doctor) => {
    setSelectedDoctor(doctor);
  };

  // Fungsi untuk menutup semua overlay
  const handleCloseOverlays = () => {
    setShowAddOverlay(false);
    setSelectedDoctor(null);
  };

  // useEffect untuk memfilter data dokter setiap kali ada perubahan
  useEffect(() => {
    let data = [...allDoctorData];
    if (searchTerm) {
      data = data.filter(dokter =>
        dokter.nip.includes(searchTerm) ||
        dokter.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredData(data);
  }, [searchTerm, allDoctorData]);

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
            <input 
              type="text" 
              placeholder="Cari berdasarkan NIP atau Nama" 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                        {dokter.jadwal.split('(').map((part, partIndex) => (
                          <React.Fragment key={partIndex}>
                            {partIndex > 0 ? `(${part}` : part}
                            {partIndex === 0 && <br />} 
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
                      Dokter tidak ditemukan
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