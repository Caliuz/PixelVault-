import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';

const orderService = new OrderService();

export class OrderController {
  async checkout(req: Request, res: Response) {
    try {
      const userId = res.locals.userId;
      const { productIds } = req.body;

      if (!Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ error: 'Envie uma lista de IDs de produtos.' });
      }

      const result = await orderService.checkout(userId, productIds);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
