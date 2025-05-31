import React from 'react';
import '../../styles/PatientView.css';

const PatientView = () => {
  return (
    <div className="patient-view">
      <h1>My Profile</h1>
      <div className="profile-card">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-group">
            <label>Name:</label>
            <span>John Doe</span>
          </div>
          <div className="info-group">
            <label>Email:</label>
            <span>john.doe@example.com</span>
          </div>
          <div className="info-group">
            <label>Phone:</label>
            <span>+1 234 567 890</span>
          </div>
        </div>
        
        <div className="profile-section">
          <h2>Medical Information</h2>
          <div className="info-group">
            <label>Blood Type:</label>
            <span>O+</span>
          </div>
          <div className="info-group">
            <label>Allergies:</label>
            <span>None</span>
          </div>
          <div className="info-group">
            <label>Conditions:</label>
            <span>None</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientView; 