import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { PrismaClient } from '@prisma/client';
import { upload, uploadToB2 } from '../config/uploadConfig.js';

const router = express.Router();
const prisma = new PrismaClient();

// Rota para listar motoristas
router.get('/', async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany();
    return res.status(200).json(drivers);
  } catch (error) {
    console.error('Erro ao buscar motoristas:', error.message || error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Rota para detalhes do motorista autenticado
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const driverId = req.user.id;
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: { shipments: true },
    });

    if (!driver) {
      return res.status(404).json({ error: 'Motorista não encontrado' });
    }

    return res.status(200).json(driver);
  } catch (error) {
    console.error('Erro ao obter dados do motorista:', error.message || error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Rota para finalizar frete
router.post('/finish-shipment', authenticateToken, async (req, res) => {
  try {
    const driverId = req.user.id;
    const { shipmentId } = req.body;

    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId, driverId },
    });

    if (!shipment) {
      return res.status(404).json({ error: 'Frete não encontrado' });
    }

    if (shipment.status === 'FINALIZADO') {
      return res.status(400).json({ error: 'Frete já finalizado' });
    }

    await prisma.shipment.update({
      where: { id: shipmentId },
      data: { status: 'FINALIZADO', finishedAt: new Date() },
    });

    return res.status(200).json({ message: 'Frete finalizado com sucesso' });
  } catch (error) {
    console.error('Erro ao finalizar frete:', error.message || error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

router.get('/current-shipment', authenticateToken, async (req, res) => {
  try {
    const driverId = req.user.id;

    const currentShipment = await prisma.shipment.findFirst({
      where: {
        driverId: driverId,
        status: 'PENDENTE'
      },
      include: {
        nfDetails: true,    // Inclui os detalhes das notas fiscais
      },
    });

    if (!currentShipment) {
      return res.status(404).json({ error: 'Nenhuma carga pendente encontrada' });
    }

    return res.status(200).json(currentShipment);
  } catch (error) {
    console.error('Erro ao obter frete atual:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

router.get('/shipment-history', authenticateToken, async (req, res) => {
  try {
    const driverId = req.user.id;

    const shipmentHistory = await prisma.shipment.findMany({
      where: {
        driverId: driverId,
        status: 'FINALIZADO'
      }
    });

    return res.status(200).json(shipmentHistory);
  } catch (error) {
    console.error('Erro ao obter histórico de fretes:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Rota para finalizar NF com imagem
router.post(
  '/finalize-nf/:nfId',
  authenticateToken,
  upload.single('proofImage'),
  async (req, res) => {
    try {
      if (!req.file) {
        console.error('❌ Nenhuma imagem foi enviada.');
        return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
      }

      console.log('📂 Arquivo recebido:', req.file);

      const proofImageUrl = await uploadToB2(req.file);

      const { nfId } = req.params;

      const nf = await prisma.nFDetail.findUnique({
        where: { id: parseInt(nfId) },
      });

      if (!nf) {
        return res.status(404).json({ error: 'Nota Fiscal não encontrada' });
      }

      await prisma.nFDetail.update({
        where: { id: parseInt(nfId) },
        data: { status: 'ENTREGUE', proofImage: proofImageUrl },
      });

      console.log('✅ Nota Fiscal finalizada com sucesso!');
      return res.status(200).json({ message: 'Nota Fiscal finalizada com sucesso!' });
    } catch (error) {
      console.error('❌ Erro ao finalizar NF:', error.message || error);
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  }
);


router.post('/test-upload', upload.single('proofImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
    }
    console.log('Arquivo recebido:', req.file);
    return res.status(200).json({ message: 'Upload bem-sucedido!', file: req.file });
  } catch (error) {
    console.error('Erro no teste de upload:', error.message || error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Encerrar Prisma ao finalizar o servidor
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default router;
