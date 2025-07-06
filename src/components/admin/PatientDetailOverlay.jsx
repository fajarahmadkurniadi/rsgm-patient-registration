import React, { useState } from 'react';
import ConfirmationOverlay from './ConfirmationOverlay'; // Impor komponen konfirmasi
import closeIcon from '../../assets/Navbar/Close X Button.webp';
import deleteIcon from '../../assets/Icon/Hapus Data.webp';
import editIcon from '../../assets/Icon/Edit Data.webp';
import backIcon from '../../assets/Login Admin/Login Admin Arrow.webp';
import saveIcon from '../../assets/Icon/Simpan Data.webp';

// --- FUNGSI HELPER UNTUK FORMAT TANGGAL ---
// Mengubah DD/MM/YYYY menjadi YYYY-MM-DD (untuk input date)
const formatDateForInput = (dateStr) => {
  if (!dateStr || dateStr.split('/').length !== 3) return '';
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};

// Mengubah YYYY-MM-DD menjadi DD/MM/YYYY (untuk penyimpanan data)
const formatDateForStorage = (dateStr) => {
  if (!dateStr || dateStr.split('-').length !== 3) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

const PatientDetailOverlay = ({ patient, onClose, onUpdate, onDelete }) => {
  // State untuk mengontrol mode edit
  const [isEditing, setIsEditing] = useState(false);
  // State untuk data yang sedang diedit
  const [editedData, setEditedData] = useState({ ...patient });
  
  // State untuk dialog konfirmasi simpan dan hapus
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Handler untuk perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (e.target.type === 'date') {
      setEditedData(prevData => ({ ...prevData, [name]: formatDateForStorage(value) }));
    } else {
      setEditedData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  // --- Handler untuk alur Simpan ---
  const handleSaveChangesClick = () => setShowSaveConfirmation(true);
  const handleConfirmSave = () => {
    onUpdate(editedData);
    setShowSaveConfirmation(false);
  };
  const handleCancelSave = () => setShowSaveConfirmation(false);

  // --- Handler untuk alur Hapus ---
  const handleDeleteClick = () => setShowDeleteConfirmation(true);
  const handleConfirmDelete = () => {
    onDelete(patient.id);
    // Penutupan overlay utama akan ditangani oleh parent (DataPasien.jsx)
  };
  const handleCancelDelete = () => setShowDeleteConfirmation(false);

  return (
    <>
      {/* Latar belakang utama */}
      <div className="overlay-backdrop" onClick={onClose}>
        <div className="overlay-container" onClick={(e) => e.stopPropagation()}>
          
          {isEditing ? (
            // --- TAMPILAN MODE EDIT ---
            <>
              <div className="overlay-header">
                <button className="btn-back" onClick={() => setIsEditing(false)}>
                  <img src={backIcon} alt="Back" />
                </button>
                <h2>Edit Data Pasien</h2>
                <div style={{ width: '36px' }} />
              </div>
              <div className="overlay-content edit-form">
                <div className="form-row"><label>Nama Lengkap</label><input type="text" name="nama" value={editedData.nama} onChange={handleInputChange} /></div>
                <div className="form-row"><label>No. Rekam Medis</label><input type="text" name="no_rm" value={editedData.no_rm} readOnly /></div>
                <div className="form-row"><label>Tanggal Lahir</label><input type="date" name="tanggal_lahir" value={formatDateForInput(editedData.tanggal_lahir)} onChange={handleInputChange} /></div>
                <div className="form-row"><label>Jenis Kelamin</label><select name="jenis_kelamin" value={editedData.jenis_kelamin} onChange={handleInputChange}><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option></select></div>
                <div className="form-row"><label>Alamat</label><input type="text" name="alamat" value={editedData.alamat} onChange={handleInputChange} /></div>
                <div className="form-row"><label>No. HP</label><input type="text" name="no_hp" value={editedData.no_hp} onChange={handleInputChange} /></div>
                <div className="form-row"><label>Nomor Induk Keluarga</label><input type="text" name="nik" value={editedData.nik} onChange={handleInputChange} /></div>
                <div className="form-row"><label>Tanggal Daftar</label><input type="date" name="tanggal" value={formatDateForInput(editedData.tanggal)} onChange={handleInputChange} /></div>
              </div>
              <div className="overlay-actions">
                <button className="btn-save" onClick={handleSaveChangesClick}><img src={saveIcon} alt="Simpan"/> Simpan</button>
              </div>
            </>
          ) : (
            // --- TAMPILAN MODE LIHAT DETAIL ---
            <>
              <div className="overlay-header">
                <h2>Detail Pasien</h2>
                <button className="btn-close" onClick={onClose}><img src={closeIcon} alt="Close" /></button>
              </div>
              <div className="overlay-content">
                <table>
                  <tbody>
                    <tr><td>Nama Lengkap</td><td>{patient.nama}</td></tr>
                    <tr><td>No. Rekam Medis</td><td>{patient.no_rm}</td></tr>
                    <tr><td>Tanggal Lahir</td><td>{patient.tanggal_lahir}</td></tr>
                    <tr><td>Jenis Kelamin</td><td>{patient.jenis_kelamin}</td></tr>
                    <tr><td>Alamat</td><td>{patient.alamat}</td></tr>
                    <tr><td>No. HP</td><td>{patient.no_hp}</td></tr>
                    <tr><td>Nomor Induk Keluarga</td><td>{patient.nik}</td></tr>
                    <tr><td>Tanggal Daftar</td><td>{patient.tanggal}</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="overlay-actions">
                <button className="btn-delete" onClick={handleDeleteClick}><img src={deleteIcon}/> Hapus Data Pasien</button>
                <button className="btn-edit" onClick={() => setIsEditing(true)}><img src={editIcon}/> Edit Data Pasien</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Render Dialog Konfirmasi Simpan secara kondisional */}
      {showSaveConfirmation && (
        <ConfirmationOverlay
          title="Simpan Perubahan?"
          message="Data yang diubah akan disimpan"
          onConfirm={handleConfirmSave}
          onCancel={handleCancelSave}
          confirmText="Simpan"
          confirmColor="primary"
        />
      )}

      {/* Render Dialog Konfirmasi Hapus secara kondisional */}
      {showDeleteConfirmation && (
        <ConfirmationOverlay
          title="Hapus Data Pasien?"
          message="Data yang dihapus tidak akan bisa kembali"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirmText="Hapus"
          confirmColor="delete"
        />
      )}
    </>
  );
};

export default PatientDetailOverlay;