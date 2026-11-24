import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';
import { PRODUCTS } from '../data/mockProducts';

export default function Conta() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('PVLT-98X2-K4M1');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 pt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Bem-vindo de volta, Lucas.</h1>
          <p className="text-xs text-slate-400 mt-1">Seus dados, suas conquistas e seus próximos upgrades.</p>
        </div>
        <Link to="/login" className="text-xs text-slate-400 hover:text-white">Sair da conta ↗</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Meus Dados */}
        <div className="lg:col-span-4 bg-[#0E1630] border border-slate-800/80 rounded-xl p-6 space-y-3 text-xs h-fit">
          <h2 className="text-base font-bold text-white">Meus dados</h2>
          <p className="text-slate-400 pb-2">Mantenha seu cadastro atualizado.</p>

          <div>
            <label className="block text-slate-400 mb-1">Nome completo</label>
            <input type="text" defaultValue="Lucas Ferreira" className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">E-mail</label>
            <input type="email" defaultValue="lucas.ferreira@email.com" className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">CEP</label>
            <input type="text" defaultValue="01310-100" className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Endereço</label>
            <input type="text" defaultValue="Av. Paulista, 1578 - Bela Vista" className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3 py-2 text-white" />
          </div>

          <button className="w-full bg-[#0044FF] hover:bg-[#0037CC] text-white font-semibold py-2.5 rounded-lg mt-2 cursor-pointer">
            Salvar alterações
          </button>
        </div>

        {/* Meus Pedidos */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Meus pedidos</h2>
            <span className="text-xs text-slate-400">3 pedidos encontrados</span>
          </div>

          {/* Jogo Digital com Key */}
          <div className="bg-[#0E1630] border border-blue-500/30 rounded-xl p-5 flex flex-col sm:flex-row gap-5 items-center">
            <img src={PRODUCTS[4].image} alt="Nebula" className="w-28 h-28 rounded-lg object-cover" />
            <div className="flex-1 w-full">
              <span className="text-[10px] font-bold text-blue-400 uppercase">JOGO DIGITAL • PEDIDO #PV-1041</span>
              <h3 className="text-lg font-bold text-white mt-0.5">Nebula: Edição Digital</h3>
              <p className="text-xs text-slate-400">Pago no Pix • 18 nov, 2026 • R$ 134,91</p>

              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 bg-[#090E20] border border-slate-700 rounded-lg px-3.5 py-2 font-mono text-xs text-white tracking-wider">
                  PVLT-98X2-K4M1
                </div>
                <button
                  onClick={handleCopy}
                  className="bg-[#0044FF] hover:bg-[#0037CC] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copiado!</> : <><Copy className="w-3.5 h-3.5" /> Copiar Código</>}
                </button>
              </div>
            </div>
          </div>

          {/* Pedido em Transporte */}
          <div className="bg-[#0E1630] border border-slate-800/80 rounded-xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={PRODUCTS[0].image} alt="RTX 4060" className="w-16 h-14 rounded-lg object-cover" />
              <div>
                <span className="text-[11px] text-slate-400">Pedido #PV-1038 • 10 nov, 2026</span>
                <h4 className="text-sm font-bold text-white">Placa de vídeo RTX 4060</h4>
                <p className="text-xs text-slate-400">Previsão de entrega: 25 nov, 2026</p>
              </div>
            </div>
            <div className="text-right">
              <span className="bg-blue-500/20 text-blue-300 text-[11px] font-semibold px-2.5 py-0.5 rounded">Em transporte</span>
              <div className="text-sm font-bold text-white mt-2">R$ 1.979,10</div>
            </div>
          </div>

          {/* Pedido Entregue */}
          <div className="bg-[#0E1630] border border-slate-800/80 rounded-xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={PRODUCTS[1].image} alt="Teclado" className="w-16 h-14 rounded-lg object-cover" />
              <div>
                <span className="text-[11px] text-slate-400">Pedido #PV-1029 • 03 nov, 2026</span>
                <h4 className="text-sm font-bold text-white">Teclado mecânico Phantom</h4>
                <p className="text-xs text-slate-400">Entregue em 08 nov, 2026</p>
              </div>
            </div>
            <div className="text-right">
              <span className="bg-[#0D3B2E] text-[#34D399] text-[11px] font-semibold px-2.5 py-0.5 rounded">Entregue</span>
              <div className="text-sm font-bold text-white mt-2">R$ 314,91</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
