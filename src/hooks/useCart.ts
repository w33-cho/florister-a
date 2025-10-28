import { useState, useEffect } from 'react';
import { CartItem, Flower, Accessory, CartAccessory } from '../lib/types';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('flower-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flower-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (flower: Flower, accessories?: CartAccessory[]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item =>
        item.id === flower.id &&
        JSON.stringify(item.selectedAccessories || []) === JSON.stringify(accessories || [])
      );

      if (existingItem) {
        return prevCart.map(item =>
          item.id === flower.id &&
          JSON.stringify(item.selectedAccessories || []) === JSON.stringify(accessories || [])
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      const cartId = `${flower.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return [...prevCart, { ...flower, cartId, quantity: 1, selectedAccessories: accessories }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
  };

  const removeAccessory = (flowerId: string, accessoryId: string) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === flowerId && item.selectedAccessories) {
          const updatedAccessories = item.selectedAccessories.filter(
            cartAcc => cartAcc.accessory.id !== accessoryId
          );
          return { ...item, selectedAccessories: updatedAccessories };
        }
        return item;
      }).filter(item => item.selectedAccessories?.length !== 0 || item.quantity > 0)
    );
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.cartId === cartId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const itemPrice = item.price * item.quantity;
      const accessoryPrice = item.selectedAccessories?.reduce((acc, cartAcc) =>
        acc + (cartAcc.accessory.price * cartAcc.quantity * item.quantity), 0) || 0;
      return total + itemPrice + accessoryPrice;
    }, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    removeAccessory,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };
}
