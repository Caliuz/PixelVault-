import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Star, Check, ShieldCheck, Upload } from 'lucide-react';
import { PRODUCTS } from '../data/mockProducts';

export default function Produto({ onAddToCart }) {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === Number(id)) || PRODUCTS[0];
  const [cep, setCep] = useState('01310-100');
  const [freteCalculado, setFreteCalculado] = useState(true);
  const [rating, setRating] = useState(0);

  return (
    <main className="max-w-7xl mx-auto px-4 pt-6">
      <div className="text-xs text-slate-400 mb-6 flex gap-2">
        <Link to="/" className="hover:text-white">Início</Link> /
        <span>{product.category}</span> /
        <span className="text-slate-200">{product.name}</span>
      </div>

      {/* Seção Principal do Produto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Galeria Esquerda */}
        <div className="lg:col-span-6">
          <div className="bg-[#0E1630] border border-slate-800/80 rounded-2xl overflow-hidden aspect-[4/3]">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {[1, 2, 3, 4].map((thumb) => (
              <div
                key={thumb}
                className={`h-20 rounded-lg overflow-hidden border-2 cursor-pointer ${
                  thumb === 1 ? 'border-[#0044FF]' : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={product.image} alt="Miniatura" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Imagens ilustrativas. Consulte as especificações.</p>
        </div>

        {/* Informações e Compra Direita */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-[#0D3B2E] text-[#34D399] text-[11px] font-semibold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              {product.inStock ? 'Em estoque' : 'Indisponível'}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white mt-3">{product.name}</h1>
          <p className="text-xs text-slate-400 mt-1.5">{product.specs}</p>

          <div className="flex items-center gap-2 mt-3 text-xs">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />)}
            </div>
            <span className="text-slate-300 font-medium">4,9 (28 avaliações)</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Cód. PV-4060-08</span>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2">
              {product.discount && (
                <span className="bg-[#E11D48] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                  {product.discount} OFF
                </span>
              )}
              <span className="text-xs text-slate-400 line-through">
                De R$ {product.oldPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="text-4xl font-extrabold text-white mt-1">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-300 mt-1">à vista no Pix com 10% de desconto</p>
            <p className="text-xs text-slate-400 mt-0.5">
              ou R$ {product.oldPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em até 10x sem juros
            </p>
          </div>

          <button
            disabled={!product.inStock}
            onClick={() => onAddToCart(product)}
            className="mt-6 w-full bg-[#0044FF] hover:bg-[#0037CC] disabled:bg-slate-800 text-white font-semibold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Adicionar à Sacola
          </button>

          {/* Frete */}
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <label className="block text-xs text-slate-300 mb-2">Calcule o frete pelo CEP</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="flex-1 bg-[#131C3A] border border-slate-700/70 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#0044FF]"
              />
              <button
                onClick={() => setFreteCalculado(true)}
                className="bg-[#162144] hover:bg-[#1E2C59] text-white text-xs font-medium px-5 py-2 rounded-lg border border-slate-700/60 transition cursor-pointer"
              >
                Calcular frete
              </button>
            </div>
            {freteCalculado && (
              <p className="text-xs text-slate-300 mt-2">
                Entrega em 3 a 5 dias úteis • <span className="font-bold text-white">R$ 24,90</span>
              </p>
            )}
            <div className="flex gap-6 mt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#10B981]" /> Compra segura</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Garantia de 12 meses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Avaliações de Clientes */}
      <section className="mt-16 pt-10 border-t border-slate-800/80">
        <h2 className="text-xl font-bold text-white mb-6">Avaliações de Clientes</h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Resumo Nota */}
          <div className="lg:col-span-3 bg-[#0E1630] border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="text-4xl font-extrabold text-white">4,9</div>
              <div className="flex text-amber-400 mt-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-400 mt-1">Baseado em 28 avaliações</p>

              <div className="space-y-2 mt-6 text-xs text-slate-400">
                {[
                  { star: '5★', pct: '85%' },
                  { star: '4★', pct: '12%' },
                  { star: '3★', pct: '3%' },
                  { star: '2★', pct: '0%' },
                  { star: '1★', pct: '0%' },
                ].map((row) => (
                  <div key={row.star} className="flex items-center gap-2">
                    <span className="w-6">{row.star}</span>
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0044FF]" style={{ width: row.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-6">100% de compras verificadas</p>
          </div>

          {/* Lista Comentários */}
          <div className="lg:col-span-5 space-y-4">
            {[
              {
                user: 'Lucas Ferreira',
                date: '18 nov, 2026',
                title: 'Excelente desempenho!',
                text: 'Rodando tudo no ultra em Full HD. Silenciosa e chegou antes do prazo.',
                likes: 12
              },
              {
                user: 'Marina Costa',
                date: '14 nov, 2026',
                title: 'O upgrade que faltava.',
                text: 'Instalação simples, temperaturas baixas e entrega muito bem embalada.',
                likes: 8
              }
            ].map((rev) => (
              <div key={rev.user} className="bg-[#0E1630] border border-slate-800/80 rounded-xl p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{rev.user}</h4>
                    <div className="flex text-amber-400 mt-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400" />)}
                    </div>
                  </div>
                  <div className="text-right text-[11px]">
                    <span className="text-[#34D399] block">✓ Compra verificada</span>
                    <span className="text-slate-500">{rev.date}</span>
                  </div>
                </div>
                <p className="text-xs font-bold text-white mt-3">{rev.title}</p>
                <p className="text-xs text-slate-400 mt-1">{rev.text}</p>
                <div className="text-right text-[11px] text-slate-500 mt-3">Útil ({rev.likes})</div>
              </div>
            ))}
          </div>

          {/* Formulário Avaliação */}
          <div className="lg:col-span-4 bg-[#0E1630] border border-slate-800/80 rounded-xl p-6">
            <h3 className="text-base font-bold text-white">Sua opinião importa</h3>
            <p className="text-xs text-slate-400 mt-1">Como foi sua experiência?</p>

            <div className="flex gap-1.5 my-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="cursor-pointer">
                  <Star className={`w-5 h-5 ${rating >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Título da avaliação</label>
                <input
                  type="text"
                  placeholder="Resuma sua experiência"
                  className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#0044FF]"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Comentário</label>
                <textarea
                  rows="3"
                  placeholder="Conte como foi usar este produto..."
                  className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#0044FF]"
                />
              </div>
              <div className="border border-dashed border-slate-700 rounded-lg p-3 text-center text-slate-400 cursor-pointer hover:border-slate-500">
                <Upload className="w-4 h-4 mx-auto mb-1" />
                <span>Clique para enviar uma foto</span>
              </div>
              <button className="w-full bg-[#0044FF] hover:bg-[#0037CC] text-white font-semibold py-2.5 rounded-lg transition cursor-pointer">
                Enviar avaliação
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
