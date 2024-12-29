import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Rota para listar motoristas
router.get('/', async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany();
    return res.status(200).json(drivers);
  } catch (error) {
    console.error('Erro ao buscar motoristas:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

export default router;
