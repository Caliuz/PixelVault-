import { Router } from 'express';
import { WalletService } from '../services/WalletService';
import { auth } from '../middlewares/auth';

const walletRoutes = Router();
const walletService = new WalletService();

walletRoutes.get('/wallet/history', auth, async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const history = await walletService.history(res.locals.userId, limit);
    return res.json(history);
  } catch {
    return res.status(500).json({ error: 'Erro ao buscar o histórico.' });
  }
});

export { walletRoutes };
