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
import DoctorProfilePage from './pages/doctor/DoctorProfilePage';
import FisaMedicalaPacient from './pages/doctor/FisaMedicalaPacient';
import './App.css';

function App() {
  const onLogout = () => {};
  const user = { email: "doctor@email.com" };
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/patient/profile" element={<PatientView />} />
        <Route path="/patient/history" element={<PatientHistory />} />
        
        {/* Nested doctor routes */}
        <Route path="/doctor" element={<DoctorDashboard onLogout={onLogout} user={user} />}>
          <Route path="add-pacient" element={<AdaugaPacient />} />
          <Route path="pacienti" element={<PacientiDoctor />} />
          <Route path="pacient/:id" element={<PacientDetalii />} />
          <Route path="pacient/:id/edit" element={<EditPacient />} />
          <Route path="profil" element={<DoctorProfilePage />} /> 
          <Route path="/doctor/pacient/:id/fisa" element={<FisaMedicalaPacient />} />
        </Route>

        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;