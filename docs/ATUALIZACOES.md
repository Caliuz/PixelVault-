# PIXEL//VAULT — Atualizações

Marketplace digital de jogos, hardware e passes. Stack: Node.js + Express + TypeScript, MySQL/MariaDB e front-end em HTML/CSS/JS.

## O que foi entregue

### Banco de dados (`backend/src/database/schema.sql`)

| Tabela | Finalidade |
| --- | --- |
| `users` | Cadastro e carteira. `credits` (1500 CR iniciais) e `role` (`client` ou `seller`) |
| `products` | Catálogo. `cr` (preço em créditos), `brl`, `seller_id` (NULL = produto da plataforma) |
| `orders` | Cabeçalho dos pedidos (comprador e total em CR) |
| `order_items` | Itens do pedido, com o preço pago no momento da compra |
| `credit_transactions` | **Novo.** Histórico de saldo: `signup_bonus`, `purchase` e `sale`, com valor, saldo após a operação e pedido relacionado |

### API (porta 3000)

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| POST | `/users` | público | Cadastro. Aceita `role` opcional (`client` ou `seller`) |
| POST | `/login` | público | Devolve token JWT e dados do usuário (com `role`) |
| GET | `/me` | login | Dados do usuário logado |
| POST | `/users/become-seller` | login | Cliente passa a ser vendedor |
| GET | `/products` | público | Catálogo completo, com o nome do vendedor |
| GET | `/products/mine` | vendedor | Anúncios do vendedor logado |
| POST | `/products` | vendedor | Publica anúncio (o `seller_id` vem do token) |
| PUT | `/products/:id` | vendedor | Edita o próprio anúncio |
| DELETE | `/products/:id` | vendedor | Remove o próprio anúncio (se ainda não foi vendido) |
| POST | `/orders/checkout` | login | Finaliza a compra do deck |
| GET | `/wallet/history` | login | Histórico de saldo do usuário |

### Regras de negócio e segurança

- **Preços no servidor:** o front-end envia só os IDs; o back-end busca os valores na tabela `products`.
- **Transação atômica:** o checkout roda em `beginTransaction`/`commit`/`rollback`, com `SELECT ... FOR UPDATE` na linha do comprador (evita gasto duplo).
- **Validações:** saldo suficiente e bloqueio de compra do próprio anúncio.
- **Repasse ao vendedor:** na mesma transação, e registrado no histórico (`sale`) do vendedor.
- **Permissão de vendedor:** o middleware `onlySeller` consulta o `role` no banco a cada chamada (não confia no token).
- **Anúncio vendido** não pode ser removido (preserva o histórico de pedidos).
- **Senhas** com bcrypt; **rotas protegidas** com JWT (`Authorization: Bearer <token>`).

### Front-end

- Catálogo carregado de `GET /products` (antes era uma lista fixa no `app.js`).
- Cadastro com a opção "Quero vender" e botão "Quero ser vendedor" no perfil.
- Painel do vendedor: publicar e remover anúncios.
- Histórico de saldo no perfil.
- Textos vindos do banco são escapados antes de ir para a tela (prevenção de XSS).

## Como rodar

1. Criar o banco: `mysql -u root -p < backend/src/database/schema.sql`
2. Criar `backend/.env` com `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` e `JWT_SECRET` (o arquivo não vai para o Git).
3. `cd backend && npm install && npm run dev`
4. Abrir `frontend/index.html` no navegador.

## Próximos passos

- Biblioteca do jogador ("Meus Itens"): `GET /me/library`.
- Edição de anúncio na tela (a rota `PUT /products/:id` já existe).
- Revisar `GET /users` e `GET /users/:id`: não exigem login e expõem e-mail e saldo.
- Validação de e-mail e tamanho mínimo de senha no cadastro.
- Migração do front-end para Vite + TypeScript.
