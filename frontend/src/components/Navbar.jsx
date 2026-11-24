import { Search, User, ShoppingBag } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({
  cartCount,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onlyOffers,
  setOnlyOffers
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const storeCategories = [
    "Todos os produtos",
    "Computadores",
    "Hardware",
    "Periféricos",
    "Jogos Digitais"
  ];

  const adminTabs = [
    "Visão geral",
    "Pedidos",
    "Produtos",
    "Avaliações",
    "Logs do sistema"
  ];

  const handleSelectCategory = (cat) => {
    setOnlyOffers(false);
    setSelectedCategory(cat);
    if (location.pathname !== '/') {
      navigate('/');
    }
    setTimeout(() => {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  const handleOpenOffers = () => {
    setSelectedCategory('Todos os produtos');
    setOnlyOffers(true);
    if (location.pathname !== '/') {
      navigate('/');
    }
    setTimeout(() => {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  return (
    <header className="bg-[#0B1126] border-b border-slate-800/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">
        <Link
          to="/"
          onClick={() => {
            setSelectedCategory('Todos os produtos');
            setOnlyOffers(false);
          }}
          className="flex items-center gap-2.5 shrink-0"
        >
          <div className="w-8 h-8 rounded-md bg-[#0044FF] flex items-center justify-center font-bold text-white text-lg">
            P
          </div>
          <span className="font-bold text-xl tracking-tight text-white">PixelVault</span>
        </Link>

        <div className="flex-1 max-w-2xl relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (location.pathname !== '/' && !isAdmin) navigate('/');
            }}
            placeholder={
              isAdmin
                ? "Buscar pedido, cliente ou produto..."
                : "O próximo upgrade começa aqui. O que você procura?"
            }
            className="w-full bg-[#131C3A] border border-slate-700/60 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#0044FF]"
          />
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <Link to="/conta" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition">
            <User className="w-4 h-4" />
            <span>{isAdmin ? "Administrador" : "Minha conta"}</span>
          </Link>

          <Link to="/sacola" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition">
            <ShoppingBag className="w-4 h-4" />
            <span>Sacola</span>
            <span className="bg-[#0044FF] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Submenu dinâmico: Loja vs Admin */}
      <nav className="border-t border-slate-800/60 bg-[#090E20]">
        <div className="max-w-7xl mx-auto px-4 h-11 flex items-center justify-between text-xs font-medium overflow-x-auto">
          {isAdmin ? (
            <>
              <div className="flex items-center gap-8 shrink-0">
                {adminTabs.map((tab, i) => (
                  <span
                    key={tab}
                    className={i === 0 ? "text-white font-semibold" : "text-slate-400"}
                  >
                    {tab}
                  </span>
                ))}
              </div>
              <span className="text-[#FF2E63] font-semibold tracking-wider uppercase shrink-0 ml-4">
                PAINEL ADMINISTRATIVO
              </span>
            </>
          ) : (
            <>
              <div className="flex items-center gap-8 shrink-0">
                {storeCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleSelectCategory(cat)}
                    className={`transition cursor-pointer ${
                      !onlyOffers && selectedCategory === cat && location.pathname === '/'
                        ? "text-white font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button
                onClick={handleOpenOffers}
                className={`font-semibold tracking-wider uppercase shrink-0 ml-4 transition cursor-pointer ${
                  onlyOffers ? "text-white underline underline-offset-4" : "text-[#FF2E63] hover:text-[#ff527d]"
                }`}
              >
                OFERTAS DA SEMANA ↗
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
