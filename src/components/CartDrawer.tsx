'use client';

import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

const CartDrawer = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity } = useCart();

  const handleCheckout = () => {
    // Número de teléfono del vendedor (Reemplazar con el real)
    const phoneNumber = "5492494212491";
    
    // Construir el mensaje
    const itemsList = cart.items.map(item => 
      `• ${item.quantity}x ${item.name} - $${(item.price * item.quantity)}`
    ).join('\n');
    
    const total = cart.total;
    
    const message = `Hola VitaliFit! 👋\nQuiero finalizar mi pedido:\n\n${itemsList}\n\n*Total a pagar: $${total}*\n\nQuedo a la espera para coordinar el pago y envío.`;
    
    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Abrir en nueva pestaña
    window.open(whatsappUrl, '_blank');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-zinc-900 h-full shadow-2xl border-l border-zinc-800 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="text-neon-green" />
            Tu Carrito <span className="text-zinc-500 text-sm font-normal">({cart.items.length} items)</span>
          </h2>
          <button 
            onClick={toggleCart}
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-zinc-800 p-6 rounded-full">
                <ShoppingBag size={48} className="text-zinc-600" />
              </div>
              <p className="text-zinc-400 text-lg">Tu carrito está vacío</p>
              <button 
                onClick={toggleCart}
                className="text-neon-green hover:underline font-medium"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-zinc-800/30 p-4 rounded-xl border border-zinc-800/50">
                <div className="relative h-20 w-20 flex-shrink-0 bg-zinc-800 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm line-clamp-1">{item.name}</h3>
                    <p className="text-neon-green font-mono text-sm">${item.price}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-zinc-800 rounded-lg border border-zinc-700">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-neon-green text-zinc-400 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-neon-green text-zinc-400 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="p-6 bg-zinc-900 border-t border-zinc-800 space-y-4">
            <div className="flex items-center justify-between text-zinc-400 text-sm">
              <span>Subtotal</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-white text-xl font-bold">
              <div className="flex flex-col">
                <span>Total</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Transferencia</span>
              </div>
              <span className="text-neon-green">${cart.total.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-neon-green text-black font-bold py-4 rounded-xl hover:bg-neon-green/90 transition-colors active:scale-95 uppercase tracking-wider"
            >
              <MessageCircle size={20} />
              Finalizar por WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
