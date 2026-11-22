import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2';
import { pool } from '../database/connection';

export async function onlySeller(req: Request, res: Response, next: NextFunction) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT role FROM users WHERE id = ?',
      [res.locals.userId]
    );

    if (!rows[0] || rows[0].role !== 'seller') {
      return res.status(403).json({ error: 'Apenas vendedores podem fazer isso.' });
    }

    next();
  } catch {
    return res.status(500).json({ error: 'Erro ao verificar permissão.' });
  }
}
