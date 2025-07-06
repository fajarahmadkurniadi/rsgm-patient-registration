import React, { useState, useRef, useEffect } from 'react';
import ConfirmationOverlay from './ConfirmationOverlay';
import closeIcon from '../../assets/Navbar/Close X Button.webp';
import deleteIcon from '../../assets/Icon/Hapus Data.webp';
import editIcon from '../../assets/Icon/Edit Data.webp';
import backIcon from '../../assets/Login Admin/Login Admin Arrow.webp';
import saveIcon from '../../assets/Icon/Simpan Data.webp';
import cameraIcon from '../../assets/Icon/add photo.webp';
import doctorPlaceholder from '../../assets/Icon/doctor_placeholder.png';

// --- (Fungsi helper tanggal tetap sama) ---
const formatDateForInput = (dateStr) => {
  if (!dateStr || dateStr.split('/').length !== 3) return '';
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};

const formatDateForStorage = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

const DoctorDetailOverlay = ({ doctor, onClose, onUpdate, onDelete }) => {
  // ... (semua state dan handler lain tetap sama) ...
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...doctor });
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(() => {
    if (doctor.foto && typeof doctor.foto === 'object') {
      return URL.createObjectURL(doctor.foto);
    }
    return doctor.foto;
  });
  const [schedule, setSchedule] = useState({ days: [], start: '', end: '' });

  useEffect(() => {
    if (isEditing) {
      const scheduleRegex = /([\w\s,&-]+)\s*\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/;
      const match = doctor.jadwal.match(scheduleRegex);
      if (match) {
        const daysRaw = match[1].replace(/&/g, ',').replace(/-/g, ',');
        const daysArray = daysRaw.split(',').map(d => d.trim()).filter(Boolean);
        setSchedule({ days: daysArray, start: match[2], end: match[3] });
      }
    }
  }, [isEditing, doctor.jadwal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'jadwal_awal' || name === 'jadwal_akhir') {
      const timePart = name === 'jadwal_awal' ? 'start' : 'end';
      setSchedule(prev => ({ ...prev, [timePart]: value }));
    } else {
        setEditedData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDayToggle = (day) => {
    setSchedule(prev => {
      const newDays = prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day];
      return { ...prev, days: newDays };
    });
  };

  const handlePhotoClick = () => fileInputRef.current.click();
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedData(prev => ({ ...prev, foto: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChangesClick = () => {
    const requiredFields = ['nama', 'spesialis', 'nip', 'tanggal_lahir', 'no_str', 'no_hp', 'alamat'];
    for (const field of requiredFields) {
        if (!editedData[field]) {
            alert('Harap isi semua form terlebih dahulu!');
            return;
        }
    }
    if (schedule.days.length === 0 || !schedule.start || !schedule.end) {
        alert('Harap isi semua form terlebih dahulu!');
        return;
    }

    const jadwalString = `${schedule.days.join(', ')} (${schedule.start} - ${schedule.end})`;
    const finalData = {
        ...editedData,
        jadwal: jadwalString,
        tanggal_lahir: editedData.tanggal_lahir.includes('-') 
            ? formatDateForStorage(editedData.tanggal_lahir) 
            : editedData.tanggal_lahir,
    };
    setEditedData(finalData);
    setShowSaveConfirmation(true);
  };
  
  const handleConfirmSave = () => {
    onUpdate(editedData);
    setShowSaveConfirmation(false);
  };
  const handleCancelSave = () => setShowSaveConfirmation(false);
  const handleDeleteClick = () => setShowDeleteConfirmation(true);
  const handleConfirmDelete = () => onDelete(doctor.id);
  const handleCancelDelete = () => setShowDeleteConfirmation(false);

  const daysOfWeek = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <>
      <div className="overlay-backdrop" onClick={onClose}>
        <div className="dd-overlay-container" onClick={(e) => e.stopPropagation()}>
          {isEditing ? (
            <>
              <div className="dd-edit-header">
                <button className="dd-btn-back" onClick={() => setIsEditing(false)}><img src={backIcon} alt="Back" /></button>
                <h2>Edit Data Dokter</h2>
                <div style={{ width: '36px' }} />
              </div>
              <div className="dd-edit-content">
                <div className="dd-edit-photo-section">
                  <div className="dd-edit-photo-placeholder" onClick={handlePhotoClick}>
                    {photoPreview ? (<img src={photoPreview} alt="Preview" className="dd-edit-photo-preview" />) : (<img src={cameraIcon} alt="Upload" />)}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handlePhotoChange} style={{ display: 'none' }} accept="image/*" />
                </div>
                <div className="dd-edit-form-row"><label>Nama Lengkap</label><input type="text" name="nama" value={editedData.nama} onChange={handleInputChange} /></div>
                
                {/* --- PERBAIKAN ADA DI SINI --- */}
                <div className="dd-edit-form-row">
                  <label>Spesialis</label>
                  <select name="spesialis" value={editedData.spesialis} onChange={handleInputChange}>
                    <option value="">Pilih Spesialis</option>
                    <option value="Ortodonti">Ortodonti</option>
                    <option value="Bedah Mulut">Bedah Mulut</option>
                    <option value="Gigi Umum">Gigi Umum</option>
                    <option value="Konservasi Gigi">Konservasi Gigi</option>
                    <option value="Prosthodonsia">Prosthodonsia</option>
                    <option value="Kesehatan Gigi Anak">Kesehatan Gigi Anak</option>
                    <option value="Periodonsia">Periodonsia</option>
                    <option value="Endodonti">Endodonti</option>
                    <option value="Penyakit Mulut">Penyakit Mulut</option>
                    <option value="Radiologi Gigi dan Mulut">Radiologi Gigi dan Mulut</option>
                    <option value="Gigi Estetika dan Kosmetik">Gigi Estetika dan Kosmetik</option>
                    <option value="Gigi Geriatri">Gigi Geriatri</option>
                  </select>
                </div>
                
                <div className="dd-edit-form-row"><label>NIP</label><input type="text" name="nip" value={editedData.nip} readOnly /></div>
                <div className="dd-edit-form-row"><label>Tanggal Lahir</label><input type="date" name="tanggal_lahir" value={formatDateForInput(editedData.tanggal_lahir)} onChange={handleInputChange} /></div>
                <div className="dd-edit-form-row schedule"><label>Jadwal Praktek</label><div className="dd-schedule-inputs"><div className="dd-schedule-days">{daysOfWeek.map(day => (<button key={day} type="button" className={`dd-day-btn ${schedule.days.includes(day) ? 'active' : ''}`} onClick={() => handleDayToggle(day)}>{day}</button>))}</div><div className="dd-schedule-time"><input type="text" name="jadwal_awal" placeholder="Awal" value={schedule.start} onChange={handleInputChange} /><span>—</span><input type="text" name="jadwal_akhir" placeholder="Akhir" value={schedule.end} onChange={handleInputChange} /></div></div></div>
                <div className="dd-edit-form-row"><label>No. STR</label><input type="text" name="no_str" value={editedData.no_str} onChange={handleInputChange} /></div>
                <div className="dd-edit-form-row"><label>No. HP</label><input type="text" name="no_hp" value={editedData.no_hp} onChange={handleInputChange} /></div>
                <div className="dd-edit-form-row"><label>Alamat</label><input type="text" name="alamat" value={editedData.alamat} onChange={handleInputChange} /></div>
                <div className="dd-edit-form-row status"><label>Status</label><div className="dd-status-options"><label><input type="radio" name="status" value="Aktif" checked={editedData.status === 'Aktif'} onChange={handleInputChange} />Aktif</label><label><input type="radio" name="status" value="Tidak Aktif" checked={editedData.status === 'Tidak Aktif'} onChange={handleInputChange} />Tidak aktif</label></div></div>
              </div>
              <div className="dd-edit-actions">
                <button className="dd-btn-discard" onClick={() => setIsEditing(false)}>Buang Perubahan</button>
                <button className="dd-btn-save-changes" onClick={handleSaveChangesClick}><img src={saveIcon} alt="Simpan" /> Simpan Perubahan</button>
              </div>
            </>
          ) : (
            <>
              <div className="dd-view-header">
                <h2>Profil Dokter</h2>
                <button className="dd-btn-close" onClick={onClose}><img src={closeIcon} alt="Close" /></button>
              </div>
              <div className="dd-view-content">
                <img src={doctor.foto && typeof doctor.foto === 'object' ? URL.createObjectURL(doctor.foto) : doctorPlaceholder} alt={doctor.nama} className="dd-profile-photo" />
                <h3 className="dd-doctor-name">{doctor.nama}</h3>
                <p className="dd-doctor-specialty">{doctor.spesialis}</p>
                <table className="dd-info-table">
                  <tbody>
                    <tr><td>NIP</td><td>{doctor.nip}</td></tr>
                    <tr><td>Tanggal Lahir</td><td>{doctor.tanggal_lahir}</td></tr>
                    <tr><td>Jadwal Praktek</td><td>{doctor.jadwal}</td></tr>
                    <tr><td>No. STR</td><td>{doctor.no_str}</td></tr>
                    <tr><td>No. HP</td><td>{doctor.no_hp}</td></tr>
                    <tr><td>Alamat</td><td>{doctor.alamat}</td></tr>
                    <tr><td>Status</td><td className={`dd-status ${doctor.status === 'Aktif' ? 'active' : 'inactive'}`}>{doctor.status}</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="dd-view-actions">
                <button className="dd-btn-delete" onClick={handleDeleteClick}><img src={deleteIcon} alt="Hapus"/> Hapus Data Dokter</button>
                <button className="dd-btn-edit" onClick={() => setIsEditing(true)}><img src={editIcon} alt="Edit"/> Edit Data Dokter</button>
              </div>
            </>
          )}
        </div>
      </div>
      {showSaveConfirmation && ( <ConfirmationOverlay title="Simpan Perubahan?" message="Data yang diubah akan disimpan" onConfirm={handleConfirmSave} onCancel={handleCancelSave} confirmText="Simpan" confirmColor="primary"/> )}
      {showDeleteConfirmation && ( <ConfirmationOverlay title="Hapus Data Dokter?" message="Data yang dihapus tidak akan bisa kembali" onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} confirmText="Hapus" confirmColor="delete"/> )}
    </>
  );
};

export default DoctorDetailOverlay;