import React from 'react';
import './header.css';
import rvrjcamslogo from '../../assets/rvrjcamslogo.jpg';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  // This function handles navigation and forces a reload when needed
  const handleNavigation = (path) => {
    // Check if we're on a dashboard page
    const currentPath = window.location.pathname;
    const isDashboard = currentPath.includes('dashboard');
    
    if (isDashboard) {
      // If coming from a dashboard, do a full page reload
      window.location.href = path;
    } else {
      // Otherwise use React Router navigation
      navigate(path);
    }
  };

  return (
    <div className="header-container">
      <div className="header-banner">
        <img src={rvrjcamslogo} alt="RVRJCAMS" />
      </div>
      <div className='nav-section'>
        <div className="nav-bar">
          <Link to="/" onClick={(e) => { e.preventDefault(); handleNavigation('/'); }}>Home</Link>
          <span className="divider">|</span>
          <Link to="/admin" onClick={(e) => { e.preventDefault(); handleNavigation('/admin'); }}>Admin</Link>
          <span className="divider">|</span>
          <Link to="/employee" onClick={(e) => { e.preventDefault(); handleNavigation('/employee'); }}>Employee</Link>
          <span className="divider">|</span>
          <Link to="/coordinator" onClick={(e) => { e.preventDefault(); handleNavigation('/coordinator'); }}>Coordinator</Link>
          <span className="divider">|</span>
          <Link to="/examsectionlogin" onClick={(e) => { e.preventDefault(); handleNavigation('/examsectionlogin'); }}>Exam Section</Link>
          <span className="divider">|</span>
          <Link to="/Contact" onClick={(e) => { e.preventDefault(); handleNavigation('/Contact'); }}>Contact</Link>
        </div>
      </div>
    </div>
  );
};

export default Header;