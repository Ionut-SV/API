
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import '../styles/Navbarstyle.css';

function Navbar() {
  const { isAuthenticated, logout } = useAuth(); // Destructure isAuthenticated and logout
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(); // Call logout from AuthContext
    navigate('/login');
    // Optionally, window.location.reload() if you need a full page reload
  };

  const navToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="nav">
      <a href="/Home" className="nav__brand">
        CodeNetHub
      </a>
      <div className="nav__toggler" onClick={navToggle} aria-label="Toggle navigation">
        <div className={`line ${menuOpen ? 'open' : ''}`}></div>
        <div className={`line ${menuOpen ? 'open' : ''}`}></div>
        <div className={`line ${menuOpen ? 'open' : ''}`}></div>
      </div>
      <ul className={`nav__menu ${menuOpen ? "open" : ""}`}>
        <li className="nav__item">
          <Link to="/" className="nav__link" onClick={navToggle}>
            Acasa
          </Link>
        </li>
        <li className="nav__item">
          <Link to="/about" className="nav__link" onClick={navToggle}>
            Despre
          </Link>
        </li>
        <li className="nav__item">
          <Link to="/contact" className="nav__link" onClick={navToggle}>
            Contact
          </Link>
        </li>
        {isAuthenticated ? (
          <>
            <li className="nav__item">
              <Link to="/" onClick={handleLogout} className="nav__link">
                Logout
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/upload" className="nav__link" onClick={navToggle}>
                Incarca
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="nav__item">
              <Link to="/login" className="nav__link" onClick={navToggle}>
                Login
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/register" className="nav__link" onClick={navToggle}>
                Înregistrare
              </Link>
            </li>
          </>
        )}
        <li className="nav__item">
          <Link to="/projects" className="nav__link" onClick={navToggle}>
            Proiecte
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
