import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import AsyncSelect from 'react-select/async';
import logoFrex from '../assets/logo_frex.svg'; 
import axios from 'axios';

// Componente de Alerta
const Alert = ({ children, type }) => {
  return (
    <div className={`p-4 rounded-lg mb-6 ${
      type === 'error' 
        ? 'bg-red-50 text-red-700 border border-red-200'
        : 'bg-green-50 text-green-700 border border-green-200'
    }`}>
      {children}
    </div>
  );
};

const CadastroFrete = () => {
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    currentNF: '',
    nfList: [],
    driverId: '',
    description: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('https://frex.onrender.com/drivers');
        setDrivers(response.data);
      } catch (error) {
        console.error('Erro ao buscar motoristas:', error);
        setMessage({ type: 'error', text: 'Erro ao carregar motoristas.' });
      }
    };

    fetchDrivers();
  }, []);

  const loadCities = async (inputValue) => {
    try {
      const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
      const filteredCities = response.data
        .filter(city => city.nome.toLowerCase().includes(inputValue.toLowerCase()))
        .map(city => ({
          value: `${city.nome} - ${city.microrregiao.mesorregiao.UF.sigla}`,
          label: `${city.nome} - ${city.microrregiao.mesorregiao.UF.sigla}`
        }));
      return filteredCities;
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      return [];
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNF = () => {
    if (!formData.currentNF.trim()) {
      setMessage({ type: 'error', text: 'Digite um número de nota fiscal válido' });
      return;
    }

    if (formData.nfList.includes(formData.currentNF.trim())) {
      setMessage({ type: 'error', text: 'Esta nota fiscal já foi adicionada' });
      return;
    }

    setFormData(prev => ({
      ...prev,
      nfList: [...prev.nfList, formData.currentNF.trim()],
      currentNF: ''
    }));
    setMessage({ type: '', text: '' });
  };

  const handleRemoveNF = (nf) => {
    setFormData(prev => ({
      ...prev,
      nfList: prev.nfList.filter(item => item !== nf)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3002/shipments', {
        name: formData.name,
        destination: formData.destination,
        nfNumbers: formData.nfList,
        driverId: formData.driverId,
        description: formData.description,
      });

      setMessage({ type: 'success', text: response.data.message });
      setFormData({
        name: '',
        destination: '',
        currentNF: '',
        nfList: [],
        driverId: '',
        description: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao cadastrar frete. Verifique os dados.' });
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[800px] bg-white rounded-xl shadow-lg p-8 border border-purple-100 flex flex-col justify-between" style={{ height: '90vh' }}>
        <div>
          <div className="text-center mb-10">
            <img 
              src={logoFrex}
              alt="FreX Logo" 
              className="h-12 mx-auto mb-2" 
            />
            <h2 className="text-2xl font-bold text-purple-600">
              Cadastro de Frete
            </h2>
          </div>

          {message.text && (
            <Alert type={message.type}>
              {message.text}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Carga *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-lg border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Cidade de Destino *
                </label>
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadCities}
                  defaultOptions
                  onChange={(selectedOption) =>
                    setFormData(prev => ({ ...prev, destination: selectedOption.value }))
                  }
                  placeholder="Digite para buscar uma cidade"
                  classNamePrefix="react-select"
                  className="w-full text-lg border-purple-200"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Adicionar Nota Fiscal e Motorista *
                </label>
                <div className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    name="currentNF"
                    value={formData.currentNF}
                    onChange={handleChange}
                    placeholder="Digite o número da NF"
                    className="flex-1 px-4 py-3 text-lg border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNF}
                    className="px-8 py-3 bg-purple-600 text-white text-lg font-medium rounded-lg hover:bg-purple-700 transition-colors min-w-[140px]"
                  >
                    Adicionar
                  </button>
                  <select
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 text-lg border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="">Selecione um motorista</option>
                    {drivers.map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {`${driver.name} - ${driver.transportCompany} (${driver.licensePlate})`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 h-24 overflow-y-auto">
                  <p className="text-lg text-gray-600 mb-2">
                    Notas fiscais adicionadas: {formData.nfList.length}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.nfList.map((nf) => (
                      <div 
                        key={nf}
                        className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full border border-purple-200"
                      >
                        <span className="text-lg text-purple-700">{nf}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveNF(nf)}
                          className="text-purple-400 hover:text-red-500 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 text-lg border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`py-4 px-8 text-xl font-medium rounded-lg text-white transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Frete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CadastroFrete;
