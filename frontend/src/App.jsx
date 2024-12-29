// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CadastroFrete from './pages/CadastroFrete';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CadastroFrete />} />
      </Routes>
    </Router>
  );
}

export default App;
