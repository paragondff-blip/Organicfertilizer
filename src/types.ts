export interface SiteSettings {
  siteName: string;
  logo: string;
  favicon: string;
  footer: {
    address: string;
    phone: string;
    email: string;
    facebook: string;
    instagram: string;
    twitter: string;
  };
  home: {
    heroTagline: string;
    heroBtn1Text: string;
    heroBtn2Text: string;
    features: { title: string; desc: string }[];
    topSellersBadge: string;
    topSellersTitle: string;
    topSellersDesc: string;
    newsletterTitle: string;
    newsletterDesc: string;
  };
  navigation: {
    headerLinks: { name: string; path: string }[];
  };
  payments: {
    codActive: boolean;
    bkashActive: boolean;
    bkashNumber: string;
    nagadActive: boolean;
    nagadNumber: string;
    rocketActive: boolean;
    rocketNumber: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  categoryName: string;
  brand: string;
  images: string[];
  ingredients?: string;
  nutritionInfo?: string;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  discountPrice?: number;
  createdAt: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  phoneNumber?: string;
  address?: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid';
  shippingAddress: any;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogItem {
  id: string;
  title: string;
  content: string;
  author: string;
  image: string;
  tags: string[];
  createdAt: string;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  active: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description?: string;
  order?: number;
}

export interface CompanyInfo {
  mdName: string;
  mdMessage: string;
  mdImage: string;
  mdQuote?: string;
  startDate: string;
  history: string;
  headerImage: string;
  heroTitle?: string;
  heroSubtitle?: string;
  stats?: {
    label: string;
    value: string;
    icon?: string;
  }[];
  values?: {
    title: string;
    desc: string;
    icon?: string;
  }[];
  updatedAt?: any;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  expiryDate?: string;
  active: boolean;
  usageLimit?: number;
  usageCount: number;
  createdAt: any;
}
