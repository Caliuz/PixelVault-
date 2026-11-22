import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { checkoutSchema } from '../schemas';

const orderRoutes = Router();
const orderController = new OrderController();

orderRoutes.post('/orders/checkout', auth, validate(checkoutSchema), async (req, res) => {
  await orderController.checkout(req, res);
});

export { orderRoutes };
