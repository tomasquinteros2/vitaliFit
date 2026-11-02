'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/context/ProductContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Función auxiliar para normalizar strings (quitar acentos y minúsculas)
const normalize = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { products } = useProducts();
  
  const slug = params.slug as string;
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';

  // Mapeo de slugs a nombres de categoría reales
  const categoryMap: Record<string, string> = {
    'proteinas':    'Proteínas',
    'pre-workout':  'Pre-Workout & Energía',
    'recuperacion': 'Recuperación',
    'salud':        'Salud & Vitaminas',
  };

  const categoryName = categoryMap[slug];

  // Filtrar productos por categoría Y búsqueda
  const categoryProducts = products.filter((product) => {
    const matchesCategory = normalize(product.category) === normalize(categoryName || '');
    const matchesSearch = product.name.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (!categoryName) {
    return (
      <div className="min-h-screen bg-black text-white font-sans">
        <Navbar />
        <CartDrawer />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Categoría no encontrada</h1>
          <Link href="/" className="text-neon-green hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-green selection:text-black">
      <Navbar />
      <CartDrawer />

      <main className="container mx-auto px-4 py-12">
        {/* Header de Categoría */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-neon-green mb-6 transition-colors">
            <ArrowLeft size={20} />
            Volver al inicio
          </Link>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Categoría: <span className="text-neon-green">{categoryName}</span>
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">
            {searchQuery 
              ? `Resultados para "${searchQuery}" en ${categoryName}`
              : `Explora nuestra selección de productos para ${categoryName.toLowerCase()}.`
            }
          </p>
        </div>

        {/* Grid de Productos */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <p className="text-xl text-zinc-400">
              {searchQuery 
                ? `No se encontraron productos que coincidan con "${searchQuery}" en esta categoría.`
                : "No hay productos disponibles en esta categoría por el momento."
              }
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-12 mt-12">
        <div className="container mx-auto px-4 text-center text-zinc-500 text-sm">
          <p>&copy; 2026 VitaliFit. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
