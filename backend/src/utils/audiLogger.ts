
import type { Request } from 'express';
import { prisma } from './prisma.js';


export async function registrarLog(req: Request, usuarioId: number | null, acao: string) {
  try {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    await prisma.logSistema.create({
      data: {
        usuario_id: usuarioId,
        acao,
        ip,
      },
    });
  } catch (error) {
    console.error('Erro ao salvar log de auditoria:', error);
  }
}