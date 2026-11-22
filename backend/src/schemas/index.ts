import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string({ message: 'Username é obrigatório.' })
    .trim()
    .min(3, 'Username deve ter ao menos 3 caracteres.')
    .max(30, 'Username deve ter no máximo 30 caracteres.')
    .regex(/^[\p{L}\p{N}_ .-]+$/u, 'Username só pode ter letras, números, espaço, ponto, hífen e underline.'),
  email: z
    .string({ message: 'E-mail é obrigatório.' })
    .trim()
    .toLowerCase()
    .max(100, 'E-mail deve ter no máximo 100 caracteres.')
    .email('E-mail inválido.'),
  password: z
    .string({ message: 'Senha é obrigatória.' })
    .min(8, 'A senha deve ter ao menos 8 caracteres.')
    .max(72, 'A senha deve ter no máximo 72 caracteres.')
    .regex(/[A-Za-z]/, 'A senha deve ter ao menos uma letra.')
    .regex(/\d/, 'A senha deve ter ao menos um número.'),
  role: z
    .enum(['client', 'seller'], { message: "Role inválido. Use 'client' ou 'seller'." })
    .default('client'),
});

export const loginSchema = z.object({
  email: z
    .string({ message: 'E-mail é obrigatório.' })
    .trim()
    .min(1, 'E-mail é obrigatório.')
    .max(100, 'E-mail inválido.'),
  password: z
    .string({ message: 'Senha é obrigatória.' })
    .min(1, 'Senha é obrigatória.')
    .max(72, 'Senha inválida.'),
});

export const checkoutSchema = z.object({
  productIds: z
    .array(
      z
        .number({ message: 'IDs de produto inválidos.' })
        .int('IDs de produto inválidos.')
        .positive('IDs de produto inválidos.'),
      { message: 'Envie uma lista de IDs de produtos.' }
    )
    .min(1, 'O deck está vazio.')
    .max(50, 'Máximo de 50 itens por pedido.'),
});
