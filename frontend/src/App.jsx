// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CadastroFrete from './pages/CadastroFrete';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Bem-vindo ao Sistema de Gestão de Entregas</h1>} />
        <Route path="/cadastro-frete" element={<CadastroFrete />} />
      </Routes>
    </Router>
  );
}

export default App;
