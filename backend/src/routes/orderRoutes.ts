import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { auth } from '../middlewares/auth';

const orderRoutes = Router();
const orderController = new OrderController();

orderRoutes.post('/orders/checkout', auth, async (req, res) => {
  await orderController.checkout(req, res);
});

export { orderRoutes };
