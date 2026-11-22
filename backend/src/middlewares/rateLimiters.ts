import { rateLimit } from 'express-rate-limit';

const base = { standardHeaders: 'draft-7' as const, legacyHeaders: false };

export const globalLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 500,
  message: { error: 'Muitas requisições. Tente novamente em alguns minutos.' },
});

export const loginLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
});

export const registerLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { error: 'Muitos cadastros a partir deste IP. Tente novamente mais tarde.' },
});
