import React from 'react';

// Fungsi helper untuk memberikan class CSS berdasarkan nama Poli
const getPoliClassName = (poli) => {
  if (!poli) return '';
  return `poli-${poli.toLowerCase().replace(/\s+/g, '-')}`;
};

// Fungsi helper untuk memformat tanggal (opsional, tapi disarankan)
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  // Jika format sudah DD/MM/YYYY, kembalikan langsung
  if (dateStr.includes('/')) {
    return dateStr;
  }
  // Jika format YYYY-MM-DD, ubah ke DD/MM/YYYY
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

const DailyPatientList = ({ patients = [] }) => {
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
                  {/* Tambahkan sel data untuk tanggal tujuan */}
                  <td>{formatDate(patient.tanggalTujuan)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
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