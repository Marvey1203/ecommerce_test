'use client';

import { useStore, Product } from '@/lib/store';
import Image from 'next/image';
import { motion } from 'motion/react';
import Link from 'next/link';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, setCartOpen } = useStore();
  const isOutOfStock = product.stock <= 0;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group flex flex-col bg-[#111] rounded-2xl overflow-hidden border border-white/5"
    >
      <Link href={`/product/${product.id}`} className="relative aspect-[4/5] w-full bg-[#1a1a1a] overflow-hidden cursor-pointer block">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'opacity-50' : 'opacity-80 group-hover:opacity-100'}`}
          referrerPolicy="no-referrer"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-medium text-sm tracking-wide uppercase">Out of Stock</span>
          </div>
        )}
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/product/${product.id}`}>
            <h3 className="text-xl font-medium text-white hover:text-gray-300 cursor-pointer transition-colors">{product.name}</h3>
          </Link>
          <span className="text-lg text-gray-400">${product.price}</span>
        </div>
        <p className="text-sm text-gray-500 mb-6 flex-grow">{product.description}</p>
        <button
          onClick={() => {
            if (!isOutOfStock) {
              addToCart(product);
              setCartOpen(true);
            }
          }}
          disabled={isOutOfStock}
          className={`w-full py-3 rounded-full border border-white/20 text-white transition-colors font-medium text-sm tracking-wide uppercase ${
            isOutOfStock 
              ? 'opacity-50 cursor-not-allowed bg-white/5' 
              : 'hover:bg-white hover:text-black cursor-pointer'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
}
