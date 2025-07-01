import React, { useState, useEffect } from 'react';
import logoDesktop from '../assets/Navbar/Logo navbar desktop.webp';
import hamburgerIcon from '../assets/Navbar/Hamburger.webp';
import closeIcon from '../assets/Navbar/Close X Button.webp';
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const navList = document.getElementById('nav-list');
    if (isMenuOpen) {
      navList.classList.add('active');
    } else {
      navList.classList.remove('active');
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navigate = useNavigate()

  return (
    <nav className='navbar-for-homepage'>
      <img className='desktop-logo' src={logoDesktop} alt="Logo" />
      <img
        id='hamburger-icon'
        className='hamburger'
        src={isMenuOpen ? closeIcon : hamburgerIcon}
        alt="Menu"
        onClick={toggleMenu}
      />
      <ul id="nav-list">
        <li onClick={() => navigate('/pendaftaranpasien')}><a className='nav-ul-li-mc' onClick={closeMenu}>Daftar</a></li>
        <li><a className='nav-ul-li-npc' href="https://rsgm.usu.ac.id/id" onClick={closeMenu}>Profil</a></li>
        <li><a className='nav-ul-li-npc' href="#jadwal" onClick={closeMenu}>Jadwal</a></li>
        <li><a className='nav-ul-li-npc' href="#location" onClick={closeMenu}>Lokasi</a></li>
        <li><a className='nav-ul-li-npc' href="#contact" onClick={closeMenu}>Kontak</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
