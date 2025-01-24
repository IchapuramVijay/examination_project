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
      <form className="login-form" onSubmit={handleSubmit}>
      <img src={collegelogo} alt="College Logo" className="college-logo" />
      <div className="form-content">
        <div className="form-group">
          <label>Employee id :</label>
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </div>
    </form>
  );
};

export default Home;