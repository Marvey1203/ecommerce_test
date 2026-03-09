'use client';

import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
  const {
    isCartOpen,
    setCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    user,
    setAuthModalOpen,
  } = useStore();
  const router = useRouter();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setCartOpen(false);
    if (!user) {
      setAuthModalOpen(true);
    } else {
      router.push('/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[101] flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <ShoppingBag size={20} />
                Your Cart
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p>Your cart is empty.</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="text-white border-b border-white pb-1 hover:text-gray-300 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-24 h-24 bg-[#1a1a1a] rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-white font-medium">{item.name}</h3>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-500 hover:text-red-400 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <p className="text-gray-400 text-sm mt-1">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 w-fit rounded-lg p-1 border border-white/10 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-white text-sm w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className={`p-1 transition-colors ${item.quantity >= item.stock ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:text-white cursor-pointer'}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-2xl font-medium text-white">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-white text-black py-4 rounded-xl font-medium hover:bg-gray-200 transition-colors uppercase tracking-wide text-sm"
                >
                  Checkout
                </button>
                {!user && (
                  <p className="text-center text-xs text-gray-500 mt-4">
                    You will be asked to sign in before completing your purchase.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
