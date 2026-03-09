'use client';

import { useStore } from '@/lib/store';
import { ShoppingCart, User, X, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

export function Navbar() {
  const { user, cart, setAuthModalOpen, setCartOpen, logout } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif font-bold tracking-tighter text-white cursor-pointer">
          AURA
        </Link>
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/account" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
                <UserCircle size={20} />
                <span className="hidden sm:block">{user.email}</span>
              </Link>
              <button
                onClick={logout}
                className="text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <User size={18} />
              <span>Sign In</span>
            </button>
          )}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white cursor-pointer"
          >
            <ShoppingCart size={18} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </nav>
  );
}
