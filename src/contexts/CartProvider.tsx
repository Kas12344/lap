"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect } from 'react';
import type { CartItem, Laptop, CustomerDetails } from '@/types';
import { WHATSAPP_NUMBER, WHATSAPP_LINK_BASE } from '@/lib/constants';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (laptop: Laptop, quantity?: number) => void;
  removeFromCart: (laptopId: string) => void;
  updateQuantity: (laptopId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  generateWhatsAppMessage: (customerDetails: CustomerDetails) => string;
  checkoutWithWhatsApp: (customerDetails: CustomerDetails) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('lapzenCart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lapzenCart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (laptop: Laptop, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.laptop.id === laptop.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.laptop.id === laptop.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.laptop.stock) }
            : item
        );
      }
      return [...prevItems, { laptop, quantity: Math.min(quantity, laptop.stock) }];
    });
  };

  const removeFromCart = (laptopId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.laptop.id !== laptopId));
  };

  const updateQuantity = (laptopId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.laptop.id === laptopId
          ? { ...item, quantity: Math.max(0, Math.min(quantity, item.laptop.stock)) }
          : item
      ).filter(item => item.quantity > 0) // Remove if quantity is 0
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.laptop.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const generateWhatsAppMessage = (customerDetails: CustomerDetails) => {
    let message = `Order Request from Lapzen\n`;
    message += `Name: ${customerDetails.name}\n`;
    message += `Phone: ${customerDetails.phone}\n`;
    message += `Address: ${customerDetails.address}\n\n`;
    message += `Cart Items:\n`;
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.laptop.name} (${item.quantity}x) - ${item.laptop.price.toLocaleString()} PKR\n`;
    });
    message += `\nTotal: ${getCartTotal().toLocaleString()} PKR`;
    return message;
  };
  
  const checkoutWithWhatsApp = (customerDetails: CustomerDetails) => {
    const message = generateWhatsAppMessage(customerDetails);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `${WHATSAPP_LINK_BASE}${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    if (typeof window !== "undefined") {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
        generateWhatsAppMessage,
        checkoutWithWhatsApp,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};