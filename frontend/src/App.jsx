import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CadastroFrete from './pages/CadastroFrete';
import DeliveryHistory from './pages/DeliveryHistory';
import LoginWeb from './pages/LoginWeb';
import './App.css';

// Componente para rotas protegidas
const ProtectedRoute = ({ children, allowedTypes }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedTypes.includes(userType)) {
    return <Navigate to="/historico" replace />;
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
              <Navigate to={userType === 'admin' ? '/' : '/historico'} replace />
            ) : (
              <LoginWeb />
            )
          } 
        />

        {/* Rota inicial - redireciona baseado na autenticação */}
        <Route 
          path="/" 
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <ProtectedRoute allowedTypes={['admin']}>
                <CadastroFrete />
              </ProtectedRoute>
            )
          } 
        />

        {/* Rota protegida - admin e viewer */}
        <Route 
          path="/historico" 
          element={
            <ProtectedRoute allowedTypes={['admin', 'viewer']}>
              <DeliveryHistory />
            </ProtectedRoute>
          } 
        />

        {/* Redireciona rotas não encontradas */}
        <Route 
          path="*" 
          element={
            <Navigate 
              to={
                !isAuthenticated
                  ? '/login'
                  : userType === 'admin'
                    ? '/'
                    : '/historico'
              } 
              replace 
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;