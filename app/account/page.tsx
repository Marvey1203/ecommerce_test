'use client';

import { useState, useEffect } from 'react';
import { useStore, Order } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Package, Settings, Bell, LogOut, ArrowLeft, Save, CheckCircle2, X, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'orders' | 'settings' | 'notifications';

export default function AccountDashboard() {
  const { user, logout, toggleSubscription, updateProfile, updateNotifications, setSubscription, addOrder } = useStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [isSaved, setIsSaved] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSubModalOpen, setSubModalOpen] = useState(false);
  const [isViewSubModalOpen, setViewSubModalOpen] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);

  const PACKAGES = [
    { id: 'Low', name: 'Essential', price: 9.99, desc: 'Basic perks and early access.' },
    { id: 'Medium', name: 'Premium', price: 19.99, desc: 'Free shipping and exclusive drops.' },
    { id: 'Large', name: 'Elite', price: 29.99, desc: 'All perks plus monthly samples.' }
  ] as const;

  const handleSubscribe = (pkg: { id: string, name: string, price: number, desc: string }) => {
    setSubscription(pkg.id as any);
    addOrder({
      id: `SUB-${crypto.randomUUID().split('-')[0].toUpperCase()}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      total: pkg.price,
      status: 'Delivered',
      items: [{
        id: `sub-${pkg.id}`,
        name: `Inner Circle - ${pkg.name} Tier`,
        price: pkg.price,
        quantity: 1,
        image: 'https://picsum.photos/seed/vip/800/1000',
        description: 'Monthly Inner Circle Subscription',
        stock: 0
      }]
    });
    setSubSuccess(true);
    setTimeout(() => {
      setSubSuccess(false);
      setSubModalOpen(false);
    }, 2500);
  };

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-4xl font-serif font-light text-white mb-12">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <div className="p-6 bg-[#111] rounded-2xl border border-white/10 mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white text-xl font-medium mb-4">
                {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <p className="text-white font-medium truncate">
                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
              </p>
              <p className="text-sm text-gray-500 mt-1">Member since {new Date().getFullYear()}</p>
            </div>

            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'orders' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Package size={18} />
                <span className="font-medium">Order History</span>
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings size={18} />
                <span className="font-medium">Account Settings</span>
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'notifications' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Bell size={18} />
                <span className="font-medium">Notifications</span>
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors mt-4 cursor-pointer"
              >
                <LogOut size={18} />
                <span className="font-medium">Sign Out</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                {/* Inner Circle Subscription */}
                <section>
                  <h2 className="text-2xl font-serif font-light text-white mb-6">Inner Circle Subscription</h2>
                  <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        {user.subscriptionTier !== 'None' ? `Inner Circle: ${user.subscriptionTier} Tier` : 'Exclusive Updates & Offers'}
                      </h3>
                      <p className="text-gray-400 text-sm max-w-md">
                        {user.subscriptionTier !== 'None'
                          ? 'You are currently subscribed to the Inner Circle. Enjoy your exclusive perks and early access.'
                          : 'Receive early access to new product drops, exclusive discounts, and curated content directly to your inbox.'}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      {user.subscriptionTier !== 'None' && (
                        <button
                          onClick={() => setViewSubModalOpen(true)}
                          className="px-6 py-3 rounded-xl font-medium text-sm transition-colors cursor-pointer whitespace-nowrap bg-white text-black hover:bg-gray-200"
                        >
                          View Subscription
                        </button>
                      )}
                      <button
                        onClick={() => user.subscriptionTier !== 'None' ? setSubscription('None') : setSubModalOpen(true)}
                        className={`px-6 py-3 rounded-xl font-medium text-sm transition-colors cursor-pointer whitespace-nowrap ${
                          user.subscriptionTier !== 'None' 
                            ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
                            : 'bg-white text-black hover:bg-gray-200'
                        }`}
                      >
                        {user.subscriptionTier !== 'None' ? 'Cancel Subscription' : 'Join Inner Circle'}
                      </button>
                    </div>
                  </div>
                </section>

                {/* Order History */}
                <section>
                  <h2 className="text-2xl font-serif font-light text-white mb-6">Order History</h2>
                  
                  {user.orders.length === 0 ? (
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-12 text-center">
                      <Package size={48} className="mx-auto text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No orders yet</h3>
                      <p className="text-gray-400 mb-6">When you make a purchase, it will appear here.</p>
                      <Link 
                        href="/"
                        className="inline-block px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {/* Product Orders */}
                      {user.orders.filter(o => !o.id.startsWith('SUB-')).length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                            <Package size={20} className="text-gray-400" />
                            Product Orders
                          </h3>
                          <div className="space-y-6">
                            {user.orders.filter(o => !o.id.startsWith('SUB-')).map((order) => (
                              <div 
                                key={order.id} 
                                onClick={() => setSelectedOrder(order)}
                                className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-white/30 transition-colors group"
                              >
                                <div className="p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors">
                                  <div>
                                    <p className="text-sm text-gray-400 mb-1">Order Placed</p>
                                    <p className="text-white font-medium">{order.date}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-400 mb-1">Total</p>
                                    <p className="text-white font-medium">${order.total.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-400 mb-1">Order #</p>
                                    <p className="text-white font-medium">{order.id}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                      {order.status}
                                    </span>
                                  </div>
                                </div>
                                <div className="p-6 flex items-center justify-between">
                                  <div className="flex -space-x-4">
                                    {order.items.map((item, idx) => (
                                      <div key={`${item.id}-${idx}`} className="relative w-12 h-12 rounded-full border-2 border-[#111] overflow-hidden bg-[#1a1a1a]" style={{ zIndex: 10 - idx }}>
                                        <Image src={item.image} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                                      </div>
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">View Details &rarr;</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Subscription Orders */}
                      {user.orders.filter(o => o.id.startsWith('SUB-')).length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                            <Star size={20} className="text-gray-400" />
                            Subscriptions
                          </h3>
                          <div className="space-y-6">
                            {user.orders.filter(o => o.id.startsWith('SUB-')).map((order) => (
                              <div 
                                key={order.id} 
                                onClick={() => setSelectedOrder(order)}
                                className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-white/30 transition-colors group"
                              >
                                <div className="p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors">
                                  <div>
                                    <p className="text-sm text-gray-400 mb-1">Date</p>
                                    <p className="text-white font-medium">{order.date}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-400 mb-1">Total</p>
                                    <p className="text-white font-medium">${order.total.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-400 mb-1">Subscription #</p>
                                    <p className="text-white font-medium">{order.id}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                      {order.status}
                                    </span>
                                  </div>
                                </div>
                                <div className="p-6 flex items-center justify-between">
                                  <div className="flex -space-x-4">
                                    {order.items.map((item, idx) => (
                                      <div key={`${item.id}-${idx}`} className="relative w-12 h-12 rounded-full border-2 border-[#111] overflow-hidden bg-[#1a1a1a]" style={{ zIndex: 10 - idx }}>
                                        <Image src={item.image} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                                      </div>
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">View Details &rarr;</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <section>
                  <h2 className="text-2xl font-serif font-light text-white mb-6">Account Settings</h2>
                  <form onSubmit={handleProfileSave} className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-gray-500">First Name</label>
                        <input 
                          type="text" 
                          value={profileForm.firstName} 
                          onChange={e => setProfileForm({...profileForm, firstName: e.target.value})} 
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" 
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-gray-500">Last Name</label>
                        <input 
                          type="text" 
                          value={profileForm.lastName} 
                          onChange={e => setProfileForm({...profileForm, lastName: e.target.value})} 
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" 
                          placeholder="Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-gray-500">Email Address</label>
                        <input 
                          type="email" 
                          value={profileForm.email} 
                          onChange={e => setProfileForm({...profileForm, email: e.target.value})} 
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" 
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-gray-500">Phone Number</label>
                        <input 
                          type="tel" 
                          value={profileForm.phone} 
                          onChange={e => setProfileForm({...profileForm, phone: e.target.value})} 
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" 
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                      <AnimatePresence>
                        {isSaved ? (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-green-400 text-sm"
                          >
                            <CheckCircle2 size={16} />
                            <span>Settings saved successfully</span>
                          </motion.div>
                        ) : (
                          <div />
                        )}
                      </AnimatePresence>
                      <button 
                        type="submit" 
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        <Save size={18} />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </form>
                </section>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <section>
                  <h2 className="text-2xl font-serif font-light text-white mb-6">Notification Preferences</h2>
                  <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 space-y-2">
                    
                    <div className="flex items-center justify-between py-4 border-b border-white/5">
                      <div className="pr-4">
                        <h3 className="text-white font-medium mb-1">Order Updates</h3>
                        <p className="text-sm text-gray-500">Receive notifications about your order status and shipping.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={user.notifications.orderUpdates} 
                          onChange={(e) => updateNotifications({ orderUpdates: e.target.checked })} 
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/30"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-white/5">
                      <div className="pr-4">
                        <h3 className="text-white font-medium mb-1">Marketing Emails</h3>
                        <p className="text-sm text-gray-500">Receive emails about new products, features, and more.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={user.notifications.marketing} 
                          onChange={(e) => updateNotifications({ marketing: e.target.checked })} 
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/30"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4">
                      <div className="pr-4">
                        <h3 className="text-white font-medium mb-1">SMS Notifications</h3>
                        <p className="text-sm text-gray-500">Receive text messages for urgent updates and exclusive drops.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={user.notifications.sms} 
                          onChange={(e) => updateNotifications({ sms: e.target.checked })} 
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/30"></div>
                      </label>
                    </div>

                  </div>
                </section>
              </motion.div>
            )}

          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      <AnimatePresence>
        {isSubModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !subSuccess && setSubModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden z-10"
            >
              {!subSuccess && (
                <button
                  onClick={() => setSubModalOpen(false)}
                  className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors cursor-pointer z-20"
                >
                  <X size={24} />
                </button>
              )}
              
              {subSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 size={40} className="text-green-400" />
                  </motion.div>
                  <h2 className="text-3xl font-serif font-light text-white mb-4">Welcome to the Inner Circle!</h2>
                  <p className="text-gray-400">Thank you for subscribing. Your order history has been updated.</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif font-light text-white mb-4">Choose Your Package</h2>
                    <p className="text-gray-400">Select the Inner Circle tier that best fits your lifestyle.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PACKAGES.map((pkg) => (
                      <div key={pkg.id} className="bg-black border border-white/10 rounded-2xl p-6 flex flex-col hover:border-white/30 transition-colors">
                        <h3 className="text-xl font-medium text-white mb-2">{pkg.name}</h3>
                        <div className="text-2xl text-white mb-4">${pkg.price}<span className="text-sm text-gray-500">/mo</span></div>
                        <p className="text-sm text-gray-400 mb-8 flex-grow">{pkg.desc}</p>
                        <button
                          onClick={() => handleSubscribe(pkg)}
                          className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          Select {pkg.id}
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Subscription Modal */}
      <AnimatePresence>
        {isViewSubModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setViewSubModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden z-10"
            >
              <button
                onClick={() => setViewSubModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors cursor-pointer z-20"
              >
                <X size={24} />
              </button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star size={32} className="text-white" />
                </div>
                <h2 className="text-3xl font-serif font-light text-white mb-2">Your Subscription</h2>
                <p className="text-gray-400">Inner Circle {user.subscriptionTier} Tier</p>
              </div>
              
              <div className="bg-black border border-white/10 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-medium text-white mb-4">Current Perks</h3>
                <ul className="space-y-3 text-gray-400 text-sm">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-green-400" />
                    <span>Early access to new product drops</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-green-400" />
                    <span>Exclusive member-only discounts</span>
                  </li>
                  {user.subscriptionTier === 'Medium' || user.subscriptionTier === 'Large' ? (
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-green-400" />
                      <span>Free priority shipping on all orders</span>
                    </li>
                  ) : null}
                  {user.subscriptionTier === 'Large' ? (
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-green-400" />
                      <span>Monthly curated sample boxes</span>
                    </li>
                  ) : null}
                </ul>
              </div>
              
              <button
                onClick={() => setViewSubModalOpen(false)}
                className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors cursor-pointer z-20"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-serif font-light text-white mb-6 flex-shrink-0">Order Details</h2>
              
              <div className="overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex flex-wrap gap-6 mb-8 pb-6 border-b border-white/10">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Number</p>
                    <p className="text-white font-medium">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date Placed</p>
                    <p className="text-white font-medium">{selectedOrder.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="text-white font-medium">${selectedOrder.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-white mb-4">Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                      <div className="relative w-20 h-20 bg-[#1a1a1a] rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <Link href={`/product/${item.id}`} className="text-white font-medium hover:text-gray-300 transition-colors cursor-pointer" onClick={() => setSelectedOrder(null)}>
                          {item.name}
                        </Link>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-1">{item.description}</p>
                        <p className="text-gray-400 text-sm mt-2">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-white font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
