import express from 'express';
import { authenticateToken, checkWebAuth} from '../middlewares/authMiddleware.js';
import { upload } from '../config/uploadConfig.js';
import { 
  getAllDrivers,
  getDriverDetails,
  finishShipment,
  getCurrentShipment,
  getShipmentHistory,
  finalizeNf,
  reportNfIssue,
  testUpload,
  getInvoiceHistory
} from '../controllers/driverController.js';

const router = express.Router();

// Rota para listar motoristas
router.get('/', getAllDrivers);

// Rota para detalhes do motorista autenticado
router.get('/me', authenticateToken, getDriverDetails);

// Rota para finalizar frete
router.post('/finish-shipment', authenticateToken, finishShipment);

// Obter frete atual do motorista
router.get('/current-shipment', authenticateToken, getCurrentShipment);

// Obter histórico de fretes
router.get('/shipment-history', authenticateToken, getShipmentHistory);

// Rota para finalizar NF com imagem
router.post(
  '/finalize-nf/:nfId',
  authenticateToken,
  upload.single('proofImage'),
  finalizeNf
);

// Rota para reportar problema em uma NF
router.post(
  '/report-nf-issue/:nfId',
  authenticateToken,
  reportNfIssue
);

// Teste de upload
router.post('/test-upload', upload.single('proofImage'), testUpload);

// Histórico de faturas/invoices (admin/web)
router.get('/invoice-history', checkWebAuth, getInvoiceHistory);

export default router;
