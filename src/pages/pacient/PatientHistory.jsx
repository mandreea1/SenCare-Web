import React from 'react';
import '../../styles/PatientHistory.css';

const PatientHistory = () => {
  return (
    <div className="patient-history">
      <h1>Medical History</h1>
      <div className="history-timeline">
        <div className="history-item">
          <div className="history-date">2024-03-15</div>
          <div className="history-content">
            <h3>Regular Checkup</h3>
            <p>Blood pressure: 120/80 mmHg</p>
            <p>Heart rate: 72 bpm</p>
            <p>Notes: Patient in good health, no concerns reported.</p>
          </div>
        </div>
        
        <div className="history-item">
          <div className="history-date">2024-02-10</div>
          <div className="history-content">
            <h3>Flu Vaccination</h3>
            <p>Received annual flu vaccine</p>
            <p>No adverse reactions reported</p>
          </div>
        </div>
        
        <div className="history-item">
          <div className="history-date">2024-01-05</div>
          <div className="history-content">
            <h3>Dental Checkup</h3>
            <p>Regular dental examination</p>
            <p>No cavities found</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHistory; 