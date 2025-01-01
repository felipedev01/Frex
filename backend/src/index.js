import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import shipmentsRouter from './routes/shipments.js';
import driversRouter from './routes/drivers.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas

app.use('/drivers', driversRouter);


app.use('/shipments', shipmentsRouter );

app.use('/auth', authRouter);

// Iniciar servidor
app.listen(3002, '0.0.0.0', () => {
  console.log('Servidor rodando na porta 3002 atualizado!');
});
