import React from 'react';
import  './header.css';
import rvrjcamslogo from '../../assets/rvrjcamslogo.jpg';
import { Link } from 'react-router-dom';

const Header = () => (
    <div className="header-container">
      <div className="header-banner">
        <img src={rvrjcamslogo} alt="RVRJCAMS" />
      </div>
      <div className='nav-section'>
      <div className="nav-bar">
        <Link to ="/">Home</Link>
        <span className="divider">|</span>
        <Link to ="/admin">Admin </Link>
        <span className="divider">|</span>
        <Link to ="/employee">Employee </Link>
        <span className="divider">|</span>
        <Link to="/coordinator">Coordinator</Link>
        <span className="divider">|</span>
        <Link to ="/examsectionlogin">Exam Section</Link>
        <span className="divider">|</span>
        <Link to ="/Contact">Contact</Link>
      </div>
      </div>
    </div>
  );
  
  export default Header;

