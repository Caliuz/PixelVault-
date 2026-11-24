import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Check } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Catalogo from './pages/Catalogo';
import Produto from './pages/Produto';
import Sacola from './pages/Sacola';
import Auth from './pages/Auth';
import Conta from './pages/Conta';
import Admin from './pages/Admin';

export default function App() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos os produtos');
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [toast, setToast] = useState(false);

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const handleRemoveFromCart = (index) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#070B19] text-slate-100">
        <Navbar
          cartCount={cart.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onlyOffers={onlyOffers}
          setOnlyOffers={setOnlyOffers}
        />

        {toast && (
          <div className="fixed top-24 right-6 z-50 bg-[#0D3B2E] border border-[#10B981]/50 text-[#34D399] px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2 shadow-xl">
            <Check className="w-4 h-4" /> Ação realizada com sucesso!
          </div>
        )}

        <div className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <Catalogo
                  searchTerm={searchTerm}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  onlyOffers={onlyOffers}
                  setOnlyOffers={setOnlyOffers}
                  onAddToCart={handleAddToCart}
                />
              }
            />
            <Route path="/produto/:id" element={<Produto onAddToCart={handleAddToCart} />} />
            <Route path="/sacola" element={<Sacola cart={cart} onRemoveFromCart={handleRemoveFromCart} />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/conta" element={<Conta />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
