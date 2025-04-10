import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CadastroFrete from './pages/CadastroFrete';
import DeliveryHistory from './pages/DeliveryHistory';
import LoginWeb from './pages/LoginWeb';
import RegisterTransportCompany from './pages/RegisterTransportCompany';
import TransportadoraDashboard from './pages/TransportadoraDashboard';
import './App.css';

// Componente para rotas protegidas
const ProtectedRoute = ({ children, allowedTypes }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedTypes.includes(userType)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  // Verificar autenticação
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  const userType = localStorage.getItem('userType');

  return (
    <Router>
      <Routes>
        {/* Rota pública - Login */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              userType === 'transportCompany' ? (
                <Navigate to="/transportadora" replace />
              ) : (
                <Navigate to={userType === 'admin' ? '/admin' : '/historico'} replace />
              )
            ) : (
              <LoginWeb />
            )
          } 
        />

        {/* Rota pública - Cadastro de Transportadora */}
        <Route
          path="/cadastro-transportadora"
          element={
            isAuthenticated ? (
              <Navigate to={userType === 'transportCompany' ? '/transportadora' : '/admin'} replace />
            ) : (
              <RegisterTransportCompany />
            )
          }
        />

        {/* Rota inicial - redireciona para login */}
        <Route 
          path="/" 
          element={<Navigate to="/login" replace />} 
        />

        {/* Rota protegida - admin */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <CadastroFrete />
            </ProtectedRoute>
          } 
        />

        {/* Rota protegida - transportadora */}
        <Route 
          path="/transportadora"
          element={
            <ProtectedRoute allowedTypes={['transportCompany']}>
              <TransportadoraDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Rota protegida - admin e viewer */}
        <Route 
          path="/historico" 
          element={
            <ProtectedRoute allowedTypes={['admin', 'viewer', 'transportCompany']}>
              <DeliveryHistory />
            </ProtectedRoute>
          } 
        />

        {/* Redireciona rotas não encontradas */}
        <Route 
          path="*" 
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;