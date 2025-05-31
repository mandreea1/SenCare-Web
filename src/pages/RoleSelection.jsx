import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';
import logo from '../assets/logo.jpg';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="role-selection-container">
      <img src={logo} alt="SenCare" style={{ width: 200, margin: '0 auto 32px', display: 'block', borderRadius: '50%' }} />
      <h1>Bine ai venit la SenCare!</h1>
      <div className="role-buttons">
        <button onClick={() => navigate('/medic')} className="role-btn">
          <i className="fas fa-user-md" style={{ fontSize: 32, marginRight: 8, verticalAlign: 'middle' }}></i>
          <span className="role-text">Doctor</span>
        </button>
        <button onClick={() => navigate('/pacient')} className="role-btn">
          <i className="fas fa-user" style={{ fontSize: 32, marginRight: 8, verticalAlign: 'middle' }}></i>
          <span className="role-text">Pacient</span>
        </button>
      </div>
    </div>
  );
};

export default RoleSelection; 