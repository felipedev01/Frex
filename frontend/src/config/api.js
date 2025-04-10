// Configuração da API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

// URLs específicas
export const API_URLS = {
  // Auth
  login: `${API_BASE_URL}/auth/auth/web-login`,
  registerTransportCompany: `${API_BASE_URL}/auth/transport-company/register`,
  
  // Recursos
  drivers: `${API_BASE_URL}/drivers`,
  shipments: `${API_BASE_URL}/shipments`,
}; 