import express from 'express';
import { 
  validateToken, 
  registerDriver, 
  loginDriver, 
  createUser, 
  webLogin 
} from '../controllers/authController.js';

const router = express.Router();

// Validação de token
router.get('/validate-token', validateToken);

// Cadastro de Motorista
router.post('/register', registerDriver);

// Login de Motorista
router.post('/login', loginDriver);

// Criação de usuários administrativos
router.post('/users', createUser);

// Login para interface web
router.post('/auth/web-login', webLogin);

export default router;

