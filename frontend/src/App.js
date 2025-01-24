import React from 'react';
import Header from './components/header/header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import './App.css';
import Admin from './components/Admin/adminpage';
import Coordinator from './components/Coordinator/coordinator';

function App() {
  return (
    <BrowserRouter >
    <div className="App">
      <Header />
      <Routes>
          <Route path="/" element= {<Home />} />
          <Route path="/employee" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/coordinator" element={<Coordinator />} />

        </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;