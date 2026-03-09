'use client';

import { use } from 'react';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { notFound } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useCallback } from 'react';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { products, addToCart, setCartOpen } = useStore();
  const product = products.find(p => p.id === id);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!product) {
    notFound();
  }

  const recommendedProducts = products.filter(p => p.id !== id).slice(0, 3);
  const displayImages = product.images || [product.image];

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* Image Carousel */}
          <div className="relative bg-[#111] rounded-3xl overflow-hidden border border-white/5 aspect-[4/5] lg:aspect-square">
            <div className="overflow-hidden h-full" ref={emblaRef}>
              <div className="flex h-full">
                {displayImages.map((img, index) => (
                  <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
                    <Image
                      src={img}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {displayImages.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
                <button
                  onClick={scrollPrev}
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={scrollNext}
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl md:text-6xl font-serif font-light text-white">{product.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                product.stock > 10 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                product.stock > 0 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>
            <p className="text-2xl text-gray-300 mb-8">${product.price.toFixed(2)}</p>
            
            <div className="prose prose-invert mb-10">
              <p className="text-gray-400 text-lg leading-relaxed font-light">
                {product.detailedDescription || product.description}
              </p>
            </div>

            <div className="space-y-4 mt-auto">
              <button
                onClick={() => {
                  if (product.stock > 0) {
                    addToCart(product);
                    setCartOpen(true);
                  }
                }}
                disabled={product.stock <= 0}
                className={`w-full py-4 rounded-full font-medium transition-colors uppercase tracking-wide ${
                  product.stock <= 0 
                    ? 'bg-white/10 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-black hover:bg-gray-200 cursor-pointer'
                }`}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="border-t border-white/10 pt-16">
            <h2 className="text-3xl font-serif font-light text-white mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
