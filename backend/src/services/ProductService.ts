import { pool } from '../database/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const CATEGORIES = ['Jogo', 'Hardware', 'Passe'];

type Clean = Partial<{
  title: string;
  category: string;
  platform: string;
  tag: string;
  cr: number;
  brl: number;
  img: string;
}>;

function httpError(status: number, message: string) {
  return Object.assign(new Error(message), { status });
}

function clean(data: any, partial: boolean): Clean {
  const out: Clean = {};

  if (data.title !== undefined || !partial) {
    const title = String(data.title ?? '').trim();
    if (!title || title.length > 100) throw httpError(400, 'Título obrigatório (até 100 caracteres).');
    out.title = title;
  }

  if (data.category !== undefined || !partial) {
    if (!CATEGORIES.includes(data.category)) {
      throw httpError(400, `Categoria inválida. Use: ${CATEGORIES.join(', ')}.`);
    }
    out.category = data.category;
  }

  if (data.platform !== undefined || !partial) {
    const platform = String(data.platform ?? '').trim();
    if (!platform || platform.length > 50) throw httpError(400, 'Plataforma obrigatória (até 50 caracteres).');
    out.platform = platform;
  }

  if (data.tag !== undefined) {
    const tag = String(data.tag).trim();
    if (tag.length > 50) throw httpError(400, 'Tag deve ter até 50 caracteres.');
    out.tag = tag || 'NOVO';
  } else if (!partial) {
    out.tag = 'NOVO';
  }

  if (data.cr !== undefined || !partial) {
    const cr = Number(data.cr);
    if (!Number.isInteger(cr) || cr < 1 || cr > 100000) {
      throw httpError(400, 'Preço em CR deve ser um inteiro entre 1 e 100000.');
    }
    out.cr = cr;
  }

  if (data.brl !== undefined) {
    const brl = Number(data.brl);
    if (!(brl > 0) || brl > 99999999) throw httpError(400, 'Preço em BRL inválido.');
    out.brl = brl;
  }

  if (data.img !== undefined || !partial) {
    const img = String(data.img ?? '').trim();
    if (!/^https?:\/\/.+/i.test(img) || img.length > 255) {
      throw httpError(400, 'Imagem deve ser uma URL http(s) de até 255 caracteres.');
    }
    out.img = img;
  }

  return out;
}

export class ProductService {
  async list() {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.id, p.title, p.category, p.platform, p.tag, p.cr, p.brl, p.rating, p.img,
              p.seller_id, u.username AS seller_name
       FROM products p
       LEFT JOIN users u ON u.id = p.seller_id
       ORDER BY p.id`
    );
    return rows;
  }

  async listMine(sellerId: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM products WHERE seller_id = ? ORDER BY id',
      [sellerId]
    );
    return rows;
  }

  async create(sellerId: number, data: any) {
    const f = clean(data, false);
    const brl = f.brl !== undefined ? f.brl : Number(((f.cr as number) * 0.6).toFixed(2));

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO products (title, category, platform, tag, cr, brl, rating, img, seller_id)
       VALUES (?, ?, ?, ?, ?, ?, 'NOVO', ?, ?)`,
      [f.title, f.category, f.platform, f.tag, f.cr, brl, f.img, sellerId]
    );

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );
    return rows[0];
  }

  async update(sellerId: number, id: number, data: any) {
    await this.assertOwner(sellerId, id);

    const f = clean(data, true);
    const keys = Object.keys(f) as (keyof Clean)[];
    if (keys.length === 0) throw httpError(400, 'Nada para atualizar.');

    await pool.query(
      `UPDATE products SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE id = ?`,
      [...keys.map((k) => f[k]), id]
    );

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  }

  async remove(sellerId: number, id: number) {
    await this.assertOwner(sellerId, id);

    const [sales] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS n FROM order_items WHERE product_id = ?',
      [id]
    );
    if (sales[0].n > 0) throw httpError(409, 'Produto já vendido não pode ser removido.');

    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return { deleted: id };
  }

  private async assertOwner(sellerId: number, id: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM products WHERE id = ? AND seller_id = ?',
      [id, sellerId]
    );
    if (rows.length === 0) throw httpError(404, 'Produto não encontrado ou não pertence a você.');
  }
}
