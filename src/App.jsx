import React from 'react';
import {Route, Routes, useNavigate } from 'react-router-dom';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdaugaPacient from './pages/doctor/AdaugaPacient';
import PacientiDoctor from './pages/doctor/PacientiDoctor';
import PacientDetalii from './pages/doctor/PacientDetalii';
import EditPacient from './pages/doctor/EditPacient';
import DoctorProfilePage from './pages/doctor/DoctorProfilePage';
import FisaMedicalaPacient from './pages/doctor/FisaMedicalaPacient';
import GraficeEvolutie from './pages/doctor/GraficeEvolutie';
import { AuthProvider, useAuth } from './context/AuthContext';
import PacientDashboard from './pages/pacient/PacientDashboard';
import PacientProfilePage from './pages/pacient/PacientProfilePage';
import PacientFisaMedicala from './pages/pacient/PacientFisaMedicala';
import './App.css';

// Creăm un component wrapper pentru a putea utiliza hook-uri
function AppRoutes() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Nested doctor routes */}
        <Route path="/doctor" element={<DoctorDashboard onLogout={handleLogout} user={user} />}>
          <Route path="add-pacient" element={<AdaugaPacient />} />
          <Route path="pacienti" element={<PacientiDoctor />} />
          <Route path="pacient/:id" element={<PacientDetalii />} />
          <Route path="pacient/:id/edit" element={<EditPacient />} />
          <Route path="profil" element={<DoctorProfilePage />} /> 
          <Route path="/doctor/pacient/:id/fisa" element={<FisaMedicalaPacient />} />
          <Route path="/doctor/pacient/:id/grafice" element={<GraficeEvolutie />} />
        </Route>

          {/* Nested pacient routes */}
          <Route path="/pacient" element={<PacientDashboard onLogout={handleLogout} user={user} />}>
            <Route path="profil" element={<PacientProfilePage user={user} />} />
            <Route path="medical-records-pdf" element={<PacientFisaMedicala />} />
          </Route>
        {/* Rute pentru admin */}
        <Route path="/admin" element={<AdminDashboard onLogout={handleLogout} />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;