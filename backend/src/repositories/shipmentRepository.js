import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Buscar fretes por ID do motorista
export const findShipmentsByDriverId = async (driverId) => {
  try {
    const shipments = await prisma.shipment.findMany({
      where: { driverId },
    });
    return { success: true, data: shipments };
  } catch (error) {
    console.error('Erro ao buscar fretes do motorista:', error);
    return { success: false, error };
  }
};

// Buscar frete pendente por ID do motorista
export const findPendingShipmentByDriverId = async (driverId) => {
  try {
    const shipment = await prisma.shipment.findFirst({
      where: {
        driverId: parseInt(driverId),
        status: 'PENDENTE',
      },
    });
    return { success: true, data: shipment };
  } catch (error) {
    console.error('Erro ao buscar frete pendente do motorista:', error);
    return { success: false, error };
  }
};

// Criar novo frete
export const createShipment = async (shipmentData) => {
  try {
    const shipment = await prisma.shipment.create({
      data: shipmentData,
    });
    return { success: true, data: shipment };
  } catch (error) {
    console.error('Erro ao criar frete:', error);
    return { success: false, error };
  }
};

// Criar várias notas fiscais
export const createManyNfDetails = async (nfDetails) => {
  try {
    await prisma.nFDetail.createMany({
      data: nfDetails,
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao criar notas fiscais:', error);
    return { success: false, error };
  }
};

// Buscar frete por ID
export const findShipmentById = async (shipmentId, driverId = null) => {
  try {
    const whereClause = { id: shipmentId };
    if (driverId) {
      whereClause.driverId = driverId;
    }
    
    const shipment = await prisma.shipment.findUnique({
      where: whereClause,
    });
    return { success: true, data: shipment };
  } catch (error) {
    console.error('Erro ao buscar frete por ID:', error);
    return { success: false, error };
  }
};

// Atualizar frete
export const updateShipment = async (shipmentId, updateData) => {
  try {
    const updatedShipment = await prisma.shipment.update({
      where: { id: shipmentId },
      data: updateData,
    });
    return { success: true, data: updatedShipment };
  } catch (error) {
    console.error('Erro ao atualizar frete:', error);
    return { success: false, error };
  }
}; 