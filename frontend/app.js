const API_URL = 'http://localhost:3000';

const PRODUCTS = [
  { id: 1, title: 'CyberPulse 2099', category: 'Jogo', platform: 'PC / CLOUD', tag: 'EM DESTAQUE', cr: 420, brl: 249.90, rating: '4.9', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=700&q=80' },
  { id: 2, title: 'Deriva Quântica', category: 'Jogo', platform: 'PC / CORRIDA', tag: 'LANÇAMENTO', cr: 300, brl: 179.90, rating: '4.7', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=700&q=80' },
  { id: 3, title: 'Neon Blade VR', category: 'Jogo', platform: 'PC / VR', tag: 'TOP AÇÃO', cr: 240, brl: 149.90, rating: '4.8', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=700&q=80' },
  { id: 4, title: 'Neural Link Headset', category: 'Hardware', platform: 'ÁUDIO 7.1', tag: 'HARDWARE', cr: 890, brl: 549.90, rating: '4.9', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80' },
  { id: 5, title: 'NeuroDeck Portátil', category: 'Hardware', platform: 'CONSOLE', tag: 'ED. LIMITADA', cr: 2400, brl: 1499.00, rating: '5.0', img: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=700&q=80' },
  { id: 6, title: 'Orbital Siege — Passe S7', category: 'Passe', platform: 'PC / CLOUD', tag: 'PASSE DE BATALHA', cr: 120, brl: 69.90, rating: '4.6', img: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=700&q=80' },
];

let currentUser = null;
let deck = [];
let activeCategory = 'Todos';

// RENDERIZA CATÁLOGO
function renderProducts() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'Todos' || p.category === activeCategory;
    const matchText = p.title.toLowerCase().includes(query) || p.platform.toLowerCase().includes(query);
    return matchCat && matchText;
  });

  document.getElementById('items-count').textContent = `${filtered.length} itens disponíveis`;
  const grid = document.getElementById('products-grid');
  grid.innerHTML = filtered.map(p => `
    <article class="product-card">
      <span class="tag-pill">${p.tag}</span>
      <img src="${p.img}" alt="${p.title}">
      <div class="product-body">
        <div class="product-meta"><span>${p.platform}</span><span>★ ${p.rating}</span></div>
        <h3>${p.title}</h3>
        <div class="product-footer">
          <div>
            <span class="price-cr">${p.cr} CR</span>
            <span class="price-brl">R$ ${p.brl.toFixed(2).replace('.', ',')}</span>
          </div>
          <button class="btn-add" onclick="addToDeck(${p.id})">+ DECK</button>
        </div>
      </div>
    </article>
  `).join('');
}

// DECK (CARRINHO)
function addToDeck(id) {
  const item = PRODUCTS.find(p => p.id === id);
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
  const totalBrl = deck.reduce((acc, item) => acc + item.brl, 0);
  const after = saldo - subtotal;

  document.getElementById('deck-saldo').textContent = saldo;
  document.getElementById('deck-subtotal').textContent = `${subtotal} CR`;
  document.getElementById('deck-brl').textContent = `R$ ${totalBrl.toFixed(2).replace('.', ',')}`;

  const afterEl = document.getElementById('deck-after');
  afterEl.textContent = `${after} CR`;
  afterEl.style.color = after < 0 ? '#ef4444' : '#00ff88';

  const container = document.getElementById('deck-items');
  container.innerHTML = deck.length === 0
    ? '<p class="muted">Seu deck está vazio. Adicione jogos do catálogo!</p>'
    : deck.map((item, idx) => `
        <div class="deck-item">
          <div>
            <strong>${item.title}</strong>
            <div class="accent">${item.cr} CR</div>
          </div>
          <button class="icon-btn" onclick="removeFromDeck(${idx})">✕</button>
        </div>
      `).join('');
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
    return;
  }

  const res = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    localStorage.removeItem('pixelvault_token');
    return carregarPerfil();
  }

  currentUser = await res.json();
  document.getElementById('nav-credits').textContent = currentUser.credits;
  document.getElementById('open-auth-btn').classList.add('hidden');
  document.getElementById('user-hud').classList.remove('hidden');

  document.getElementById('prof-username').textContent = currentUser.username;
  document.getElementById('prof-email').textContent = currentUser.email;
  document.getElementById('prof-credits').textContent = currentUser.credits;
  document.getElementById('auth-forms').classList.add('hidden');
  document.getElementById('profile-view').classList.remove('hidden');
  document.getElementById('auth-modal-title').textContent = 'MEU PERFIL';
  updateDeckUI();
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

  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
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

renderProducts();
carregarPerfil();