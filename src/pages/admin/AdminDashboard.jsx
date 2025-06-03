import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaUserMd, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import logo from '../../assets/logo1.png';

function AdminDashboard({ onLogout }) {
  const location = useLocation();

  // Ascunde bannerul dacă suntem pe /admin/add-doctor
  const hideBanner = location.pathname === '/admin/add-doctor';

  return (
    <div>
      <nav className="doctor-navbar">
        <div className="logo">
          <FaUserCircle />
          <Link to="/admin">
            SenCare Admin
          </Link>
        </div>
        <div className="right-icons">
          <Link to="/admin/add-doctor" className="nav-link">
            <FaUserMd style={{ marginRight: 8 }} /> Adaugă medic
          </Link>
          <button className="icon-btn" title="Logout" onClick={onLogout}>
            <FaSignOutAlt />
          </button>
        </div>
      </nav>

      <main className="main-content">
        {!hideBanner && (
          <div className="welcome-banner">
            <div className="welcome-content">
              <div className="welcome-header">
                <h1>Bun venit în zona de administrare SenCare!
                <img
                  src={logo}
                  alt="SenCare"
                  className="logo-image"
                />
                </h1>
              </div>
              <p>Sistem pentru monitorizarea și îngrijirea pacienților</p>
            </div>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminDashboard;