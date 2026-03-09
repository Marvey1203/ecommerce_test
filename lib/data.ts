import { Product } from './store';

export const products: Product[] = [
  {
    id: '1',
    name: 'Aura Pro',
    price: 129.99,
    image: 'https://picsum.photos/seed/vape1/800/1000',
    images: [
      'https://picsum.photos/seed/vape1/800/1000',
      'https://picsum.photos/seed/vape1-alt1/800/1000',
      'https://picsum.photos/seed/vape1-alt2/800/1000'
    ],
    description: 'Our flagship model with precision temperature control and extended battery life.',
    detailedDescription: 'Experience the pinnacle of vaping technology with the Aura Pro. Featuring a state-of-the-art ceramic heating chamber, precision temperature control down to the degree, and a massive 4000mAh battery that lasts for days. The aerospace-grade aluminum body ensures durability while maintaining a sleek, premium feel. Includes advanced haptic feedback and a high-resolution OLED display.',
    tags: ['Pro', 'Advanced', 'Best Seller'],
    stock: 50,
  },
  {
    id: '2',
    name: 'Aura Lite',
    price: 79.99,
    image: 'https://picsum.photos/seed/vape2/800/1000',
    images: [
      'https://picsum.photos/seed/vape2/800/1000',
      'https://picsum.photos/seed/vape2-alt1/800/1000',
      'https://picsum.photos/seed/vape2-alt2/800/1000'
    ],
    description: 'Compact, discreet, and powerful. Perfect for on-the-go use.',
    detailedDescription: 'The Aura Lite is designed for the modern minimalist. Weighing just 85 grams, it fits perfectly in any pocket while delivering uncompromising vapor quality. The intuitive one-button interface and smart-draw technology make it incredibly easy to use. Despite its size, it features a robust 1500mAh battery and fast USB-C charging.',
    tags: ['Lite', 'Starter', 'Compact'],
    stock: 120,
  },
  {
    id: '3',
    name: 'Aura Max',
    price: 159.99,
    image: 'https://picsum.photos/seed/vape3/800/1000',
    images: [
      'https://picsum.photos/seed/vape3/800/1000',
      'https://picsum.photos/seed/vape3-alt1/800/1000',
      'https://picsum.photos/seed/vape3-alt2/800/1000'
    ],
    description: 'Maximum cloud production with dual-chamber technology.',
    detailedDescription: 'For those who demand the absolute most from their device, the Aura Max delivers. Our patented dual-chamber technology allows for unprecedented cloud production and flavor purity. Customize your session with the companion mobile app, adjusting heating curves and tracking usage. The premium glass mouthpiece ensures the cleanest possible draw.',
    tags: ['Max', 'Advanced', 'High Power'],
    stock: 30,
  },
  {
    id: '4',
    name: 'Aura Classic',
    price: 99.99,
    image: 'https://picsum.photos/seed/vape4/800/1000',
    images: [
      'https://picsum.photos/seed/vape4/800/1000',
      'https://picsum.photos/seed/vape4-alt1/800/1000',
      'https://picsum.photos/seed/vape4-alt2/800/1000'
    ],
    description: 'The original design that started it all, refined for modern standards.',
    detailedDescription: 'A tribute to our original breakthrough device, the Aura Classic combines retro aesthetics with modern internals. We\'ve kept the iconic silhouette but upgraded everything inside: a new convection heating system, improved battery life, and medical-grade stainless steel airpaths. It\'s a timeless piece for the true aficionado.',
    tags: ['Classic', 'Retro', 'Reliable'],
    stock: 75,
  },
];
