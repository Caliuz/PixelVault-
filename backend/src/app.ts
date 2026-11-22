import express from 'express';
import cors from 'cors';
import { userRoutes } from './routes/userRoutes';
import { authRoutes } from './routes/authRoutes';
import { orderRoutes } from './routes/orderRoutes';
import { walletRoutes } from './routes/walletRoutes';
import { productRoutes } from './routes/productRoutes';
import { sellerRoutes } from './routes/sellerRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'PixelVault API funcionando' });
});

app.use(userRoutes);
app.use(authRoutes);
app.use(orderRoutes);
app.use(walletRoutes);
app.use(productRoutes);
app.use(sellerRoutes);

export { app };
