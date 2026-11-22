import { Router, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { auth } from '../middlewares/auth';
import { onlySeller } from '../middlewares/onlySeller';

const productRoutes = Router();
const productService = new ProductService();

function fail(res: Response, error: any) {
  if (error && error.status) {
    return res.status(error.status).json({ error: error.message });
  }
  return res.status(500).json({ error: 'Erro interno.' });
}

productRoutes.get('/products', async (req, res) => {
  try {
    return res.json(await productService.list());
  } catch (error) {
    return fail(res, error);
  }
});

productRoutes.get('/products/mine', auth, onlySeller, async (req, res) => {
  try {
    return res.json(await productService.listMine(res.locals.userId));
  } catch (error) {
    return fail(res, error);
  }
});

productRoutes.post('/products', auth, onlySeller, async (req, res) => {
  try {
    const product = await productService.create(res.locals.userId, req.body);
    return res.status(201).json(product);
  } catch (error) {
    return fail(res, error);
  }
});

productRoutes.put('/products/:id', auth, onlySeller, async (req, res) => {
  try {
    const product = await productService.update(res.locals.userId, Number(req.params.id), req.body);
    return res.json(product);
  } catch (error) {
    return fail(res, error);
  }
});

productRoutes.delete('/products/:id', auth, onlySeller, async (req, res) => {
  try {
    return res.json(await productService.remove(res.locals.userId, Number(req.params.id)));
  } catch (error) {
    return fail(res, error);
  }
});

export { productRoutes };
