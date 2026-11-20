import express from 'express';
import cors from 'cors';
import { userRoutes } from './routes/userRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'PixelVault API funcionando' });
});

app.use(userRoutes);

export { app };
