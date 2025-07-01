import React from 'react'
import Navbar from './Navbar'
import gambarDokter from '../assets/Hero/Dokter image 3 better version.webp'
import gambarDokterMobile from '../assets/Hero/Dokter image mobile 2.webp'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  
  const navigate = useNavigate()

  return (
    <>
    <div id="hero">
      <div className="hero-header">  
        <Navbar/>
      </div>
      <div className="hero-container">
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                Dapatkan <br />
                Layanan Medis <br />
                yang lebih cepat <br />
                dan efisien
              </h1>
              <h1>
                Dapatkan Layanan Medis <br />
                yang lebih cepat dan efisien
              </h1>
              <button onClick={() => navigate('/pendaftaranpasien')} className="cta-button">Daftar Sekarang</button>
            </div>
            <div className="hero-image-wrapper">
              <img src={gambarDokter} alt="Dokter" className="hero-image" />
              <img src={gambarDokterMobile} alt="Dokter" className="hero-image" />
            </div>
          </div>

          <div className="pasien-box">
            🦷 Pasien hari ini: <span>27</span>
          </div>
        </section>
      </div>
    </div>
    </>
  )
}

export default Hero