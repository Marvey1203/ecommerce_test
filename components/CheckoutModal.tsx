'use client';

import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CheckoutModal() {
  const { isCheckoutModalOpen, setCheckoutModalOpen, cart, clearCart, addOrder } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0) + 15.00; // Added shipping

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Create order record
    const newOrder = {
      id: Math.random().toString(36).substring(2, 10).toUpperCase(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      total: total,
      status: 'Processing' as const,
      items: [...cart],
    };
    
    addOrder(newOrder);
    
    setIsProcessing(false);
    setIsSuccess(true);
    clearCart();
    
    // Auto close after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setCheckoutModalOpen(false);
      router.push('/account');
    }, 3000);
  };

  if (!isCheckoutModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
        >
          {!isSuccess && !isProcessing && (
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          )}

          {isSuccess ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 size={40} className="text-green-500" />
              </motion.div>
              <h2 className="text-3xl font-serif font-light text-white mb-2">Order Confirmed</h2>
              <p className="text-gray-400">Thank you for your purchase. Your premium experience awaits.</p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-serif font-light text-white mb-8 border-b border-white/10 pb-4">
                Secure Checkout
              </h2>
              
              <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">{item.quantity}x</span>
                      <span className="text-white">{item.name}</span>
                    </div>
                    <span className="text-gray-400">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6 mb-8">
                <div className="flex justify-between items-center text-xl">
                  <span className="text-gray-400">Total</span>
                  <span className="text-white font-medium">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-white text-black py-4 rounded-xl font-medium hover:bg-gray-200 transition-colors uppercase tracking-wide text-sm disabled:opacity-50 relative overflow-hidden"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                    />
                    Processing...
                  </span>
                ) : (
                  'Pay Now'
                )}
              </button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
