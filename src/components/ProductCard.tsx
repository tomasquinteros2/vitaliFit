"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, CheckCircle } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const outOfStock = product.inStock === false;

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className={`group relative bg-[#161616] border overflow-hidden transition-all duration-300 flex flex-col ${outOfStock ? 'border-zinc-800 opacity-70' : 'border-zinc-800 hover:border-brand-yellow'}`}>
      {/* Toast móvil */}
      <div
        className={`absolute inset-x-0 top-0 z-20 flex items-center justify-center gap-2 bg-brand-green text-white text-xs font-black uppercase tracking-widest py-2.5 transition-all duration-300 ${
          added ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}
      >
        <CheckCircle size={14} />
        ¡Agregado al carrito!
      </div>

      {/* Área clickeable hacia la página del producto */}
      <Link href={`/product/${product.id}`} className="block flex-1 flex flex-col">
        {/* Image */}
        <div className="relative h-56 w-full overflow-hidden bg-zinc-900 flex-shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${outOfStock ? 'grayscale' : 'group-hover:scale-105'}`}
          />
          {/* Category badge */}
          <div className="absolute top-0 left-0 bg-brand-green text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5">
            {product.category}
          </div>
          {product.isFeatured && !outOfStock && (
            <div className="absolute top-0 right-0 bg-brand-yellow text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5">
              Destacado
            </div>
          )}
          {/* Badge Sin Stock */}
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-black/70 border border-zinc-600 text-zinc-300 text-xs font-black uppercase tracking-widest px-4 py-2">
                Sin Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-base font-black text-white uppercase tracking-tight mb-1 leading-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="text-zinc-500 text-xs mb-5 line-clamp-2 flex-1">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-0.5">
                Precio
              </p>
              <span className={`text-2xl font-black ${outOfStock ? 'text-zinc-600' : 'text-white'}`}>
                ${Number(product.price).toLocaleString("es-AR")}
              </span>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">Transferencia</p>
            </div>

            {/* Botón separado para no propagar el click al Link */}
            <button
              onClick={(e) => { e.preventDefault(); handleAddToCart(); }}
              disabled={outOfStock}
              className={`flex items-center gap-2 px-4 py-2.5 font-black text-xs uppercase tracking-widest transition-colors ${
                outOfStock
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  : added
                  ? 'bg-brand-yellow text-white active:scale-95'
                  : 'bg-brand-green text-black hover:bg-brand-yellow-light active:scale-95'
              }`}
            >
              {added ? <CheckCircle size={16} /> : <ShoppingCart size={16} />}
              {outOfStock ? 'Sin Stock' : added ? '¡Listo!' : 'Añadir'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
