import { pool } from '../database/connection';
import bcrypt from 'bcryptjs';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  role?: 'client' | 'seller';
}

export class UserService {
  async create({ username, email, password, role = 'client' }: CreateUserDTO) {
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      throw new Error('E-mail ou username já cadastrado.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );

    await pool.query(
      "INSERT INTO credit_transactions (user_id, type, amount, balance_after, description) SELECT id, 'signup_bonus', credits, credits, 'Bônus de boas-vindas' FROM users WHERE id = ?",
      [result.insertId]
    );

    return {
      id: result.insertId,
      username,
      email,
      role,
      credits: 1500,
    };
  }

  async findAll() {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, username, email, role, credits, created_at FROM users'
    );
    return rows;
  }

  async findById(id: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, username, email, role, credits, created_at FROM users WHERE id = ?',
      [id]
    );
    if (rows.length === 0) throw new Error('Usuário não encontrado.');
    return rows[0];
  }

  async becomeSeller(userId: number) {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE users SET role = 'seller' WHERE id = ?",
      [userId]
    );
    if (result.affectedRows === 0) throw new Error('Usuário não encontrado.');
    return { id: userId, role: 'seller' };
  }
}
