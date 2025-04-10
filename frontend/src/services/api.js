import { API_BASE_URL, API_URLS } from '../config/api';

/**
 * Serviço para realizar requisições à API
 */
class ApiService {
  // Headers padrão para requisições
  getHeaders() {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // GET 
  async get(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao fazer requisição GET:', error);
      throw error;
    }
  }

  // POST
  async post(url, data) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || `Erro na requisição: ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error('Erro ao fazer requisição POST:', error);
      throw error;
    }
  }

  // PUT
  async put(url, data) {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao fazer requisição PUT:', error);
      throw error;
    }
  }

  // DELETE
  async delete(url) {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao fazer requisição DELETE:', error);
      throw error;
    }
  }

  // Serviços específicos
  
  // Auth
  async login(email, password) {
    return this.post(API_URLS.login, { email, password });
  }

  async registerTransportCompany(data) {
    return this.post(API_URLS.registerTransportCompany, data);
  }

  // Drivers
  async getDrivers() {
    return this.get(API_URLS.drivers);
  }

  // Shipments
  async getShipments() {
    return this.get(API_URLS.shipments);
  }
}

export default new ApiService(); 