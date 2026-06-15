import { Product, Category, BlogItem, BannerItem } from './types';

export const DUMMY_CATEGORIES: Category[] = [
  { id: '1', name: 'Cream Biscuits', slug: 'cream', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80', description: 'Luscious cream layered between crisp biscuits' },
  { id: '2', name: 'Chocolate Biscuits', slug: 'chocolate', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=400&q=80', description: 'Rich, dark chocolate indulgent treats' },
  { id: '3', name: 'Butter Cookies', slug: 'butter', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=400&q=80', description: 'Melt-in-your-mouth buttery goodness' },
  { id: '4', name: 'Digestive Biscuits', slug: 'digestive', image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=400&q=80', description: 'Healthy wheat-based crunchy delight' },
];

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Madagascar Vanilla Cream',
    description: 'Crispy golden biscuits filled with smooth, aromatic Madagascar vanilla cream. Perfect for teatime.',
    price: 12.99,
    stock: 150,
    categoryId: '1',
    categoryName: 'Cream Biscuits',
    brand: 'Organic Delight',
    images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80'],
    rating: 4.8,
    reviewsCount: 124,
    isBestSeller: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    name: 'Triple Dark Choco Bliss',
    description: 'Intense dark chocolate biscuit with chocolate chips and a velvety chocolate fudge center.',
    price: 15.50,
    stock: 80,
    categoryId: '2',
    categoryName: 'Chocolate Biscuits',
    brand: 'Cocoa Premium',
    images: ['https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80'],
    rating: 4.9,
    reviewsCount: 89,
    isNew: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p3',
    name: 'Scottish Highland Butter',
    description: 'Traditional shortbread made with pure organic grass-fed butter from the Scottish Highlands.',
    price: 18.00,
    stock: 200,
    categoryId: '3',
    categoryName: 'Butter Cookies',
    brand: 'Heritage Grains',
    images: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80'],
    rating: 4.7,
    reviewsCount: 56,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p4',
    name: 'Oat & Honey Digestive',
    description: 'Wholesome oats and wild honey combined in a fiber-rich digestive biscuit for sustained energy.',
    price: 9.99,
    stock: 300,
    categoryId: '4',
    categoryName: 'Digestive Biscuits',
    brand: 'Nature Choice',
    images: ['https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=800&q=80'],
    rating: 4.5,
    reviewsCount: 42,
    createdAt: new Date().toISOString()
  }
];

export const DUMMY_BANNERS: BannerItem[] = [
  {
    id: 'b1',
    title: 'Purely Organic, Truly Delicious',
    subtitle: 'Discover our new collection of handcrafted biscuits made from 100% natural ingredients.',
    image: 'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?auto=format&fit=crop&w=1600&q=80',
    link: '/shop',
    active: true
  }
];
