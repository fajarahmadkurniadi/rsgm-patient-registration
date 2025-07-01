import React from 'react'
import '../styles/loginadmin.css'
import arrowBack from '../assets/Login Admin/Login Admin Arrow.webp'
import logoDesktop from '../assets/Navbar/Logo navbar desktop.webp';
import { useNavigate } from 'react-router-dom'

const LoginAdmin = () => {
    const navigate = useNavigate()

  return (
    <>
    <div id="loginadmin">
        <div className="loginadmin-header">
            <button onClick={() => navigate('/')}><img src={arrowBack}/> Home Page</button>
        </div>
        <div className="loginadmin-container">
            <div className="loginadmin-form-wrapper">
                <form className='loginadmin-form' action="">
                    <img src={logoDesktop}/>
                    <h1>Selamat Datang Admin!</h1>
                    <h2>Memelihara senyum, memelihara kehidupan. Semangat bekerja hari ini dan jangan lupa tersenyum 😁</h2>
                    <div className="loginadmin-username">
                        <p>Email</p>
                        <input type="email" name="" id="" placeholder='Masukkan Email'/>
                    </div>
                    <div className="loginadmin-password">
                        <p>Password</p>
                        <input type="password" name="" id="" placeholder='Masukkan Password'/>
                    </div>
                    <button>Login</button>
                </form>
            </div>
        </div>
    </div>
    </>
  )
}

export default LoginAdmin