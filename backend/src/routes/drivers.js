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
      include: {
        shipments: true, // Inclui os fretes associados ao motorista
      },
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

router.post('/finish-shipment', authenticateToken, async (req, res) => {
  try {
    const driverId = req.user.id;
    const { shipmentId } = req.body;

    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId, driverId: driverId }
    });

    if (!shipment) {
      return res.status(404).json({ error: 'Frete não encontrado' });
    }

    if (shipment.status === 'FINALIZADO') {
      return res.status(400).json({ error: 'Frete já finalizado' });
    }

    await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        status: 'FINALIZADO',
        finishedAt: new Date()
      }
    });

    return res.status(200).json({ message: 'Frete finalizado com sucesso' });
  } catch (error) {
    console.error('Erro ao finalizar frete:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }

  
});

router.get('/shipment-history', authenticateToken, async (req, res) => {
  try {
    const driverId = req.user.id;

    const shipmentHistory = await prisma.shipment.findMany({
      where: {
        driverId: driverId,
        status: 'FINALIZADO'
      }
    });

    return res.status(200).json(shipmentHistory);
  } catch (error) {
    console.error('Erro ao obter histórico de fretes:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

router.get('/current-shipment', authenticateToken, async (req, res) => {
  try {
    const driverId = req.user.id;

    const currentShipment = await prisma.shipment.findFirst({
      where: {
        driverId: driverId,
        status: 'PENDENTE'
      }
    });

    if (!currentShipment) {
      return res.status(404).json({ error: 'Nenhuma carga pendente encontrada' });
    }

    return res.status(200).json(currentShipment);
  } catch (error) {
    console.error('Erro ao obter frete atual:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});



export default router;
