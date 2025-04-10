import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoFrex from '../assets/logo_frex.svg';

const TransportadoraDashboard = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const name = localStorage.getItem('userName');

    if (!token || userType !== 'transportCompany') {
      navigate('/login');
      return;
    }

    setCompanyName(name || 'Transportadora');
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-purple-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Navbar */}
      <header className="bg-white shadow">
        <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <img src={logoFrex} alt="FreX Logo" className="h-8 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">Painel da Transportadora</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Olá, {companyName}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-md"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bem-vindo ao seu painel de controle</h2>
          <p className="text-gray-600">
            Este é o painel da sua transportadora no sistema Frex. Aqui você pode gerenciar seus fretes, motoristas e acompanhar suas entregas.
          </p>
        </div>

        {/* Cards / Widgets Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fretes Ativos</p>
                <h3 className="text-xl font-semibold">0</h3>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Entregas Concluídas</p>
                <h3 className="text-xl font-semibold">0</h3>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Motoristas</p>
                <h3 className="text-xl font-semibold">0</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Gerenciar Fretes</h3>
            <p className="text-gray-600 mb-4">Cadastre novos fretes, acompanhe o status das entregas e veja o histórico completo.</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Acessar Fretes
            </button>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Gerenciar Motoristas</h3>
            <p className="text-gray-600 mb-4">Cadastre novos motoristas, atualize informações e gerencie a equipe da sua transportadora.</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Acessar Motoristas
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransportadoraDashboard; 