import React, { useState } from 'react';
import saveIcon from '../../assets/Icon/Simpan Data.webp';

const EditScheduleOverlay = ({ schedule, onClose, onUpdateSchedule }) => {
  // Inisialisasi state dengan data jadwal yang akan diedit
  const [editedSchedule, setEditedSchedule] = useState({
    id: schedule.id,
    status: schedule.status,
    jam_mulai: schedule.jam_mulai,
    jam_selesai: schedule.jam_selesai,
  });

  // Handler untuk setiap perubahan pada form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSchedule((prev) => ({ ...prev, [name]: value }));
  };

  // Handler saat tombol simpan diklik
  const handleSave = () => {
    onUpdateSchedule(editedSchedule);
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="es-overlay-container" onClick={(e) => e.stopPropagation()}>
        <div className="es-overlay-header">
          <h2>Edit Jadwal</h2>
        </div>
        <div className="es-overlay-content">
          {/* Form dinonaktifkan karena nama dan tanggal tidak seharusnya diubah */}
          <div className="es-form-row">
            <label>Nama Dokter</label>
            <input type="text" value={schedule.nama} readOnly />
          </div>
          <div className="es-form-row">
            <label>Hari/Tanggal</label>
            <input type="text" value={new Date(schedule.tanggal).toLocaleDateString('id-ID', { dateStyle: 'full' })} readOnly />
          </div>

          {/* Form yang bisa diubah */}
          <div className="es-form-row">
            <label>Jam Mulai</label>
            <input type="time" name="jam_mulai" value={editedSchedule.jam_mulai} onChange={handleInputChange} />
          </div>
          <div className="es-form-row">
            <label>Jam Selesai</label>
            <input type="time" name="jam_selesai" value={editedSchedule.jam_selesai} onChange={handleInputChange} />
          </div>
          <div className="es-form-row">
            <label>Status</label>
            <select name="status" value={editedSchedule.status} onChange={handleInputChange}>
              <option value="Hadir">Hadir</option>
              <option value="Berhalangan">Berhalangan</option>
              <option value="Menggantikan">Menggantikan</option>
            </select>
          </div>
        </div>
        <div className="es-overlay-actions">
          <button className="es-btn-cancel" onClick={onClose}>
            Batal
          </button>
          <button className="es-btn-save" onClick={handleSave}>
            <img src={saveIcon} alt="Simpan" /> Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditScheduleOverlay;
