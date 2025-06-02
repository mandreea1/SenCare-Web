import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaUserMd, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import logo from '../../assets/logo1.png';

export default function DoctorDashboard({ onLogout, user }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/doctor' || location.pathname === '/doctor/';

  useEffect(() => {
    async function fetchDoctorData() {
      setLoading(true);
      setError('');
      try {
        const userId = user?.userId || localStorage.getItem('userId');
        if (!userId) {
          setDoctor(null);
          setLoading(false);
          setError('Nu există userId.');
          return;
        }
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        const res = await fetch(`${BACKEND_URL}/api/doctor/profile?userId=${userId}`);
        if (!res.ok) throw new Error('Eroare la profil doctor');
        const data = await res.json();
        if (!data || !data.Nume) {
          setDoctor(null);
          setError('Nu s-au găsit date pentru acest doctor.');
        } else {
          setDoctor(data);
        }
      } catch (err) {
        setDoctor(null);
        setError('Eroare la conectarea cu serverul.');
      } finally {
        setLoading(false);
      }
    }
    fetchDoctorData();
  }, [user]);

  const renderErrorMessage = () => {
    if (error) {
      return <div className="error-message">{error}</div>;
    }
    return null;
  };

  return (
    <div>
      {/* Bara de navigare sus */}
      <nav className="doctor-navbar">
        <div className="logo">
          <FaUserMd />
            <Link to="/doctor">
                SenCare
              </Link>
            </div>
        <div className="nav-menu">
          <Link
            to="/doctor/add-pacient"
            className={location.pathname === '/doctor/add-pacient' ? 'nav-link active' : 'nav-link'}
          >
            Adaugă pacient
          </Link>
          <Link
            to="/doctor/pacienti"
            className={location.pathname === '/doctor/pacienti' ? 'nav-link active' : 'nav-link'}
          >
            Vezi pacienții mei
          </Link>
        </div>
        <div className="right-icons">
          <button className="icon-btn" title="Profil" onClick={() => navigate('/doctor/profil')}>
            <FaUserCircle />
          </button>
          <button className="icon-btn" title="Logout" onClick={onLogout}>
            <FaSignOutAlt />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {isDashboard && (
  <div className="welcome-banner">
    <div className="welcome-content">
      {renderErrorMessage()}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <h1 style={{ margin: 0 }}>Bun venit la SenCare!</h1>
        <img
          src={logo}
          alt="SenCare"
          className="logo-image"
        />
      </div>
      {!loading && doctor && (
        <h2>Dr. {doctor.Nume} {doctor.Prenume}</h2>
      )}
      <p>Sistem pentru monitorizarea și îngrijirea pacienților</p>
    </div>
  </div>
)}
        <Outlet />
      </main>
    </div>
  );
}