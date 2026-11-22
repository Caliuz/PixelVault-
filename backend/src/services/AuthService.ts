import { pool } from '../database/connection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

export class AuthService {
  async login(email: string, password: string) {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, username, email, password, role, credits FROM users WHERE email = ?',
      [email]
    );

    const user = rows[0];
    if (!user) throw new Error('E-mail ou senha inválidos.');

    const senhaCorreta = await bcrypt.compare(password, user.password);
    if (!senhaCorreta) throw new Error('E-mail ou senha inválidos.');

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET não configurado no .env');

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '7d' });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        credits: user.credits,
      },
    };
  }
}
