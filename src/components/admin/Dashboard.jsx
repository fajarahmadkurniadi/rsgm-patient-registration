import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

// Import semua komponen dan aset Anda
import notificationImg from "../../assets/Dashboard/Notification Logo - Before.webp";
import notificationAfterImg from "../../assets/Dashboard/Notification After.png";
import pendaftaranHariIniImg from "../../assets/Dashboard/Pendaftaran Hari ini - Dashboard.webp";
import pasienBulanIniImg from "../../assets/Dashboard/Pasien Bulan ini - Dashboard.webp";
import dokterAktifImg from "../../assets/Dashboard/Dokter Aktif - Dashboard.webp";
import jadwalDokterHariIniImg from "../../assets/Dashboard/Jadwal Dokter Hari ini - Dashboard.webp";
import WeeklyVisitChart from './WeeklyVisitChart';
import Clock from './Clock';
import DailyPatientList from './DailyPatientList';

// Inisialisasi koneksi socket
const socket = io('http://localhost:3001');

const Dashboard = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("Belum ada aktivitas baru.");

  const [stats, setStats] = useState({
    pendaftaranHariIni: 0,
    pasienBulanIni: 0,
    dokterAktif: 0,
    jadwalHariIni: 0,
  });
  const [pasienHarian, setPasienHarian] = useState([]);
  const [kunjunganMingguan, setKunjunganMingguan] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, pasienRes, kunjunganRes] = await Promise.all([
        fetch('http://localhost:3001/api/dashboard/stats'),
        fetch('http://localhost:3001/api/dashboard/pasien-hari-ini'),
        fetch('http://localhost:3001/api/dashboard/kunjungan-mingguan')
      ]);
      const statsData = await statsRes.json();
      const pasienData = await pasienRes.json();
      const kunjunganData = await kunjunganRes.json();
      setStats(statsData);
      setPasienHarian(pasienData);
      setKunjunganMingguan(kunjunganData);
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    socket.on('pendaftaran_baru', (data) => {
      console.log('Notifikasi pendaftaran diterima:', data.message);
      setNotificationMessage("Ada pendaftaran pasien baru!");
      setHasNewNotification(true);
      fetchDashboardData();
    });

    socket.on('pesan_baru', (data) => {
      console.log('Notifikasi pesan diterima:', data.message);
      setNotificationMessage(data.message);
      setHasNewNotification(true);
    });

    return () => {
      socket.off('pendaftaran_baru');
      socket.off('pesan_baru');
    };
  }, [fetchDashboardData]);

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (hasNewNotification) {
      setHasNewNotification(false);
    }
  };

  return (
    <div id="dashboard">
      <div className="dashboard-header">
        <h1>👋 Halo, Admin! Selamat datang di <br /> Dashboard RegisWeb.</h1>
        <div className="dashboard-header-components">
          <img
            src={hasNewNotification ? notificationAfterImg : notificationImg}
            alt="Notifikasi"
            onClick={toggleNotification}
            style={{ cursor: 'pointer' }}
          />
          <Clock />
          {isNotificationOpen && (
            <div className="notification-overlay">
              <p>{notificationMessage}</p>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-jumlah-keterangan">
        <div className="dashboard-jumlah-keterangan-core">
          <div className="dashboard-jumlah-keterangan-core-patient">
            <img src={pendaftaranHariIniImg} alt="Pendaftaran Hari Ini" />
            <div className="dashboard-jumlah-keterangan-core-patient-number">
              <h2>{stats.pendaftaranHariIni}</h2>
            </div>
          </div>
          <p>Pendaftaran Hari ini</p>
        </div>
        <div className="dashboard-jumlah-keterangan-core">
          <div className="dashboard-jumlah-keterangan-core-patient">
            <img src={pasienBulanIniImg} alt="Pasien Bulan Ini" />
            <div className="dashboard-jumlah-keterangan-core-patient-number">
              <h2>{stats.pasienBulanIni}</h2>
            </div>
          </div>
          <p>Pasien Bulan ini</p>
        </div>
        <div className="dashboard-jumlah-keterangan-core">
          <div className="dashboard-jumlah-keterangan-core-patient">
            <img src={dokterAktifImg} alt="Dokter Aktif" />
            <div className="dashboard-jumlah-keterangan-core-patient-number">
              <h2>{stats.dokterAktif}</h2>
            </div>
          </div>
          <p>Dokter aktif</p>
        </div>
        <div className="dashboard-jumlah-keterangan-core">
          <div className="dashboard-jumlah-keterangan-core-patient">
            <img src={jadwalDokterHariIniImg} alt="Jadwal Dokter Hari Ini" />
            <div className="dashboard-jumlah-keterangan-core-patient-number">
              <h2>{stats.jadwalHariIni}</h2>
            </div>
          </div>
          <p>Jadwal Dokter Hari ini</p>
        </div>
      </div>

      <div className="dashboard-list">
        <div className="dashboard-list-graphic">
          <h2>Kunjungan pasien mingguan</h2>
          <WeeklyVisitChart weeklyData={kunjunganMingguan} />
        </div>
        <div className="dashboard-list-patient-daily">
          <DailyPatientList patients={pasienHarian} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;