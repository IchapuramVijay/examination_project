import React, { useState } from 'react';
import Header from '../header/header';
import './Home.css';
import rvrjcamslogo from '../../assets/rvrjcamslogo.jpg';
import collegelogo from '../../assets/collegelogo.jpg';

const Home = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="home">
      <Header />
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <div className="logo-section">
            <img src={collegelogo} alt="College Logo" />
          </div>
          <div className="input-group">
            <label>Employee id :</label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password :</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Home;