import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

const userService = new UserService();

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const { username, email, password, role } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, e-mail e senha são obrigatórios.' });
      }

      if (role !== undefined && role !== 'client' && role !== 'seller') {
        return res.status(400).json({ error: "Role inválido. Use 'client' ou 'seller'." });
      }

      const user = await userService.create({ username, email, password, role: role ?? 'client' });
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const users = await userService.findAll();
      return res.json(users);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao listar usuários.' });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await userService.findById(id);
      return res.json(user);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }
}
