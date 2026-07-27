'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/lib/types';
import { INITIAL_PRODUCTS_DATA, formatCurrencyVND } from '@/lib/products-data';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product | string, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const local = localStorage.getItem('tiemlua_cart');
      if (local) {
        setCart(JSON.parse(local));
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tiemlua_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (prod: Product | string, quantity = 1) => {
    let targetProd: Product | undefined;
    if (typeof prod === 'string') {
      targetProd = INITIAL_PRODUCTS_DATA.find(p => p.id === prod);
    } else {
      targetProd = prod;
    }

    if (!targetProd) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === targetProd.id);
      if (existing) {
        return prev.map(item =>
          item.id === targetProd.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: targetProd.id,
          name: targetProd.name,
          priceNum: targetProd.priceNum,
          priceFormatted: targetProd.price,
          img: targetProd.img,
          categoryName: targetProd.categoryName,
          quantity
        }
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.priceNum * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
