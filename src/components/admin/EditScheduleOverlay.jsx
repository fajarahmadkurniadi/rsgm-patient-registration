import React, { useState, useEffect } from 'react';
import closeIcon from '../../assets/Navbar/Close X Button.webp';
import saveIcon from '../../assets/Icon/Simpan Data.webp';

const EditScheduleOverlay = ({ schedule, onClose, onUpdateSchedule }) => {
  const [editedSchedule, setEditedSchedule] = useState({ ...schedule });
  const [scheduleParts, setScheduleParts] = useState({ days: [], start: '', end: '' });

  // Efek untuk mem-parse jadwal saat komponen dimuat
  useEffect(() => {
    const scheduleRegex = /([\w\s,&-]+)\s*\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/;
    const match = schedule.jadwal.match(scheduleRegex);
    if (match) {
      const daysRaw = match[1].replace(/&/g, ',').replace(/-/g, ',');
      const daysArray = daysRaw.split(',').map(d => d.trim()).filter(Boolean);
      setScheduleParts({ days: daysArray, start: match[2], end: match[3] });
    }
  }, [schedule.jadwal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'start' || name === 'end') {
      setScheduleParts(prev => ({ ...prev, [name]: value }));
    } else {
      setEditedSchedule(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDayToggle = (day) => {
    setScheduleParts(prev => {
      const newDays = prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day];
      return { ...prev, days: newDays };
    });
  };

  const handleSave = () => {
    const jadwalString = `${scheduleParts.days.join(', ')} (${scheduleParts.start} - ${scheduleParts.end})`;
    const finalData = { ...editedSchedule, jadwal: jadwalString };
    onUpdateSchedule(finalData);
  };

  const daysOfWeek = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="es-overlay-container" onClick={(e) => e.stopPropagation()}>
        <div className="es-overlay-header">
          <h2>Edit Jadwal</h2>
        </div>
        <div className="es-overlay-content">
          <div className="es-form-row">
            <label>Nama Dokter</label>
            <input type="text" value={editedSchedule.nama} readOnly />
          </div>
          <div className="es-form-row">
            <label>Jadwal Praktek</label>
            <div className="es-schedule-inputs">
              <div className="es-schedule-days">
                {daysOfWeek.map(day => (
                  <button key={day} type="button" className={`es-day-btn ${scheduleParts.days.includes(day) ? 'active' : ''}`} onClick={() => handleDayToggle(day)}>
                    {day}
                  </button>
                ))}
              </div>
              <div className="es-schedule-time">
                <input type="time" name="start" value={scheduleParts.start} onChange={handleInputChange} />
                <span>—</span>
                <input type="time" name="end" value={scheduleParts.end} onChange={handleInputChange} />
              </div>
            </div>
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
          <button className="es-btn-cancel" onClick={onClose}>Batal</button>
          <button className="es-btn-save" onClick={handleSave}>
            <img src={saveIcon} alt="Simpan"/> Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditScheduleOverlay;