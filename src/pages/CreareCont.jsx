import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';
import logo from '../assets/logo.jpg';

const CreareCont = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Aici poți adăuga logica de creare cont
    navigate('/medic');
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="logo">
          <img src={logo} alt="SenCare" style={{ width: 200, margin: '0 auto 32px', display: 'block', borderRadius: '50%' }} />
        </div>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <i className="fas fa-user-md" style={{ fontSize: 64, color: '#3182CE', marginBottom: 8 }}></i>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
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
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="signup-button">
            Creează cont
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreareCont; 