import React from 'react';
import Header from './components/header/header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import './App.css';
import Admin from './components/Admin/adminpage';
import Coordinator from './components/coordinator/coordinator';
import EmployeeDashboard from './components/Dashboards/Employee/Employeedashboard';
import AdminDashboard from './components/Dashboards/Admindb/Admindashboard';
import Examsection from './components/Examsection/Examsection';
import Examsectiondashboard from './components/Examsection/Examsectiondashboard';
import Cord from './components/cord/cord';
import AvailableEmployees from './components/cord/AvailableEmployees';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employee" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<EmployeeDashboard />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/examsectionlogin" element={<Examsection />} />
          <Route path="/examsectiondashboard" element={<Examsectiondashboard />} />
          <Route path="/coordinator" element={<Coordinator />} />
          <Route path="/cord" element={<Cord />} />
          <Route path="/available-employees" element={<AvailableEmployees />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;