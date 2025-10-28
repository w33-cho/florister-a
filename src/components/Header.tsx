import { ShoppingCart, Sparkles } from 'lucide-react';

interface HeaderProps {
  cartItemsCount: number;
  onOpenCart: () => void;
}

export function Header({ cartItemsCount, onOpenCart }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-40">
      <div>
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white p-1.5 rounded-full shadow-xl overflow-hidden">
                  <img
                    src="/clararamos CIRCULAR.png"
                    alt="Clara Ramos Logo"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-2xl whitespace-nowrap">
                    Ramos Isis
                  </h1>
                  <Sparkles size={24} className="hidden sm:block text-white animate-pulse flex-shrink-0" />
                </div>
                <p className="text-white text-sm font-light tracking-wider drop-shadow-lg">
                  Experiencia Floral Futurista
                </p>
              </div>
            </div>

            <button
              onClick={onOpenCart}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-br from-pink-500 to-rose-600 p-3 rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-300 border border-pink-400/30">
                <ShoppingCart size={24} className="text-white" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg shadow-green-500/50 animate-pulse">
                    {cartItemsCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
