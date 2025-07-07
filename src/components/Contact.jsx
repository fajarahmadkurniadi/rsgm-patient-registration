import React, { useState } from 'react';
import emailLogo from '../assets/Contact/Contact Email.webp';
import telephoneLogo from '../assets/Contact/Contact Telephone.webp';
import dokterImg from '../assets/Contact/Contact Dokter.webp';

const Contact = () => {
  const [contactData, setContactData] = useState({
    nama: '',
    email: '',
    pesan: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contactData.nama || !contactData.email || !contactData.pesan) {
      alert('Harap isi semua kolom terlebih dahulu.');
      return;
    }

    try {
        const response = await fetch('http://localhost:3001/api/pesan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData),
        });

        if (!response.ok) {
            throw new Error('Gagal mengirim pesan');
        }

        // Kosongkan form terlebih dahulu
        setContactData({ nama: '', email: '', pesan: '' });

        // Tampilkan alert setelah form kosong
        setTimeout(() => {
            alert('Pesan Anda berhasil terkirim!');
        }, 0);

    } catch (error) {
        console.error('Error submitting message:', error);
        alert('Terjadi kesalahan saat mengirim pesan.');
    }
  };

  return (
    <>
      <div id="contact">
        <div className="contact-container">
          <div className="contact-core">
            <div className="contact-left">
              <h1>Hubungi Kami</h1>
              <div className="contact-left-address">
                <p><img className='contact-left-address-logo' src={emailLogo} alt="Email"/><a href="mailto:rsgm@usu.ac.id">rsgm@usu.ac.id</a></p>
                <p><img className='contact-left-address-logo' src={telephoneLogo} alt="Telepon"/><a href="https://api.whatsapp.com/send?phone=085791259191">+62 857-9125-9191</a></p>
              </div>
              <img className='contact-left-image' src={dokterImg} alt="Dokter"/>
            </div>
            <div className="contact-right">
              <form onSubmit={handleSubmit}>
                <input type="text" name="nama" placeholder='Nama Lengkap' value={contactData.nama} onChange={handleInputChange}/>
                <input type="email" name="email" placeholder='Alamat Email' value={contactData.email} onChange={handleInputChange}/>
                <textarea name="pesan" rows="6" placeholder='Pesan' value={contactData.pesan} onChange={handleInputChange}></textarea>
                <div className="contact-right-form-justfit">
                  <button type="submit">Kirim</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;