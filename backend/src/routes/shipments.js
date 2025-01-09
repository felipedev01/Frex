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

  jwt.verify(token,process.env.SECRET_KEY, (err, decoded) => {
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


/* router.post('/', async (req, res) => {
  try {
    const { name, driverId, description, origin, destination } = req.body;

    if (!name || !driverId || !description || !origin || !destination) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const shipment = await prisma.shipment.create({
      data: {
        name,
        driverId: parseInt(driverId),
        description,
        origin,
        destination,
      },
    });

    return res.status(201).json({ message: 'Frete criado com sucesso!', shipment });
  } catch (error) {
    console.error('Erro ao criar frete:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
}); */


router.post('/', async (req, res) => {
  try {
    const { name, driverId, description, destination, nfNumbers } = req.body;

    if (!name || !driverId || !description || !destination || !nfNumbers) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    // Criar o frete (Shipment)
    const shipment = await prisma.shipment.create({
      data: {
        name,
        driverId: parseInt(driverId),
        description,
        destination,
        status: 'PENDENTE',
      },
    });

    // Criar as notas fiscais associadas
    const nfDetails = nfNumbers.map(nfNumber => ({
      shipmentId: shipment.id,
      nfNumber,
    }));

    await prisma.nFDetail.createMany({
      data: nfDetails,
    });

    return res.status(201).json({
      message: 'Frete e notas fiscais cadastrados com sucesso!',
      shipment,
    });
  } catch (error) {
    console.error('Erro ao criar frete e notas fiscais:', error.message || error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});





export default router;

