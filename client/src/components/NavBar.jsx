import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../components/Navbarstyle.css';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current path
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navToggle = () => {
    setMenuOpen(!menuOpen);
  };

  // Determine if the sidebar should be hidden based on the current path
  const hideSidebar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      <div className={`navbar ${hideSidebar ? 'navbar--no-sidebar' : ''}`}>
        <a href="/home" className="navbar__brand">
          CodeNetHub
        </a>
        <div className="navbar__right">
          <ul className="navbar__menu">
            {isAuthenticated ? (
              <li className="navbar__item">
                <Link to="/" onClick={handleLogout} className="navbar__link">
                  Logout
                </Link>
              </li>
            ) : (
              <>
                <li className="navbar__item">
                  <Link to="/login" className="navbar__link">
                    Login
                  </Link>
                </li>
                <li className="navbar__item">
                  <Link to="/register" className="navbar__link">
                    Înregistrare
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className={`sidebar ${hideSidebar ? 'sidebar--hidden' : ''}`}>
        <ul className={`sidebar__menu ${menuOpen ? 'open' : ''}`}>
          <li className="sidebar__item">
            <Link to="/" className="sidebar__link" onClick={navToggle}>
              Acasa
            </Link>
          </li>
          <li className="sidebar__item">
            <Link to="/about" className="sidebar__link" onClick={navToggle}>
              Despre
            </Link>
          </li>
          <li className="sidebar__item">
            <Link to="/contact" className="sidebar__link" onClick={navToggle}>
              Contact
            </Link>
          </li>
          <li className="sidebar__item">
            <Link to="/projects" className="sidebar__link" onClick={navToggle}>
              Proiecte
            </Link>
          </li>
          {isAuthenticated && (
            <li className="sidebar__item">
              <Link to="/upload" className="sidebar__link" onClick={navToggle}>
                Incarca
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

export default Navbar;
