import React, { useState, useEffect } from 'react';
import Clock from './Clock';
import AddScheduleOverlay from './AddScheduleOverlay'; // Impor komponen overlay baru
import searchIcon from '../../assets/Icon/Search.webp';
import deleteIcon from '../../assets/Icon/Hapus Data.webp';
import editIcon from '../../assets/Icon/Edit Data.webp';

// Data dokter yang akan digunakan untuk mengisi dropdown di "Tambah Jadwal"
const allDoctorData = [
    { id: 1, nama: 'drg. Siti Nazifah, Sp.Ort., Subsp. OD (K)', nip: '200600193', spesialis: 'Ortodonti', jadwal: 'Senin, Rabu (08:30 - 12:00)', status: 'Hadir' },
    { id: 2, nama: 'drg. Andi Surya, Sp. BM', nip: '1957204830', spesialis: 'Bedah Mulut', jadwal: 'Kamis, Sabtu (08:30 - 12:00)', status: 'Hadir' },
    { id: 3, nama: 'drg. Marsha Anjely Julius, S.K.G.', nip: '230600043', spesialis: 'Gigi Umum', jadwal: 'Senin, Rabu (13:30 - 18:00)', status: 'Hadir' },
    { id: 4, nama: 'drg. Citra Wahyuni, Sp. KG', nip: '1840965320', spesialis: 'Konservasi Gigi', jadwal: 'Kamis, Sabtu (13:30 - 18:00)', status: 'Berhalangan' },
    { id: 5, nama: 'drg. Eka Pratama, Sp.Pros', nip: '2579103826', spesialis: 'Prosthodonsia', jadwal: 'Senin, Rabu (08:30 - 12:00)', status: 'Hadir' },
    { id: 6, nama: 'drg. Rina Amelia, M.Kes', nip: '201504881', spesialis: 'Kesehatan Gigi Anak', jadwal: 'Selasa, Kamis (09:00 - 14:00)', status: 'Hadir' },
    { id: 7, nama: 'drg. Ivan Zulkarnain, Sp.Perio', nip: '200911547', spesialis: 'Periodonsia', jadwal: 'Jumat, Sabtu (10:00 - 15:00)', status: 'Menggantikan' },
    { id: 8, nama: 'drg. Bima Sakti', nip: '210700211', spesialis: 'Gigi Umum', jadwal: 'Senin, Rabu (08:30 - 12:00)', status: 'Hadir' },
];

// Daftar spesialis untuk dropdown filter
const specialistOptions = [
    "Ortodonti", "Bedah Mulut", "Gigi Umum", "Konservasi Gigi", 
    "Prosthodonsia", "Kesehatan Gigi Anak", "Periodonsia", "Endodonti", 
    "Penyakit Mulut", "Radiologi Gigi dan Mulut", "Gigi Estetika dan Kosmetik", "Gigi Geriatri"
];

const Jadwal = () => {
    // State untuk data yang akan ditampilkan di tabel
    const [schedules, setSchedules] = useState([]);
    // State untuk semua data jadwal (termasuk yang baru ditambahkan)
    const [allSchedules, setAllSchedules] = useState(allDoctorData); 

    // State untuk input filter
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    
    // State untuk total dokter pada hari yang dipilih
    const [dailyTotal, setDailyTotal] = useState(0);

    // State untuk mengontrol visibilitas overlay "Tambah Jadwal"
    const [showAddSchedule, setShowAddSchedule] = useState(false); 

    // Fungsi untuk mendapatkan nama hari dari tanggal
    const getDayName = (date) => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return days[new Date(date + 'T00:00:00').getDay()];
    };

    // Fungsi untuk menangani penambahan jadwal baru dari overlay
    const handleAddSchedule = (newSchedule) => {
        setAllSchedules(prev => [...prev, newSchedule]);
        setShowAddSchedule(false);
    };

    // useEffect untuk memfilter data setiap kali ada perubahan
    useEffect(() => {
        let data = [...allSchedules];
        
        if (selectedDate) {
            const dayName = getDayName(selectedDate);
            data = data.filter(doc => doc.jadwal.includes(dayName));
        }

        if (selectedSpecialty) {
            data = data.filter(doc => doc.spesialis === selectedSpecialty);
        }
        
        setDailyTotal(data.length);

        if (searchTerm) {
            data = data.filter(doc =>
                doc.nip.includes(searchTerm) ||
                doc.nama.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setSchedules(data);
        
    }, [searchTerm, selectedDate, selectedSpecialty, allSchedules]);

    const getStatusClass = (status) => {
        if (status === 'Hadir') return 'status-hadir';
        if (status === 'Berhalangan') return 'status-berhalangan';
        if (status === 'Menggantikan') return 'status-menggantikan';
        return '';
    };

    return (
        <>
            <div id="jadwal-dokter">
                <div className="jadwal-dokter-header">
                    <h1>Jadwal</h1>
                    <div className="jadwal-dokter-header-components">
                        <Clock/>
                    </div>
                </div>

                <div className="jd-content">
                    <div className="jd-filters">
                        <div className="jd-search-bar">
                            <img src={searchIcon} alt="search" />
                            <input 
                                type="text" 
                                placeholder="Cari berdasarkan NIP atau Nama" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select 
                            className="jd-select" 
                            value={selectedSpecialty} 
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                        >
                            <option value="">Semua Spesialis</option>
                            {specialistOptions.map(spec => (
                                <option key={spec} value={spec}>{spec}</option>
                            ))}
                        </select>
                        <input 
                            type="date" 
                            className="jd-date-input" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <button className="jd-btn-today" onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}>
                            Pergi Ke Hari Ini
                        </button>
                        <button className="jd-btn-add" onClick={() => setShowAddSchedule(true)}>
                            <span>+</span> Tambah Jadwal
                        </button>
                    </div>

                    <div className="jd-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>No.</th><th>Nama Dokter</th><th>NIP</th><th>Spesialis</th>
                                    <th>Hari/Tanggal</th><th>Jam Mulai</th><th>Jam Selesai</th>
                                    <th>Status</th><th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.length > 0 ? (
                                    schedules.map((schedule, index) => {
                                        const jadwalMatch = schedule.jadwal.match(/\((.*?)\)/);
                                        const jam = jadwalMatch ? jadwalMatch[1].split('-') : ['N/A', 'N/A'];
                                        const jamMulai = jam[0]?.trim();
                                        const jamSelesai = jam[1]?.trim();

                                        return (
                                            <tr key={schedule.id}>
                                                <td>{index + 1}.</td>
                                                <td>{schedule.nama}</td>
                                                <td>{schedule.nip}</td>
                                                <td>{schedule.spesialis}</td>
                                                <td>
                                                    {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Pilih tanggal'}
                                                </td>
                                                <td>{jamMulai}</td>
                                                <td>{jamSelesai}</td>
                                                <td className={getStatusClass(schedule.status)}>{schedule.status}</td>
                                                <td>
                                                    <div className="jd-aksi-buttons">
                                                        <button className="jd-btn-aksi delete"><img src={deleteIcon} alt="Hapus"/></button>
                                                        <button className="jd-btn-aksi edit"><img src={editIcon} alt="Edit"/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="no-data-found">
                                            Tidak ada jadwal dokter pada hari yang dipilih.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="jadwal-dokter-footer">
                    <p>Menampilkan {schedules.length} dari <span>{dailyTotal}</span> Dokter</p>
                </div>
            </div>
            
            {showAddSchedule && (
                <AddScheduleOverlay 
                    onClose={() => setShowAddSchedule(false)}
                    onAddSchedule={handleAddSchedule}
                    doctorList={allDoctorData}
                />
            )}
        </>
    );
};

export default Jadwal;