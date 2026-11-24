import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowLeft, Check } from 'lucide-react';
import { PRODUCTS } from '../data/mockProducts';

export default function Sacola({ cart, onRemoveFromCart }) {
  const items = cart.length > 0 ? cart : [PRODUCTS[0], PRODUCTS[1]];
  const [payment, setPayment] = useState('pix');
  const [cep, setCep] = useState('01310-100');

  const subtotal = items.reduce((acc, item) => acc + item.oldPrice, 0);
  const frete = 24.90;
  const descontoPix = payment === 'pix' ? subtotal * 0.10 : 0;
  const total = subtotal + frete - descontoPix;

  const handleWhatsApp = () => {
    const lista = items.map((i) => `• ${i.name}`).join('%0A');
    const msg = `Olá PixelVault! Quero finalizar meu pedido:%0A${lista}%0ATotal: R$ ${total.toFixed(2)}`;
    window.open(`https://wa.me/5548999999999?text=${msg}`, '_blank');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 pt-6">
      <div className="text-xs text-slate-400 mb-4">
        <Link to="/" className="hover:text-white">Início</Link> / <span className="text-slate-200">Sacola</span>
      </div>

      <h1 className="text-3xl font-bold text-white">Sua próxima conquista está aqui.</h1>
      <p className="text-xs text-slate-400 mt-1">Revise os itens e finalize seu pedido com a gente.</p>

      {/* Etapas */}
      <div className="flex gap-8 text-xs mt-6 pb-4 border-b border-slate-800/80">
        <span className="text-white font-semibold border-b-2 border-[#0044FF] pb-4 -mb-4">01 Sacola</span>
        <span className="text-slate-500">02 Atendimento WhatsApp</span>
        <span className="text-slate-500">03 Pedido confirmado</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Lista de Itens */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0E1630] border border-slate-800/80 rounded-xl p-5">
            <div className="grid grid-cols-12 text-[11px] text-slate-400 pb-3 border-b border-slate-800/80">
              <div className="col-span-7">Produto</div>
              <div className="col-span-2 text-center">Quantidade</div>
              <div className="col-span-3 text-right">Valor</div>
            </div>

            <div className="divide-y divide-slate-800/80">
              {items.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="py-4 grid grid-cols-12 items-center gap-3">
                  <div className="col-span-7 flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-16 h-14 rounded-lg object-cover bg-[#090E20]" />
                    <div>
                      <h3 className="text-xs font-semibold text-white">{item.name}</h3>
                      <p className="text-[11px] text-slate-400">{item.specs}</p>
                      <button
                        onClick={() => onRemoveFromCart(idx)}
                        className="text-[11px] text-rose-400 hover:underline mt-1 cursor-pointer"
                      >
                        Remover item
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <div className="inline-flex items-center bg-[#131C3A] border border-slate-700/70 rounded-lg text-xs">
                      <span className="px-2.5 py-1 text-slate-400">-</span>
                      <span className="px-2 py-1 text-white font-semibold">1</span>
                      <span className="px-2.5 py-1 text-slate-400">+</span>
                    </div>
                  </div>

                  <div className="col-span-3 text-right text-xs font-bold text-white">
                    R$ {item.oldPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Frete */}
          <div className="bg-[#0E1630] border border-slate-800/80 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white">Onde você vai jogar?</h3>
            <p className="text-xs text-slate-400 mt-0.5">Informe o CEP para consultar a entrega.</p>
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="flex-1 bg-[#131C3A] border border-slate-700/70 rounded-lg px-3.5 py-2 text-xs text-white"
              />
              <button className="bg-[#162144] text-white text-xs font-medium px-5 py-2 rounded-lg border border-slate-700/60">
                Calcular frete
              </button>
            </div>
            <div className="flex justify-between text-xs mt-3 pt-3 border-t border-slate-800/80">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#10B981]" /> Entrega padrão: 3 a 5 dias úteis
              </span>
              <span className="font-bold text-white">R$ 24,90</span>
            </div>
          </div>

          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" /> Continuar comprando
          </Link>
        </div>

        {/* Resumo do Pedido */}
        <div className="lg:col-span-5">
          <div className="bg-[#0E1630] border border-slate-800/80 rounded-xl p-6">
            <h2 className="text-base font-bold text-white mb-4">Resumo do pedido</h2>

            <div className="space-y-2.5 text-xs border-b border-slate-800/80 pb-4">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal ({items.length} itens)</span>
                <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Frete</span>
                <span>R$ {frete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="mt-4">
              <span className="block text-xs text-slate-300 mb-2">Forma de pagamento</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'pix', label: 'Pix', sub: '10% OFF' },
                  { id: 'cartao', label: 'Cartão', sub: 'Até 10x' },
                  { id: 'boleto', label: 'Boleto', sub: 'À vista' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPayment(opt.id)}
                    className={`p-2.5 rounded-lg text-left border transition cursor-pointer ${
                      payment === opt.id
                        ? 'bg-[#0044FF] border-[#0044FF] text-white'
                        : 'bg-[#131C3A] border-slate-700/70 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div className="text-[10px] opacity-80">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {payment === 'pix' && (
              <div className="flex justify-between text-xs text-[#34D399] mt-4">
                <span>Desconto no Pix (10%)</span>
                <span>- R$ {descontoPix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-slate-800/80">
              <span className="text-sm font-bold text-white">Total</span>
              <span className="text-2xl font-extrabold text-white">
                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <button
              onClick={handleWhatsApp}
              className="mt-5 w-full bg-[#E11D48] hover:bg-[#be123c] text-white font-semibold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> Finalizar Pedido via WhatsApp
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-3">
              Você será direcionado ao WhatsApp para confirmar seus dados e combinar o pagamento.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
