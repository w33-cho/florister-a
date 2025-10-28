import { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, MessageCircle, Sparkles } from 'lucide-react';
import { CartItem } from '../lib/types';
import { CheckoutData } from './CheckoutForm';

interface CartProps {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (flowerId: string, quantity: number) => void;
  onRemove: (flowerId: string) => void;
  onRemoveAccessory: (flowerId: string, accessoryId: string) => void;
  onSendWhatsApp: (checkoutData: CheckoutData) => void;
  totalPrice: number;
}

export function Cart({
  cart,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemove,
  onRemoveAccessory,
  onSendWhatsApp,
  totalPrice
}: CartProps) {
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    name: '',
    address: '',
    phone: ''
  });
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white backdrop-blur-lg shadow-2xl shadow-gray-200/30 z-50 flex flex-col border-l border-gray-300/50">
        <div className="absolute inset-0 bg-gray-100/10 pointer-events-none" />
        <style>{`
          .cart-products-section {
            flex: 1;
            overflow-y: auto;
          }
        `}</style>
        <div className="relative p-4 border-b border-gray-300/50 bg-white backdrop-blur-lg">

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg blur-md opacity-60" />
                <div className="relative bg-gradient-to-br from-pink-500 to-rose-600 p-2 rounded-lg">
                  <ShoppingBag size={20} className="text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-rose-300">
                  Carrito
                </h2>
                <p className="text-pink-400 text-xs font-medium tracking-wide">
                  {cart.length} {cart.length === 1 ? 'PRODUCTO' : 'PRODUCTOS'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl blur-md opacity-0 group-hover:opacity-60 transition-opacity" />
              <div className="relative p-3 bg-pink-500/20 hover:bg-pink-500/30 rounded-xl transition-all border border-pink-500/30 group-hover:border-pink-400/50">
                <X size={24} className="text-white group-hover:text-white transition-colors" />
              </div>
            </button>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-8">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-2xl" />
                <ShoppingBag size={60} className="relative text-pink-500/30" />
              </div>
              <p className="text-gray-400 text-lg font-medium">Tu carrito está vacío</p>
              <p className="text-gray-600 text-sm mt-1">Agrega productos para continuar</p>
            </div>
          </div>
        ) : (
          <>
            <div className="cart-products-section p-3 space-y-2">
              {cart.map((item, index) => (
                <div
                  key={item.cartId}
                  className="group relative"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
 
                  <div className="relative flex gap-2 p-2 bg-white rounded-lg border border-gray-300 group-hover:border-gray-400 transition-all">
                    <div className="relative w-12 h-12 rounded overflow-hidden border border-gray-300 shadow-md">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-xs text-pink-600 truncate drop-shadow-lg" style={{ textShadow: '0 0 10px #ec4899' }}>
                        {item.name}
                      </h3>
                      <p className="text-pink-600 font-semibold text-sm drop-shadow-lg" style={{ textShadow: '0 0 10px #ec4899' }}>
                        {item.price.toFixed(2)} CUP
                      </p>
                      {item.selectedAccessories && item.selectedAccessories.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {item.selectedAccessories.map((cartAcc, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <p className="text-xs text-pink-500 font-medium">
                                  + {cartAcc.accessory.name} (x{cartAcc.quantity})
                                </p>
                                <button
                                  onClick={() => onRemoveAccessory(item.id, cartAcc.accessory.id)}
                                  className="text-red-400 hover:text-red-300 text-xs ml-1"
                                >
                                  ×
                                </button>
                              </div>
                              <p className="text-xs text-pink-400">
                                +{(cartAcc.accessory.price * cartAcc.quantity).toFixed(2)} CUP
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-2 pt-2 border-t border-pink-200/30">
                        <p className="text-xs text-pink-500 font-bold">
                          Subtotal: {(() => {
                            const itemTotal = item.price * item.quantity;
                            const accessoryTotal = item.selectedAccessories?.reduce((acc, cartAcc) =>
                              acc + (cartAcc.accessory.price * cartAcc.quantity), 0) || 0;
                            return (itemTotal + accessoryTotal).toFixed(2);
                          })()} CUP
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1">
                        <button
                          onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                          className="group/btn relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded blur-sm opacity-0 group-hover/btn:opacity-60 transition-opacity" />
                          <div className="relative p-1 bg-red-500/20 hover:bg-red-500/40 rounded transition-all border border-red-500/30">
                            <Minus size={12} className="text-red-300" />
                          </div>
                        </button>

                        <span className="font-semibold text-sm text-pink-600 w-6 text-center drop-shadow-lg" style={{ textShadow: '0 0 10px #ec4899' }}>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                          className="group/btn relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded blur-sm opacity-0 group-hover/btn:opacity-60 transition-opacity" />
                          <div className="relative p-1 bg-green-500/20 hover:bg-green-500/40 rounded transition-all border border-green-500/30">
                            <Plus size={12} className="text-green-300" />
                          </div>
                        </button>

                        <button
                          onClick={() => onRemove(item.cartId)}
                          className="ml-auto text-red-400 hover:text-red-300 text-xs font-medium uppercase transition-colors"
                        >
                          <X size={14} className="inline" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300/30 p-2 bg-white">
              <div className="relative mb-2 p-1.5 bg-white rounded border border-gray-300">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded pointer-events-none" />

                <div className="relative text-center">
                  <div className="text-xs text-pink-400 font-medium tracking-wide mb-0.5">
                    TOTAL
                  </div>
                  <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                    {totalPrice.toFixed(2)} CUP
                  </span>
                </div>
              </div>

              <div className="mb-2 p-2 bg-white rounded border border-gray-300">
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="block text-sm text-gray-700 font-semibold mb-1">NOMBRE</label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={checkoutData.name}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                        setCheckoutData(prev => ({ ...prev, name: value }));
                      }}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-semibold mb-1">DIRECCIÓN</label>
                    <textarea
                      placeholder="Tu dirección"
                      value={checkoutData.address}
                      onChange={(e) => setCheckoutData(prev => ({ ...prev, address: e.target.value }))}
                      rows={2}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-semibold mb-1">TELÉFONO</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm font-medium">+53</span>
                      <input
                        type="tel"
                        placeholder="12345678"
                        value={checkoutData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                          setCheckoutData(prev => ({ ...prev, phone: value }));
                        }}
                        className="w-full bg-white border border-gray-300 rounded px-3 pl-12 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSendWhatsApp(checkoutData)}
                disabled={!checkoutData.name.trim() || !checkoutData.address.trim() || checkoutData.phone.length !== 8}
                className="w-full bg-green-500 text-white py-1.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: '0 0 15px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.4)' }}
              >
                <MessageCircle size={14} />
                ENVIAR
              </button>
            </div>
          </>
        )}

      </div>
    </>
  );
}
