import { X, Plus, Minus } from 'lucide-react';
import { Accessory, CartAccessory } from '../lib/types';

interface AccessoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessories: Accessory[];
  onSelectAccessories: (accessories: CartAccessory[]) => void;
  selectedAccessories: CartAccessory[];
  onConfirm?: () => void;
}

export function AccessoryModal({
  isOpen,
  onClose,
  accessories,
  onSelectAccessories,
  selectedAccessories,
  onConfirm
}: AccessoryModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose} />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Seleccionar Accesorio</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          <button
            onClick={() => onSelectAccessories([])}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              selectedAccessories.length === 0
                ? 'border-pink-500 bg-pink-50 text-pink-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <div className="text-left">
              <h3 className="font-semibold">Sin accesorios</h3>
              <p className="text-sm opacity-75">Solo el producto principal</p>
            </div>
          </button>

          {accessories.map((accessory) => {
            const cartAccessory = selectedAccessories.find(ca => ca.accessory.id === accessory.id);
            const quantity = cartAccessory?.quantity || 0;

            return (
              <div
                key={accessory.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  quantity > 0
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={accessory.image_url}
                    alt={accessory.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="text-left flex-1">
                    <h3 className="font-semibold">{accessory.name}</h3>
                    <p className="text-sm opacity-75">{accessory.description}</p>
                    <p className="text-sm font-bold text-pink-600 mt-1">
                      +{accessory.price.toFixed(2)} CUP
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {quantity > 0 && (
                      <>
                        <button
                          onClick={() => {
                            const newAccessories = selectedAccessories.map(ca =>
                              ca.accessory.id === accessory.id
                                ? { ...ca, quantity: ca.quantity - 1 }
                                : ca
                            ).filter(ca => ca.quantity > 0);
                            onSelectAccessories(newAccessories);
                          }}
                          className="w-8 h-8 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center text-white"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-pink-600 min-w-[20px] text-center">
                          {quantity}
                        </span>
                      </>
                    )}
                    <button
                      onClick={() => {
                        const existing = selectedAccessories.find(ca => ca.accessory.id === accessory.id);
                        if (existing) {
                          const newAccessories = selectedAccessories.map(ca =>
                            ca.accessory.id === accessory.id
                              ? { ...ca, quantity: ca.quantity + 1 }
                              : ca
                          );
                          onSelectAccessories(newAccessories);
                        } else {
                          onSelectAccessories([...selectedAccessories, { accessory, quantity: 1 }]);
                        }
                      }}
                      className="w-8 h-8 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center text-white"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            className="flex-1 py-2 px-4 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </>
  );
}