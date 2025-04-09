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

// Exportar app para ser usado no server.js
export default app;
