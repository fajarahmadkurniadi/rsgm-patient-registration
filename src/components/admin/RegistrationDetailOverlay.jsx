import React from 'react';
import closeIcon from '../../assets/Navbar/Close X Button.webp';

const RegistrationDetailOverlay = ({ detail, onClose }) => {
  if (!detail) return null;

  // Fungsi untuk memformat tanggal agar lebih mudah dibaca
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-container" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-header">
          <h2>Detail Pendaftaran Pasien</h2>
          <button className="btn-close" onClick={onClose}>
            <img src={closeIcon} alt="Close" />
          </button>
        </div>
        <div className="overlay-content">
          <table>
            <tbody>
              <tr>
                <td>No. Antrian</td>
                <td>{detail.nomor_antrian || 'N/A'}</td>
              </tr>
              <tr>
                <td>Status Pasien</td>
                <td>{detail.status_pasien || 'N/A'}</td>
              </tr>
              <tr style={{ height: '20px' }}></tr>
              <tr>
                <td>
                  <strong>--- Data Pasien ---</strong>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Nama Pasien</td>
                <td>{detail.nama_lengkap || 'N/A'}</td>
              </tr>
              <tr>
                <td>No. Rekam Medis</td>
                <td>{detail.no_rm || 'N/A'}</td>
              </tr>
              <tr>
                <td>NIK</td>
                <td>{detail.nik || 'N/A'}</td>
              </tr>
              <tr>
                <td>Jenis Kelamin</td>
                <td>{detail.jenis_kelamin || 'N/A'}</td>
              </tr>
              <tr>
                <td>No. HP</td>
                <td>{detail.no_hp || 'N/A'}</td>
              </tr>
              <tr style={{ height: '20px' }}></tr>
              <tr>
                <td>
                  <strong>--- Rencana Kunjungan ---</strong>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Tanggal Pemeriksaan</td>
                <td>{formatDate(detail.tanggal_pendaftaran)}</td>
              </tr>
              <tr>
                <td>Jam Pemeriksaan</td>
                <td>{detail.jam_pemeriksaan || 'N/A'}</td>
              </tr>
              <tr>
                <td>Poli Tujuan</td>
                <td>{detail.poli_tujuan || 'N/A'}</td>
              </tr>
              <tr>
                <td>Dokter</td>
                <td>{detail.nama_dokter || 'N/A'}</td>
              </tr>
              <tr>
                <td>Keluhan</td>
                <td>{detail.keluhan || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetailOverlay;
