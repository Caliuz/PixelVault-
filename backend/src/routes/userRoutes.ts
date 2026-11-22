import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { registerSchema } from '../schemas';

const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/users', validate(registerSchema), async (req, res) => {
  await userController.create(req, res);
});

// Cada usuário só vê o próprio cadastro. A listagem geral foi removida (só voltaria para um admin).
userRoutes.get('/users/:id', auth, async (req, res) => {
  if (Number(req.params.id) !== res.locals.userId) {
    return res.status(403).json({ error: 'Acesso negado.' });
  }
  await userController.show(req, res);
});

export { userRoutes };
