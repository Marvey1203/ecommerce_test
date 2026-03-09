import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/AuthModal';
import { CheckoutModal } from '@/components/CheckoutModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'AURA | Premium Vaporizers',
  description: 'Elevate your experience with our premium collection of meticulously crafted vaporizers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-black text-white antialiased selection:bg-white/30 selection:text-white" suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
        <CartDrawer />
        <AuthModal />
        <CheckoutModal />
      </body>
    </html>
  );
}
