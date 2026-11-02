'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import { Filter, ArrowRight, ChevronRight } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import Link from 'next/link';
import Image from 'next/image';

// Categorías alineadas con las categorías reales de la base de datos
const CATEGORIES = [
  { name: 'Proteínas',         slug: 'proteinas',    image: '/images/cat-proteinas.jpg',  label: 'Proteínas' },
  { name: 'Pre-Workout',       slug: 'pre-workout',  image: '/images/cat-preworkout.jpg', label: 'Pre-Workout' },
  { name: 'Recuperación',      slug: 'recuperacion', image: '/images/cat-creatina.jpg',   label: 'Recuperación' },
  { name: 'Salud & Vitaminas', slug: 'salud',        image: '/images/cat-salud.jpg',       label: 'Salud & Vitaminas' },
];

function HomeContent() {
  const { products, loading } = useProducts();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const maxPrice = products.length > 0
    ? Math.ceil(Math.max(...products.map(p => Number(p.price))) / 1000) * 1000
    : 1000;

  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  useEffect(() => {
    if (products.length > 0) {
      const max = Math.ceil(Math.max(...products.map(p => Number(p.price))) / 1000) * 1000;
      setPriceRange([0, max]);
    }
  }, [products]);

  // Cuando llega un searchQuery desde la URL, hacer scroll a #productos
  useEffect(() => {
    if (searchQuery) {
      setShowAll(true);
      setTimeout(() => {
        document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  }, [searchQuery]);

  const isFiltering = !!searchQuery || !!selectedCategory || priceRange[1] < maxPrice || showAll;

  const filteredProducts = products.filter((product) => {
    const productName = product.name ? product.name.toLowerCase().trim() : '';
    const productPrice = Number(product.price);
    const productCategory = product.category ? product.category.trim().toLowerCase() : '';

    const matchesSearch = searchQuery ? productName.includes(searchQuery.trim()) : true;
    const matchesCategory = selectedCategory
      ? productCategory === selectedCategory.trim().toLowerCase()
      : true;
    const matchesPrice = !isNaN(productPrice) && productPrice >= priceRange[0] && productPrice <= priceRange[1];

    if (showAll || searchQuery || selectedCategory || priceRange[1] < maxPrice) {
      return matchesSearch && matchesCategory && matchesPrice;
    }
    return product.isFeatured;
  });

  const displayProducts =
    !isFiltering && filteredProducts.length === 0 && products.length > 0
      ? products
      : filteredProducts;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      <Navbar />
      <CartDrawer />

      {/* ── HERO ── */}
      <section className="relative h-[92vh] min-h-[560px] flex items-end overflow-hidden">
        {/* Imagen de fondo — reemplazá /hero-bg.jpg con tu foto */}
        <div className="absolute inset-0">
          <Image
            src="/page-screen1.png"
            alt="Hero"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Overlay degradado hacia abajo */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent" />
        </div>

        {/* Contenido del hero */}
        <div className="relative z-10 w-full container mx-auto px-6 pb-20 md:pb-28">
          {/* Pill superior */}
          <div className="inline-flex items-center gap-2 bg-brand-green/10 border border-brand-green/40 px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            <span className="text-brand-green text-xs font-bold uppercase tracking-widest">Suplementación de Élite</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-none tracking-tighter mb-6">
            Desata tu<br />
            <span className="text-brand-green">Potencial</span>
          </h1>

          <p className="text-zinc-300 text-lg md:text-xl max-w-xl mb-10 font-light leading-relaxed">
            Suplementación deportiva de élite para atletas<br className="hidden md:block" /> que no aceptan límites.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/promos">
              <button className="flex items-center gap-3 bg-brand-green text-black px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-brand-yellow-light transition-colors">
                Ver Ofertas Exclusivas
                <ArrowRight size={18} />
              </button>
            </Link>
            <button
              onClick={() => { setShowAll(true); document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="flex items-center gap-3 border border-white/30 text-white px-8 py-4 font-bold text-sm uppercase tracking-widest hover:border-white transition-colors"
            >
              Ver Productos
            </button>
          </div>
        </div>
      </section>

      {/* ── CATEGORÍAS ── */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-yellow text-xs font-bold uppercase tracking-widest mb-2">Explorar</p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Categorías</h2>
          </div>
          <Link href="#productos" onClick={() => setShowAll(true)} className="hidden md:flex items-center gap-2 text-zinc-400 hover:text-brand-yellow transition-colors text-sm font-medium uppercase tracking-wide">
            Ver todas <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} href={`/category/${cat.slug}`}>
              <div className="group relative h-52 md:h-64 overflow-hidden bg-zinc-900 cursor-pointer">
                {/* Imagen de categoría */}
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-brand-yellow/80 transition-all duration-300" />
                {/* Borde amarillo al hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-yellow transition-colors duration-300" />
                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white font-black text-xl uppercase tracking-tight">{cat.label}</p>
                  <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-brand-yellow text-xs font-bold uppercase tracking-wider">Ver más</span>
                    <ArrowRight size={12} className="text-brand-yellow" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS / LISTADO COMPLETO ── */}
      <section id="productos" className="bg-[#0a0a0a] py-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-yellow text-xs font-bold uppercase tracking-widest mb-2">
                {isFiltering ? 'Resultados' : 'Selección'}
              </p>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                {searchQuery
                  ? `"${searchQuery}"`
                  : showAll
                  ? 'Todos los Productos'
                  : 'Productos Destacados'}
              </h2>
            </div>

            {/* Filtros inline */}
            {(showAll || searchQuery) && (
              <div className="hidden md:flex items-center gap-3">
                {['Proteínas', 'Pre-Workout & Energía', 'Recuperación', 'Salud & Vitaminas'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(prev => prev === cat ? null : cat)}
                    className={`px-5 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${
                      selectedCategory === cat
                        ? 'bg-brand-yellow text-black border-brand-yellow'
                        : 'border-zinc-700 text-zinc-400 hover:border-brand-yellow hover:text-brand-yellow'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-xs text-zinc-500 hover:text-white transition-colors underline underline-offset-2"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-[380px] bg-zinc-900 animate-pulse" />
              ))}
            </div>
          ) : displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <Filter size={40} className="text-zinc-700" />
              <p className="text-zinc-400 text-lg">No se encontraron productos.</p>
              <button
                onClick={() => { setSelectedCategory(null); setPriceRange([0, maxPrice]); setShowAll(false); }}
                className="text-brand-yellow hover:underline font-medium text-sm uppercase tracking-wide"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Botón VER TODOS */}
          {!showAll && !searchQuery && (
            <div className="flex justify-center mt-14">
              <button
                onClick={() => setShowAll(true)}
                className="flex items-center gap-3 border-2 border-brand-green text-brand-green px-12 py-4 font-black text-sm uppercase tracking-widest hover:bg-brand-green hover:text-black transition-all duration-200"
              >
                Ver Todos los Productos
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-zinc-800 py-10 mt-0">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500 text-sm">
            <Link href="/" className="flex-shrink-0">
                <Image src="/Vitalifit.png" alt="Logotipo Vitalifit" width={220} height={50} priority />
            </Link>
            <span className="flex-shrink-0">
                <Image src="/argentina.png" alt="Logotipo Vitalifit" width={220} height={50} priority />
            </span>
          <p>&copy; 2026 VitaliFit — Diseñado para atletas, por atletas.</p>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0f0f]" />}>
      <HomeContent />
    </Suspense>
  );
}

