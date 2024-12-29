import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Rota para cadastrar um novo frete

import jwt from 'jsonwebtoken';

const authenticateDriver = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, 'SECRET_KEY', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.driverId = decoded.id;
    next();
  });
};

// Rota protegida para listar fretes do motorista autenticado
router.get('/my-shipments', authenticateDriver, async (req, res) => {
  try {
    const shipments = await prisma.shipment.findMany({
      where: { driverId: req.driverId },
    });
    return res.status(200).json(shipments);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar fretes' });
  }
});



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

