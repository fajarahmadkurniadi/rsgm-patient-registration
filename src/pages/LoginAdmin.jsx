import React, { useState } from 'react';
import '../styles/loginadmin.css';
import arrowBack from '../assets/Login Admin/Login Admin Arrow.webp';
import logoDesktop from '../assets/Navbar/Logo navbar desktop.webp';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/loginadmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        navigate('/admin');
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <div id="loginadmin">
        <div className="loginadmin-header">
          <button onClick={() => navigate('/')}>
            <img src={arrowBack} /> Home Page
          </button>
        </div>
        <div className="loginadmin-container">
          <div className="loginadmin-form-wrapper">
            <form className="loginadmin-form" onSubmit={handleLogin}>
              <img src={logoDesktop} />
              <h1>Selamat Datang Admin!</h1>
              <h2>
                Memelihara senyum, memelihara kehidupan. Semangat bekerja hari
                ini dan jangan lupa tersenyum 😁
              </h2>
              <div className="loginadmin-username">
                <p>Email</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan Email"
                  required
                />
              </div>
              <div className="loginadmin-password">
                <p>Password</p>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Password"
                  required
                />
              </div>
              {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginAdmin;