import React, { useState, useEffect } from 'react';
import Clock from './Clock';
import PatientDetailOverlay from './PatientDetailOverlay';
import searchIcon from '../../assets/Icon/Search.webp'; // Impor ikon search

const initialPatientData = [
  { id: 1, no_rm: '100001', nama: 'Andi Sukma', nik: '1271021412960021', tanggal: '17/05/2025', tanggal_lahir: '14/12/1996', jenis_kelamin: 'Laki-laki', alamat: 'Jl. Merdeka No. 15, Medan', no_hp: '0812-1111-2222' },
  { id: 2, no_rm: '100002', nama: 'Siti Dewi', nik: '1271034912010022', tanggal: '17/05/2025', tanggal_lahir: '25/03/1999', jenis_kelamin: 'Perempuan', alamat: 'Jl. Mawar No. 10, Medan', no_hp: '0812-3456-7890' },
  { id: 3, no_rm: '100003', nama: 'Budi Antara', nik: '1271042508000023', tanggal: '17/05/2025', tanggal_lahir: '25/08/2000', jenis_kelamin: 'Laki-laki', alamat: 'Jl. Sudirman No. 1, Medan', no_hp: '0813-1234-5678' },
  { id: 4, no_rm: '100004', nama: 'Ratna Indah', nik: '1271064109970024', tanggal: '18/05/2025', tanggal_lahir: '01/09/1997', jenis_kelamin: 'Perempuan', alamat: 'Jl. Gatot Subroto No. 99, Medan', no_hp: '0815-1122-3344' },
  { id: 5, no_rm: '100005', nama: 'Fitri Lestari', nik: '1271082201040025', tanggal: '18/05/2025', tanggal_lahir: '22/01/2004', jenis_kelamin: 'Perempuan', alamat: 'Jl. Imam Bonjol No. 23, Medan', no_hp: '0818-5555-6666' },
  { id: 6, no_rm: '100006', nama: 'Rudi Setiawan', nik: '1271075308000026', tanggal: '18/05/2025', tanggal_lahir: '13/08/2000', jenis_kelamin: 'Laki-laki', alamat: 'Jl. Pahlawan No. 7, Medan', no_hp: '0819-7777-8888' },
  { id: 7, no_rm: '100007', nama: 'Lina Handayani', nik: '127108503980027', tanggal: '19/05/2025', tanggal_lahir: '18/05/1998', jenis_kelamin: 'Perempuan', alamat: 'Jl. Diponegoro No. 45, Medan', no_hp: '0811-9999-0000' },
  { id: 8, no_rm: '100008', nama: 'Agus Santoso', nik: '127109480697028', tanggal: '19/05/2025', tanggal_lahir: '08/06/1997', jenis_kelamin: 'Laki-laki', alamat: 'Jl. Sisingamangaraja No. 123, Medan', no_hp: '0817-1234-5678' },
  { id: 9, no_rm: '100009', nama: 'Maya Wardani', nik: '127110011010029', tanggal: '19/05/2025', tanggal_lahir: '01/10/2001', jenis_kelamin: 'Perempuan', alamat: 'Jl. Juanda No. 8, Medan', no_hp: '0816-8765-4321' },
  { id: 10, no_rm: '100010', nama: 'Eko Prasetyo', nik: '1271114612970030', tanggal: '20/05/2025', tanggal_lahir: '12/12/1997', jenis_kelamin: 'Laki-laki', alamat: 'Jl. Asia Afrika No. 5, Medan', no_hp: '0814-5555-1111' },
];

const DataPasien = () => {
  const [allPatientData, setAllPatientData] = useState(initialPatientData);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filteredData, setFilteredData] = useState(allPatientData);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleViewDetail = (pasien) => setSelectedPatient(pasien);
  const handleCloseOverlay = () => setSelectedPatient(null);

  const handleUpdatePatient = (updatedPatient) => {
    setAllPatientData(prevData => prevData.map(patient => patient.id === updatedPatient.id ? updatedPatient : patient));
    handleCloseOverlay(); 
  };

  const handleDeletePatient = (patientId) => {
    setAllPatientData(prevData => prevData.filter(patient => patient.id !== patientId));
    handleCloseOverlay();
  };
  
  useEffect(() => {
    let data = [...allPatientData];
    if (searchTerm) {
      data = data.filter(pasien =>
        pasien.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pasien.no_rm.includes(searchTerm)
      );
    }
    if (searchDate) {
      const [year, month, day] = searchDate.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      data = data.filter(pasien => pasien.tanggal === formattedDate);
    }
    setFilteredData(data);
  }, [searchTerm, searchDate, allPatientData]);

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
                      <td>{pasien.nama}</td>
                      <td>{pasien.no_rm}</td>
                      <td>{pasien.nik}</td>
                      <td>{pasien.tanggal}</td>
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