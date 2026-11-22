import { Router } from 'express';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../schemas';

const authRoutes = Router();
const authService = new AuthService();
const userService = new UserService();

authRoutes.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return res.json(result);
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
});

authRoutes.get('/me', auth, async (req, res) => {
  try {
    const user = await userService.findById(res.locals.userId);
    return res.json(user);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
});

export { authRoutes };
