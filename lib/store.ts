import { create } from 'zustand';
import { products as initialProducts } from './data';

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  detailedDescription?: string;
  tags?: string[];
  stock: number;
};

export type CartItem = Product & { quantity: number };

export type Order = {
  id: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  items: CartItem[];
};

export type AdminOrder = Order & {
  customer: {
    name: string;
    email: string;
    location: string;
  };
};

export type AdminSubscription = {
  id: string;
  email: string;
  tier: SubscriptionTier;
  startDate: string;
  status: 'Active' | 'Cancelled';
};

export type SubscriptionTier = 'None' | 'Low' | 'Medium' | 'Large';

export type UserProfile = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isSubscribed: boolean;
  subscriptionTier: SubscriptionTier;
  orders: Order[];
  notifications: {
    marketing: boolean;
    sms: boolean;
    orderUpdates: boolean;
  };
};

const FAKE_ORDERS: Order[] = [
  {
    id: 'ORD-7X9Q2P',
    date: 'October 12, 2025',
    total: 144.99,
    status: 'Delivered',
    items: [
      {
        id: '1',
        name: 'Aura Pro',
        price: 129.99,
        image: 'https://picsum.photos/seed/vape1/800/1000',
        description: 'Our flagship model with precision temperature control and extended battery life.',
        quantity: 1,
        stock: 50
      }
    ]
  },
  {
    id: 'ORD-3M5B1L',
    date: 'March 05, 2026',
    total: 94.99,
    status: 'Shipped',
    items: [
      {
        id: '2',
        name: 'Aura Lite',
        price: 79.99,
        image: 'https://picsum.photos/seed/vape2/800/1000',
        description: 'Compact, discreet, and powerful. Perfect for on-the-go use.',
        quantity: 1,
        stock: 120
      }
    ]
  }
];

const FAKE_ADMIN_ORDERS: AdminOrder[] = [
  ...FAKE_ORDERS.map(o => ({
    ...o,
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      location: 'Cape Town, WC'
    }
  })),
  {
    id: 'ORD-9A2B4C',
    date: 'March 07, 2026',
    total: 259.98,
    status: 'Processing',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      location: 'Johannesburg, GP'
    },
    items: [
      {
        id: '3',
        name: 'Aura Max',
        price: 159.99,
        image: 'https://picsum.photos/seed/vape3/800/1000',
        description: 'Maximum cloud production with dual-chamber technology.',
        quantity: 1,
        stock: 30
      },
      {
        id: '4',
        name: 'Aura Classic',
        price: 99.99,
        image: 'https://picsum.photos/seed/vape4/800/1000',
        description: 'The original design that started it all, refined for modern standards.',
        quantity: 1,
        stock: 75
      }
    ]
  }
];

const FAKE_ADMIN_SUBSCRIPTIONS: AdminSubscription[] = [
  { id: 'SUB-123', email: 'jane@example.com', tier: 'Medium', startDate: 'January 15, 2026', status: 'Active' },
  { id: 'SUB-456', email: 'mike@example.com', tier: 'Large', startDate: 'February 01, 2026', status: 'Active' },
  { id: 'SUB-789', email: 'sarah@example.com', tier: 'Low', startDate: 'March 02, 2026', status: 'Cancelled' },
];

type StoreState = {
  products: Product[];
  user: UserProfile | null;
  cart: CartItem[];
  adminOrders: AdminOrder[];
  adminSubscriptions: AdminSubscription[];
  isAuthModalOpen: boolean;
  isCartOpen: boolean;
  isCheckoutModalOpen: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  login: (email: string) => void;
  logout: () => void;
  toggleSubscription: () => void;
  setSubscription: (tier: SubscriptionTier) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  updateNotifications: (data: Partial<UserProfile['notifications']>) => void;
  addOrder: (order: Order, customerInfo?: AdminOrder['customer']) => void;
  updateAdminOrderStatus: (orderId: string, status: Order['status']) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setAuthModalOpen: (isOpen: boolean) => void;
  setCartOpen: (isOpen: boolean) => void;
  setCheckoutModalOpen: (isOpen: boolean) => void;
};

export const useStore = create<StoreState>((set) => ({
  products: initialProducts,
  user: null,
  cart: [],
  adminOrders: FAKE_ADMIN_ORDERS,
  adminSubscriptions: FAKE_ADMIN_SUBSCRIPTIONS,
  isAuthModalOpen: false,
  isCartOpen: false,
  isCheckoutModalOpen: false,
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, product) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...product } : p)
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),
  login: (email) => set({ 
    user: { 
      email, 
      firstName: '',
      lastName: '',
      phone: '',
      isSubscribed: false, 
      subscriptionTier: 'None',
      orders: FAKE_ORDERS,
      notifications: {
        marketing: true,
        sms: false,
        orderUpdates: true
      }
    }, 
    isAuthModalOpen: false 
  }),
  logout: () => set({ user: null }),
  toggleSubscription: () => set((state) => ({
    user: state.user ? { ...state.user, isSubscribed: !state.user.isSubscribed, subscriptionTier: state.user.isSubscribed ? 'None' : 'Low' } : null
  })),
  setSubscription: (tier) => set((state) => ({
    user: state.user ? { ...state.user, isSubscribed: tier !== 'None', subscriptionTier: tier } : null
  })),
  updateProfile: (data) => set((state) => ({
    user: state.user ? { ...state.user, ...data } : null
  })),
  updateNotifications: (data) => set((state) => ({
    user: state.user ? { ...state.user, notifications: { ...state.user.notifications, ...data } } : null
  })),
  addOrder: (order, customerInfo) => set((state) => {
    const newAdminOrder: AdminOrder = {
      ...order,
      customer: customerInfo || {
        name: state.user?.firstName ? `${state.user.firstName} ${state.user.lastName}` : 'Guest',
        email: state.user?.email || 'guest@example.com',
        location: 'Unknown Location'
      }
    };
    
    // If it's a subscription order, add to admin subscriptions
    let newAdminSubs = [...state.adminSubscriptions];
    if (order.id.startsWith('SUB-')) {
      const tierMatch = order.items[0]?.name.match(/Inner Circle - (.*) Tier/);
      const tier = tierMatch ? tierMatch[1] as SubscriptionTier : 'Low';
      newAdminSubs = [{
        id: order.id,
        email: state.user?.email || 'guest@example.com',
        tier,
        startDate: order.date,
        status: 'Active'
      }, ...newAdminSubs];
    }

    // Decrement stock for purchased items
    const updatedProducts = state.products.map(product => {
      const purchasedItem = order.items.find(item => item.id === product.id);
      if (purchasedItem) {
        return { ...product, stock: Math.max(0, product.stock - purchasedItem.quantity) };
      }
      return product;
    });

    return {
      products: updatedProducts,
      user: state.user ? { ...state.user, orders: [order, ...state.user.orders] } : null,
      adminOrders: [newAdminOrder, ...state.adminOrders],
      adminSubscriptions: newAdminSubs
    };
  }),
  updateAdminOrderStatus: (orderId, status) => set((state) => ({
    adminOrders: state.adminOrders.map(o => o.id === orderId ? { ...o, status } : o),
    user: state.user ? {
      ...state.user,
      orders: state.user.orders.map(o => o.id === orderId ? { ...o, status } : o)
    } : null
  })),
  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          return { cart: state.cart };
        }
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      if (product.stock <= 0) return { cart: state.cart };
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => {
      const product = state.products.find(p => p.id === productId);
      const maxQuantity = product ? product.stock : Infinity;
      return {
        cart: state.cart.map((item) =>
          item.id === productId ? { ...item, quantity: Math.min(Math.max(1, quantity), maxQuantity) } : item
        ),
      };
    }),
  clearCart: () => set({ cart: [] }),
  setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  setCheckoutModalOpen: (isOpen) => set({ isCheckoutModalOpen: isOpen }),
}));
