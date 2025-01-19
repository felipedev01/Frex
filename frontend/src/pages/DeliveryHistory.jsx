import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, Truck, Calendar, AlertTriangle, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DeliveryHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3002/drivers/invoice-history', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const formattedInvoices = data.flatMap(shipment => 
        shipment.nfDetails.map(nf => ({
          id: nf.id,
          nfNumber: nf.nfNumber,
          status: nf.status,
          issueType: nf.issueType,
          issueDetails: nf.issueDetails,
          createdAt: nf.createdAt,
          completedAt: nf.completedAt,
          proofImage: nf.proofImage,
          shipment: {
            name: shipment.name,
            origin: shipment.origin,
            destination: shipment.destination,
            driver: {
              name: shipment.driver.name,
              transportCompany: shipment.driver.transportCompany,
              licensePlate: shipment.driver.licensePlate
            }
          }
        }))
      );

      setInvoices(formattedInvoices);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      setError('Não foi possível carregar o histórico de notas fiscais.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ENTREGUE':
        return 'bg-green-100 text-green-800';
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'DIVERGENTE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ENTREGUE':
        return 'Entregue';
      case 'PENDENTE':
        return 'Pendente';
      case 'DIVERGENTE':
        return 'Divergente';
      default:
        return status;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.nfNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.shipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.shipment.driver.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50 p-4 flex items-center justify-center">
        <p className="text-purple-600">Carregando histórico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-purple-50 p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 p-4 md:p-6">
      <h1 className="text-2xl font-bold text-purple-600 mb-6">Histórico de Notas Fiscais</h1>
      
      {/* Barra de Pesquisa e Filtros */}
      <div className="bg-white rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número da NF, nome da carga ou motorista"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-purple-600" />
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os status</option>
              <option value="PENDENTE">Pendente</option>
              <option value="ENTREGUE">Entregue</option>
              <option value="DIVERGENTE">Divergente</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">Todas as datas</option>
              <option value="today">Hoje</option>
              <option value="week">Última semana</option>
              <option value="month">Último mês</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Notas Fiscais */}
      <div className="grid gap-4">
        {filteredInvoices.length === 0 ? (
          <Alert>
            <AlertDescription>
              Nenhuma nota fiscal encontrada com os filtros atuais.
            </AlertDescription>
          </Alert>
        ) : (
          filteredInvoices.map((invoice) => (
            <Card 
              key={invoice.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedInvoice(selectedInvoice?.id === invoice.id ? null : invoice)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">NF-{invoice.nfNumber}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {getStatusText(invoice.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{invoice.shipment.name}</div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 md:items-center text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      {invoice.shipment.driver.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {selectedInvoice?.id === invoice.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {/* Detalhes do Frete */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Detalhes do Frete</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>De: {invoice.shipment.origin}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>Para: {invoice.shipment.destination}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Truck className="h-4 w-4" />
                            <span>{invoice.shipment.driver.transportCompany}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Placa: {invoice.shipment.driver.licensePlate}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status e Informações Adicionais */}
                    {invoice.status === 'DIVERGENTE' && (
                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-red-800">{invoice.issueType}</h4>
                            <p className="text-sm text-red-600 mt-1">{invoice.issueDetails}</p>
                            {invoice.completedAt && (
                              <p className="text-sm text-red-600 mt-2">
                                Reportado em: {new Date(invoice.completedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {invoice.status === 'ENTREGUE' && (
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-green-800">Entrega Concluída</h4>
                            <p className="text-sm text-green-600 mt-1">
                              Finalizado em: {new Date(invoice.completedAt).toLocaleString()}
                            </p>
                          </div>
                          {invoice.proofImage && (
                            <button 
                              onClick={() => window.open(invoice.proofImage, '_blank')}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              Ver Comprovante
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;