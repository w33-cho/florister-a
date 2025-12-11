import { useState, useEffect, useCallback } from 'react';
import { CartItem, Flower, CartAccessory } from '../lib/types';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCart = localStorage.getItem('flower-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('flower-cart');
      }
    }
  }, []);

  useEffect(() => {
    const startTime = performance.now();
    localStorage.setItem('flower-cart', JSON.stringify(cart));
    const duration = performance.now() - startTime;
    if (duration > 5) {
      console.log('[Storage Performance] localStorage write took', duration, 'ms');
    }
  }, [cart]);

  const addToCart = useCallback((flower: Flower, accessories?: CartAccessory[]) => {
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
  }, []);

  const removeFromCart = useCallback((cartId: string) => {
    // Use requestIdleCallback for non-blocking cart updates
    const updateCart = () => {
      const startTime = performance.now();
      setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
      const duration = performance.now() - startTime;
      if (duration > 5) {
        console.log('[Cart Performance] removeFromCart took', duration, 'ms');
      }
    };

    // Schedule for idle time if available, otherwise execute immediately
    if ('requestIdleCallback' in window) {
      requestIdleCallback(updateCart, { timeout: 50 });
    } else {
      updateCart();
    }
  }, []);

  const removeAccessory = useCallback((flowerId: string, accessoryId: string) => {
    // Use requestIdleCallback for non-blocking cart updates
    const updateCart = () => {
      const startTime = performance.now();
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
      const duration = performance.now() - startTime;
      if (duration > 5) {
        console.log('[Cart Performance] removeAccessory took', duration, 'ms');
      }
    };

    // Schedule for idle time if available, otherwise execute immediately
    if ('requestIdleCallback' in window) {
      requestIdleCallback(updateCart, { timeout: 50 });
    } else {
      updateCart();
    }
  }, []);

  const updateQuantity = useCallback((cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }

    // Use requestIdleCallback for non-blocking cart updates
    const updateCart = () => {
      const startTime = performance.now();
      setCart(prevCart =>
        prevCart.map(item =>
          item.cartId === cartId ? { ...item, quantity } : item
        )
      );
      const duration = performance.now() - startTime;
      if (duration > 5) {
        console.log('[Cart Performance] updateQuantity took', duration, 'ms');
      }
    };

    // Schedule for idle time if available, otherwise execute immediately
    if ('requestIdleCallback' in window) {
      requestIdleCallback(updateCart, { timeout: 50 });
    } else {
      updateCart();
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    // Use requestIdleCallback for non-blocking cart updates
    const updateCart = () => {
      const startTime = performance.now();
      setCart([]);
      // Clear localStorage immediately when clearing cart
      localStorage.removeItem('flower-cart');
      const duration = performance.now() - startTime;
      if (duration > 5) {
        console.log('[Cart Performance] clearCart took', duration, 'ms');
      }
    };

    // Schedule for idle time if available, otherwise execute immediately
    if ('requestIdleCallback' in window) {
      requestIdleCallback(updateCart, { timeout: 50 });
    } else {
      updateCart();
    }
  }, []);

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
