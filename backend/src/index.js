import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import shipmentsRouter from './routes/shipments.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas

app.get('/debug', (req, res) => {
  console.log('🚀 Endpoint de debug foi acessado!');
  res.status(200).json({
    message: '🚀 Debug funcionando diretamente no appp!',
    status: 'success'
  });
});

app.use('/', shipmentsRouter );

// Iniciar servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
