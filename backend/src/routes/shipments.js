import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Rota para cadastrar um novo frete
router.post('/', async (req, res) => {
  const { name, nfNumbers, driverId, description } = req.body;

  try {
    // Validação básica
    if (!name || !nfNumbers || !driverId) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    // Criação do frete no banco de dados
    const shipment = await prisma.shipment.create({
      data: {
        name,
        nfNumbers,
        driverId: parseInt(driverId),
        description,
      },
    });

    return res.status(201).json({ message: 'Frete cadastrado com sucesso!', shipment });
  } catch (error) {
    console.error('Erro ao cadastrar frete:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

export default router;

