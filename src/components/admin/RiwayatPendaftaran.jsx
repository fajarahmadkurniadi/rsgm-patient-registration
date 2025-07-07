import React, { useState, useEffect } from 'react';
import Clock from './Clock';
import searchIcon from '../../assets/Icon/Search.webp';

const RiwayatPendaftaran = () => {
    const [allHistory, setAllHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchDate, setSearchDate] = useState('');
  
    // Fungsi untuk mengambil data riwayat dari API
    const fetchHistory = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/riwayat');
            if (!response.ok) {
                throw new Error('Gagal mengambil data riwayat');
            }
            const data = await response.json();
            setAllHistory(data);
        } catch (error) {
            console.error("Gagal mengambil riwayat pendaftaran:", error);
        }
    };

    // Ambil data saat komponen pertama kali dimuat
    useEffect(() => {
        fetchHistory();
    }, []);

    // Jalankan filter setiap kali ada perubahan
    useEffect(() => {
        let data = [...allHistory];
    
        if (searchTerm) {
            data = data.filter(item =>
                item.nama.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
    
        if (searchDate) {
            const [year, month, day] = searchDate.split('-');
            const formattedDate = `${day}/${month}/${year}`;
            data = data.filter(item => item.tanggal === formattedDate);
        }
    
        setFilteredHistory(data);
    }, [searchTerm, searchDate, allHistory]);
  
    const getStatusClass = (status) => {
        if (status === 'Pasien Baru') return 'status-baru';
        if (status === 'Pasien Terdaftar') return 'status-terdaftar';
        return '';
    };

    return (
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
                        <input
                            type="text"
                            placeholder="Cari Nama Pasien"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <input
                        type="date"
                        className="rp-date-input"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                    />
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
                            {filteredHistory.length > 0 ? (
                                filteredHistory.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}.</td>
                                        <td>{item.tanggal}</td>
                                        <td>{item.no_antrian}</td>
                                        <td>{item.nama}</td>
                                        <td>{item.nik}</td>
                                        <td>{item.poli}</td>
                                        <td>{item.jam_daftar}</td>
                                        <td><span className={getStatusClass(item.status)}>{item.status}</span></td>
                                        <td>
                                            <button className="rp-btn-detail">Lihat Detail</button>
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
                <p>Menampilkan {filteredHistory.length} dari <span>{allHistory.length}</span> Pendaftaran</p>
            </div>
        </div>
    );
};

export default RiwayatPendaftaran;