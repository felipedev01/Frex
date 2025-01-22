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


router.post('/users', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    // Validações básicas
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (!['admin', 'viewer'].includes(userType)) {
      return res.status(400).json({ error: 'Tipo de usuário inválido' });
    }

    // Verifica se o email já está em uso
    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    const existingViewer = await prisma.viewer.findUnique({ where: { email } });

    if (existingAdmin || existingViewer) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário na tabela apropriada
    let user;
    if (userType === 'admin') {
      user = await prisma.admin.create({
        data: {
          name,
          email,
          password: hashedPassword
        }
      });
    } else {
      user = await prisma.viewer.create({
        data: {
          name,
          email,
          password: hashedPassword
        }
      });
    }

    // Remove a senha do retorno
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      message: `Usuário ${userType} criado com sucesso`,
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

router.post('/auth/web-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Primeiro tenta encontrar um admin
    let admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (admin) {
      const validPassword = await bcrypt.compare(password, admin.password);
      if (validPassword) {
        const token = jwt.sign(
          { id: admin.id, type: 'admin' },
          process.env.SECRET_KEY,  // <- Corrigido aqui
          { expiresIn: '24h' }
        );

        return res.json({
          token,
          userType: 'admin',
          name: admin.name
        });
      }
    }

    // Se não encontrou admin ou senha errada, tenta viewer
    let viewer = await prisma.viewer.findUnique({
      where: { email }
    });

    if (viewer) {
      const validPassword = await bcrypt.compare(password, viewer.password);
      if (validPassword) {
        const token = jwt.sign(
          { id: viewer.id, type: 'viewer' },
          process.env.SECRET_KEY,  // <- Corrigido aqui também
          { expiresIn: '24h' }
        );

        return res.json({
          token,
          userType: 'viewer',
          name: viewer.name
        });
      }
    }

    // Se chegou aqui, as credenciais são inválidas
    return res.status(401).json({ error: 'Credenciais inválidas' });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

export default router;

