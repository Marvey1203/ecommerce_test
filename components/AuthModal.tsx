'use client';

import { useStore } from '@/lib/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const schema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type FormData = z.infer<typeof schema>;

export function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, login, cart } = useStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    login(data.email);
    reset();
    if (cart.length > 0) {
      router.push('/checkout');
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setAuthModalOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <h2 className="text-3xl font-serif font-light text-white mb-2">Sign In</h2>
          <p className="text-gray-400 mb-8 text-sm">
            Enter your details to access your account and complete your purchase.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-2">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-2">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black rounded-xl py-4 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 mt-4"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
