import { useState, Suspense, lazy, useEffect, useMemo, useCallback } from 'react';

// Register service worker for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { FlowerCard } from './components/FlowerCard';
import { useFlowers } from './hooks/useFlowers';
import { useCart } from './hooks/useCart';
import { sendToWhatsApp } from './utils/whatsapp';
import { CheckoutData } from './components/CheckoutForm';
import { Loader2, Sparkles, Zap } from 'lucide-react';
import { Flower, CartAccessory } from './lib/types';

// Screen reader utilities
const srOnly = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  .sr-only:focus {
    position: static;
    width: auto;
    height: auto;
    padding: 0.5rem 1rem;
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
    background: white;
    border: 2px solid #ec4899;
    border-radius: 0.25rem;
    z-index: 9999;
  }
`;

// Lazy load non-critical components with dynamic imports
const Carousel = lazy(() => import('./components/Carousel').then(module => ({ default: module.Carousel })));
const CartComponent = lazy(() => import('./components/Cart').then(module => ({ default: module.Cart })));
const AccessoryModalComponent = lazy(() => import('./components/AccessoryModal').then(module => ({ default: module.AccessoryModal })));


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

  // Optimized performance monitoring for main thread blocking
  useEffect(() => {
    // Break down observer setup to avoid long tasks
    const setupObserver = () => {
      const observer = new PerformanceObserver((list) => {
        // Process entries asynchronously to avoid blocking
        setTimeout(() => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.duration > 50) {
              console.log('[Main Thread Block]', {
                name: entry.name,
                duration: entry.duration,
                startTime: entry.startTime,
                type: entry.entryType
              });
            }
          });
        }, 0);
      });

      observer.observe({ entryTypes: ['longtask'] });
      return observer;
    };

    // Setup input monitoring with debouncing
    let inputTimeout: number;
    let lastInputTime = 0;

    const handleInput = () => {
      const now = performance.now();
      clearTimeout(inputTimeout);
      inputTimeout = window.setTimeout(() => {
        const delay = now - lastInputTime;
        if (delay > 100) {
          console.log('[Input Delay]', { delay, timestamp: now });
        }
        lastInputTime = now;
      }, 16);
    };

    // Schedule setup asynchronously
    const timer = setTimeout(() => {
      const observer = setupObserver();
      document.addEventListener('click', handleInput, { passive: true });
      document.addEventListener('keydown', handleInput, { passive: true });

      return () => {
        observer.disconnect();
        document.removeEventListener('click', handleInput);
        document.removeEventListener('keydown', handleInput);
        clearTimeout(inputTimeout);
      };
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccessoryModalOpen, setIsAccessoryModalOpen] = useState(false);
  const [selectedFlowerForAccessory, setSelectedFlowerForAccessory] = useState<Flower | null>(null);
  const [selectedAccessories, setSelectedAccessories] = useState<CartAccessory[]>([]);

  // Memoize expensive filtering operation
  const filteredFlowers = useMemo(() => {
    return selectedCategory
      ? flowers.filter(flower => flower.category_id === selectedCategory)
      : flowers;
  }, [flowers, selectedCategory]);

  const handleSendWhatsApp = useCallback((checkoutData: CheckoutData) => {
    if (cart.length > 0) {
      sendToWhatsApp(cart, WHATSAPP_NUMBER, checkoutData);
      clearCart();
      setIsCartOpen(false);
    }
  }, [cart, clearCart]);

  // Reset cart on page load and when page becomes visible
  useEffect(() => {
    const resetCart = () => {
      localStorage.removeItem('flower-cart');
    };

    // Reset immediately
    resetCart();

    // Also reset when page becomes visible (user switches tabs)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        resetCart();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleAddToCart = useCallback((flower: Flower) => {
    // Siempre mostrar modal de accesorios para ramos y macetas, incluso si ya hay uno en el carrito
    if (flower.category_id === '2' || flower.category_id === '3' || flower.category_id === '4') {
      setSelectedFlowerForAccessory(flower);
      setSelectedAccessories([]);
      setIsAccessoryModalOpen(true);
    } else {
      addToCart(flower);
    }
  }, [addToCart]);

  const handleAccessoryConfirm = useCallback(() => {
    if (selectedFlowerForAccessory) {
      addToCart(selectedFlowerForAccessory, selectedAccessories.length > 0 ? selectedAccessories : undefined);
      setIsAccessoryModalOpen(false);
      setSelectedFlowerForAccessory(null);
      setSelectedAccessories([]);
    }
  }, [selectedFlowerForAccessory, selectedAccessories, addToCart]);

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
    <>
      <style>{srOnly}</style>
      <div className="min-h-screen bg-white">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-pink-500 text-white px-4 py-2 rounded z-50">
          Saltar al contenido principal
        </a>
        <Header cartItemsCount={getTotalItems()} onOpenCart={() => setIsCartOpen(true)} />

      <Suspense fallback={
        <div className="h-[600px] flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50"
             style={{ contain: 'layout style paint' }}>
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-pink-500/30 rounded-full blur-2xl animate-pulse" />
              <Loader2 size={64} className="relative animate-spin text-pink-400" />
            </div>
            <p className="text-pink-600 text-xl font-bold">Cargando carrusel...</p>
          </div>
        </div>
      }>
        <Carousel />
      </Suspense>

      {/* Defer non-critical content with reduced layout shift */}
      <div style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '600px',
        contain: 'layout style paint'
      } as React.CSSProperties}>


      </div>

      <main id="main-content" className="relative z-20 pt-8" role="main">
        <div className="container mx-auto px-4 pb-16">
          <div className="mb-8 text-center">
            <div className="relative inline-block" style={{ minHeight: '120px' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl blur-xl" />
              <div className="relative bg-gradient-to-br from-pink-50/90 to-rose-50/90 backdrop-blur-sm rounded-2xl p-6 border border-pink-300/50 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-2xl pointer-events-none" />
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles size={20} className="text-pink-400" />
                  <h2 className="text-xl font-bold text-pink-800">
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
              <p className="text-gray-700 text-2xl font-semibold">No hay flores disponibles en esta categoría</p>
              <p className="text-gray-800 mt-2">Selecciona otra categoría para ver más productos</p>
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

      <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" style={{ contain: 'layout style paint' }}><Loader2 className="animate-spin text-white" size={32} /></div>}>
        <CartComponent
          cart={cart}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onRemoveAccessory={removeAccessory}
          onSendWhatsApp={handleSendWhatsApp}
          totalPrice={getTotalPrice()}
        />
      </Suspense>

      <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" style={{ contain: 'layout style paint' }}><Loader2 className="animate-spin text-white" size={32} /></div>}>
        <AccessoryModalComponent
          isOpen={isAccessoryModalOpen}
          onClose={() => setIsAccessoryModalOpen(false)}
          accessories={accessories}
          onSelectAccessories={setSelectedAccessories}
          selectedAccessories={selectedAccessories}
          onConfirm={handleAccessoryConfirm}
        />
      </Suspense>

      <footer className="relative bg-gradient-to-t from-pink-100 via-rose-50 to-pink-50 text-pink-800 py-12 mt-20 border-t border-pink-300/50" role="contentinfo">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 pointer-events-none" />
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 pointer-events-none" />
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <div className="mb-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <Sparkles className="text-pink-400" size={28} aria-hidden="true" />
              <h3 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-rose-300">
                Creaciones Isis
              </h3>
              <Sparkles className="text-pink-400" size={28} aria-hidden="true" />
            </div>
            <p className="text-pink-600 font-medium tracking-wide">Experiencia Floral Futurista</p>
          </div>

          <div className="border-t border-pink-500/20 pt-6 mt-6">
            <p className="text-pink-700 font-medium">© 2025 Floristería Creaciones Isis. Todos los derechos reservados.</p>
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
    </>
  );
}

export default App;
