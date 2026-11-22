import { pool } from '../database/connection';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface ProductRow extends RowDataPacket {
  id: number;
  title: string;
  cr: number;
  seller_id: number | null;
}

export class OrderService {
  async checkout(userId: number, productIds: number[]) {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw new Error('O deck está vazio.');
    }

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // 1. Trava a linha do comprador para evitar gasto duplo simultâneo
      const [userRows] = await conn.query<RowDataPacket[]>(
        'SELECT id, credits FROM users WHERE id = ? FOR UPDATE',
        [userId]
      );
      const buyer = userRows[0];
      if (!buyer) {
        throw new Error('Usuário não encontrado.');
      }

      // 2. Busca todos os produtos do Deck em uma única consulta no banco
      const uniqueIds = [...new Set(productIds)];
      const [prodRows] = await conn.query<ProductRow[]>(
        'SELECT id, title, cr, seller_id FROM products WHERE id IN (?)',
        [uniqueIds]
      );

      const productMap = new Map<number, ProductRow>();
      for (const p of prodRows) {
        productMap.set(p.id, p);
      }

      // 3. Calcula o total real e valida cada item enviado
      let totalCr = 0;
      const itemsToSave: { productId: number; priceCr: number; sellerId: number | null }[] = [];

      for (const prodId of productIds) {
        const product = productMap.get(prodId);
        if (!product) {
          throw new Error(`Produto ID ${prodId} não encontrado.`);
        }
        if (product.seller_id === userId) {
          throw new Error(`Você não pode comprar o seu próprio anúncio (${product.title}).`);
        }

        totalCr += product.cr;
        itemsToSave.push({
          productId: product.id,
          priceCr: product.cr,
          sellerId: product.seller_id,
        });
      }

      // 4. Verifica se o comprador tem saldo suficiente
      if (buyer.credits < totalCr) {
        throw new Error(
          `Créditos insuficientes. Necessário: ${totalCr} CR, Disponível: ${buyer.credits} CR.`
        );
      }

      // 5. Desconta os créditos do comprador
      const newBalance = buyer.credits - totalCr;
      await conn.query('UPDATE users SET credits = ? WHERE id = ?', [newBalance, userId]);

      // 6. Registra o pedido na tabela orders
      const [orderResult] = await conn.query<ResultSetHeader>(
        'INSERT INTO orders (user_id, total_cr) VALUES (?, ?)',
        [userId, totalCr]
      );
      const orderId = orderResult.insertId;

      // 7. Registra cada item comprado e repassa os créditos ao vendedor (se houver seller_id)
      for (const item of itemsToSave) {
        await conn.query(
          'INSERT INTO order_items (order_id, product_id, price_cr) VALUES (?, ?, ?)',
          [orderId, item.productId, item.priceCr]
        );

        if (item.sellerId) {
          await conn.query(
            'UPDATE users SET credits = credits + ? WHERE id = ?',
            [item.priceCr, item.sellerId]
          );
        }
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