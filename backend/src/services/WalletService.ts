import { pool } from '../database/connection';
import { RowDataPacket } from 'mysql2';

export class WalletService {
  async history(userId: number, limit = 50) {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, type, amount, balance_after, order_id, description, created_at
       FROM credit_transactions
       WHERE user_id = ?
       ORDER BY id DESC
       LIMIT ?`,
      [userId, limit]
    );
    return rows;
  }
}
