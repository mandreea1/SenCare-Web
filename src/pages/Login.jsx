import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import logo from '../assets/logo.jpg';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('${process.env.REACT_APP_BACKEND_URL}/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });

    const data = await response.json();

    console.log('Răspuns primit:', data);
    if (response.ok) {
      // Redirecționează în funcție de tipul utilizatorului
            if (data.userType && data.userType.toLowerCase() === 'doctor') {
        localStorage.setItem('email', formData.email);
              navigate('/doctor');
      } else if (data.userType && data.userType.toLowerCase() === 'pacient') {
        navigate('/patient');
      } 
       else if (data.userType && data.userType.toLowerCase() === 'admin') {
    navigate('/admin');}
      else {
        alert('Tip de utilizator necunoscut!');
      }
    } else {
      alert(data.error || 'Email sau parolă incorectă!');
    }
  } catch (error) {
    alert('Eroare la autentificare!');
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <img
            src={logo}
            alt="SenCare"
            style={{
              width: 200,
              margin: '0 auto 32px',
              display: 'block',
              borderRadius: '50%'
            }}
          />
        </div>

        {/* Pictograma de doctor */}
        <div style={{ margin: '24px 0', textAlign: 'center' }}>
          <i className="fas fa-user-md" style={{ fontSize: 64, color: '#3182CE', marginBottom: 8 }}></i>
        </div>

        <h2>Autentificare</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Parolă"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Autentificare
          </button>
        </form>

        <div className="forgot-password">
          <a href="/forgot-password">Ai uitat parola?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;