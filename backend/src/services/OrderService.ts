import { pool } from '../database/connection';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface ProductRow extends RowDataPacket {
  id: number;
  title: string;
  cr: number;
  seller_id: number | null;
  category: string;
}

// Itens digitais únicos: só podem ser comprados uma vez por usuário
const DIGITAL_UNICOS = ['Jogo', 'Passe'];

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

      // 2. Busca todos os produtos do deck em uma única consulta
      const uniqueIds = [...new Set(productIds)];
      const [prodRows] = await conn.query<ProductRow[]>(
        'SELECT id, title, cr, seller_id, category FROM products WHERE id IN (?)',
        [uniqueIds]
      );

      const productMap = new Map<number, ProductRow>();
      for (const p of prodRows) {
        productMap.set(p.id, p);
      }

      // 2.1 Descobre quais itens digitais únicos o comprador já possui
      const digitalIds = prodRows
        .filter((p) => DIGITAL_UNICOS.includes(p.category))
        .map((p) => p.id);

      const jaPossui = new Set<number>();
      if (digitalIds.length > 0) {
        const [ownedRows] = await conn.query<RowDataPacket[]>(
          `SELECT DISTINCT oi.product_id
             FROM order_items oi
             JOIN orders o ON o.id = oi.order_id
            WHERE o.user_id = ? AND oi.product_id IN (?)`,
          [userId, digitalIds]
        );
        for (const r of ownedRows) {
          jaPossui.add(r.product_id);
        }
      }
      const digitaisNoDeck = new Set<number>();

      // 3. Calcula o total real e valida cada item
      let totalCr = 0;
      const itemsToSave: { productId: number; title: string; priceCr: number; sellerId: number | null }[] = [];

      for (const prodId of productIds) {
        const product = productMap.get(prodId);
        if (!product) {
          throw new Error(`Produto ID ${prodId} não encontrado.`);
        }
        if (product.seller_id === userId) {
          throw new Error(`Você não pode comprar o seu próprio anúncio (${product.title}).`);
        }

        if (DIGITAL_UNICOS.includes(product.category)) {
          if (jaPossui.has(product.id)) {
            throw new Error(`Você já possui "${product.title}".`);
          }
          if (digitaisNoDeck.has(product.id)) {
            throw new Error(`"${product.title}" aparece mais de uma vez no deck.`);
          }
          digitaisNoDeck.add(product.id);
        }

        totalCr += product.cr;
        itemsToSave.push({
          productId: product.id,
          title: product.title,
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

      // 6. Registra o pedido
      const [orderResult] = await conn.query<ResultSetHeader>(
        'INSERT INTO orders (user_id, total_cr) VALUES (?, ?)',
        [userId, totalCr]
      );
      const orderId = orderResult.insertId;

      // 7. Registra a saída no histórico do comprador
      const titles = itemsToSave.map((i) => i.title).join(', ');
      await conn.query(
        'INSERT INTO credit_transactions (user_id, type, amount, balance_after, order_id, description) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, 'purchase', -totalCr, newBalance, orderId, `Compra #${orderId}: ${titles}`.slice(0, 255)]
      );

      // 8. Registra cada item e repassa os créditos ao vendedor (se houver seller_id)
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

          const [sellerRows] = await conn.query<RowDataPacket[]>(
            'SELECT credits FROM users WHERE id = ?',
            [item.sellerId]
          );

          await conn.query(
            'INSERT INTO credit_transactions (user_id, type, amount, balance_after, order_id, description) VALUES (?, ?, ?, ?, ?, ?)',
            [
              item.sellerId,
              'sale',
              item.priceCr,
              sellerRows[0].credits,
              orderId,
              `Venda: ${item.title} (pedido #${orderId})`.slice(0, 255),
            ]
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
