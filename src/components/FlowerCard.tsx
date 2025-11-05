import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Flower, CartItem } from '../lib/types';
import { useState, useEffect } from 'react';

interface FlowerCardProps {
  flower: Flower;
  quantity: number;
  onUpdateQuantity: (flowerId: string, quantity: number) => void;
  onAddToCart: (flower: Flower) => void;
}

export function FlowerCard({ flower, quantity, onUpdateQuantity, onAddToCart }: FlowerCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Development helper: Reset cart on mount (remove in production)
  useEffect(() => {
    localStorage.removeItem('flower-cart');
  }, []);

  return (
    <div className="group relative" style={{ contain: 'layout style paint' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl overflow-hidden border border-pink-300/50 shadow-2xl shadow-pink-200/50 transform group-hover:scale-105 group-hover:border-pink-400/60 transition-all duration-500 h-[32rem] flex flex-col" style={{ contain: 'layout style' }}>
        <div className="relative h-64 overflow-hidden flex-shrink-0 bg-white" style={{ backgroundColor: 'white' }}>
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-pink-50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            </div>
          )}
          <img
            src={flower.image_url}
            alt={flower.name}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            className={`w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>

        <div className="p-6 bg-gradient-to-br from-pink-100/90 to-rose-100/90 backdrop-blur-sm flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-2 min-h-[3.5rem] flex items-center">
            {flower.name}
          </h3>
          <p className="text-gray-700 text-sm mb-4 line-clamp-2 min-h-[2.5rem] flex items-start">{flower.description}</p>
<div className="flex items-center justify-between gap-2 mb-4 mt-auto">
  <div className="flex flex-col">
    <div className="text-xs text-gray-700 mb-1 font-semibold tracking-wide">PRECIO</div>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-black text-gray-800">
        {flower.price.toFixed(2)}
      </span>
      <span className="text-lg font-bold text-gray-600">CUP</span>
    </div>
  </div>

  {quantity === 0 ? (
    <button
      onClick={(e) => {
        e.preventDefault();
        onAddToCart(flower);
      }}
      className="group/btn relative flex-shrink-0"
      aria-label={`Agregar ${flower.name} al carrito`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl blur-md opacity-60 group-hover/btn:opacity-100 transition-opacity" />
      <div className="relative flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-3 rounded-xl font-bold shadow-xl transform group-hover/btn:scale-105 transition-all duration-300 border border-pink-400/30 whitespace-nowrap">
        <ShoppingCart size={20} aria-hidden="true" />
        Agregar
      </div>
    </button>
  ) : (
    <div className="flex items-center gap-2">
      <button
        onClick={(e) => {
          e.preventDefault();
          // Si hay múltiples items con diferentes accesorios, quitar del último agregado
          const cartItems: CartItem[] = JSON.parse(localStorage.getItem('flower-cart') || '[]');
          const itemsWithSameFlower = cartItems.filter((item: CartItem) => item.id === flower.id);
          if (itemsWithSameFlower.length > 0) {
            // Quitar del último item agregado (el más reciente)
            const lastItem = itemsWithSameFlower[itemsWithSameFlower.length - 1];
            // Siempre eliminar el item completamente, no reducir cantidad
            onUpdateQuantity(lastItem.cartId, 0);
          }
        }}
        className="group/btn relative"
        aria-label={`Disminuir cantidad de ${flower.name}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-lg blur-md opacity-60 group-hover/btn:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white w-10 h-10 rounded-lg font-bold shadow-xl transform group-hover/btn:scale-105 transition-all duration-300 border border-red-400/30">
          <Minus size={16} aria-hidden="true" />
        </div>
      </button>

      <span className="text-gray-800 text-xl font-black min-w-[2rem] text-center drop-shadow-lg">{quantity}</span>

      <button
        onClick={(e) => {
          e.preventDefault();
          onAddToCart(flower);
        }}
        className="group/btn relative"
        aria-label={`Aumentar cantidad de ${flower.name}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-lg blur-md opacity-60 group-hover/btn:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white w-10 h-10 rounded-lg font-bold shadow-xl transform group-hover/btn:scale-105 transition-all duration-300 border border-green-400/30">
          <Plus size={16} aria-hidden="true" />
        </div>
      </button>
    </div>
  )}
</div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 to-rose-500/5 pointer-events-none" />
      </div>
    </div>
  );
}
