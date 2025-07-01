import React from 'react'
import clockImg from '../assets/Jadwal/Clock jadwal.webp'

const Jadwal = () => {
  return (
    <>
    <div id="jadwal">
      <div className="jadwal-container">
        <div className="jadwal-title">
          <h1>
            Jadwal <span></span> <img src={clockImg} alt="Jam" />
          </h1>
          <h1>Pelayanan</h1>
        </div>
        <div className="jadwal-schedule">
          <div className="jadwal-schedule-container">
            <div className="jadwal-item">
              <div className="jadwal-icon kalender"></div>
              <div className="jadwal-teks">
                <span className="jadwal-hari">Senin - Kamis</span>
                <span className="jadwal-jam">08:00 - 15:30</span>
              </div>
            </div>
            <div className="jadwal-item">
              <div className="jadwal-icon masjid"></div>
              <div className="jadwal-teks">
                <span className="jadwal-hari">Jum'at</span>
                <span className="jadwal-jam">08:00 - 16:00</span>
              </div>
            </div>
            <div className="jadwal-item jadwal-no-border">
              <div className="jadwal-icon dilarang"></div>
              <div className="jadwal-teks">
                <span className="jadwal-hari">Sabtu, Minggu & <br />Hari Besar</span>
                <span className="jadwal-jam libur">Libur</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Jadwal