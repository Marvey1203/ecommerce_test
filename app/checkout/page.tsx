'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

export default function CheckoutInfoPage() {
  const { cart, user, setCheckoutModalOpen } = useStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    suburb: '',
    town: '',
    province: '',
    postalCode: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 15.00;
  const total = subtotal + shipping;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span>Back to Cart</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-serif font-light text-white mb-8">Shipping Information</h1>

            <form onSubmit={handleContinue} className="space-y-8">
              <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl text-white font-medium mb-6">Delivery Address</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500">First Name</label>
                    <input required type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500">Last Name</label>
                    <input required type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500">Phone Number (SA)</label>
                    <input required type="tel" placeholder="+27" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500">Street Address</label>
                    <input required type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500">Suburb</label>
                    <input required type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" value={formData.suburb} onChange={e => setFormData({...formData, suburb: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500">City / Town</label>
                    <input required type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" value={formData.town} onChange={e => setFormData({...formData, town: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500">Province</label>
                    <select required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer" value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})}>
                      <option value="">Select Province</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500">Postal Code</label>
                    <input required type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors uppercase tracking-wide cursor-pointer"
              >
                Continue to Payment
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sticky top-28">
              <h2 className="text-xl text-white font-medium mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-[#1a1a1a] rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-sm">{item.name}</h3>
                      <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-white text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-white/10 pt-6 mb-6 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white">${shipping.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-400">Total</span>
                  <span className="text-white font-medium">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
