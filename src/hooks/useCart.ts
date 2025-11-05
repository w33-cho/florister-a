import { useState, useEffect, useCallback } from 'react';
import { CartItem, Flower, CartAccessory } from '../lib/types';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Always start with empty cart for better user experience
    // Cart persistence can cause confusion when users return to the site
    // Comment out the lines below if you want to restore persistence

    /*
    const startTime = performance.now();
    const savedCart = localStorage.getItem('flower-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    const duration = performance.now() - startTime;
    if (duration > 5) {
      console.log('[Storage Performance] localStorage read took', duration, 'ms');
    }
    */
  }, []);

  useEffect(() => {
    // Debounce localStorage writes to prevent excessive blocking
    const timeoutId = setTimeout(() => {
      const startTime = performance.now();
      localStorage.setItem('flower-cart', JSON.stringify(cart));
      const duration = performance.now() - startTime;
      if (duration > 5) {
        console.log('[Storage Performance] localStorage write took', duration, 'ms');
      }
    }, 100); // 100ms debounce

    return () => clearTimeout(timeoutId);
  }, [cart]);

  const addToCart = useCallback((flower: Flower, accessories?: CartAccessory[]) => {
    // Use requestIdleCallback for non-blocking cart updates
    const updateCart = () => {
      const startTime = performance.now();

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

      const duration = performance.now() - startTime;
      if (duration > 10) {
        console.log('[Cart Performance] addToCart took', duration, 'ms');
      }
    };

    // Schedule for idle time if available, otherwise execute immediately
    if ('requestIdleCallback' in window) {
      requestIdleCallback(updateCart, { timeout: 100 });
    } else {
      updateCart();
    }
  }, []);

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
    // Clear localStorage immediately when clearing cart
    localStorage.removeItem('flower-cart');
  };

  const resetCart = () => {
    setCart([]);
    localStorage.removeItem('flower-cart');
  };

  const getTotalPrice = useCallback(() => {
    const startTime = performance.now();

    const result = cart.reduce((total, item) => {
      const itemPrice = item.price * item.quantity;
      const accessoryPrice = item.selectedAccessories?.reduce((acc, cartAcc) =>
        acc + (cartAcc.accessory.price * cartAcc.quantity * item.quantity), 0) || 0;
      return total + itemPrice + accessoryPrice;
    }, 0);

    const duration = performance.now() - startTime;
    if (duration > 5) {
      console.log('[Cart Performance] getTotalPrice took', duration, 'ms for', cart.length, 'items');
    }

    return result;
  }, [cart]);

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
    resetCart,
    getTotalPrice,
    getTotalItems
  };
}
