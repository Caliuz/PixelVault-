import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { userRoutes } from './routes/userRoutes';
import { authRoutes } from './routes/authRoutes';
import { orderRoutes } from './routes/orderRoutes';
import { walletRoutes } from './routes/walletRoutes';
import { productRoutes } from './routes/productRoutes';
import { sellerRoutes } from './routes/sellerRoutes';
import { globalLimiter, loginLimiter, registerLimiter } from './middlewares/rateLimiters';

const app = express();

// Em produção, atrás de um proxy (Render, Railway...), habilite: app.set('trust proxy', 1);

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5500,http://127.0.0.1:5500')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const isProduction = process.env.NODE_ENV === 'production';

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Sem Origin = curl, Postman ou outro servidor (o CORS só vale para navegadores)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // index.html aberto direto do disco (file://) envia Origin "null": só em desenvolvimento
      if (!isProduction && origin === 'null') return callback(null, true);
      return callback(null, false);
    },
  })
);
app.use(globalLimiter);
app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => {
  res.json({ message: 'PixelVault API funcionando' });
});

app.post('/login', loginLimiter);
app.post('/users', registerLimiter);

app.use(userRoutes);
app.use(authRoutes);
app.use(orderRoutes);
app.use(walletRoutes);
app.use(productRoutes);
app.use(sellerRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido.' });
  }
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Requisição grande demais.' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Erro interno.' });
});

export { app };
