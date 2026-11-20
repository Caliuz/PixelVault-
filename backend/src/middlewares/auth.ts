import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não informado.' });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    res.locals.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}
