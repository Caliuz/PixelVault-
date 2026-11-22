import { Router } from 'express';
import { LibraryService } from '../services/LibraryService';
import { auth } from '../middlewares/auth';

const libraryRoutes = Router();
const libraryService = new LibraryService();

libraryRoutes.get('/me/library', auth, async (req, res) => {
  try {
    return res.json(await libraryService.list(res.locals.userId));
  } catch {
    return res.status(500).json({ error: 'Erro ao carregar a biblioteca.' });
  }
});

export { libraryRoutes };
