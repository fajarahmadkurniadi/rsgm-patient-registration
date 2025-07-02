import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  // Fungsi yang akan dijalankan saat tombol "Keluar" diklik
  const handleLogout = () => {
    // Menghapus status login dari localStorage
    localStorage.removeItem('isAdminLoggedIn');
    
    // Mengarahkan pengguna kembali ke halaman login
    navigate('/loginadmin');
  };

  return (
    <>
      <div id="logout">
        <div className="logout-title">
          <h1>Yakin ingin logout?</h1>
          <h3>Kamu akan keluar dari halaman Admin RSGM Web</h3>
        </div>
        {/* Tambahkan onClick handler di sini */}
        <button onClick={handleLogout}>Keluar</button>
      </div>
    </>
  );
};

export default Logout;