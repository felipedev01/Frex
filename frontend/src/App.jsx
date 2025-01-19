import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CadastroFrete from './pages/CadastroFrete';
import DeliveryHistory from './pages/DeliveryHistory';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CadastroFrete />} />
        <Route path="/historico" element={<DeliveryHistory />} />
      </Routes>
    </Router>
  );
}

export default App;