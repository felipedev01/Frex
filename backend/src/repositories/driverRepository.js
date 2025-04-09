import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Buscar todos os motoristas
export const findAllDrivers = async () => {
  try {
    const drivers = await prisma.driver.findMany();
    return { success: true, data: drivers };
  } catch (error) {
    console.error('Erro ao buscar todos os motoristas:', error);
    return { success: false, error };
  }
};

// Buscar motorista por ID com seus fretes
export const findDriverById = async (driverId) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: { shipments: true },
    });
    return { success: true, data: driver };
  } catch (error) {
    console.error('Erro ao buscar motorista por ID:', error);
    return { success: false, error };
  }
};

// Buscar frete pendente de um motorista
export const findDriverPendingShipment = async (driverId) => {
  try {
    const shipment = await prisma.shipment.findFirst({
      where: {
        driverId: driverId,
        status: 'PENDENTE'
      },
      include: {
        nfDetails: true,
      },
    });
    return { success: true, data: shipment };
  } catch (error) {
    console.error('Erro ao buscar frete pendente:', error);
    return { success: false, error };
  }
};

// Buscar histórico de fretes de um motorista
export const findDriverShipmentHistory = async (driverId) => {
  try {
    const shipments = await prisma.shipment.findMany({
      where: {
        driverId: driverId,
        status: 'FINALIZADO'
      }
    });
    return { success: true, data: shipments };
  } catch (error) {
    console.error('Erro ao buscar histórico de fretes:', error);
    return { success: false, error };
  }
};

// Buscar nota fiscal por ID
export const findNfById = async (nfId) => {
  try {
    const nf = await prisma.nFDetail.findUnique({
      where: { id: parseInt(nfId) },
    });
    return { success: true, data: nf };
  } catch (error) {
    console.error('Erro ao buscar nota fiscal:', error);
    return { success: false, error };
  }
};

// Atualizar nota fiscal
export const updateNf = async (nfId, nfData) => {
  try {
    const updatedNf = await prisma.nFDetail.update({
      where: { id: parseInt(nfId) },
      data: nfData,
    });
    return { success: true, data: updatedNf };
  } catch (error) {
    console.error('Erro ao atualizar nota fiscal:', error);
    return { success: false, error };
  }
};

// Buscar todas as notas fiscais de um frete
export const findNfsByShipmentId = async (shipmentId) => {
  try {
    const nfDetails = await prisma.nFDetail.findMany({
      where: { shipmentId },
    });
    return { success: true, data: nfDetails };
  } catch (error) {
    console.error('Erro ao buscar notas fiscais de um frete:', error);
    return { success: false, error };
  }
};

// Buscar frete por ID
export const findShipmentById = async (shipmentId, driverId = null) => {
  try {
    const where = { id: shipmentId };
    if (driverId) {
      where.driverId = driverId;
    }
    
    const shipment = await prisma.shipment.findUnique({
      where
    });
    return { success: true, data: shipment };
  } catch (error) {
    console.error('Erro ao buscar frete por ID:', error);
    return { success: false, error };
  }
};

// Atualizar status de um frete
export const updateShipmentStatus = async (shipmentId, statusData) => {
  try {
    const updatedShipment = await prisma.shipment.update({
      where: { id: shipmentId },
      data: statusData,
    });
    return { success: true, data: updatedShipment };
  } catch (error) {
    console.error('Erro ao atualizar status do frete:', error);
    return { success: false, error };
  }
};

// Buscar histórico de todas as faturas
export const findAllShipments = async () => {
  try {
    const shipments = await prisma.shipment.findMany({
      include: {
        nfDetails: true,
        driver: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { success: true, data: shipments };
  } catch (error) {
    console.error('Erro ao buscar histórico de faturas:', error);
    return { success: false, error };
  }
}; 