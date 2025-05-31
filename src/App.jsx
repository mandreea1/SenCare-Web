import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientView from './pages/patient/PatientView';
import PatientHistory from './pages/patient/PatientHistory';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdaugaPacient from './pages/doctor/AdaugaPacient';
import PacientiDoctor from './pages/doctor/PacientiDoctor';
import PacientDetalii from './pages/doctor/PacientDetalii';
import EditPacient from './pages/doctor/EditPacient';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/patient/profile" element={<PatientView />} />
        <Route path="/patient/history" element={<PatientHistory />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/add-pacient" element={<AdaugaPacient />} />
        <Route path="/doctor/pacienti" element={<PacientiDoctor />} />
<Route path="/doctor/pacient/:id" element={<PacientDetalii />} />
<Route path="/doctor/pacient/:id/edit" element={<EditPacient />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;