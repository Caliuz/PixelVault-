import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());

// Rota simples de verificação
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API PixelVault rodando!' });
});

export { app };