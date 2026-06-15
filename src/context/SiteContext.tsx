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
      twitter: '#'
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
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for settings
    const unsub = onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(prev => ({ ...prev, ...docSnap.data() }));
      }
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => unsub();
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
