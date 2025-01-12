import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Cadastro de Motorista

router.get('/validate-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ valid: false, message: 'Token não fornecido.' });
  }

  try {
    // Verifica se o token é válido
    jwt.verify(token, process.env.SECRET_KEY);
    return res.status(200).json({ valid: true });
  } catch (error) {
    return res.status(401).json({ valid: false, message: 'Token inválido ou expirado.' });
  }
});


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
// Login de Motorista
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca o motorista pelo email
    const driver = await prisma.driver.findUnique({
      where: { email },
    });

    if (!driver) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    // Valida a senha
    const isPasswordValid = await bcrypt.compare(password, driver.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Gera o token
    const token = jwt.sign({ id: driver.id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    // Retorna token e dados básicos do usuário
    return res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
      user: {
        id: driver.id,
        name: driver.name,
        email: driver.email,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

export default router;

