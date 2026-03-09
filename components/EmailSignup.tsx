'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type FormData = z.infer<typeof schema>;

export function EmailSignup() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Subscribed:', data.email);
    setIsSubmitted(true);
  };

  return (
    <section className="py-32 bg-[#0a0a0a] border-y border-white/5">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-serif font-light text-white mb-6">
          Join the Inner Circle
        </h2>
        <p className="text-gray-400 mb-12 max-w-xl mx-auto font-light text-lg">
          Subscribe to receive exclusive access to limited edition drops, early product releases, and curated content.
        </p>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 text-white inline-block"
          >
            <p className="text-lg font-medium">Welcome to the club.</p>
            <p className="text-sm text-gray-400 mt-2">Check your inbox for confirmation.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto relative">
            <div className="relative flex items-center">
              <input
                {...register('email')}
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-transparent border-b border-white/20 py-4 pr-32 text-white placeholder:text-gray-600 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="absolute right-0 text-sm font-medium uppercase tracking-wider text-white hover:text-gray-300 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Joining...' : 'Subscribe'}
              </button>
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-left mt-2 absolute"
              >
                {errors.email.message}
              </motion.p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
