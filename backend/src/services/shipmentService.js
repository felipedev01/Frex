import jwt from 'jsonwebtoken';
import * as shipmentRepository from '../repositories/shipmentRepository.js';

// Verificar autenticação do token do motorista
export const verifyDriverToken = (token) => {
  if (!token) {
    return { success: false, error: 'Token não fornecido' };
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return { success: true, driverId: decoded.id };
  } catch (error) {
    return { success: false, error: 'Token inválido' };
  }
};

// Listar fretes de um motorista específico
export const getShipmentsByDriverId = async (driverId) => {
  const result = await shipmentRepository.findShipmentsByDriverId(driverId);
  
  if (!result.success) {
    return { success: false, error: 'Erro ao buscar fretes' };
  }
  
  return { success: true, data: result.data };
};

// Criar novo frete com notas fiscais
export const createNewShipment = async (shipmentData) => {
  const { name, driverId, description, origin, destination, nfNumbers } = shipmentData;

  if (!name || !driverId || !origin || !destination || !nfNumbers) {
    return { success: false, error: 'Preencha todos os campos obrigatórios.' };
  }

  // Verificar se o motorista já possui um frete pendente
  const pendingResult = await shipmentRepository.findPendingShipmentByDriverId(driverId);
  
  if (!pendingResult.success) {
    return { success: false, error: 'Erro no servidor' };
  }
  
  if (pendingResult.data) {
    return { success: false, error: 'O motorista já possui um frete pendente.' };
  }

  // Criar o frete (Shipment)
  const shipmentResult = await shipmentRepository.createShipment({
    name,
    driverId: parseInt(driverId),
    description,
    origin,
    destination,
    status: 'PENDENTE',
  });
  
  if (!shipmentResult.success) {
    return { success: false, error: 'Erro ao criar frete' };
  }
  
  const shipment = shipmentResult.data;

  // Criar notas fiscais associadas ao frete
  const nfDetails = nfNumbers.map(nfNumber => ({
    shipmentId: shipment.id,
    nfNumber,
  }));

  const nfDetailsResult = await shipmentRepository.createManyNfDetails(nfDetails);
  
  if (!nfDetailsResult.success) {
    return { success: false, error: 'Erro ao criar notas fiscais' };
  }

  return {
    success: true,
    message: 'Frete e notas fiscais cadastrados com sucesso!',
    shipment
  };
}; 