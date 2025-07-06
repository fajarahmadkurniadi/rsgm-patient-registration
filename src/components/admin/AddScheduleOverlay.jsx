import React, { useState, useEffect } from 'react';
import closeIcon from '../../assets/Navbar/Close X Button.webp';
import saveIcon from '../../assets/Icon/Simpan Data.webp';

const AddScheduleOverlay = ({ onClose, onAddSchedule, doctorList }) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [scheduleData, setScheduleData] = useState({
    hari_tanggal: '',
    jam_mulai: '',
    jam_selesai: '',
    status: 'Hadir',
  });
  const [selectedDoctorInfo, setSelectedDoctorInfo] = useState({
    nip: '',
    spesialis: ''
  });

  // Efek untuk auto-fill NIP dan Spesialis saat dokter dipilih
  useEffect(() => {
    if (selectedDoctorId) {
      const doctor = doctorList.find(d => d.id.toString() === selectedDoctorId);
      if (doctor) {
        setSelectedDoctorInfo({ nip: doctor.nip, spesialis: doctor.spesialis });
      }
    } else {
      setSelectedDoctorInfo({ nip: '', spesialis: '' });
    }
  }, [selectedDoctorId, doctorList]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleData(prev => ({ ...prev, [name]: value }));
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctorId(e.target.value);
  };
  
  const getDayName = (dateStr) => {
      if (!dateStr) return '';
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      return days[new Date(dateStr + 'T00:00:00').getDay()];
  };

  const handleSave = () => {
    if (!selectedDoctorId || !scheduleData.hari_tanggal || !scheduleData.jam_mulai || !scheduleData.jam_selesai) {
      alert("Harap lengkapi semua data jadwal.");
      return;
    }
    const doctor = doctorList.find(d => d.id.toString() === selectedDoctorId);
    
    // Buat objek jadwal baru dengan format yang benar
    const newSchedule = {
      id: Date.now(), // ID unik untuk jadwal baru
      nama: doctor.nama,
      nip: doctor.nip,
      spesialis: doctor.spesialis,
      // BUAT JADWAL STRING YANG SESUAI DENGAN FILTER
      jadwal: `${getDayName(scheduleData.hari_tanggal)} (${scheduleData.jam_mulai} - ${scheduleData.jam_selesai})`,
      status: scheduleData.status,
    };
    onAddSchedule(newSchedule);
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="js-overlay-container" onClick={(e) => e.stopPropagation()}>
        <div className="js-overlay-header">
          <h2>Tambah Jadwal</h2>
        </div>
        <div className="js-overlay-content">
          <div className="js-form-row">
            <label>Nama Dokter</label>
            <select value={selectedDoctorId} onChange={handleDoctorChange}>
              <option value="">Pilih Dokter</option>
              {doctorList.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.nama}</option>
              ))}
            </select>
          </div>
          <div className="js-form-row">
            <label>NIP</label>
            <input type="text" value={selectedDoctorInfo.nip} readOnly />
          </div>
          <div className="js-form-row">
            <label>Spesialis</label>
            <input type="text" value={selectedDoctorInfo.spesialis} readOnly />
          </div>
          <div className="js-form-row">
            <label>Hari/Tanggal</label>
            <input type="date" name="hari_tanggal" value={scheduleData.hari_tanggal} onChange={handleInputChange} />
          </div>
          <div className="js-form-row">
            <label>Jam Mulai</label>
            <input type="time" name="jam_mulai" value={scheduleData.jam_mulai} onChange={handleInputChange} />
          </div>
          <div className="js-form-row">
            <label>Jam Selesai</label>
            <input type="time" name="jam_selesai" value={scheduleData.jam_selesai} onChange={handleInputChange} />
          </div>
          <div className="js-form-row">
            <label>Status</label>
            <select name="status" value={scheduleData.status} onChange={handleInputChange}>
              <option value="Hadir">Hadir</option>
              <option value="Berhalangan">Berhalangan</option>
              <option value="Menggantikan">Menggantikan</option>
            </select>
          </div>
        </div>
        <div className="js-overlay-actions">
          <button className="js-btn-cancel" onClick={onClose}>Batal</button>
          <button className="js-btn-save" onClick={handleSave}>
            <img src={saveIcon} alt="Simpan"/> Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddScheduleOverlay;