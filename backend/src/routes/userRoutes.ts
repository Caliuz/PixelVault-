import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/users', async (req, res) => {
  await userController.create(req, res);
});

userRoutes.get('/users', async (req, res) => {
  await userController.index(req, res);
});

userRoutes.get('/users/:id', async (req, res) => {
  await userController.show(req, res);
});

export { userRoutes };
