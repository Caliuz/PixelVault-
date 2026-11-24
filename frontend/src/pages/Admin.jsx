import { useState } from 'react';
import { Plus, Download, Check, X, Star } from 'lucide-react';
import { PRODUCTS } from '../data/mockProducts';

export default function Admin() {
  const [orders, setOrders] = useState([
    { id: '#PV-1047', client: 'Rafael Almeida', product: 'RTX 4060 8 GB', total: 'R$ 1.979,10', status: 'Aguardando Pix' },
    { id: '#PV-1046', client: 'Marina Costa', product: 'Headset Nebula Pro 7.1', total: 'R$ 269,91', status: 'Pago' },
    { id: '#PV-1045', client: 'João Santos', product: 'PC Gamer Vault X', total: 'R$ 5.399,10', status: 'Aguardando Pix' },
    { id: '#PV-1044', client: 'Ana Ribeiro', product: 'Teclado Phantom', total: 'R$ 314,91', status: 'Pago' }
  ]);

  const [reviews, setReviews] = useState([
    { id: 1, user: 'Pedro Lima', product: 'Placa de vídeo RTX 4060', text: '"Chegou rápido e o desempenho é excelente!"', img: PRODUCTS[0].image },
    { id: 2, user: 'Camila Souza', product: 'Headset Nebula Pro 7.1', text: '"Áudio muito bom. Confortável para jogar por horas."', img: PRODUCTS[2].image }
  ]);

  const approveOrder = (id) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: 'Pago' } : o)));
  };

  const handleReview = (id) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  return (
    <main className="max-w-7xl mx-auto px-4 pt-6 space-y-10">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-slate-400">Administração / Visão geral</span>
          <h1 className="text-3xl font-bold text-white mt-1">Central de comando.</h1>
          <p className="text-xs text-slate-400">Tudo sob controle. Sem perder o ritmo.</p>
        </div>

        <div className="flex gap-3">
          <button className="bg-[#E11D48] hover:bg-[#be123c] text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-4 h-4" /> Registrar Venda WhatsApp
          </button>
          <button className="bg-[#162144] hover:bg-[#1E2C59] text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-slate-700/70 flex items-center gap-1.5 cursor-pointer">
            <Download className="w-4 h-4" /> Exportar Relatório PDF
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total de Vendas', value: 'R$ 38.420,90', sub: 'Acumulado de novembro' },
          { label: 'Pedidos WhatsApp', value: '47', sub: 'Pedidos recebidos no mês' },
          { label: 'Produtos Ativos', value: '128', sub: 'Disponíveis no catálogo' },
          { label: 'Avaliações Pendentes', value: String(reviews.length), sub: 'Aguardando sua aprovação' }
        ].map((kpi) => (
          <div key={kpi.label} className="bg-[#0E1630] border border-slate-800/80 rounded-xl p-5">
            <span className="text-xs text-slate-400">{kpi.label}</span>
            <div className="text-2xl font-extrabold text-white mt-1">{kpi.value}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">{kpi.sub}</span>
          </div>
        ))}
      </div>

      {/* Tabela de Pedidos */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4">Gerenciar pedidos e produtos</h2>
        <div className="bg-[#0E1630] border border-slate-800/80 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 bg-[#0B1126]">
              <tr>
                <th className="p-4">Pedido</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Produto</th>
                <th className="p-4">Total</th>
                <th className="p-4">Pagamento</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#131C3A]/40">
                  <td className="p-4 font-bold text-blue-400">{order.id}</td>
                  <td className="p-4 text-white">{order.client}</td>
                  <td className="p-4 text-slate-300">{order.product}</td>
                  <td className="p-4 font-bold text-white">{order.total}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                        order.status === 'Pago'
                          ? 'bg-[#0D3B2E] text-[#34D399]'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {order.status !== 'Pago' && (
                      <button
                        onClick={() => approveOrder(order.id)}
                        className="bg-[#0D3B2E] hover:bg-[#135240] text-[#34D399] px-3 py-1 rounded font-semibold cursor-pointer"
                      >
                        Aprovar
                      </button>
                    )}
                    <button className="bg-[#162144] text-slate-300 px-3 py-1 rounded">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Avaliações Pendentes */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Avaliações Pendentes</h2>
          <span className="text-xs text-slate-400">{reviews.length} aguardando moderação</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-[#0E1630] border border-slate-800/80 rounded-xl p-5 flex gap-4 items-center">
              <img src={rev.img} alt={rev.product} className="w-20 h-20 rounded-lg object-cover" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">{rev.user}</h4>
                <p className="text-[11px] text-slate-400">{rev.product}</p>
                <div className="flex text-amber-400 my-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400" />)}
                </div>
                <p className="text-xs text-slate-300 italic">{rev.text}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleReview(rev.id)}
                    className="bg-[#0D3B2E] hover:bg-[#135240] text-[#34D399] text-xs font-semibold px-3 py-1 rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Aprovar
                  </button>
                  <button
                    onClick={() => handleReview(rev.id)}
                    className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold px-3 py-1 rounded flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Reprovar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
