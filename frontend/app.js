const API_URL = 'http://localhost:3000';

let products = [];
let catalogError = false;
let currentUser = null;
let deck = [];
let activeCategory = 'Todos';

// Escapa texto vindo do banco (títulos e nomes criados por vendedores) antes de usar em innerHTML
function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fmtBrl(value) {
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('pixelvault_token')}`,
  };
}

// CATÁLOGO (vem da API)
async function carregarProdutos() {
  try {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error('falha');
    products = await res.json();
    catalogError = false;
  } catch {
    catalogError = true;
    document.getElementById('items-count').textContent = '0 itens disponíveis';
    document.getElementById('products-grid').innerHTML =
      '<p class="muted">Não foi possível carregar o catálogo. O servidor (porta 3000) está rodando?</p>';
    return;
  }
  renderProducts();
}

function renderProducts() {
  if (catalogError) return;

  const query = document.getElementById('search-input').value.toLowerCase();
  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'Todos' || p.category === activeCategory;
    const matchText = p.title.toLowerCase().includes(query) || p.platform.toLowerCase().includes(query);
    return matchCat && matchText;
  });

  document.getElementById('items-count').textContent = `${filtered.length} itens disponíveis`;
  const grid = document.getElementById('products-grid');

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="muted">Nenhum item encontrado.</p>';
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const isMine = currentUser && p.seller_id === currentUser.id;
    const action = isMine
      ? '<span class="muted small">SEU ANÚNCIO</span>'
      : `<button class="btn-add" onclick="addToDeck(${p.id})">+ DECK</button>`;
    const seller = p.seller_name ? `<div class="muted small">por ${esc(p.seller_name)}</div>` : '';

    return `
      <article class="product-card">
        <span class="tag-pill">${esc(p.tag)}</span>
        <img src="${esc(p.img)}" alt="${esc(p.title)}">
        <div class="product-body">
          <div class="product-meta"><span>${esc(p.platform)}</span><span>★ ${esc(p.rating)}</span></div>
          <h3>${esc(p.title)}</h3>
          ${seller}
          <div class="product-footer">
            <div>
              <span class="price-cr">${p.cr} CR</span>
              <span class="price-brl">${fmtBrl(p.brl)}</span>
            </div>
            ${action}
          </div>
        </div>
      </article>`;
  }).join('');
}

// DECK (CARRINHO)
function addToDeck(id) {
  const item = products.find(p => p.id === id);
  if (item) {
    deck.push(item);
    updateDeckUI();
    document.getElementById('deck-drawer').classList.remove('hidden');
  }
}

function removeFromDeck(index) {
  deck.splice(index, 1);
  updateDeckUI();
}

function updateDeckUI() {
  document.getElementById('deck-count').textContent = deck.length;
  const saldo = currentUser ? currentUser.credits : 0;
  const subtotal = deck.reduce((acc, item) => acc + item.cr, 0);
  const totalBrl = deck.reduce((acc, item) => acc + Number(item.brl), 0);
  const after = saldo - subtotal;

  document.getElementById('deck-saldo').textContent = saldo;
  document.getElementById('deck-subtotal').textContent = `${subtotal} CR`;
  document.getElementById('deck-brl').textContent = fmtBrl(totalBrl);

  const afterEl = document.getElementById('deck-after');
  afterEl.textContent = `${after} CR`;
  afterEl.style.color = after < 0 ? '#ef4444' : '#00ff88';

  const container = document.getElementById('deck-items');
  container.innerHTML = deck.length === 0
    ? '<p class="muted">Seu deck está vazio. Adicione jogos do catálogo!</p>'
    : deck.map((item, idx) => `
        <div class="deck-item">
          <div>
            <strong>${esc(item.title)}</strong>
            <div class="accent">${item.cr} CR</div>
          </div>
          <button class="icon-btn" onclick="removeFromDeck(${idx})">✕</button>
        </div>
      `).join('');
}

// HISTÓRICO DE SALDO (GET /wallet/history)
async function carregarHistorico() {
  const box = document.getElementById('wallet-history');
  try {
    const res = await fetch(`${API_URL}/wallet/history?limit=20`, { headers: authHeaders() });
    const rows = await res.json();
    if (!res.ok) throw new Error(rows.error);

    box.innerHTML = rows.length === 0
      ? '<p class="muted">Nenhuma movimentação ainda.</p>'
      : rows.map(t => {
          const positivo = t.amount > 0;
          const data = new Date(t.created_at).toLocaleString('pt-BR');
          return `
            <div class="tx-row">
              <div>
                <strong>${esc(t.description)}</strong>
                <div class="muted small">${data} · saldo ${t.balance_after} CR</div>
              </div>
              <span style="color:${positivo ? '#00ff88' : '#ef4444'}">${positivo ? '+' : ''}${t.amount} CR</span>
            </div>`;
        }).join('');
  } catch {
    box.innerHTML = '<p class="muted">Não foi possível carregar o histórico.</p>';
  }
}

// BIBLIOTECA DO JOGADOR (GET /me/library)
async function carregarBiblioteca() {
  const box = document.getElementById('my-library');
  try {
    const res = await fetch(`${API_URL}/me/library`, { headers: authHeaders() });
    const rows = await res.json();
    if (!res.ok) throw new Error(rows.error);

    box.innerHTML = rows.length === 0
      ? '<p class="muted">Você ainda não comprou nada. Explore o catálogo!</p>'
      : rows.map(p => {
          const data = new Date(p.last_purchase).toLocaleDateString('pt-BR');
          const qtd = Number(p.quantity) > 1 ? ` · x${Number(p.quantity)}` : '';
          return `
            <div class="lib-row">
              <img class="lib-thumb" src="${esc(p.img)}" alt="${esc(p.title)}">
              <div>
                <strong>${esc(p.title)}${qtd}</strong>
                <div class="muted small">${esc(p.platform)} · comprado em ${data}</div>
              </div>
            </div>`;
        }).join('');
  } catch {
    box.innerHTML = '<p class="muted">Não foi possível carregar sua biblioteca.</p>';
  }
}

// PAINEL DO VENDEDOR
async function carregarMeusProdutos() {
  const box = document.getElementById('my-products');
  try {
    const res = await fetch(`${API_URL}/products/mine`, { headers: authHeaders() });
    const rows = await res.json();
    if (!res.ok) throw new Error(rows.error);

    box.innerHTML = rows.length === 0
      ? '<p class="muted">Você ainda não publicou nenhum anúncio.</p>'
      : rows.map(p => `
          <div class="tx-row">
            <div>
              <strong>${esc(p.title)}</strong>
              <div class="muted small">${p.cr} CR · ${esc(p.category)}</div>
            </div>
            <button class="icon-btn" title="Remover anúncio" onclick="removerProduto(${p.id})">🗑</button>
          </div>`).join('');
  } catch {
    box.innerHTML = '<p class="muted">Não foi possível carregar seus anúncios.</p>';
  }
}

async function removerProduto(id) {
  if (!confirm('Remover este anúncio?')) return;

  const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers: authHeaders() });
  const data = await res.json();

  if (!res.ok) {
    alert(data.error || 'Erro ao remover o anúncio.');
    return;
  }

  await carregarProdutos();
  await carregarMeusProdutos();
}

// AUTENTICAÇÃO REAL COM A API NODE/TYPESCRIPT (PORTA 3000)
async function carregarPerfil() {
  const token = localStorage.getItem('pixelvault_token');
  if (!token) {
    currentUser = null;
    document.getElementById('open-auth-btn').classList.remove('hidden');
    document.getElementById('user-hud').classList.add('hidden');
    document.getElementById('auth-forms').classList.remove('hidden');
    document.getElementById('profile-view').classList.add('hidden');
    updateDeckUI();
    renderProducts();
    return;
  }

  let res;
  try {
    res = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return;
  }

  if (!res.ok) {
    localStorage.removeItem('pixelvault_token');
    return carregarPerfil();
  }

  currentUser = await res.json();
  const isSeller = currentUser.role === 'seller';

  document.getElementById('nav-credits').textContent = currentUser.credits;
  document.getElementById('open-auth-btn').classList.add('hidden');
  document.getElementById('user-hud').classList.remove('hidden');

  document.getElementById('prof-username').textContent = currentUser.username;
  document.getElementById('prof-email').textContent = currentUser.email;
  document.getElementById('prof-credits').textContent = currentUser.credits;
  document.getElementById('prof-role').textContent = isSeller ? 'VENDEDOR' : 'CLIENTE';
  document.getElementById('become-seller-btn').classList.toggle('hidden', isSeller);
  document.getElementById('seller-panel').classList.toggle('hidden', !isSeller);

  document.getElementById('auth-forms').classList.add('hidden');
  document.getElementById('profile-view').classList.remove('hidden');
  document.getElementById('auth-modal-title').textContent = 'MEU PERFIL';

  updateDeckUI();
  renderProducts();
  carregarHistorico();
  carregarBiblioteca();
  if (isSeller) carregarMeusProdutos();
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  const statusEl = document.getElementById('auth-status');

  if (!res.ok) {
    statusEl.style.color = '#ef4444';
    statusEl.textContent = data.error || 'Erro ao entrar.';
    return;
  }

  localStorage.setItem('pixelvault_token', data.token);
  statusEl.style.color = '#00ff88';
  statusEl.textContent = 'Acesso liberado!';
  await carregarPerfil();
  setTimeout(() => document.getElementById('auth-modal').classList.add('hidden'), 600);
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('reg-username').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const role = document.getElementById('reg-seller').checked ? 'seller' : 'client';

  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, role }),
  });
  const data = await res.json();
  const statusEl = document.getElementById('auth-status');

  if (!res.ok) {
    statusEl.style.color = '#ef4444';
    statusEl.textContent = data.error || 'Erro ao cadastrar.';
    return;
  }

  statusEl.style.color = '#00ff88';
  statusEl.textContent = 'Conta criada! Faça login agora.';
  document.getElementById('tab-login').click();
});

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('pixelvault_token');
  document.getElementById('auth-modal-title').textContent = 'ACESSAR CONTA';
  carregarPerfil();
});

document.getElementById('become-seller-btn').addEventListener('click', async () => {
  const statusEl = document.getElementById('auth-status');
  const res = await fetch(`${API_URL}/users/become-seller`, { method: 'POST', headers: authHeaders() });
  const data = await res.json();

  if (!res.ok) {
    statusEl.style.color = '#ef4444';
    statusEl.textContent = data.error || 'Erro ao virar vendedor.';
    return;
  }

  statusEl.style.color = '#00ff88';
  statusEl.textContent = 'Agora você é vendedor!';
  await carregarPerfil();
});

document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const statusEl = document.getElementById('auth-status');

  const body = {
    title: document.getElementById('prod-title').value,
    category: document.getElementById('prod-category').value,
    platform: document.getElementById('prod-platform').value,
    cr: Number(document.getElementById('prod-cr').value),
    img: document.getElementById('prod-img').value,
  };

  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json();

  if (!res.ok) {
    statusEl.style.color = '#ef4444';
    statusEl.textContent = data.error || 'Erro ao publicar o anúncio.';
    return;
  }

  statusEl.style.color = '#00ff88';
  statusEl.textContent = 'Anúncio publicado!';
  e.target.reset();
  await carregarProdutos();
  await carregarMeusProdutos();
});

// EVENTOS DE INTERFACE
document.getElementById('search-input').addEventListener('input', renderProducts);
document.querySelectorAll('.pill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.cat;
    renderProducts();
  });
});

document.getElementById('open-auth-btn').onclick = () => document.getElementById('auth-modal').classList.remove('hidden');
document.getElementById('open-profile-btn').onclick = () => document.getElementById('auth-modal').classList.remove('hidden');
document.getElementById('close-auth-btn').onclick = () => document.getElementById('auth-modal').classList.add('hidden');

document.getElementById('tab-login').onclick = () => {
  document.getElementById('tab-login').classList.add('active');
  document.getElementById('tab-register').classList.remove('active');
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('register-form').classList.add('hidden');
};
document.getElementById('tab-register').onclick = () => {
  document.getElementById('tab-register').classList.add('active');
  document.getElementById('tab-login').classList.remove('active');
  document.getElementById('register-form').classList.remove('hidden');
  document.getElementById('login-form').classList.add('hidden');
};

document.getElementById('open-deck-btn').onclick = () => document.getElementById('deck-drawer').classList.remove('hidden');
document.getElementById('hero-deck-btn').onclick = () => document.getElementById('deck-drawer').classList.remove('hidden');
document.getElementById('close-deck-btn').onclick = () => document.getElementById('deck-drawer').classList.add('hidden');
document.getElementById('close-deck-backdrop').onclick = () => document.getElementById('deck-drawer').classList.add('hidden');

document.getElementById('open-checkout-btn').onclick = () => {
  if (!currentUser) {
    document.getElementById('deck-drawer').classList.add('hidden');
    document.getElementById('auth-modal').classList.remove('hidden');
    return;
  }
  if (deck.length === 0) return;

  const total = deck.reduce((acc, i) => acc + i.cr, 0);
  document.getElementById('checkout-saldo').textContent = currentUser.credits;
  document.getElementById('checkout-items-text').textContent = `${deck.length} itens digitais · Entrega imediata`;
  document.getElementById('checkout-total').textContent = `${total} CR`;
  document.getElementById('checkout-msg').textContent = '';

  document.getElementById('deck-drawer').classList.add('hidden');
  document.getElementById('checkout-modal').classList.remove('hidden');
};

document.getElementById('close-checkout-btn').onclick = () => document.getElementById('checkout-modal').classList.add('hidden');

// CHECKOUT REAL CONECTADO AO BACK-END (POST /orders/checkout)
document.getElementById('confirm-purchase-btn').onclick = async () => {
  const token = localStorage.getItem('pixelvault_token');
  const msg = document.getElementById('checkout-msg');
  const btn = document.getElementById('confirm-purchase-btn');

  if (!token) {
    msg.style.color = '#ef4444';
    msg.textContent = 'Faça login antes de finalizar a compra.';
    return;
  }

  if (deck.length === 0) return;

  const total = deck.reduce((acc, i) => acc + i.cr, 0);
  if (currentUser && currentUser.credits < total) {
    msg.style.color = '#ef4444';
    msg.textContent = `Créditos insuficientes (${currentUser.credits} CR disponíveis).`;
    return;
  }

  btn.disabled = true;
  btn.textContent = 'PROCESSANDO...';

  try {
    const productIds = deck.map(item => item.id);
    const res = await fetch(`${API_URL}/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productIds }),
    });

    const data = await res.json();

    if (!res.ok) {
      msg.style.color = '#ef4444';
      msg.textContent = data.error || 'Erro ao finalizar compra.';
      return;
    }

    msg.style.color = '#00ff88';
    msg.textContent = `Compra #${data.orderId} confirmada! Novo saldo: ${data.newBalance} CR`;
    deck = [];
    await carregarPerfil();

    setTimeout(() => {
      msg.textContent = '';
      document.getElementById('checkout-modal').classList.add('hidden');
    }, 1500);
  } catch (err) {
    msg.style.color = '#ef4444';
    msg.textContent = 'Erro de conexão com o servidor (porta 3000).';
  } finally {
    btn.disabled = false;
    btn.textContent = '🔒 CONFIRMAR COMPRA';
  }
};

carregarProdutos();
carregarPerfil();
