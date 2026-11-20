import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const userRoutes = Router();
const userController = new UserController();

userRoutes.post('/users', (req, res) => userController.create(req, res));
userRoutes.get('/users', (req, res) => userController.index(req, res));
userRoutes.get('/users/:id', (req, res) => userController.show(req, res));

export { userRoutes };
