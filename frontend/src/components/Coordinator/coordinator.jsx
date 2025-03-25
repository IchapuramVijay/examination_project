import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './coordinator.css';
import collegelogo from '../../assets/collegelogo.jpg';

const Coordinator = () => {
  const [coordinatorId, setCoordinatorId] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (coordinatorId === '123' && password === '123') {
      const userData = {
        id: coordinatorId,
        branch: branch,
        isAuthenticated: true
      };
      localStorage.setItem('coordinatorData', JSON.stringify(userData));
      navigate('/cord');
    } else {
      alert('Invalid credentials. Use ID: 123, Password: 123');
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="logo-section">
          <img src={collegelogo} alt="College Logo" className="college-logo" />
        </div>
        <div className="form-section">
          <div className="form-row">
            <label>Coordinator id :</label>
            <input
              type="text"
              value={coordinatorId}
              onChange={(e) => setCoordinatorId(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label>Password :</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label>Branch :</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
              className="branch-select"
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="CSBS">CSBS</option>
              <option value="CSE(DS)">CSE(DS)</option>
              <option value="CSE(AI&ML)">CSE(AI&ML)</option>
              <option value="CSE(IOT)">CSE(IOT)</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="CIVIL">CIVIL</option>
              <option value="MECH">MECH</option>
              <option value="Chemical">Chemical</option>
              <option value="MBA">MBA</option>
              <option value="MCA">MCA</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Coordinator;