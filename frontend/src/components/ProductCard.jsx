import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-[#0E1630] border border-slate-800/80 rounded-xl overflow-hidden flex flex-col hover:border-slate-700 transition group">
      <Link to={`/produto/${product.id}`} className="relative h-48 bg-[#090E20] overflow-hidden block">
        {product.inStock && product.discount ? (
          <span className="absolute top-3 left-3 z-10 bg-[#E11D48] text-white text-[11px] font-bold px-2 py-0.5 rounded">
            {product.discount}
          </span>
        ) : (
          <span className="absolute top-3 left-3 z-10 bg-slate-800/90 text-slate-300 text-[11px] font-medium px-2.5 py-0.5 rounded">
            Indisponível / Sem Estoque
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition duration-300 ${
            !product.inStock ? 'opacity-40 grayscale' : ''
          }`}
        />
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/produto/${product.id}`} className="font-semibold text-white text-sm hover:text-blue-400 transition">
            {product.name}
          </Link>
          <p className="text-xs text-slate-400 mt-1">{product.specs}</p>

          <div className="mt-4">
            <span className="text-xs text-slate-500 line-through block">
              R$ {product.oldPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xl font-bold text-white block mt-0.5">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-slate-400">no Pix • 10% OFF</span>
          </div>
        </div>

        <button
          disabled={!product.inStock}
          onClick={() => onAddToCart(product)}
          className={`mt-4 w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            product.inStock
              ? 'bg-[#0044FF] hover:bg-[#0037CC] text-white cursor-pointer'
              : 'bg-slate-800/70 text-slate-500 cursor-not-allowed'
          }`}
        >
          {product.inStock ? (
            <>
              <Plus className="w-3.5 h-3.5" /> Adicionar à Sacola
            </>
          ) : (
            'Indisponível'
          )}
        </button>
      </div>
    </div>
  );
}
