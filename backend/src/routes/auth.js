import express from 'express';
import { 
  validateToken, 
  registerDriver, 
  loginDriver, 
  registerTransportCompany,
  loginTransportCompany,
  createViewer, 
  webLogin 
} from '../controllers/authController.js';

const router = express.Router();

// Validação de token
router.get('/validate-token', validateToken);

// Cadastro de Motorista
router.post('/driver/register', registerDriver);

// Login de Motorista
router.post('/driver/login', loginDriver);

// Cadastro de Transportadora
router.post('/transport-company/register', registerTransportCompany);

// Login de Transportadora
router.post('/transport-company/login', loginTransportCompany);

// Criação de usuários viewer
router.post('/viewer/create', createViewer);

// Login para interface web
router.post('/auth/web-login', webLogin);

export default router;

