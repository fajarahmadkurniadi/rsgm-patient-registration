import React from 'react';

const ConfirmationOverlay = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = "Simpan", // Teks default jika tidak ada yg dikirim
  confirmColor = "primary" // Warna default (primary/delete)
}) => {
  return (
    <div className="overlay-backdrop" onClick={onCancel}>
      <div className="confirmation-container" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-content">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
        <div className="confirmation-actions">
          <button className="btn-cancel" onClick={onCancel}>Batal</button>
          {/* Tombol sekarang dinamis */}
          <button 
            className={`btn-confirm ${confirmColor === 'delete' ? 'btn-confirm-delete' : ''}`} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationOverlay;