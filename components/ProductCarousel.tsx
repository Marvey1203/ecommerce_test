'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback } from 'react';
import { useStore } from '@/lib/store';

export function ProductCarousel() {
  const { products } = useStore();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section id="products" className="py-32 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex items-end justify-between">
        <div>
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-4 text-white">
            The Collection
          </h2>
          <p className="text-gray-400 max-w-md font-light">
            Discover our range of premium devices, engineered for the perfect draw every time.
          </p>
        </div>
        <div className="hidden md:flex gap-4">
          <button
            onClick={scrollPrev}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={scrollNext}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
