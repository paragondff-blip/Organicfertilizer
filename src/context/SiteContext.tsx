import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { SiteSettings } from '../types';

interface SiteContextType {
  settings: SiteSettings;
  loading: boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Organic Fertilizer',
    logo: '',
    favicon: '',
    footer: {
      address: 'Green Industrial Area, Dhaka, Bangladesh',
      phone: '+880 1234 567890',
      email: 'hello@organicfertilizer.com',
      facebook: '#',
      instagram: '#',
      twitter: '#',
      description: 'Experience the true taste of nature with our premium collection of handcrafted products. Made with love and the finest ingredients.',
      quickLinks: [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Privacy Policy', path: '/privacy' }
      ],
      categories: [
        { name: 'Featured', path: '/shop?sort=popular' },
        { name: 'Best Sellers', path: '/shop?sort=popular' },
        { name: 'Organic Mix', path: '/shop' },
        { name: 'Special Offers', path: '/shop' },
        { name: 'New Arrivals', path: '/shop?sort=newest' }
      ],
      rightsReserved: 'All rights reserved.'
    },
    home: {
      heroTagline: 'Premium Organic Solutions',
      heroBtn1Text: 'View Products',
      heroBtn2Text: 'Our Mission',
      features: [
        { title: 'Safe Shipping', desc: 'Secure delivery across the country' },
        { title: 'Quality Certified', desc: '100% Organic & Eco-friendly' },
        { title: 'Expert Support', desc: 'Advice for your farm or garden' }
      ],
      topSellersBadge: 'Specially Formulated',
      topSellersTitle: 'Our Top Sellers',
      topSellersDesc: 'Discover the most effective organic fertilizers trusted by professional farmers and home gardeners alike.',
      newsletterTitle: 'Join Our Organic Community',
      newsletterDesc: 'Subscribe to get special offers, farming tips, and once-in-a-lifetime deals delivered straight to your inbox.'
    },
    navigation: {
      headerLinks: [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' }
      ]
    },
    payments: {
      codActive: true,
      bkashActive: true,
      bkashNumber: '01XXXXXXXXX',
      nagadActive: true,
      nagadNumber: '01XXXXXXXXX',
      rocketActive: false,
      rocketNumber: ''
    },
    specialOffer: {
      active: true,
      title: 'Special Offer!',
      description: 'Get 15% off on your first order with code WELCOME15',
      endDate: ''
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docKeys = ['general', 'home', 'navigation', 'payments', 'specialOffer'];
    const unsubs = docKeys.map(key => 
      onSnapshot(doc(db, 'settings', key), (docSnap) => {
        if (docSnap.exists()) {
          if (key === 'general') {
            // General doc is merged at the root level for legacy reasons 
            // (it contains siteName, logo, footer, etc.)
            setSettings(prev => ({ ...prev, ...docSnap.data() }));
          } else {
            // Other docs are stored under their respective keys
            setSettings(prev => ({ ...prev, [key]: { ...(prev as any)[key], ...docSnap.data() } }));
          }
        }
      }, (err) => {
        console.error(`Error loading ${key} settings:`, err);
      })
    );

    // Initial load state timeout just to not block forever
    const timer = setTimeout(() => setLoading(false), 1000);

    return () => {
      unsubs.forEach(unsub => unsub());
      clearTimeout(timer);
    };
  }, []);

  return (
    <SiteContext.Provider value={{ settings, loading }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}
