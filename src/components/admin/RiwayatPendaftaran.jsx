import React, { useState, useEffect, useCallback } from 'react';
import Clock from './Clock';
import searchIcon from '../../assets/Icon/Search.webp';
import RegistrationDetailOverlay from './RegistrationDetailOverlay';

const RiwayatPendaftaran = () => {
  const [history, setHistory] = useState([]);
  const [totalHistoryCount, setTotalHistoryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Fungsi untuk mengambil data riwayat dari API dengan filter
  const fetchHistory = useCallback(async () => {
    try {
      // Bangun URL dengan parameter query
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (searchDate) params.append('tanggal', searchDate);

      const response = await fetch(`http://localhost:3001/api/riwayat?${params.toString()}`);
      if (!response.ok) throw new Error('Gagal mengambil data riwayat');

      const data = await response.json();
      setHistory(data.results);
      // Simpan total pendaftaran (jika tidak ada filter)
      if (!searchTerm && !searchDate) {
        setTotalHistoryCount(data.results.length);
      }
    } catch (error) {
      console.error('Gagal mengambil riwayat pendaftaran:', error);
    }
  }, [searchTerm, searchDate]); // Tambahkan dependensi

  // Panggil fetchHistory setiap kali filter berubah
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchHistory();
    }, 300); // Debounce untuk mengurangi request saat mengetik

    return () => clearTimeout(handler);
  }, [fetchHistory]);

  // Handler untuk melihat detail
  const handleViewDetail = async (pendaftaranId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/riwayat/${pendaftaranId}`);
      if (!response.ok) throw new Error('Gagal mengambil detail pendaftaran');
      const data = await response.json();
      setSelectedDetail(data);
    } catch (error) {
      console.error(error);
      alert('Tidak dapat memuat detail pendaftaran.');
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Pasien Baru') return 'status-baru';
    if (status === 'Pasien Terdaftar') return 'status-terdaftar';
    return '';
  };

  return (
    <>
      <div id="riwayat-pendaftaran">
        <div className="riwayat-pendaftaran-header">
          <h1>Riwayat Pendaftaran</h1>
          <div className="riwayat-pendaftaran-header-components">
            <Clock />
          </div>
        </div>

        <div className="riwayat-pendaftaran-content">
          <div className="rp-filters">
            <div className="rp-search-bar">
              <img src={searchIcon} alt="search" />
              <input type="text" placeholder="Cari Nama atau NIK Pasien" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <input type="date" className="rp-date-input" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
            <button className="rp-btn-today" onClick={() => setSearchDate(new Date().toISOString().split('T')[0])}>
              Pergi Ke Hari Ini
            </button>
          </div>

          <div className="rp-table-container">
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Tanggal</th>
                  <th>No. Antrian</th>
                  <th>Nama Pasien</th>
                  <th>NIK</th>
                  <th>Poli Tujuan</th>
                  <th>Jam Daftar</th>
                  <th>Status Pasien</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}.</td>
                      <td>{item.tanggal}</td>
                      <td>{item.no_antrian}</td>
                      <td>{item.nama}</td>
                      <td>{item.nik}</td>
                      <td>{item.poli}</td>
                      <td>{item.jam_daftar}</td>
                      <td>
                        <span className={getStatusClass(item.status)}>{item.status}</span>
                      </td>
                      <td>
                        <button className="rp-btn-detail" onClick={() => handleViewDetail(item.id)}>
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data-found">
                      Tidak ada riwayat pendaftaran pada kriteria yang dipilih.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="riwayat-pendaftaran-footer">
          <p>
            Menampilkan {history.length} dari <span>{totalHistoryCount}</span> Pendaftaran
          </p>
        </div>
      </div>

      {selectedDetail && <RegistrationDetailOverlay detail={selectedDetail} onClose={() => setSelectedDetail(null)} />}
    </>
  );
};

export default RiwayatPendaftaran;
