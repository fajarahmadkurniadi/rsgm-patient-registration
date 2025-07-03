import React, { useEffect, useState } from 'react'
import notificationImg from "../../assets/Dashboard/Notification Logo - Before.webp"
import pendaftaranHariIniImg from "../../assets/Dashboard/Pendaftaran Hari ini - Dashboard.webp"
import pasienBulanIniImg from "../../assets/Dashboard/Pasien Bulan ini - Dashboard.webp"
import dokterAktifImg from "../../assets/Dashboard/Dokter Aktif - Dashboard.webp"
import jadwalDokterHariIniImg from "../../assets/Dashboard/Jadwal Dokter Hari ini - Dashboard.webp"

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Format tanggal: 03 Juli 2025
      const options = { day: '2-digit', month: 'long', year: 'numeric' };
      const formattedDate = now.toLocaleDateString('id-ID', options);

      // Format waktu: 12:47
      const formattedTime = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    };

    updateDateTime(); // panggil sekali saat awal

    const interval = setInterval(updateDateTime, 1000); // update setiap detik

    return () => clearInterval(interval); // bersihkan interval saat komponen di-unmount
  }, []);

  return (
    <>
      <div id="dashboard">
        <div className="dashboard-header">
          <h1>👋 Halo, Admin! Selamat datang di <br /> Dashboard RegisWeb.</h1>
          <div className="dashboard-header-components">
            <img src={notificationImg} alt="Notifikasi" />
            <p>{currentDate}</p>
            <h5>{currentTime}</h5>
          </div>
        </div>
        <div className="dashboard-jumlah-keterangan">
          <div className="dashboard-jumlah-keterangan-core">
            <div className="dashboard-jumlah-keterangan-core-patient">
                <img src={pendaftaranHariIniImg} />
              <div className="dashboard-jumlah-keterangan-core-patient-number">
                <h2>27</h2>
              </div>
            </div>
            <p>Pendaftaran Hari ini</p>
          </div>
          <div className="dashboard-jumlah-keterangan-core">
            <div className="dashboard-jumlah-keterangan-core-patient">
                <img src={pasienBulanIniImg} />
              <div className="dashboard-jumlah-keterangan-core-patient-number">
                <h2>2035</h2>
              </div>
            </div>
            <p>Pasien Bulan ini</p>
          </div>
          <div className="dashboard-jumlah-keterangan-core">
            <div className="dashboard-jumlah-keterangan-core-patient">
                <img src={dokterAktifImg} />
              <div className="dashboard-jumlah-keterangan-core-patient-number">
                <h2>45</h2>
              </div>
            </div>
            <p>Dokter aktif</p>
          </div>
          <div className="dashboard-jumlah-keterangan-core">
            <div className="dashboard-jumlah-keterangan-core-patient">
                <img src={jadwalDokterHariIniImg} />
              <div className="dashboard-jumlah-keterangan-core-patient-number">
                <h2>30</h2>
              </div>
            </div>
            <p>Jadwal Dokter Hari ini</p>
          </div>
        </div>
        <div className="dashboard-list"><h3>suiybdfbus</h3></div>
      </div>
    </>
  )
}

export default Dashboard
