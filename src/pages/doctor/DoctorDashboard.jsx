import React from 'react';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  return (
    <div className="doctor-dashboard">
      <h1>Doctor Dashboard</h1>
      <Link to="/doctor/add-pacient" className="btn btn-primary">
        Adaugă pacient
      </Link>
      <br /><br />
      <Link to="/doctor/pacienti" className="btn btn-secondary">
        Vezi pacienții mei
      </Link>
    </div>
  );
};

export default DoctorDashboard;