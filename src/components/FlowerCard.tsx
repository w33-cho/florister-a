import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Flower } from '../lib/types';

interface FlowerCardProps {
  flower: Flower;
  quantity: number;
  onUpdateQuantity: (flowerId: string, quantity: number) => void;
  onAddToCart: (flower: Flower) => void;
}

export function FlowerCard({ flower, quantity, onUpdateQuantity, onAddToCart }: FlowerCardProps) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl overflow-hidden border border-pink-300/50 shadow-2xl shadow-pink-200/50 transform group-hover:scale-105 group-hover:border-pink-400/60 transition-all duration-500 h-[32rem] flex flex-col">
        <div className="relative h-64 overflow-hidden flex-shrink-0 bg-white">
          <img
            src={flower.image_url}
            alt={flower.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
          />


        </div>

        <div className="p-6 bg-gradient-to-br from-pink-100/90 to-rose-100/90 backdrop-blur-sm flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-pink-600 mb-2 min-h-[3.5rem] flex items-center">
            {flower.name}
          </h3>
          <p className="text-pink-500 text-sm mb-4 line-clamp-2 min-h-[2.5rem] flex items-start">{flower.description}</p>
<div className="flex items-center justify-between gap-2 mb-4 mt-auto">
  <div className="flex flex-col">
    <div className="text-xs text-pink-600 mb-1 font-semibold tracking-wide">PRECIO</div>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">
        {flower.price.toFixed(2)}
      </span>
      <span className="text-lg font-bold text-pink-300">CUP</span>
    </div>
  </div>

  {quantity === 0 ? (
    <button
      onClick={() => onAddToCart(flower)}
      className="group/btn relative flex-shrink-0"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl blur-md opacity-60 group-hover/btn:opacity-100 transition-opacity" />
      <div className="relative flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-3 rounded-xl font-bold shadow-xl transform group-hover/btn:scale-105 transition-all duration-300 border border-pink-400/30 whitespace-nowrap">
        <ShoppingCart size={20} />
        Agregar
      </div>
    </button>
  ) : (
    <div className="flex items-center gap-2">
      <button
        onClick={() => {
          // Si hay múltiples items con diferentes accesorios, quitar del último agregado
          const cartItems = JSON.parse(localStorage.getItem('flower-cart') || '[]');
          const itemsWithSameFlower = cartItems.filter((item: any) => item.id === flower.id);
          if (itemsWithSameFlower.length > 0) {
            // Quitar del último item agregado (el más reciente)
            const lastItem = itemsWithSameFlower[itemsWithSameFlower.length - 1];
            // Siempre eliminar el item completamente, no reducir cantidad
            onUpdateQuantity(lastItem.cartId, 0);
          }
        }}
        className="group/btn relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-lg blur-md opacity-60 group-hover/btn:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white w-10 h-10 rounded-lg font-bold shadow-xl transform group-hover/btn:scale-105 transition-all duration-300 border border-red-400/30">
          <Minus size={16} />
        </div>
      </button>

      <span className="text-pink-600 text-xl font-black min-w-[2rem] text-center drop-shadow-lg" style={{ textShadow: '0 0 15px #ec4899, 0 0 30px #ec4899' }}>{quantity}</span>

      <button
        onClick={() => onAddToCart(flower)}
        className="group/btn relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-lg blur-md opacity-60 group-hover/btn:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white w-10 h-10 rounded-lg font-bold shadow-xl transform group-hover/btn:scale-105 transition-all duration-300 border border-green-400/30">
          <Plus size={16} />
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
