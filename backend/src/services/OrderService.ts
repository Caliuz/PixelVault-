import { pool } from '../database/connection';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class OrderService {
  async checkout(userId: number, productIds: number[]) {
    if (!productIds || productIds.length === 0) {
      throw new Error('O deck está vazio.');
    }

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // 1. Busca o saldo atual do usuário travando a linha para evitar compra dupla simultânea
      const [userRows] = await conn.query<RowDataPacket[]>(
        'SELECT id, credits FROM users WHERE id = ? FOR UPDATE',
        [userId]
      );
      const user = userRows[0];
      if (!user) throw new Error('Usuário não encontrado.');

      // 2. Busca os preços reais dos produtos no banco (ignora preços manipulados no front)
      let totalCr = 0;
      const itemsToSave: { productId: number; priceCr: number }[] = [];

      for (const prodId of productIds) {
        const [prodRows] = await conn.query<RowDataPacket[]>(
          'SELECT id, cr FROM products WHERE id = ?',
          [prodId]
        );
        const product = prodRows[0];
        if (!product) throw new Error(`Produto ID ${prodId} não encontrado.`);

        totalCr += product.cr;
        itemsToSave.push({ productId: product.id, priceCr: product.cr });
      }

      // 3. Verifica se tem saldo suficiente
      if (user.credits < totalCr) {
        throw new Error(`Créditos insuficientes. Necessário: ${totalCr} CR, Disponível: ${user.credits} CR.`);
      }

      // 4. Desconta os créditos do usuário
      const newBalance = user.credits - totalCr;
      await conn.query('UPDATE users SET credits = ? WHERE id = ?', [newBalance, userId]);

      // 5. Registra o pedido e os itens comprados
      const [orderResult] = await conn.query<ResultSetHeader>(
        'INSERT INTO orders (user_id, total_cr) VALUES (?, ?)',
        [userId, totalCr]
      );
      const orderId = orderResult.insertId;

      for (const item of itemsToSave) {
        await conn.query(
          'INSERT INTO order_items (order_id, product_id, price_cr) VALUES (?, ?, ?)',
          [orderId, item.productId, item.priceCr]
        );
      }

      await conn.commit();

      return {
        orderId,
        totalCr,
        newBalance,
      };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}