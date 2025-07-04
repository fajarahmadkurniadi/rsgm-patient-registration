import React from 'react';

// Data dummy untuk daftar pasien, bisa diganti dari API nanti
const dailyPatients = [
  { id: 1, nama: 'Jakjuk Khan Pajeet', jam: '08:28', poli: 'Umum' },
  { id: 2, nama: 'Said Chigga', jam: '09:32', poli: 'Gigi' },
  { id: 3, nama: 'Nirai One Well Well', jam: '10:01', poli: 'Anak' },
  { id: 4, nama: 'Fajar Just Fajar', jam: '10:54', poli: 'Umum' },
  { id: 5, nama: 'Fakhri Skroep Djamariz', jam: '11:42', poli: 'Umum' },
  { id: 6, nama: 'Paiz Brodiee', jam: '12:42', poli: 'Bedah' },
  { id: 7, nama: 'Putri Aulia', jam: '13:05', poli: 'Anak' },
];

// Fungsi helper untuk memberikan class CSS berdasarkan nama Poli
const getPoliClassName = (poli) => {
  return `poli-${poli.toLowerCase().replace(/\s+/g, '-')}`;
};

const DailyPatientList = () => {
  return (
    <div className="patient-daily-container">
      <h2>Daftar Pasien Harian</h2>
      <div className="patient-daily-table-wrapper">
        <table className="patient-daily-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama Pasien</th>
              <th>Jam Daftar</th>
              <th>Poli</th>
            </tr>
          </thead>
          <tbody className="patient-daily-table-scnd">
            {dailyPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.nama}</td>
                <td>{patient.jam}</td>
                <td id='poli' className={getPoliClassName(patient.poli)}>{patient.poli}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyPatientList;