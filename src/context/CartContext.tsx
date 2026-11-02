'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartState, CartContextType, Promotion } from '@/types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartState>({ items: [], total: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Calcular total cada vez que cambia el carrito
  useEffect(() => {
    const total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setCart(prev => ({ ...prev, total }));
  }, [cart.items]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.items.find(item => item.id === product.id);
      if (existingItem) {
        return {
          ...prev,
          items: prev.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...prev,
        items: [...prev.items, { ...product, quantity: 1 }],
      };
    });
    // Solo abrir el drawer en desktop (>= 768px). En móvil el ProductCard muestra un toast.
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setIsCartOpen(true);
    }
  };

  const addPromoToCart = (promo: Promotion) => {
    // Convertimos la promo en un "producto" para el carrito
    const promoProduct: Product = {
      id: promo.id,
      name: promo.name,
      price: promo.price,
      category: 'Proteínas', // Categoría genérica para promociones
      image: promo.image,
      description: promo.description,
    };
    addToCart(promoProduct);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== productId),
    }));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ),
    }));
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  const toggleCart = () => setIsCartOpen(prev => !prev);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addPromoToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
