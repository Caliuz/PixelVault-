import { pool } from '../database/connection';
import bcrypt from 'bcryptjs';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
}

export class UserService {
  async create({ username, email, password }: CreateUserDTO) {
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      throw new Error('E-mail ou username já cadastrado.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    await pool.query(
      "INSERT INTO credit_transactions (user_id, type, amount, balance_after, description) SELECT id, 'signup_bonus', credits, credits, 'Bônus de boas-vindas' FROM users WHERE id = ?",
      [result.insertId]
    );

    return {
      id: result.insertId,
      username,
      email,
      credits: 1500,
    };
  }

  async findAll() {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, username, email, credits, created_at FROM users'
    );
    return rows;
  }

  async findById(id: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, username, email, credits, created_at FROM users WHERE id = ?',
      [id]
    );
    if (rows.length === 0) throw new Error('Usuário não encontrado.');
    return rows[0];
  }
}
