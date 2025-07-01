import React from 'react'
import emailLogo from '../assets/Contact/Contact Email.webp'
import telephoneLogo from '../assets/Contact/Contact Telephone.webp'
import dokterImg from '../assets/Contact/Contact Dokter.webp'

const Contact = () => {
  return (
    <>
    <div id="contact">
        <div className="contact-container">
            <div className="contact-core">
                <div className="contact-left">
                    <h1>Hubungi Kami</h1>
                    <div className="contact-left-address">
                        <p><img className='contact-left-address-logo' src={emailLogo}/><a href="mailto:rsgm@usu.ac.id">rsgm@usu.ac.id</a></p>
                        <p><img className='contact-left-address-logo' src={telephoneLogo}/><a href="https://api.whatsapp.com/send?phone=085791259191">+62 857-9125-9191</a></p>
                    </div>
                    <img className='contact-left-image' src={dokterImg}/>
                </div>
                <div className="contact-right">
                  <form >
                    <input type="text" placeholder='Nama Lengkap'/>
                    <input type="email" name="" id="" placeholder='Alamat Email'/>
                    <textarea name="" id="" rows="6" placeholder='Pesan'></textarea>
                    <div className="contact-right-form-justfit">
                      <button>Kirim</button>
                    </div>
                  </form>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Contact