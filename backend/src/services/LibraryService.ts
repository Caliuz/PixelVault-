import { pool } from '../database/connection';
import { RowDataPacket } from 'mysql2';

export class LibraryService {
  async list(userId: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.id, p.title, p.category, p.platform, p.tag, p.img,
              COUNT(*) AS quantity,
              CAST(SUM(oi.price_cr) AS UNSIGNED) AS total_paid_cr,
              MAX(o.created_at) AS last_purchase
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       JOIN products p ON p.id = oi.product_id
       WHERE o.user_id = ?
       GROUP BY p.id, p.title, p.category, p.platform, p.tag, p.img
       ORDER BY last_purchase DESC`,
      [userId]
    );
    return rows;
  }
}
