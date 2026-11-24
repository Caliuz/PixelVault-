import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/conta');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 pt-6">
      <div className="text-xs text-slate-400 mb-4">Início / <span className="text-slate-200">Minha conta</span></div>

      <h1 className="text-3xl font-bold text-white">Seu acesso ao próximo nível.</h1>
      <p className="text-xs text-slate-400 mt-1">Entre na sua conta ou faça parte da PixelVault.</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        {/* Login */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSubmit} className="bg-[#0E1630] border border-slate-800/80 rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Já sou da party</h2>
              <p className="text-xs text-slate-400">Acesse seus pedidos e seus jogos em um só lugar.</p>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">E-mail</label>
              <input
                type="email"
                defaultValue="lucas.ferreira@email.com"
                className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3.5 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Senha</label>
              <input
                type="password"
                defaultValue="12345678"
                className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3.5 py-2.5 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0044FF] hover:bg-[#0037CC] text-white font-semibold text-xs py-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
            >
              Entrar na minha conta <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="bg-[#0E1630] border border-slate-800/80 rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80"
              alt="Setup"
              className="w-full h-36 object-cover"
            />
            <div className="p-5">
              <h3 className="text-sm font-bold text-white">Uma conta. Infinitas possibilidades.</h3>
              <ul className="space-y-1.5 text-xs text-slate-400 mt-3">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#10B981]" /> Acompanhe cada entrega</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#10B981]" /> Acesse seus códigos digitais</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#10B981]" /> Avalie os seus upgrades</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cadastro */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-[#0E1630] border border-slate-800/80 rounded-xl p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white">Novo por aqui? Crie sua conta.</h2>
            <p className="text-xs text-slate-400">Só alguns dados para começar a sua próxima conquista.</p>
          </div>

          <div className="space-y-3 text-xs">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">01 DADOS PESSOAIS</span>
            <div>
              <label className="block text-slate-300 mb-1">Nome completo</label>
              <input type="text" placeholder="Como podemos chamar você?" className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3.5 py-2.5 text-white" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">E-mail</label>
                <input type="email" placeholder="seunome@email.com" className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3.5 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">CPF</label>
                <input type="text" placeholder="000.000.000-00" className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3.5 py-2.5 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs pt-2">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">02 ENDEREÇO DE ENTREGA</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">CEP</label>
                <input type="text" placeholder="00000-000" className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3.5 py-2.5 text-white" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-300 mb-1">Endereço</label>
                <input type="text" placeholder="Rua, avenida ou alameda" className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3.5 py-2.5 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Número</label>
                <input type="text" placeholder="Nº" className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3.5 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Bairro</label>
                <input type="text" placeholder="Seu bairro" className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3.5 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Cidade</label>
                <input type="text" placeholder="Sua cidade" className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3.5 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Estado</label>
                <input type="text" placeholder="UF" className="w-full bg-[#131C3A] border border-slate-700/70 rounded-lg px-3.5 py-2.5 text-white" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0044FF] hover:bg-[#0037CC] text-white font-semibold text-xs py-3 rounded-lg transition cursor-pointer"
          >
            Criar minha conta
          </button>
        </form>
      </div>
    </main>
  );
}
