import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/logo1.png';

export default function PacientDashboard({ onLogout, user }) {
  const [pacient, setPacient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/pacient' || location.pathname === '/pacient/';

  useEffect(() => {
    async function fetchPacientData() {
      setLoading(true);
      setError('');
      try {
        const userId = user?.userId || localStorage.getItem('userId');
        if (!userId) {
          setPacient(null);
          setLoading(false);
          setError('Nu există userId.');
          return;
        }
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        const res = await fetch(`${BACKEND_URL}/api/pacient/profil?userId=${userId}`);
        if (!res.ok) throw new Error('Eroare la profil pacient');
        const data = await res.json();
        if (!data || !data.Nume) {
          setPacient(null);
          setError('Nu s-au găsit date pentru acest pacient.');
        } else {
          setPacient(data);
        }
      } catch (err) {
        setPacient(null);
        setError('Eroare la conectarea cu serverul.');
      } finally {
        setLoading(false);
      }
    }
    fetchPacientData();
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
          <FaUserCircle />
          <Link to="/pacient">
            SenCare
          </Link>
        </div>
        <div className="right-icons">
          <button className="icon-btn" title="Profil" onClick={() => navigate('/pacient/profil')}>
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
              <div className="welcome-header">
                <h1>Bun venit la SenCare!</h1>
                <img
                  src={logo}
                  alt="SenCare"
                  className="logo-image"
                />
              </div>
              {!loading && pacient && (
                <h2>{pacient.Nume} {pacient.Prenume}</h2>
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