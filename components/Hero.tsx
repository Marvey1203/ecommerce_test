'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/seed/vape-smoke/1920/1080"
          alt="Atmospheric smoke"
          fill
          className="object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black" />
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-serif font-light text-white mb-6 tracking-tight"
        >
          Elevate Your <br className="hidden md:block" />
          <span className="italic text-white/80">Experience</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light"
        >
          Discover our premium collection of meticulously crafted vaporizers. 
          Designed for the modern connoisseur.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <button 
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-white text-black rounded-full font-medium tracking-wide hover:bg-gray-200 transition-colors"
          >
            Explore Collection
          </button>
        </motion.div>
      </div>
    </section>
  );
}
