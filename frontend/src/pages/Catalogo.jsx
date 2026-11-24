import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/mockProducts';
import ProductCard from '../components/ProductCard';

export default function Catalogo({
  searchTerm,
  selectedCategory,
  setSelectedCategory,
  onlyOffers,
  setOnlyOffers,
  onAddToCart
}) {
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.specs.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === 'Todos os produtos' || item.category === selectedCategory;
    const matchesStatus =
      statusFilter === 'all' || (statusFilter === 'inStock' && item.inStock);
    const matchesOffers = !onlyOffers || Boolean(item.discount);
    return matchesSearch && matchesCat && matchesStatus && matchesOffers;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 pt-6">
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0C1430] via-[#101C42] to-[#0B122B] border border-slate-800/80 grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <span className="text-[11px] font-bold tracking-widest text-blue-400 uppercase mb-3">
            HARDWARE DE ELITE. PREÇO DE OUTRO NÍVEL.
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Seu próximo nível começa com um upgrade.
          </h1>
          <p className="text-sm text-slate-400 mt-3">
            Até 25% OFF + 10% de desconto no Pix.
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setOnlyOffers(true);
                document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 bg-[#0044FF] hover:bg-[#0037CC] text-white text-xs font-semibold px-5 py-3 rounded-lg transition cursor-pointer"
            >
              Explorar ofertas <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="h-64 lg:h-auto relative">
          <img
            src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=900&q=80"
            alt="Setup Gamer PixelVault"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101C42] via-transparent to-transparent hidden lg:block" />
        </div>
      </section>

      <section id="catalogo" className="mt-10 scroll-mt-32">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {onlyOffers ? "Ofertas da Semana" : "Encontre seu próximo upgrade"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {onlyOffers
                ? "Descontos selecionados + 10% OFF extra no Pix."
                : "Performance para jogar. Liberdade para escolher."}
            </p>
          </div>
          <span className="text-xs text-slate-400">{filteredProducts.length} produtos encontrados</span>
        </div>

        <div className="bg-[#0E1630] border border-slate-800/80 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end mb-8">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1.5">Categoria</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setOnlyOffers(false);
                setSelectedCategory(e.target.value);
              }}
              className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0044FF]"
            >
              <option value="Todos os produtos">Todas as categorias</option>
              <option value="Computadores">Computadores</option>
              <option value="Hardware">Hardware</option>
              <option value="Periféricos">Periféricos</option>
              <option value="Jogos Digitais">Jogos Digitais</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1.5">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0044FF]"
            >
              <option value="all">Disponível e indisponível</option>
              <option value="inStock">Somente em estoque</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1.5">Ordenar por</label>
            <select className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0044FF]">
              <option>Mais relevantes</option>
              <option>Menor preço</option>
              <option>Maior desconto</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('Todos os produtos');
              setStatusFilter('all');
              setOnlyOffers(false);
            }}
            className="w-full bg-[#162144] hover:bg-[#1E2C59] text-slate-200 text-xs font-medium py-2 px-4 rounded-lg border border-slate-700/60 transition cursor-pointer"
          >
            Limpar filtros
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>
    </main>
  );
}
