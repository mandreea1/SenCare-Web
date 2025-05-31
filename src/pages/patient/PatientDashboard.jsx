import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/PatientDashboard.css';

const PatientDashboard = () => {
  return (
    <div className="patient-dashboard">
      <h1>Patient Dashboard</h1>
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>My Profile</h2>
          <p>View and update your personal information</p>
          <Link to="/patient/profile" className="btn btn-primary">
            View Profile
          </Link>
        </div>
        <div className="dashboard-card">
          <h2>Medical History</h2>
          <p>View your medical records and history</p>
          <Link to="/patient/history" className="btn btn-primary">
            View History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard; 