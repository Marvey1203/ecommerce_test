'use client';

import { useState, useMemo } from 'react';
import { useStore, AdminOrder, AdminSubscription, Product } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Package, Users, TrendingUp, Star, ArrowLeft, Search, CheckCircle2, Clock, Plus, Edit2, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

type Tab = 'overview' | 'orders' | 'subscriptions' | 'products';

export default function AdminDashboard() {
  const { adminOrders, adminSubscriptions, updateAdminOrderStatus, products, addProduct, updateProduct, deleteProduct } = useStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Product Management State
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    price: 0,
    image: '',
    description: '',
    detailedDescription: '',
    stock: 0
  });

  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm(product);
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        price: 0,
        image: 'https://picsum.photos/seed/newvape/800/1000',
        description: '',
        detailedDescription: '',
        stock: 0
      });
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
    } else {
      addProduct({
        ...productForm,
        id: crypto.randomUUID(),
        images: [productForm.image as string, productForm.image as string, productForm.image as string]
      } as Product);
    }
    setProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  // Derived metrics
  const totalRevenue = adminOrders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = adminOrders.length;
  const activeSubs = adminSubscriptions.filter(s => s.status === 'Active').length;

  // Chart data: Orders over time (mocked by date)
  const chartData = useMemo(() => {
    const dataByDate: Record<string, number> = {};
    adminOrders.forEach(order => {
      const dateStr = order.date; // e.g., "October 12, 2025"
      const dateObj = new Date(dateStr);
      const monthYear = `${dateObj.toLocaleString('default', { month: 'short' })} ${dateObj.getFullYear()}`;
      if (!dataByDate[monthYear]) {
        dataByDate[monthYear] = 0;
      }
      dataByDate[monthYear] += 1;
    });
    
    return Object.keys(dataByDate).map(date => ({
      name: date,
      orders: dataByDate[date]
    })).reverse(); // Reverse to show chronological if data was descending
  }, [adminOrders]);

  // Popular products
  const popularProducts = useMemo(() => {
    const counts: Record<string, { count: number, name: string, image: string }> = {};
    adminOrders.forEach(order => {
      order.items.forEach(item => {
        if (!counts[item.id]) {
          counts[item.id] = { count: 0, name: item.name, image: item.image };
        }
        counts[item.id].count += item.quantity;
      });
    });
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [adminOrders]);

  // Filtered orders
  const filteredOrders = adminOrders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span>Back to Store</span>
        </Link>

        <h1 className="text-4xl font-serif font-light text-white mb-12">Admin Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <nav className="space-y-1 sticky top-28">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'overview' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <TrendingUp size={18} />
                <span className="font-medium">Overview</span>
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'orders' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Package size={18} />
                <span className="font-medium">Orders</span>
              </button>
              <button 
                onClick={() => setActiveTab('subscriptions')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'subscriptions' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Star size={18} />
                <span className="font-medium">Subscriptions</span>
              </button>
              <button 
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'products' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Package size={18} />
                <span className="font-medium">Products</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-8">
            
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                    <p className="text-sm text-gray-400 mb-2">Total Revenue</p>
                    <p className="text-3xl font-medium text-white">${totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                    <p className="text-sm text-gray-400 mb-2">Total Orders</p>
                    <p className="text-3xl font-medium text-white">{totalOrders}</p>
                  </div>
                  <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                    <p className="text-sm text-gray-400 mb-2">Active Subscriptions</p>
                    <p className="text-3xl font-medium text-white">{activeSubs}</p>
                  </div>
                </div>

                {/* Charts */}
                <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-medium text-white mb-6">Orders Over Time</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="name" stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                        <YAxis stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="orders" fill="#fff" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Popular Products */}
                <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-medium text-white mb-6">Popular Products</h3>
                  <div className="space-y-4">
                    {popularProducts.map((product, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 bg-[#1a1a1a] rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={product.image} alt={product.name} fill className="object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <span className="text-white font-medium">{product.name}</span>
                        </div>
                        <div className="text-gray-400">
                          <span className="text-white font-medium">{product.count}</span> sold
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between bg-[#111] border border-white/10 rounded-2xl p-4">
                  <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search orders by ID, name, or email..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
                      <div className="p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-white/[0.02]">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Order #</p>
                          <p className="text-white font-medium">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Date</p>
                          <p className="text-white font-medium">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Customer</p>
                          <p className="text-white font-medium">{order.customer.name}</p>
                          <p className="text-xs text-gray-500">{order.customer.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Total</p>
                          <p className="text-white font-medium">${order.total.toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                            order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          }`}>
                            {order.status}
                          </span>
                          {order.status === 'Processing' && (
                            <button 
                              onClick={() => updateAdminOrderStatus(order.id, 'Shipped')}
                              className="text-xs text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors cursor-pointer"
                            >
                              Mark as Shipped
                            </button>
                          )}
                          {order.status === 'Shipped' && (
                            <button 
                              onClick={() => updateAdminOrderStatus(order.id, 'Delivered')}
                              className="text-xs text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors cursor-pointer"
                            >
                              Mark as Delivered
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="p-6 bg-black/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Items</h4>
                            <div className="space-y-3">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="relative w-10 h-10 bg-[#1a1a1a] rounded overflow-hidden flex-shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                                  </div>
                                  <div>
                                    <p className="text-white text-sm">{item.name}</p>
                                    <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Shipping Location</h4>
                            <p className="text-white text-sm">{order.customer.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      No orders found matching your search.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'subscriptions' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02]">
                        <th className="p-4 text-sm font-medium text-gray-400">ID</th>
                        <th className="p-4 text-sm font-medium text-gray-400">Customer Email</th>
                        <th className="p-4 text-sm font-medium text-gray-400">Tier</th>
                        <th className="p-4 text-sm font-medium text-gray-400">Start Date</th>
                        <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminSubscriptions.map((sub) => (
                        <tr key={sub.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 text-sm text-white">{sub.id}</td>
                          <td className="p-4 text-sm text-white">{sub.email}</td>
                          <td className="p-4 text-sm text-white">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/10 text-white">
                              {sub.tier}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-400">{sub.startDate}</td>
                          <td className="p-4 text-sm">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                              sub.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between bg-[#111] border border-white/10 rounded-2xl p-4">
                  <h2 className="text-xl font-medium text-white px-2">Products</h2>
                  <button
                    onClick={() => handleOpenProductModal()}
                    className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <Plus size={18} />
                    <span>Add Product</span>
                  </button>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02]">
                        <th className="p-4 text-sm font-medium text-gray-400 w-20">Image</th>
                        <th className="p-4 text-sm font-medium text-gray-400">Name</th>
                        <th className="p-4 text-sm font-medium text-gray-400">Price</th>
                        <th className="p-4 text-sm font-medium text-gray-400">Stock</th>
                        <th className="p-4 text-sm font-medium text-gray-400">Tags</th>
                        <th className="p-4 text-sm font-medium text-gray-400 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <div className="relative w-12 h-12 bg-[#1a1a1a] rounded-lg overflow-hidden">
                              <Image src={product.image} alt={product.name} fill className="object-cover" referrerPolicy="no-referrer" />
                            </div>
                          </td>
                          <td className="p-4 text-sm text-white font-medium">{product.name}</td>
                          <td className="p-4 text-sm text-gray-300">${product.price.toFixed(2)}</td>
                          <td className="p-4 text-sm">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              product.stock > 10 ? 'bg-green-500/10 text-green-400' : 
                              product.stock > 0 ? 'bg-yellow-500/10 text-yellow-400' : 
                              'bg-red-500/10 text-red-400'
                            }`}>
                              {product.stock} in stock
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-2">
                              {product.tags?.map((tag, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/10 text-gray-300">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleOpenProductModal(product)}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setProductModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setProductModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors cursor-pointer z-20"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-serif font-light text-white mb-6 flex-shrink-0">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>

              <form onSubmit={handleSaveProduct} className="overflow-y-auto pr-2 custom-scrollbar space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-xs uppercase tracking-wider text-gray-500">Product Name</label>
                    <input 
                      type="text" 
                      required
                      value={productForm.name} 
                      onChange={e => setProductForm({...productForm, name: e.target.value})} 
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-xs uppercase tracking-wider text-gray-500">Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={productForm.price} 
                      onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value)})} 
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-xs uppercase tracking-wider text-gray-500">Stock</label>
                    <input 
                      type="number" 
                      min="0"
                      required
                      value={productForm.stock} 
                      onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value) || 0})} 
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-500">Image URL</label>
                  <input 
                    type="url" 
                    required
                    value={productForm.image} 
                    onChange={e => setProductForm({...productForm, image: e.target.value})} 
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-500">Tags (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Pro, Advanced, Best Seller"
                    value={productForm.tags?.join(', ') || ''} 
                    onChange={e => setProductForm({...productForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})} 
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-500">Short Description</label>
                  <input 
                    type="text" 
                    required
                    value={productForm.description} 
                    onChange={e => setProductForm({...productForm, description: e.target.value})} 
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-500">Detailed Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={productForm.detailedDescription} 
                    onChange={e => setProductForm({...productForm, detailedDescription: e.target.value})} 
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors resize-none" 
                  />
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setProductModalOpen(false)}
                    className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    {editingProduct ? 'Save Changes' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
