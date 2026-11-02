'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import { usePromos } from '@/context/PromoContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PromosPage() {
  const { promotions } = usePromos();
  const { addPromoToCart } = useCart();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-green selection:text-black">
      <Navbar />
      <CartDrawer />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4">
            Ofertas <span className="text-neon-green">Exclusivas</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Aprovecha nuestros packs diseñados para maximizar tus resultados y tu ahorro.
          </p>
        </div>

        {promotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {promotions.map((promo) => (
              <div key={promo.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-neon-green transition-all duration-300 shadow-2xl hover:shadow-neon-green/20 flex flex-col">
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10 bg-neon-green text-black font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-lg">
                  <Tag size={14} />
                  OFERTA LIMITADA
                </div>

                {/* Image */}
                <div className="relative h-64 w-full overflow-hidden bg-zinc-800">
                  <Image
                    src={promo.image}
                    alt={promo.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-white mb-2">{promo.name}</h3>
                  <p className="text-zinc-400 mb-6 flex-1">{promo.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-800">
                    <div className="flex flex-col">
                      <span className="text-sm text-zinc-500 line-through">Antes: ${(promo.price * 1.2).toFixed(2)}</span>
                      <span className="text-3xl font-black text-neon-green">${promo.price.toFixed(2)}</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Transferencia</span>
                    </div>
                    
                    <button
                      onClick={() => addPromoToCart(promo)}
                      className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-neon-green transition-colors active:scale-95 shadow-lg"
                    >
                      <ShoppingCart size={20} />
                      Añadir Pack
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <Tag size={48} className="mx-auto text-zinc-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No hay promociones activas</h3>
            <p className="text-zinc-400 mb-6">Vuelve pronto para ver nuevas ofertas.</p>
            <Link href="/" className="text-neon-green hover:underline font-medium">
              Ver todos los productos
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-12 mt-12">
        <div className="container mx-auto px-4 text-center text-zinc-500 text-sm">
          <p>&copy; 2024 VitaliFit. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
