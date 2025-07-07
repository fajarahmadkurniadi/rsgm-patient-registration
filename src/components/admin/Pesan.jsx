import React, { useState, useEffect } from 'react';
import Clock from './Clock';

const Pesan = () => {
  const [messages, setMessages] = useState([]);

  // Fungsi untuk mengambil data dari API
  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/pesan');
      if (!response.ok) {
        throw new Error('Gagal mengambil data pesan');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Gagal mengambil pesan:", error);
    }
  };

  // Mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div id="admin-pesan">
      <div className="admin-pesan-header">
        <h1>Pesan Masuk</h1>
        <div className="admin-pesan-header-components">
          <Clock />
        </div>
      </div>

      <div className="admin-pesan-content">
        <div className="ap-table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Jam</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Pesan</th>
              </tr>
            </thead>
            <tbody>
              {messages.length > 0 ? (
                messages.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}.</td>
                    <td>{item.tanggal}</td>
                    <td>{item.jam}</td>
                    <td>{item.nama}</td>
                    <td>{item.email}</td>
                    <td className="pesan-text">{item.pesan}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data-found">
                    Tidak ada pesan masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="admin-pesan-footer">
           <p>Menampilkan {messages.length} dari <span>{messages.length}</span> Pesan</p>
      </div>
    </div>
  );
}

export default Pesan;