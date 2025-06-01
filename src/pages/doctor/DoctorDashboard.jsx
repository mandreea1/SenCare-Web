import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaUserMd, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

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

  return (
    <div>
      {/* Bara de navigare sus */}
      <nav className="doctor-navbar">
        <div className="logo">
          <FaUserMd />
          SenCare
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
          <div className="bg-white rounded shadow-sm p-4 mb-4" style={{ maxWidth: 420 }}>
            <div className="fs-2 fw-bold mb-3">Datele medicului</div>
            {loading && <div>Se încarcă datele...</div>}
            {error && <div className="text-danger">{error}</div>}
            {!loading && doctor && (
              <>
                <div className="fs-4 fw-semibold mb-2">
                  {doctor.Nume} {doctor.Prenume}
                </div>
                <div className="text-primary fw-medium mb-1">
                  Specializare: {doctor.Specializare}
                </div>
                <div className="text-muted mb-1">Telefon: {doctor.Telefon}</div>
                <div className="text-secondary mb-1">Email: {doctor.Email}</div>
              </>
            )}
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}