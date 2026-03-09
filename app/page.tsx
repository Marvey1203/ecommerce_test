import { Hero } from '@/components/Hero';
import { ProductCarousel } from '@/components/ProductCarousel';
import { EmailSignup } from '@/components/EmailSignup';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <EmailSignup />
      <ProductCarousel />
      
      <footer className="py-12 border-t border-white/10 bg-black text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} AURA Premium Vaporizers. All rights reserved.</p>
        <p className="mt-2">Must be of legal smoking age to purchase.</p>
        <div className="mt-6">
          <Link href="/admin" className="text-gray-600 hover:text-white transition-colors cursor-pointer">Admin Dashboard</Link>
        </div>
      </footer>
    </div>
  );
}
