import React, { useState, useEffect, useCallback } from 'react';
import Clock from './Clock';
import AddScheduleOverlay from './AddScheduleOverlay';
import EditScheduleOverlay from './EditScheduleOverlay';
import ConfirmationOverlay from './ConfirmationOverlay';
import searchIcon from '../../assets/Icon/Search.webp';
import deleteIcon from '../../assets/Icon/Hapus Data.webp';
import editIcon from '../../assets/Icon/Edit Data.webp';

const specialistOptions = [
  'Ortodonti',
  'Bedah Mulut',
  'Gigi Umum',
  'Konservasi Gigi',
  'Prosthodonsia',
  'Kesehatan Gigi Anak',
  'Periodonsia',
  'Endodonti',
  'Penyakit Mulut',
  'Radiologi Gigi dan Mulut',
  'Gigi Estetika dan Kosmetik',
  'Gigi Geriatri',
];

const Jadwal = () => {
  const [allDoctorList, setAllDoctorList] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [deletingScheduleId, setDeletingScheduleId] = useState(null);

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/dokter');
      if (!response.ok) throw new Error('Gagal mengambil daftar dokter');
      const data = await response.json();
      setAllDoctorList(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchSchedulesForDate = useCallback(async () => {
    if (!selectedDate) return;
    try {
      const params = new URLSearchParams({
        tanggal: selectedDate,
        spesialis: selectedSpecialty,
        search: searchTerm,
      });
      const response = await fetch(`http://localhost:3001/api/jadwalharian?${params}`);
      if (!response.ok) throw new Error(`Gagal mengambil jadwal untuk tanggal ${selectedDate}`);
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error(error);
      setSchedules([]);
    }
  }, [selectedDate, selectedSpecialty, searchTerm]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    fetchSchedulesForDate();
  }, [fetchSchedulesForDate]);

  const handleAddSchedule = async (newScheduleData) => {
    try {
      const response = await fetch('http://localhost:3001/api/jadwalharian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newScheduleData),
      });
      if (!response.ok) throw new Error('Gagal menambah jadwal');
      fetchSchedulesForDate();
      setShowAddSchedule(false);
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan jadwal baru.');
    }
  };

  const handleUpdateSchedule = async (updatedSchedule) => {
    try {
      const response = await fetch(`http://localhost:3001/api/jadwalharian/${updatedSchedule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSchedule),
      });
      if (!response.ok) throw new Error('Gagal memperbarui jadwal');
      fetchSchedulesForDate();
      setEditingSchedule(null);
    } catch (error) {
      console.error(error);
      alert('Gagal memperbarui jadwal.');
    }
  };

  const handleDeleteSchedule = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/jadwalharian/${deletingScheduleId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Gagal menghapus jadwal');
      fetchSchedulesForDate();
      setDeletingScheduleId(null);
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus jadwal.');
    }
  };

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
            <Clock />
          </div>
        </div>
        <div className="jd-content">
          <div className="jd-filters">
            <div className="jd-search-bar">
              <img src={searchIcon} alt="search" />
              <input type="text" placeholder="Cari berdasarkan NIP atau Nama" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <select className="jd-select" value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}>
              <option value="">Semua Spesialis</option>
              {specialistOptions.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <input type="date" className="jd-date-input" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
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
                  <th>No.</th>
                  <th>Nama Dokter</th>
                  <th>NIP</th>
                  <th>Spesialis</th>
                  <th>Hari/Tanggal</th>
                  <th>Jam Mulai</th>
                  <th>Jam Selesai</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {schedules.length > 0 ? (
                  schedules.map((schedule, index) => (
                    <tr key={schedule.id}>
                      <td>{index + 1}.</td>
                      <td>{schedule.nama}</td>
                      <td>{schedule.nip}</td>
                      <td>{schedule.spesialis}</td>
                      <td>{new Date(schedule.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</td>
                      <td>{schedule.jam_mulai}</td>
                      <td>{schedule.jam_selesai}</td>
                      <td className={getStatusClass(schedule.status)}>{schedule.status}</td>
                      <td>
                        <div className="jd-aksi-buttons">
                          <button className="jd-btn-aksi delete" onClick={() => setDeletingScheduleId(schedule.id)}>
                            <img src={deleteIcon} alt="Hapus" />
                          </button>
                          <button className="jd-btn-aksi edit" onClick={() => setEditingSchedule(schedule)}>
                            <img src={editIcon} alt="Edit" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data-found">
                      Tidak ada jadwal dokter pada kriteria yang dipilih.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="jadwal-dokter-footer">
          <p>
            Menampilkan {schedules.length} dari <span>{schedules.length}</span> Dokter
          </p>
        </div>
      </div>
      {showAddSchedule && <AddScheduleOverlay onClose={() => setShowAddSchedule(false)} onAddSchedule={handleAddSchedule} doctorList={allDoctorList} initialDate={selectedDate} />}
      {editingSchedule && <EditScheduleOverlay schedule={editingSchedule} onClose={() => setEditingSchedule(null)} onUpdateSchedule={handleUpdateSchedule} />}
      {deletingScheduleId && (
        <ConfirmationOverlay title="Hapus Jadwal?" message="Jadwal yang dipilih akan dihapus permanen." onConfirm={handleDeleteSchedule} onCancel={() => setDeletingScheduleId(null)} confirmText="Hapus" confirmColor="delete" />
      )}
    </>
  );
};

export default Jadwal;
