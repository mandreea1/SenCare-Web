import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaUserMd, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const navStyles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(90deg, #6a6fd5 0%, #3840a7 100%)',
    color: '#fff',
    padding: '0 32px',
    height: 70,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(60,60,120,0.07)',
  },
  navMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    marginLeft: 32, // pentru a împinge meniul puțin spre dreapta față de logo
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 18,
    padding: '8px 18px',
    borderRadius: 8,
    transition: 'background 0.18s, color 0.18s',
  },
  navLinkActive: {
    background: '#fff',
    color: '#3840a7',
  },
  logo: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginRight: 16, // logo mai spre stânga
  },
  rightIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: 26,
    cursor: 'pointer',
    padding: 0,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.25)',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    background: '#fff',
    borderRadius: 12,
    padding: 32,
    minWidth: 320,
    boxShadow: '0 8px 32px rgba(60,60,120,0.18)',
    color: '#222',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 16,
    background: 'none',
    border: 'none',
    fontSize: 22,
    cursor: 'pointer',
    color: '#3840a7',
  },
};

const mainStyles = {
  main: {
    padding: '48px 40px',
    minHeight: '100vh',
    background: '#f8f8fa',
  },
};

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
      <nav style={navStyles.navbar}>
        {/* Stânga: Logo + Meniu */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={navStyles.logo}>
            <FaUserMd />
            SenCare
          </div>
          <div style={navStyles.navMenu}>
            <Link
              to="/doctor/add-pacient"
              style={{
                ...navStyles.navLink,
                ...(location.pathname === '/doctor/add-pacient' ? navStyles.navLinkActive : {}),
              }}
            >
              Adaugă pacient
            </Link>
            <Link
              to="/doctor/pacienti"
              style={{
                ...navStyles.navLink,
                ...(location.pathname === '/doctor/pacienti' ? navStyles.navLinkActive : {}),
              }}
            >
              Vezi pacienții mei
            </Link>
          </div>
        </div>
        {/* Dreapta: Iconițe */}
        <div style={navStyles.rightIcons}>
          <button
            style={navStyles.iconBtn}
            title="Profil"
            onClick={() => navigate('/doctor/profil')}
          >
            <FaUserCircle />
          </button>
          <button style={navStyles.iconBtn} title="Logout" onClick={onLogout}>
            <FaSignOutAlt />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={mainStyles.main}>
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
                {/* UserID și MedicID eliminate */}
              </>
            )}
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}