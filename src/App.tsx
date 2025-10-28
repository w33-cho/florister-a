import { useState } from 'react';
import { Header } from './components/Header';
import { Carousel } from './components/Carousel';
import { CategoryFilter } from './components/CategoryFilter';
import { FlowerCard } from './components/FlowerCard';
import { Cart } from './components/Cart';
import { AccessoryModal } from './components/AccessoryModal';
import { useFlowers } from './hooks/useFlowers';
import { useCart } from './hooks/useCart';
import { sendToWhatsApp } from './utils/whatsapp';
import { CheckoutData } from './components/CheckoutForm';
import { Loader2, Sparkles, Zap } from 'lucide-react';
import { Flower, Accessory, CartAccessory } from './lib/types';

const WHATSAPP_NUMBER = '5358702873';

function App() {
  const { flowers, categories, accessories, loading } = useFlowers();
  const {
    cart,
    addToCart,
    removeFromCart,
    removeAccessory,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccessoryModalOpen, setIsAccessoryModalOpen] = useState(false);
  const [selectedFlowerForAccessory, setSelectedFlowerForAccessory] = useState<Flower | null>(null);
  const [selectedAccessories, setSelectedAccessories] = useState<CartAccessory[]>([]);

  const filteredFlowers = selectedCategory
    ? flowers.filter(flower => flower.category_id === selectedCategory)
    : flowers;

  const handleSendWhatsApp = (checkoutData: CheckoutData) => {
    if (cart.length > 0) {
      sendToWhatsApp(cart, WHATSAPP_NUMBER, checkoutData);
      clearCart();
      setIsCartOpen(false);
    }
  };

  const handleAddToCart = (flower: Flower) => {
    // Siempre mostrar modal de accesorios para ramos y macetas, incluso si ya hay uno en el carrito
    if (flower.category_id === '2' || flower.category_id === '3' || flower.category_id === '4') {
      setSelectedFlowerForAccessory(flower);
      setSelectedAccessories([]);
      setIsAccessoryModalOpen(true);
    } else {
      addToCart(flower);
    }
  };

  const handleAccessoryConfirm = () => {
    if (selectedFlowerForAccessory) {
      addToCart(selectedFlowerForAccessory, selectedAccessories.length > 0 ? selectedAccessories : undefined);
      setIsAccessoryModalOpen(false);
      setSelectedFlowerForAccessory(null);
      setSelectedAccessories([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-pink-500/30 rounded-full blur-2xl animate-pulse" />
            <Loader2 size={64} className="relative animate-spin text-pink-400" />
          </div>
          <p className="text-pink-600 text-xl font-bold">Cargando flores futurísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header cartItemsCount={getTotalItems()} onOpenCart={() => setIsCartOpen(true)} />

      <Carousel />

      <main className="relative z-20 pt-8">
        <div className="container mx-auto px-4 pb-16">
          <div className="mb-8 text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl blur-xl" />
              <div className="relative bg-gradient-to-br from-pink-50/90 to-rose-50/90 backdrop-blur-sm rounded-2xl p-6 border border-pink-300/50 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-2xl pointer-events-none" />
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles size={20} className="text-pink-400" />
                  <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-rose-300">
                    Información Importante
                  </h2>
                  <Sparkles size={20} className="text-pink-400" />
                </div>
                <p className="text-pink-700 text-sm leading-relaxed max-w-2xl mx-auto font-medium">
                  Los ramos se confeccionan agregando los diferentes accesorios según tu gusto.
                  El costo de los accesorios se agrega por separado al costo del ramo o maceta.
                </p>
              </div>
            </div>
          </div>

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {filteredFlowers.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-2xl" />
                <Zap size={80} className="relative text-pink-500/40 mx-auto" />
              </div>
              <p className="text-gray-400 text-2xl font-semibold">No hay flores disponibles en esta categoría</p>
              <p className="text-gray-600 mt-2">Selecciona otra categoría para ver más productos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredFlowers.map((flower, index) => (
                <div
                  key={flower.id}
                  style={{
                    animation: 'fadeInUp 0.6s ease-out',
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <FlowerCard
                    flower={flower}
                    quantity={cart.filter(item => item.id === flower.id).reduce((total, item) => total + item.quantity, 0)}
                    onUpdateQuantity={updateQuantity}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Cart
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onRemoveAccessory={removeAccessory}
        onSendWhatsApp={handleSendWhatsApp}
        totalPrice={getTotalPrice()}
      />

      <AccessoryModal
        isOpen={isAccessoryModalOpen}
        onClose={() => setIsAccessoryModalOpen(false)}
        accessories={accessories}
        onSelectAccessories={setSelectedAccessories}
        selectedAccessories={selectedAccessories}
        onConfirm={handleAccessoryConfirm}
      />

      <footer className="relative bg-gradient-to-t from-pink-100 via-rose-50 to-pink-50 text-pink-800 py-12 mt-20 border-t border-pink-300/50">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 pointer-events-none" />
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 pointer-events-none" />
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <div className="mb-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <Sparkles className="text-pink-400" size={28} />
              <h3 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-rose-300">
                Ramos Isis
              </h3>
              <Sparkles className="text-pink-400" size={28} />
            </div>
            <p className="text-pink-600 font-medium tracking-wide">Experiencia Floral Futurista</p>
          </div>

          <div className="border-t border-pink-500/20 pt-6 mt-6">
            <p className="text-pink-700 font-medium">© 2025 Floristería Ramos Isis. Todos los derechos reservados.</p>
            <p className="text-pink-600 text-sm mt-2 font-semibold">
              Contacto WhatsApp:{' '}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition-colors underline font-bold"
              >
                {WHATSAPP_NUMBER}
              </a>
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50" />
      </footer>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default App;
