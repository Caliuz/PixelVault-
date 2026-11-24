
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    tipo: 'cliente' | 'admin';
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'pixelvault_super_secreto_2026';

export function verificarToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido. Faça login.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token mal formatado.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as {
      id: number;
      email: string;
      tipo: 'cliente' | 'admin';
    };
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ erro: 'Sessão expirada ou token inválido.' });
  }
}

export function verificarAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.tipo !== 'admin') {
    return res.status(403).json({ erro: 'Acesso negado. Exclusivo para administradores.' });
  }
  return next();
}