import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
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

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const driverId = req.user.id; // O ID do motorista deve vir do token JWT
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      return res.status(404).json({ error: 'Motorista não encontrado' });
    }

    return res.status(200).json(driver);
  } catch (error) {
    console.error('Erro ao obter dados do motorista:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});


export default router;
