import { Router } from 'express';

const userRoutes = Router();

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

const users: User[] = [];
let nextId = 1;

userRoutes.post('/users', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email e password são obrigatórios' });
  }

  const user: User = { id: nextId++, username, email, password };
  users.push(user);

  const { password: _senha, ...userSemSenha } = user;
  return res.status(201).json(userSemSenha);
});

userRoutes.get('/users', (req, res) => {
  const lista = users.map(({ password, ...resto }) => resto);
  return res.json(lista);
});

export { userRoutes };
