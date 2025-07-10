import React from 'react';

// Fungsi helper untuk memberikan class CSS berdasarkan nama Poli
// Ini akan berguna jika Anda ingin memberi warna berbeda untuk setiap poli di masa depan
const getPoliClassName = (poli) => {
  if (!poli) return '';
  // Mengubah "Gigi Umum" menjadi "poli-gigi-umum"
  return `poli-${poli.toLowerCase().replace(/\s+/g, '-')}`;
};

const DailyPatientList = ({ patients = [] }) => { // Terima props 'patients'
  return (
    <div className="patient-daily-container">
      <h2>Pasien Hari ini</h2>
      <div className="patient-daily-table-wrapper">
        <table className="patient-daily-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama Pasien</th>
              <th>Jam Tujuan</th>
              <th>Poli</th>
              <th>Tanggal Tujuan</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map((patient, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{patient.nama}</td>
                  <td>{patient.jamDaftar}</td>
                  <td className={getPoliClassName(patient.poli)}>
                    {patient.poli}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                  Belum ada pasien hari ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyPatientList;