import React from 'react';
import  './header.css';
import rvrjcamslogo from '../../assets/rvrjcamslogo.jpg';

const Header = () => (
    <div className="header-container">
      <div className="header-banner">
        <img src={rvrjcamslogo} alt="RVRJCAMS" />
      </div>
      <div className='nav-section'>
      <div className="nav-bar">
        <a href="#Home">Home</a>
        <span className="divider">|</span>
        <a href="#admin">Admin</a>
        <span className="divider">|</span>
        <a href="#">Employee Login</a>
        <span className="divider">|</span>
        <a href="#coordinator">coordinator</a>
        <span className="divider">|</span>
        <a href="#contact">contant</a>
      </div>
      </div>
    </div>
  );
  
  export default Header;

