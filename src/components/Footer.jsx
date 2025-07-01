import React from 'react'
import shieldSword from '../assets/Footer/Shield Logo Footer.webp'
import instagramFooterLogo from '../assets/Footer/Instagram Logo Footer.webp'
import emailFooterLogo from '../assets/Footer/Email Logo Footer.webp'
import whatsappFooterLogo from '../assets/Footer/Whatsapp Logo Footer.webp'
import youtubeFooterLogo from '../assets/Footer/Youtube Logo Footer.webp'
import tiktokFooterLogo from '../assets/Footer/Tiktok Logo Footer.webp'
import facebookFooterLogo from '../assets/Footer/Facebook Logo Footer.webp'
import usuFooterLogo from '../assets/Footer/USU Logo Footer.webp'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate = useNavigate()

  return (
    <>
    <div id="footer">
        <div className="footer-container">
            <div className="footer-left-row">
                <img src={shieldSword} className='xyzbca' onClick={() => navigate('/loginadmin')}/>
                <p>Jalan Alumni No.2, Medan, Sumatera Utara, Indonesia. <br /> 20155</p>
                <div className="footer-left-row-social">
                    <a href="https://www.instagram.com/rsgm.usu/"><img src={instagramFooterLogo} /></a>
                    <a href="mailto:rsgm@usu.ac.id"><img src={emailFooterLogo} /></a>
                    <a href="https://api.whatsapp.com/send?phone=085791259191"><img src={whatsappFooterLogo} /></a>
                    <a href="https://www.youtube.com/@rsgmusu"><img src={youtubeFooterLogo} /></a>
                    <a href="https://www.tiktok.com/@rsgm.usu"><img src={tiktokFooterLogo} /></a>
                    <a href="https://www.facebook.com/rsgmusu"><img src={facebookFooterLogo} /></a>
                </div>
            </div>
            <div className="footer-right-row">
                <img src={usuFooterLogo} />
                <h1>Hak Cipta © 2025 <br /> Universitas Sumatera Utara</h1>
            </div>
        </div>
    </div>
    </>
  )
}

export default Footer