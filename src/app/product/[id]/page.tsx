'use client';

import React, { useState } from 'react';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, CheckCircle, ChevronRight, Shield, Zap, Truck, RotateCcw } from 'lucide-react';

const BENEFITS = [
  { icon: Shield,   label: 'Producto original',     sub: '100% auténtico' },
  { icon: Zap,      label: 'Envío rápido',           sub: 'Todo el país' },
  { icon: Truck,    label: 'Coordinamos el envío',   sub: 'Via WhatsApp' },
  { icon: RotateCcw,label: 'Soporte postventa',      sub: 'Te acompañamos' },
];

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { products, loading } = useProducts();
  const { addToCart } = useCart();

  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [flavorError, setFlavorError] = useState(false);

  const product = products.find((p) => p.id === id);
  const hasFlavors = product?.flavors && product.flavors.length > 1;
  const outOfStock = product?.inStock === false;

  const handleAddToCart = () => {
    if (!product || outOfStock) return;
    if (hasFlavors && !selectedFlavor) {
      setFlavorError(true);
      setTimeout(() => setFlavorError(false), 2500);
      return;
    }
    const productToAdd = selectedFlavor
      ? { ...product, name: `${product.name} — ${selectedFlavor}` }
      : product;
    addToCart(productToAdd);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white">
        <Navbar />
        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-square bg-zinc-900 animate-pulse" />
            <div className="space-y-6 pt-4">
              <div className="h-5 w-32 bg-zinc-800 animate-pulse" />
              <div className="h-12 w-3/4 bg-zinc-800 animate-pulse" />
              <div className="h-10 w-1/3 bg-zinc-800 animate-pulse" />
              <div className="h-24 bg-zinc-800 animate-pulse" />
              <div className="h-14 bg-zinc-800 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── NOT FOUND ── */
  if (!product) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center px-6">
          <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center">
            <ShoppingCart size={32} className="text-zinc-600" />
          </div>
          <p className="text-2xl font-black uppercase text-white">Producto no encontrado</p>
          <p className="text-zinc-500 text-sm">El producto que buscás no existe o fue eliminado.</p>
          <Link
            href="/"
            className="flex items-center gap-2 bg-brand-green text-black px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-brand-yellow-light transition-colors"
          >
            <ArrowLeft size={16} /> Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      <Navbar />
      <CartDrawer />

      {/* ── BREADCRUMB ── */}
      <div className="border-b border-zinc-900">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center gap-1.5 text-[11px] text-zinc-600 uppercase tracking-widest">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={11} />
            <Link href="/#productos" className="hover:text-white transition-colors">Productos</Link>
            <ChevronRight size={11} />
            <span className="text-zinc-400 truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <section className="container mx-auto px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── COLUMNA IMAGEN ── */}
          <div className="lg:sticky lg:top-24 space-y-3">
            {/* Imagen principal */}
            <div className="relative w-full aspect-[4/4] bg-zinc-900 overflow-hidden group">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={`object-cover transition-transform duration-700 ${outOfStock ? 'grayscale' : 'group-hover:scale-105'}`}
                priority
              />
              {/* Badges sobre imagen */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-brand-green text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 w-fit">
                  {product.category}
                </span>
                {product.isFeatured && !outOfStock && (
                  <span className="bg-brand-yellow text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 w-fit">
                    ⭐ Destacado
                  </span>
                )}
                {outOfStock && (
                  <span className="bg-zinc-800 border border-zinc-600 text-zinc-300 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 w-fit">
                    Sin Stock
                  </span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          </div>

          {/* ── COLUMNA INFO ── */}
          <div className="flex flex-col gap-8">

            {/* Categoría pill + nombre */}
            <div>
              <p className="text-brand-green text-[11px] font-black uppercase tracking-widest mb-3">
                {product.category}
              </p>
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-black uppercase leading-[1.05] tracking-tighter text-white mb-4">
                {product.name}
              </h1>
              {/* Precio */}
              <div className="flex items-end gap-3 mt-2">
                <span className="text-5xl font-black text-white leading-none">
                  ${Number(product.price).toLocaleString('es-AR')}
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">Transferencia</span>
              </div>
            </div>

            {/* Descripción */}
            <div className="border-l-2 border-brand-green pl-5">
              <p className="text-zinc-300 text-[15px] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* ── SABORES ── */}
            {hasFlavors && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                    Elegí tu sabor
                    <span className="text-brand-green ml-1">*</span>
                  </p>
                  {selectedFlavor && (
                    <span className="text-[11px] font-bold text-brand-green uppercase tracking-wide">
                      {selectedFlavor} ✓
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.flavors!.map((flavor) => (
                    <button
                      key={flavor}
                      onClick={() => { setSelectedFlavor(flavor); setFlavorError(false); }}
                      className={`relative px-4 py-2.5 text-xs font-black uppercase tracking-wide border-2 transition-all duration-150 active:scale-95 ${
                        selectedFlavor === flavor
                          ? 'border-brand-green bg-brand-green text-black shadow-lg'
                          : flavorError
                          ? 'border-red-500/70 text-red-400 bg-red-500/5 hover:border-brand-green hover:text-white hover:bg-transparent'
                          : 'border-zinc-700 text-zinc-400 bg-transparent hover:border-zinc-400 hover:text-white'
                      }`}
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
                {flavorError && (
                  <div className="flex items-center gap-2 mt-3 text-red-400 bg-red-500/10 border border-red-500/30 px-4 py-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    <p className="text-xs font-bold uppercase tracking-wide">
                      Seleccioná un sabor antes de continuar
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── BOTÓN AGREGAR AL CARRITO ── */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`w-full flex items-center justify-center gap-3 py-5 font-black text-sm uppercase tracking-widest transition-all duration-200 active:scale-[0.98] ${
                  outOfStock
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : added
                    ? 'bg-brand-yellow text-white'
                    : 'bg-brand-green text-black hover:bg-brand-yellow-light'
                }`}
              >
                {outOfStock ? (
                  <>
                    <ShoppingCart size={20} />
                    Sin Stock
                  </>
                ) : added ? (
                  <>
                    <CheckCircle size={20} />
                    ¡Listo! Producto agregado
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Agregar al carrito
                  </>
                )}
              </button>

              <Link
                href="/#productos"
                className="w-full flex items-center justify-center gap-2 py-3.5 border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors"
              >
                <ArrowLeft size={14} />
                Seguir comprando
              </Link>
            </div>

            {/* ── BENEFICIOS ── */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {BENEFITS.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-3">
                  <Icon size={18} className="text-brand-green flex-shrink-0" />
                  <div>
                    <p className="text-white text-xs font-bold leading-tight">{label}</p>
                    <p className="text-zinc-500 text-[10px] leading-tight mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── BOTÓN FLOTANTE MOBILE ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#0f0f0f]/95 backdrop-blur border-t border-zinc-800 px-4 py-3 flex gap-3">
        <div className="flex-1">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-none mb-0.5">Precio</p>
          <p className={`text-xl font-black ${outOfStock ? 'text-zinc-600' : 'text-white'}`}>${Number(product.price).toLocaleString('es-AR')}</p>
          <p className="text-[9px] text-zinc-600 uppercase tracking-widest">Transferencia</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={`flex items-center gap-2 px-6 py-3 font-black text-xs uppercase tracking-widest transition-all flex-shrink-0 ${
            outOfStock
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : added
              ? 'bg-brand-yellow text-white active:scale-95'
              : 'bg-brand-green text-black hover:bg-brand-yellow-light active:scale-95'
          }`}
        >
          {outOfStock ? 'Sin Stock' : added ? <><CheckCircle size={16} /> ¡Listo!</> : <><ShoppingCart size={16} /> Agregar</>}
        </button>
      </div>

      {/* Espaciado extra en mobile para el botón flotante */}
      <div className="h-24 lg:hidden" />

      {/* ── FOOTER ── */}
      <footer className="border-t border-zinc-800 py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500 text-sm">
          <Link href="/" className="flex-shrink-0">
            <Image src="/Vitalifit.png" alt="VitaliFit" width={180} height={44} priority />
          </Link>
          <span className="flex-shrink-0">
            <Image src="/argentina.png" alt="Argentina" width={180} height={44} priority />
          </span>
          <p className="text-center text-xs">&copy; 2026 VitaliFit — Diseñado para atletas, por atletas.</p>
        </div>
      </footer>
    </div>
  );
}
