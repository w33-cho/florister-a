import { CartItem } from '../lib/types';
import { CheckoutData } from '../components/CheckoutForm';

export function sendToWhatsApp(cart: CartItem[], phoneNumber: string, checkoutData?: CheckoutData) {
  const message = formatOrderMessage(cart, checkoutData);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
}

function formatOrderMessage(cart: CartItem[], checkoutData?: CheckoutData): string {
  let message = '🌸 *Nuevo Pedido de Flores* 🌸\n\n';

  if (checkoutData) {
    message += `*Datos del Cliente:*\n`;
    message += `👤 Nombre: ${checkoutData.name}\n`;
    message += `📍 Dirección: ${checkoutData.address}\n`;
    message += `📱 Teléfono: +53 ${checkoutData.phone}\n\n`;
  }

  message += `*Productos:*\n\n`;
  cart.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   Cantidad: ${item.quantity}\n`;
    message += `   Precio unitario: $${item.price.toFixed(2)}\n`;
    if (item.selectedAccessories && item.selectedAccessories.length > 0) {
      item.selectedAccessories.forEach((cartAcc) => {
        message += `   🎀 Accesorio: ${cartAcc.accessory.name} (x${cartAcc.quantity}) (+$${cartAcc.accessory.price.toFixed(2)} c/u)\n`;
      });
    }
    const accessoryTotal = item.selectedAccessories?.reduce((acc, cartAcc) =>
      acc + (cartAcc.accessory.price * cartAcc.quantity * item.quantity), 0) || 0;
    message += `   Subtotal: $${((item.price * item.quantity) + accessoryTotal).toFixed(2)}\n\n`;
  });

  const total = cart.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const accessoryTotal = item.selectedAccessories?.reduce((acc, cartAcc) =>
      acc + (cartAcc.accessory.price * cartAcc.quantity * item.quantity), 0) || 0;
    return sum + itemTotal + accessoryTotal;
  }, 0);
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `*TOTAL: $${total.toFixed(2)}*\n\n`;
  message += 'Gracias por tu compra! 💐';

  return message;
}
