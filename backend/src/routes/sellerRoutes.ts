import { Router } from 'express';
import { UserService } from '../services/UserService';
import { auth } from '../middlewares/auth';

const sellerRoutes = Router();
const userService = new UserService();

sellerRoutes.post('/users/become-seller', auth, async (req, res) => {
  try {
    const result = await userService.becomeSeller(res.locals.userId);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

export { sellerRoutes };
