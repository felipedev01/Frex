import { uploadToB2 } from '../config/uploadConfig.js';
import * as driverRepository from '../repositories/driverRepository.js';

// Listar todos os motoristas
export const getAllDrivers = async () => {
  const result = await driverRepository.findAllDrivers();
  
  if (!result.success) {
    return { success: false, error: 'Erro interno do servidor.' };
  }
  
  return { success: true, data: result.data };
};

// Buscar detalhes do motorista pelo ID
export const getDriverById = async (driverId) => {
  const result = await driverRepository.findDriverById(driverId);
  
  if (!result.success) {
    return { success: false, error: 'Erro no servidor' };
  }
  
  if (!result.data) {
    return { success: false, error: 'Motorista não encontrado' };
  }
  
  return { success: true, data: result.data };
};

// Finalizar frete
export const completeShipment = async (driverId, shipmentId) => {
  // Buscar o frete para verificar se existe e se já foi finalizado
  const shipmentResult = await driverRepository.findShipmentById(shipmentId, driverId);
  
  if (!shipmentResult.success) {
    return { success: false, error: 'Erro no servidor' };
  }
  
  if (!shipmentResult.data) {
    return { success: false, error: 'Frete não encontrado' };
  }
  
  const shipment = shipmentResult.data;
  
  if (shipment.status === 'FINALIZADO') {
    return { success: false, error: 'Frete já finalizado' };
  }
  
  // Atualizar o status do frete
  const updateResult = await driverRepository.updateShipmentStatus(shipmentId, {
    status: 'FINALIZADO',
    finishedAt: new Date()
  });
  
  if (!updateResult.success) {
    return { success: false, error: 'Erro no servidor' };
  }
  
  return { success: true, message: 'Frete finalizado com sucesso' };
};

// Obter frete atual de um motorista
export const getDriverCurrentShipment = async (driverId) => {
  const result = await driverRepository.findDriverPendingShipment(driverId);
  
  if (!result.success) {
    return { success: false, error: 'Erro no servidor' };
  }
  
  if (!result.data) {
    return { success: false, error: 'Nenhuma carga pendente encontrada' };
  }
  
  return { success: true, data: result.data };
};

// Obter histórico de fretes de um motorista
export const getDriverShipmentHistory = async (driverId) => {
  const result = await driverRepository.findDriverShipmentHistory(driverId);
  
  if (!result.success) {
    return { success: false, error: 'Erro no servidor' };
  }
  
  return { success: true, data: result.data };
};

// Finalizar NF com imagem
export const finalizeNfWithProof = async (nfId, fileData) => {
  if (!fileData) {
    return { success: false, error: 'Nenhuma imagem foi enviada.' };
  }

  try {
    // Upload da imagem para o B2
    const proofImageUrl = await uploadToB2(fileData);
    
    // Buscar a NF para verificar se existe
    const nfResult = await driverRepository.findNfById(nfId);
    
    if (!nfResult.success) {
      return { success: false, error: 'Erro no servidor' };
    }
    
    if (!nfResult.data) {
      return { success: false, error: 'Nota Fiscal não encontrada' };
    }
    
    const nf = nfResult.data;
    
    // Atualizar a NF com a imagem do comprovante
    const updateNfResult = await driverRepository.updateNf(nfId, {
      status: 'ENTREGUE',
      proofImage: proofImageUrl,
      completedAt: new Date()
    });
    
    if (!updateNfResult.success) {
      return { success: false, error: 'Erro ao atualizar nota fiscal' };
    }
    
    // Verificar se todas as notas fiscais do frete estão entregues
    const nfDetailsResult = await driverRepository.findNfsByShipmentId(nf.shipmentId);
    
    if (!nfDetailsResult.success) {
      return { success: false, error: 'Erro ao verificar notas fiscais' };
    }
    
    const nfDetails = nfDetailsResult.data;
    const allDelivered = nfDetails.every((detail) => 
      detail.status === 'ENTREGUE' || detail.status === 'DIVERGENTE'
    );
    
    // Se todas as NFs foram processadas, finalizar o frete
    if (allDelivered) {
      const updateShipmentResult = await driverRepository.updateShipmentStatus(nf.shipmentId, {
        status: 'FINALIZADO',
        finishedAt: new Date()
      });
      
      if (!updateShipmentResult.success) {
        return { success: false, error: 'Erro ao finalizar frete' };
      }
    }
    
    return { success: true, message: 'Nota Fiscal finalizada com sucesso!' };
  } catch (error) {
    console.error('Erro ao finalizar NF:', error.message || error);
    return { success: false, error: 'Erro no servidor' };
  }
};

// Reportar problema em uma NF
export const reportNfIssue = async (nfId, issueData) => {
  const { issueType, issueDetails } = issueData;

  if (!issueType || !issueDetails) {
    return { success: false, error: 'Tipo do problema e detalhes são obrigatórios' };
  }

  // Buscar a NF para verificar se existe e seu status
  const nfResult = await driverRepository.findNfById(nfId);
  
  if (!nfResult.success) {
    return { success: false, error: 'Erro no servidor' };
  }
  
  if (!nfResult.data) {
    return { success: false, error: 'Nota Fiscal não encontrada' };
  }
  
  const nf = nfResult.data;
  
  if (nf.status !== 'PENDENTE') {
    return { success: false, error: 'Esta nota fiscal já foi processada' };
  }

  // Atualizar a NF com os detalhes do problema
  const updateNfResult = await driverRepository.updateNf(nfId, {
    status: 'DIVERGENTE',
    issueType,
    issueDetails,
    completedAt: new Date()
  });
  
  if (!updateNfResult.success) {
    return { success: false, error: 'Erro ao reportar problema' };
  }

  // Verificar se todas as NFs do frete foram processadas
  const nfDetailsResult = await driverRepository.findNfsByShipmentId(nf.shipmentId);
  
  if (!nfDetailsResult.success) {
    return { success: false, error: 'Erro ao verificar notas fiscais' };
  }
  
  const nfDetails = nfDetailsResult.data;
  const allProcessed = nfDetails.every(detail => 
    detail.status === 'ENTREGUE' || detail.status === 'DIVERGENTE'
  );

  // Se todas foram processadas, finalizar o frete
  if (allProcessed) {
    const updateShipmentResult = await driverRepository.updateShipmentStatus(nf.shipmentId, {
      status: 'FINALIZADO',
      finishedAt: new Date()
    });
    
    if (!updateShipmentResult.success) {
      return { success: false, error: 'Erro ao finalizar frete' };
    }
  }

  return { success: true, message: 'Problema reportado com sucesso' };
};

// Obter histórico de faturas
export const getInvoiceHistory = async () => {
  const result = await driverRepository.findAllShipments();
  
  if (!result.success) {
    return { success: false, error: 'Erro no servidor' };
  }
  
  return { success: true, data: result.data };
}; 