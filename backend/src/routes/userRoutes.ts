import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { auth } from '../middlewares/auth';

const userRoutes = Router();
const userController = new UserController();

// Rota pública: cria conta de Cliente ('client') ou Vendedor ('seller')
userRoutes.post('/users', async (req, res) => {
  await userController.create(req, res);
});

// Rotas protegidas: exigem token JWT válido
userRoutes.get('/users', auth, async (req, res) => {
  await userController.index(req, res);
});

userRoutes.get('/users/:id', auth, async (req, res) => {
  await userController.show(req, res);
});

export { userRoutes };