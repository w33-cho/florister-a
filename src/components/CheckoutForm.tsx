import { useState } from 'react';
import { User, MapPin, Phone, Check, X } from 'lucide-react';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CheckoutData) => void;
}

export interface CheckoutData {
  name: string;
  address: string;
  phone: string;
}

export function CheckoutForm({ isOpen, onClose, onSubmit }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutData>({
    name: '',
    address: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Partial<CheckoutData>>({});

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{8,}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Ingresa un número de teléfono válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof CheckoutData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl shadow-cyan-900/50 z-50 flex flex-col border-l border-cyan-500/30">
        <div className="relative p-6 border-b border-cyan-500/30 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 pointer-events-none" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl blur-md opacity-60" />
                <div className="relative bg-gradient-to-br from-cyan-500 to-teal-600 p-3 rounded-xl">
                  <User size={28} className="text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-teal-300">
                  Datos de Envío
                </h2>
                <p className="text-cyan-400 text-xs font-semibold tracking-wider">
                  COMPLETA TU PEDIDO
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl blur-md opacity-0 group-hover:opacity-60 transition-opacity" />
              <div className="relative p-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-all border border-cyan-500/30 group-hover:border-red-400/50">
                <X size={24} className="text-cyan-300 group-hover:text-red-400 transition-colors" />
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6">
          <div>
            <label className="block text-cyan-300 text-sm font-bold mb-2 flex items-center gap-2">
              <User size={16} />
              Nombre Completo
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full bg-gray-800/50 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-cyan-500/30 focus:ring-cyan-500 focus:border-cyan-400'
                }`}
                placeholder="Ingresa tu nombre completo"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-cyan-300 text-sm font-bold mb-2 flex items-center gap-2">
              <MapPin size={16} />
              Dirección de Envío
            </label>
            <div className="relative">
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className={`w-full bg-gray-800/50 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.address
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-cyan-500/30 focus:ring-cyan-500 focus:border-cyan-400'
                }`}
                placeholder="Ingresa tu dirección completa"
              />
              {errors.address && (
                <p className="text-red-400 text-xs mt-1">{errors.address}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-cyan-300 text-sm font-bold mb-2 flex items-center gap-2">
              <Phone size={16} />
              Número de Teléfono
            </label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full bg-gray-800/50 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-cyan-500/30 focus:ring-cyan-500 focus:border-cyan-400'
                }`}
                placeholder="Ingresa tu número de teléfono"
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="group relative w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl transform group-hover:scale-105 transition-all duration-300 border border-green-400/50">
                <Check size={24} />
                CONFIRMAR PEDIDO
              </div>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}