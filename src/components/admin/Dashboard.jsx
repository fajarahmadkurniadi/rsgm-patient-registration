import React, { useState } from 'react';

// Impor semua aset gambar yang dibutuhkan
// (notificationAfterImg sudah tidak digunakan, tapi boleh tetap diimpor jika akan dipakai lagi nanti)
import notificationImg from "../../assets/Dashboard/Notification Logo - Before.webp";
import notificationAfterImg from "../../assets/Dashboard/Notification Logo - After.webp";
import pendaftaranHariIniImg from "../../assets/Dashboard/Pendaftaran Hari ini - Dashboard.webp";
import pasienBulanIniImg from "../../assets/Dashboard/Pasien Bulan ini - Dashboard.webp";
import dokterAktifImg from "../../assets/Dashboard/Dokter Aktif - Dashboard.webp";
import jadwalDokterHariIniImg from "../../assets/Dashboard/Jadwal Dokter Hari ini - Dashboard.webp";

// Impor komponen-komponen child
import WeeklyVisitChart from './WeeklyVisitChart';
import Clock from './Clock';
import DailyPatientList from './DailyPatientList';

const Dashboard = () => {
  // Hanya state untuk membuka/menutup overlay
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Fungsi toggle sederhana
  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <>
      <div id="dashboard">
        {/* Bagian Header */}
        <div className="dashboard-header">
          <h1>👋 Halo, Admin! Selamat datang di <br /> Dashboard RegisWeb.</h1>
          <div className="dashboard-header-components">
            {/* Gambar sekarang statis dan hanya memiliki fungsi onClick */}
            <img 
              src={notificationImg} 
              alt="Notifikasi"
              onClick={toggleNotification} 
            />
            <Clock />

            {/* Tampilkan overlay notifikasi jika 'isNotificationOpen' true */}
            {isNotificationOpen && (
              <div className="notification-overlay">
                <p>Belum ada aktivitas hari ini</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Bagian Kartu Statistik */}
        <div className="dashboard-jumlah-keterangan">
          <div className="dashboard-jumlah-keterangan-core">
            <div className="dashboard-jumlah-keterangan-core-patient">
                <img src={pendaftaranHariIniImg} alt="Pendaftaran Hari Ini" />
              <div className="dashboard-jumlah-keterangan-core-patient-number">
                <h2>27</h2>
              </div>
            </div>
            <p>Pendaftaran Hari ini</p>
          </div>
          <div className="dashboard-jumlah-keterangan-core">
            <div className="dashboard-jumlah-keterangan-core-patient">
                <img src={pasienBulanIniImg} alt="Pasien Bulan Ini" />
              <div className="dashboard-jumlah-keterangan-core-patient-number">
                <h2>2035</h2>
              </div>
            </div>
            <p>Pasien Bulan ini</p>
          </div>
          <div className="dashboard-jumlah-keterangan-core">
            <div className="dashboard-jumlah-keterangan-core-patient">
                <img src={dokterAktifImg} alt="Dokter Aktif" />
              <div className="dashboard-jumlah-keterangan-core-patient-number">
                <h2>45</h2>
              </div>
            </div>
            <p>Dokter aktif</p>
          </div>
          <div className="dashboard-jumlah-keterangan-core">
            <div className="dashboard-jumlah-keterangan-core-patient">
                <img src={jadwalDokterHariIniImg} alt="Jadwal Dokter Hari Ini" />
              <div className="dashboard-jumlah-keterangan-core-patient-number">
                <h2>30</h2>
              </div>
            </div>
            <p>Jadwal Dokter Hari ini</p>
          </div>
        </div>
        
        {/* Bagian Konten Utama (Grafik dan Daftar Pasien) */}
        <div className="dashboard-list">
          <div className="dashboard-list-graphic">
            <h2>Kunjungan pasien mingguan</h2>
            <WeeklyVisitChart />
          </div>
          
          <div className="dashboard-list-patient-daily">
            <DailyPatientList />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;