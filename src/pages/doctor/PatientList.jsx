import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/PatientList.css';

const PatientList = () => {
  // Mock data - in a real app, this would come from an API
  const patients = [
    { id: 1, name: 'John Doe', age: 45, condition: 'Hypertension' },
    { id: 2, name: 'Jane Smith', age: 32, condition: 'Diabetes' },
    { id: 3, name: 'Robert Johnson', age: 58, condition: 'Arthritis' }
  ];

  return (
    <div className="patient-list">
      <div className="header">
        <h1>Patient List</h1>
        <Link to="/doctor/patient/add" className="btn btn-primary">
          Add New Patient
        </Link>
      </div>
      
      <div className="patients-grid">
        {patients.map(patient => (
          <div key={patient.id} className="patient-card">
            <h3>{patient.name}</h3>
            <div className="patient-info">
              <p><strong>Age:</strong> {patient.age}</p>
              <p><strong>Condition:</strong> {patient.condition}</p>
            </div>
            <div className="patient-actions">
              <Link to={`/doctor/patient/${patient.id}`} className="btn btn-secondary">
                View Details
              </Link>
              <Link to={`/doctor/recommendations/${patient.id}`} className="btn btn-primary">
                Recommendations
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientList; 