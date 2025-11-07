import { useState, useCallback, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react';
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

  // Debounced state updates to prevent excessive re-renders and crashes
  const [debouncedData, setDebouncedData] = useState<CheckoutData>(checkoutData);

  // Update checkoutData from debounced data
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCheckoutData(debouncedData);
    }, 100); // 100ms debounce

    return () => clearTimeout(timeoutId);
  }, [debouncedData]);

  // Optimize cart close performance
  const handleClose = useCallback(() => {
    // Use requestIdleCallback for smooth closing animation
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => onClose(), { timeout: 16 });
    } else {
      onClose();
    }
  }, [onClose]);

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
                <p className="text-gray-600 text-xs font-medium tracking-wide">
                  {cart.length} {cart.length === 1 ? 'PRODUCTO' : 'PRODUCTOS'}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="group relative"
              aria-label="Cerrar carrito de compras"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl blur-md opacity-0 group-hover:opacity-60 transition-opacity" />
              <div className="relative p-3 bg-pink-500/20 hover:bg-pink-500/30 rounded-xl transition-all border border-pink-500/30 group-hover:border-pink-400/50">
                <X size={24} className="text-white group-hover:text-white transition-colors" aria-hidden="true" />
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
                      <h3 className="font-medium text-xs text-gray-800 truncate drop-shadow-lg" style={{ textShadow: '0 0 10px #ec4899' }}>
                        {item.name}
                      </h3>
                      <p className="text-gray-800 font-semibold text-sm drop-shadow-lg" style={{ textShadow: '0 0 10px #ec4899' }}>
                        {item.price.toFixed(2)} CUP
                      </p>
                      {item.selectedAccessories && item.selectedAccessories.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {item.selectedAccessories.map((cartAcc, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <p className="text-xs text-gray-700 font-medium">
                                  + {cartAcc.accessory.name} (x{cartAcc.quantity})
                                </p>
                                <button
                                  onClick={() => {
                                    // Optimize accessory removal performance
                                    const removeAccessory = () => onRemoveAccessory(item.id, cartAcc.accessory.id);
                                    if ('requestIdleCallback' in window) {
                                      requestIdleCallback(removeAccessory, { timeout: 16 });
                                    } else {
                                      removeAccessory();
                                    }
                                  }}
                                  className="text-red-400 hover:text-red-300 text-xs ml-1"
                                  aria-label={`Remover accesorio ${cartAcc.accessory.name} de ${item.name}`}
                                >
                                  ×
                                </button>
                              </div>
                              <p className="text-xs text-gray-600">
                                +{(cartAcc.accessory.price * cartAcc.quantity).toFixed(2)} CUP
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-2 pt-2 border-t border-gray-300/30">
                        <p className="text-xs text-gray-800 font-bold">
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
                          onClick={() => {
                            // Debounce quantity updates to prevent rapid clicking
                            const updateQuantity = () => onUpdateQuantity(item.cartId, item.quantity - 1);
                            if ('requestIdleCallback' in window) {
                              requestIdleCallback(updateQuantity, { timeout: 16 });
                            } else {
                              updateQuantity();
                            }
                          }}
                          className="group/btn relative"
                          aria-label={`Disminuir cantidad de ${item.name}`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded blur-sm opacity-0 group-hover/btn:opacity-60 transition-opacity" />
                          <div className="relative p-1 bg-red-500/20 hover:bg-red-500/40 rounded transition-all border border-red-500/30">
                            <Minus size={12} className="text-red-300" aria-hidden="true" />
                          </div>
                        </button>

                        <span className="font-semibold text-sm text-gray-800 w-6 text-center drop-shadow-lg" style={{ textShadow: '0 0 10px #ec4899' }}>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => {
                            // Debounce quantity updates to prevent rapid clicking
                            const updateQuantity = () => onUpdateQuantity(item.cartId, item.quantity + 1);
                            if ('requestIdleCallback' in window) {
                              requestIdleCallback(updateQuantity, { timeout: 16 });
                            } else {
                              updateQuantity();
                            }
                          }}
                          className="group/btn relative"
                          aria-label={`Aumentar cantidad de ${item.name}`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded blur-sm opacity-0 group-hover/btn:opacity-60 transition-opacity" />
                          <div className="relative p-1 bg-green-500/20 hover:bg-green-500/40 rounded transition-all border border-green-500/30">
                            <Plus size={12} className="text-green-300" aria-hidden="true" />
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            // Optimize remove operation performance
                            const removeItem = () => onRemove(item.cartId);
                            if ('requestIdleCallback' in window) {
                              requestIdleCallback(removeItem, { timeout: 16 });
                            } else {
                              removeItem();
                            }
                          }}
                          className="ml-auto text-red-400 hover:text-red-300 text-xs font-medium uppercase transition-colors"
                          aria-label={`Remover ${item.name} del carrito`}
                        >
                          <X size={14} className="inline" aria-hidden="true" />
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
                  <div className="text-xs text-gray-700 font-medium tracking-wide mb-0.5">
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
                        // Debounce input updates to prevent excessive re-renders
                        const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                        setDebouncedData(prev => ({ ...prev, name: value }));
                      }}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-semibold mb-1">DIRECCIÓN</label>
                    <textarea
                      placeholder="Tu dirección"
                      value={checkoutData.address}
                      onChange={(e) => {
                        // Debounce textarea updates to prevent excessive re-renders
                        setDebouncedData(prev => ({ ...prev, address: e.target.value }));
                      }}
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
                          // Debounce phone input updates to prevent excessive re-renders
                          const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                          setDebouncedData(prev => ({ ...prev, phone: value }));
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
                aria-label="Enviar pedido por WhatsApp"
              >
                <MessageCircle size={14} aria-hidden="true" />
                ENVIAR Y LIMPIAR CARRITO
              </button>
            </div>
          </>
        )}

      </div>
    </>
  );
}
