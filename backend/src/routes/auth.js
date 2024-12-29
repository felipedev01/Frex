import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Cadastro de Motorista
router.post('/register', async (req, res) => {
  const { name, email, password, transportCompany, licensePlate } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const driver = await prisma.driver.create({
      data: {
        name,
        email,
        password: hashedPassword,
        transportCompany,
        licensePlate,
      },
    });

    return res.status(201).json({ message: 'Motorista cadastrado com sucesso!' });
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao cadastrar motorista' });
  }
});

// Login de Motorista
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const driver = await prisma.driver.findUnique({
      where: { email },
    });

    if (!driver) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, driver.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: driver.id }, 'SECRET_KEY', { expiresIn: '1h' });
    return res.status(200).json({ message: 'Login bem-sucedido!', token });
  } catch (error) {
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

export default router;
