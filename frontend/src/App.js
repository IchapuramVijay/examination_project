import React from 'react';
import Header from './components/header/header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Admin from './components/Admin/Admin';
import './App.css';

function App() {
  return (
    <BrowserRouter >
    <div className="App">
      <Header />
      <Routes>
          <Route path="/" element= {<Home />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/Employee" element={<Home />} />
        </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;