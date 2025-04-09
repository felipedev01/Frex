import express from 'express';
import { checkAdminAuth } from '../middlewares/authMiddleware.js';
import { 
  authenticateDriver, 
  getDriverShipments, 
  createShipment 
} from '../controllers/shipmentController.js';

const router = express.Router();

// Rota protegida para listar fretes do motorista autenticado
router.get('/my-shipments', authenticateDriver, getDriverShipments);

// Rota para cadastrar um novo frete (protegida por admin)
router.post('/', checkAdminAuth, createShipment);

export default router;

