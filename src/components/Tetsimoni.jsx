import React, { useState } from 'react';
import leftSlideButton from '../assets/Testimoni/Left Slide Button.webp'
import rightSlideButton from '../assets/Testimoni/Right Slide Button.webp'
import avatarAlien from '../assets/Testimoni/Profile Photo Alien.webp';
import avatarCat from '../assets/Testimoni/Profile Photo Cat.webp';
import avatarPaiz from '../assets/Testimoni/Paiz Profile Photo Rounded.webp';
import avatarSkroep from '../assets/Testimoni/Skroep Profile Photo Rounded.webp';
import avatarFajar from '../assets/Testimoni/Fajar Profile Photo Rounded.webp';
import avatarNanaz from '../assets/Testimoni/Nanaz Profile Photo Rounded.webp';


const Tetsimoni = () => {

  const testimonials = [
    {
      nama: 'Fajar Ahmad Kurniadi',
      status: 'Mahasiswa',
      pesan: 'Saya sangat terbantu dengan adanya sistem pendaftaran online ini. Prosesnya cepat dan tidak ribet, cukup isi data dari rumah dan langsung dapat jadwal perawatan. Tidak perlu lagi datang pagi-pagi hanya untuk ambil nomor antrian seperti sebelumnya. Selain itu, informasi mengenai dokter dan jenis perawatan juga sangat jelas, sehingga saya bisa memilih layanan yang sesuai dengan kebutuhan saya. Tampilan websitenya juga sederhana dan mudah dipahami, bahkan bagi orang tua saya yang kurang akrab dengan teknologi.',
      avatar: avatarFajar,
    },
    {
      nama: 'Fakhri Djamariz',
      status: 'Mahasiswa',
      pesan: 'Sering kali saya kesusahan ketika ingin mencari jadwal konsultasi ke dokter khususnya dokter spesialis Gigi dan Mulut, Alhasil saya harus pergi terlebih dahulu ke lokasi untuk mencari jadwal dan sering kali saya menunggu lama antrian untuk itu. Dengan adanya website ini, membantu saya untuk dapat mencari tahu konsultasi dan jadwal yang cocok untuk dapat saya gunakan sebelum saya pergi ke lokasi.',
      avatar: avatarSkroep,
    },
    {
      nama: 'Siti Nazifah',
      status: 'Mahasiswa FKG',
      pesan: 'Dengan aplikasi ini, pasien bisa melakukan pendaftaran perawatan di RSGM dengan mudah dan praktis hanya dengan memegang ponsel di rumah, tanpa harus mengantri dari pagi. Aplikasi ini dirancang untuk memudahkan pengguna, dengan tampilan yang sederhana dan mudah diakses. Pasien bisa melihat daftar dokter dan perawatan yang tersedia dengan jelas, sehingga mereka bisa memilih perawatan yang tepat untuk kebutuhan mereka. Ini membuat proses pendaftaran menjadi lebih efisien dan nyaman.',
      avatar: avatarNanaz,
    },
    {
      nama: 'Faiz Hazim Hawari',
      status: 'UI/UX & Web Designer',
      pesan: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et leo in sapien interdum sagittis. In varius molestie pretium. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam et gravida enim. Fusce accumsan neque mi, ac porttitor turpis congue at. Vestibulum sit amet mi enim. Suspendisse nec molestie magna. Etiam venenatis sem aliquam leo sollicitudin blandit. Suspendisse blandit bibendum auctor.',
      avatar: avatarPaiz,
    },
  ];

  const scrollRef = React.useRef(null);
  const scrollIntervalRef = React.useRef(null);


  const startScroll = (direction) => {
    if (scrollRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        scrollRef.current.scrollBy({
          left: direction === 'left' ? -5 : 5,
          behavior: 'auto', // auto agar tidak berat saat interval
        });
      }, 5); // semakin kecil, semakin halus
    }
  };
  
  const stopScroll = () => {
    clearInterval(scrollIntervalRef.current);
    scrollIntervalRef.current = null;
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -100,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 100,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <div id="testimoni">
          <div className="testimoni-container">
              <div className="testimoni-title">
                <h1>
                  Mengapa harus mendaftar menggunakan <br />
                  RSGM RegisWeb?
                </h1>
              </div>
              <div className="testimoni-carousel">
                <button className="testimoni-btn left" onClick={handleScrollLeft}
                onMouseDown={() => startScroll('left')}
                onMouseUp={stopScroll}
                onMouseLeave={stopScroll}
                onTouchStart={() => startScroll('left')}
                onTouchEnd={stopScroll}
                >
                  <img src={leftSlideButton} />
                </button>

                <div className="testimoni-track-wrapper" style={{ position: 'relative' }}>
                  <div className="fade-left"></div>

                  <div className="testimoni-track" ref={scrollRef}>
                    {testimonials.map((item, index) => (
                      <div className="testimoni-card" key={index}>
                        <div className="testimoni-header">
                          <img src={item.avatar} alt={item.nama} className="testimoni-avatar" />
                          <div>
                            <strong>{item.nama}</strong>
                            <div className="testimoni-status">{item.status}</div>
                          </div>
                        </div>
                        <p className="testimoni-message">{item.pesan}</p>
                      </div>
                    ))}
                  </div>

                  <div className="fade-right"></div>
                </div>

                <button className="testimoni-btn right" onClick={handleScrollRight}
                onMouseDown={() => startScroll('right')}
                onMouseUp={stopScroll}
                onMouseLeave={stopScroll}
                onTouchStart={() => startScroll('right')}
                onTouchEnd={stopScroll}
                >
                  <img src={rightSlideButton} />
                </button>
              </div>
          </div>
      </div>
    </>
  )
}

export default Tetsimoni