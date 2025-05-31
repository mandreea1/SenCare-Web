import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/SignUp.css';
import logo from '../assets/logo.jpg';

const SignUp = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aici poți adăuga logica de autentificare
    navigate('/doctor');
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
          <button type="submit" className="signup-button">
            Log In
          </button>
        </form>
        <div className="signup-link" style={{ marginTop: 24 }}>
          Nu ai cont? <Link to="/creare-cont">Creează unul aici</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 