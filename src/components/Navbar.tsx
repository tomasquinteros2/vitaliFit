'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

const Navbar = () => {
  const { cart, toggleCart } = useCart();
  const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = (term: string) => {
    if (term.trim()) {
      // Siempre redirigir a la home con el query, sin importar en qué página estamos
      router.push(`/?q=${encodeURIComponent(term.trim())}`);
    } else {
      // Si borra el texto y ya estamos en home, limpiar el query
      if (pathname === '/') {
        router.replace('/');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const term = (e.target as HTMLInputElement).value.trim();
      if (term) {
        router.push(`/?q=${encodeURIComponent(term)}`);
        // Pequeño delay para que la navegación ocurra antes del scroll
        setTimeout(() => {
          document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  };

  const categories = [
    { name: 'Proteínas',          href: '/category/proteinas' },
    { name: 'Pre-Workout',        href: '/category/pre-workout' },
    { name: 'Recuperación',       href: '/category/recuperacion' },
    { name: 'Salud & Vitaminas',  href: '/category/salud' },
    { name: 'Ofertas',            href: '/promos' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-zinc-800">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 mt-2">
          <Image src="/Vitalifit.png" alt="Logotipo Vitalifit" width={220} height={50} priority />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {categories.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-zinc-400 hover:text-brand-yellow font-bold transition-colors text-xs uppercase tracking-widest"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-800 px-4 py-2 focus-within:border-brand-yellow transition-colors">
            <Search size={16} className="text-zinc-600 flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar productos..."
              onKeyDown={handleKeyDown}
              onChange={(e) => { if (!e.target.value) handleSearch(''); }}
              defaultValue={searchParams.get('q')?.toString()}
              className="bg-transparent border-none outline-none text-white text-xs ml-2 w-36 lg:w-52 placeholder:text-zinc-600"
            />
          </div>

          {/* Cart */}
          <button
            onClick={toggleCart}
            className="relative flex items-center gap-2 bg-brand-green text-black px-4 py-2 font-black text-xs uppercase tracking-widest hover:bg-brand-yellow-light transition-colors"
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Carrito</span>
            {itemCount > 0 && (
              <span className="bg-black bg-brand-green text-xs font-black h-5 w-5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
