import * as driverService from '../services/driverService.js';

// Listar todos os motoristas
export const getAllDrivers = async (req, res) => {
  const result = await driverService.getAllDrivers();
  
  if (result.success) {
    return res.status(200).json(result.data);
  } else {
    return res.status(500).json({ error: result.error });
  }
};

// Buscar detalhes do motorista autenticado
export const getDriverDetails = async (req, res) => {
  const driverId = req.user.id;
  const result = await driverService.getDriverById(driverId);
  
  if (result.success) {
    return res.status(200).json(result.data);
  } else {
    return res.status(result.error === 'Motorista não encontrado' ? 404 : 500).json({ error: result.error });
  }
};

// Finalizar frete
export const finishShipment = async (req, res) => {
  const driverId = req.user.id;
  const { shipmentId } = req.body;
  
  const result = await driverService.completeShipment(driverId, shipmentId);
  
  if (result.success) {
    return res.status(200).json({ message: result.message });
  } else {
    const status = result.error === 'Frete não encontrado' ? 404 : 
                  result.error === 'Frete já finalizado' ? 400 : 500;
    return res.status(status).json({ error: result.error });
  }
};

// Obter frete atual
export const getCurrentShipment = async (req, res) => {
  const driverId = req.user.id;
  
  const result = await driverService.getDriverCurrentShipment(driverId);
  
  if (result.success) {
    return res.status(200).json(result.data);
  } else {
    return res.status(result.error === 'Nenhuma carga pendente encontrada' ? 404 : 500).json({ error: result.error });
  }
};

// Obter histórico de fretes
export const getShipmentHistory = async (req, res) => {
  const driverId = req.user.id;
  
  const result = await driverService.getDriverShipmentHistory(driverId);
  
  if (result.success) {
    return res.status(200).json(result.data);
  } else {
    return res.status(500).json({ error: result.error });
  }
};

// Finalizar NF com imagem
export const finalizeNf = async (req, res) => {
  const { nfId } = req.params;
  
  const result = await driverService.finalizeNfWithProof(nfId, req.file);
  
  if (result.success) {
    return res.status(200).json({ message: result.message });
  } else {
    const status = result.error === 'Nota Fiscal não encontrada' ? 404 : 
                  result.error === 'Nenhuma imagem foi enviada.' ? 400 : 500;
    return res.status(status).json({ error: result.error });
  }
};

// Reportar problema em uma NF
export const reportNfIssue = async (req, res) => {
  const { nfId } = req.params;
  const result = await driverService.reportNfIssue(nfId, req.body);
  
  if (result.success) {
    return res.status(200).json({ message: result.message });
  } else {
    const status = result.error === 'Nota Fiscal não encontrada' ? 404 : 
                  result.error === 'Esta nota fiscal já foi processada' || 
                  result.error === 'Tipo do problema e detalhes são obrigatórios' ? 400 : 500;
    return res.status(status).json({ error: result.error });
  }
};

// Teste de upload
export const testUpload = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
    }
    console.log('Arquivo recebido:', req.file);
    return res.status(200).json({ message: 'Upload bem-sucedido!', file: req.file });
  } catch (error) {
    console.error('Erro no teste de upload:', error.message || error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Obter histórico de faturas
export const getInvoiceHistory = async (req, res) => {
  const result = await driverService.getInvoiceHistory();
  
  if (result.success) {
    return res.status(200).json(result.data);
  } else {
    return res.status(500).json({ error: result.error });
  }
}; 