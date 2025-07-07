import React, { useState, useEffect } from 'react';
import saveIcon from '../../assets/Icon/Simpan Data.webp';

const AddScheduleOverlay = ({ onClose, onAddSchedule, doctorList, initialDate }) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [scheduleData, setScheduleData] = useState({
    tanggal: initialDate || '',
    jam_mulai: '',
    jam_selesai: '',
    status: 'Hadir',
  });
  const [selectedDoctorInfo, setSelectedDoctorInfo] = useState({
    nip: '',
    spesialis: '',
  });

  useEffect(() => {
    if (selectedDoctorId) {
      const doctor = doctorList.find((d) => d.id.toString() === selectedDoctorId);
      if (doctor) {
        setSelectedDoctorInfo({ nip: doctor.nip, spesialis: doctor.spesialis });
        // Ekstrak jam dari jadwal utama dokter
        const jadwalMatch = doctor.jadwal.match(/\((.*?)\)/);
        const jam = jadwalMatch ? jadwalMatch[1].split('-') : ['', ''];
        setScheduleData((prev) => ({ ...prev, jam_mulai: jam[0]?.trim(), jam_selesai: jam[1]?.trim() }));
      }
    } else {
      setSelectedDoctorInfo({ nip: '', spesialis: '' });
    }
  }, [selectedDoctorId, doctorList]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctorId(e.target.value);
  };

  const handleSave = () => {
    if (!selectedDoctorId || !scheduleData.tanggal || !scheduleData.jam_mulai || !scheduleData.jam_selesai) {
      alert('Harap lengkapi semua data jadwal.');
      return;
    }

    const newSchedule = {
      dokter_id: parseInt(selectedDoctorId, 10),
      tanggal: scheduleData.tanggal,
      jam_mulai: scheduleData.jam_mulai,
      jam_selesai: scheduleData.jam_selesai,
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
              {doctorList.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.nama}
                </option>
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
            <input type="date" name="tanggal" value={scheduleData.tanggal} onChange={handleInputChange} />
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
          <button className="js-btn-cancel" onClick={onClose}>
            Batal
          </button>
          <button className="js-btn-save" onClick={handleSave}>
            <img src={saveIcon} alt="Simpan" /> Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddScheduleOverlay;
