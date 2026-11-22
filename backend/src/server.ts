import { app } from './app';

const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
  console.error('JWT_SECRET ausente ou curto (mínimo 32 caracteres). Gere com: openssl rand -hex 32');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor PixelVault rodando em http://localhost:${PORT}`);
});
