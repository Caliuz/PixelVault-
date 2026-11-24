import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#090E20] border-t border-slate-800/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-slate-400">
        <div>
          <h3 className="text-white font-bold text-base mb-1">PixelVault</h3>
          <p>Seu próximo nível começa aqui.</p>
          <div className="flex flex-wrap gap-4 mt-4 text-slate-500">
            <Link to="/" className="hover:text-slate-300">Privacidade</Link>
            <Link to="/" className="hover:text-slate-300">Termos de uso</Link>
            <Link to="/" className="hover:text-slate-300">Trocas e devoluções</Link>
            <Link to="/admin" className="text-slate-400 hover:text-blue-400 font-medium">Painel Admin</Link>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-1">Atendimento</h4>
          <p>WhatsApp • Seg. a sex., 9h às 18h</p>
        </div>

        <div className="md:text-right">
          <h4 className="text-white font-semibold mb-1">Compra segura. Jogo garantido.</h4>
          <p>© 2026 PixelVault. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
