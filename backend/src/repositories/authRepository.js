import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Buscar motorista por email
export const findDriverByEmail = async (email) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { email }
    });
    return { success: true, data: driver };
  } catch (error) {
    console.error('Erro ao buscar motorista por email:', error);
    return { success: false, error };
  }
};

// Criar motorista
export const createDriver = async (driverData) => {
  try {
    const driver = await prisma.driver.create({
      data: driverData
    });
    return { success: true, data: driver };
  } catch (error) {
    console.error('Erro ao criar motorista:', error);
    return { success: false, error };
  }
};

// Buscar admin por email
export const findAdminByEmail = async (email) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email }
    });
    return { success: true, data: admin };
  } catch (error) {
    console.error('Erro ao buscar admin por email:', error);
    return { success: false, error };
  }
};

// Buscar viewer por email
export const findViewerByEmail = async (email) => {
  try {
    const viewer = await prisma.viewer.findUnique({
      where: { email }
    });
    return { success: true, data: viewer };
  } catch (error) {
    console.error('Erro ao buscar viewer por email:', error);
    return { success: false, error };
  }
};

// Criar admin
export const createAdmin = async (adminData) => {
  try {
    const admin = await prisma.admin.create({
      data: adminData
    });
    return { success: true, data: admin };
  } catch (error) {
    console.error('Erro ao criar admin:', error);
    return { success: false, error };
  }
};

// Criar viewer
export const createViewer = async (viewerData) => {
  try {
    const viewer = await prisma.viewer.create({
      data: viewerData
    });
    return { success: true, data: viewer };
  } catch (error) {
    console.error('Erro ao criar viewer:', error);
    return { success: false, error };
  }
}; 