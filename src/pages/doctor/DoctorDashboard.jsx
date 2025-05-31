import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaUserMd, FaSignOutAlt } from 'react-icons/fa';



const sidebarStyles = {
  sidebar: {
    width: 220,
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #6a6fd5 0%, #3840a7 100%)',
    color: '#fff',
    padding: '32px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'fixed',
    left: 0,
    top: 0,
    boxShadow: '2px 0 12px rgba(60,60,120,0.08)',
    zIndex: 10,
  },
  logo: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 40,
    letterSpacing: 1,
  },
  nav: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 18, // mai mult spațiu între butoane
    marginTop: 40,
  },
  navItem: {
    width: '90%',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    fontSize: 18,
    fontWeight: 600,
    color: '#3840a7',
    background: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'background 0.18s, color 0.18s',
    textDecoration: 'none',
    boxShadow: '0 2px 8px rgba(60,60,120,0.07)',
  },
  navItemActive: {
    background: '#3840a7',
    color: '#fff',
  },
  spacer: {
    flex: 1,
  },
  logout: {
    marginTop: 32,
    padding: '12px 32px',
    background: 'rgba(255,255,255,0.10)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  }
};

const mainStyles = {
  main: {
    marginLeft: 220,
    padding: '48px 40px',
    minHeight: '100vh',
    background: '#f8f8fa',
    display: 'flex',
    flexDirection: 'row',
    gap: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    marginBottom: 32,
    color: '#222',
  },
  info: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(60,60,120,0.07)',
    padding: 32,
    maxWidth: 420,
    marginBottom: 32,
    minWidth: 320,
    height: 'fit-content'
  },
  outlet: {
    flex: 1,
    minWidth: 0,
  }
};

export default function DoctorDashboard({ onLogout, user }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        // Folosește endpoint-ul corect!
        const res = await fetch(`/api/doctor/profile?userId=${userId}`);
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

  const location = useLocation();
  const isDashboard = location.pathname === "/doctor" || location.pathname === "/doctor/";

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <aside style={sidebarStyles.sidebar}>
        <div style={sidebarStyles.logo}>
          <FaUserMd style={{ marginRight: 10 }} />
          SenCare
        </div>
        <nav style={sidebarStyles.nav}>
          <Link
            to="/doctor"
            style={{
              ...sidebarStyles.navItem,
              ...(isDashboard ? sidebarStyles.navItemActive : {})
            }}
          >
            Dashboard
          </Link>
          <Link
            to="/doctor/add-pacient"
            style={{
              ...sidebarStyles.navItem,
              ...(location.pathname === "/doctor/add-pacient" ? sidebarStyles.navItemActive : {})
            }}
          >
            Adaugă pacient
          </Link>
          <Link
            to="/doctor/pacienti"
            style={{
              ...sidebarStyles.navItem,
              ...(location.pathname === "/doctor/pacienti" ? sidebarStyles.navItemActive : {})
            }}
          >
            Vezi pacienții mei
          </Link>
        </nav>
        <div style={sidebarStyles.spacer} />
        <button style={sidebarStyles.logout} onClick={onLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>
      {/* Main Content */}
      <main style={mainStyles.main}>
        {isDashboard && (
          <div style={mainStyles.info}>
            <div style={mainStyles.title}>Datele medicului</div>
            {loading && <div>Se încarcă datele...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {!loading && doctor && (
              <>
                <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
                  {doctor.Nume} {doctor.Prenume}
                </div>
                <div style={{ color: '#6a6fd5', fontWeight: 500, marginBottom: 4 }}>
                  Specializare: {doctor.Specializare}
                </div>
                <div style={{ color: '#888', marginBottom: 4 }}>
                  Telefon: {doctor.Telefon}
                </div>
                <div style={{ color: '#444', fontSize: 16 }}>
                  Email: {doctor.Email}
                </div>
                <div style={{ color: '#444', fontSize: 16, marginTop: 8 }}>
                  UserID: {doctor.UserID}
                </div>
                <div style={{ color: '#444', fontSize: 16, marginTop: 8 }}>
                  MedicID: {doctor.MedicID}
                </div>
              </>
            )}
          </div>
        )}
        <div style={mainStyles.outlet}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}