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

// Buscar motorista por placa
export const findDriverByLicensePlate = async (licensePlate) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { licensePlate }
    });
    return { success: true, data: driver };
  } catch (error) {
    console.error('Erro ao buscar motorista por placa:', error);
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

// Buscar transportadora por email
export const findTransportCompanyByEmail = async (email) => {
  try {
    const company = await prisma.transportCompany.findUnique({
      where: { email }
    });
    return { success: true, data: company };
  } catch (error) {
    console.error('Erro ao buscar transportadora por email:', error);
    return { success: false, error };
  }
};

// Buscar transportadora por CNPJ
export const findTransportCompanyByCNPJ = async (cnpj) => {
  try {
    const company = await prisma.transportCompany.findUnique({
      where: { cnpj }
    });
    return { success: true, data: company };
  } catch (error) {
    console.error('Erro ao buscar transportadora por CNPJ:', error);
    return { success: false, error };
  }
};

// Criar transportadora
export const createTransportCompany = async (companyData) => {
  try {
    const company = await prisma.transportCompany.create({
      data: companyData
    });
    return { success: true, data: company };
  } catch (error) {
    console.error('Erro ao criar transportadora:', error);
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