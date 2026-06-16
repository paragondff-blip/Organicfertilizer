import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Truck, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, limit, getDocs, where } from 'firebase/firestore';
import { Product, BannerItem } from '../types';

import { useSite } from '../context/SiteContext';

export default function Home() {
  const { addToCart } = useCart();
  const { settings } = useSite();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodSnap = await getDocs(query(collection(db, 'products'), limit(4)));
        setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
        
        const bannerSnap = await getDocs(query(collection(db, 'banners'), where('active', '==', true), limit(1)));
        if (!bannerSnap.empty) {
          setBanners(bannerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BannerItem[]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const heroBanner = banners[0] || {
    title: `Premium ${settings.siteName}`,
    subtitle: 'High-quality solutions for your organic farming and gardening',
    image: 'https://images.unsplash.com/photo-1598214814594-cce8b3353e87?q=80&w=2000&auto=format&fit=crop'
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBanner.image} 
            alt="Hero" 
            className="w-full h-full object-cover brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:max-w-3xl space-y-6"
          >
            <span className="inline-block px-4 py-1.5 bg-secondary text-white rounded-full text-sm font-bold tracking-widest uppercase mb-4">
              {settings.home.heroTagline}
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
              {heroBanner.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              {heroBanner.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/shop" className="btn-primary py-4 px-8 text-lg">
                {settings.home.heroBtn1Text} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/about" className="glass py-4 px-8 text-lg rounded-full text-white hover:bg-white/30 transition-all font-medium">
                {settings.home.heroBtn2Text}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {settings.home.features.map((f, i) => {
            const Icon = i === 0 ? Truck : i === 1 ? ShieldCheck : Star;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-3xl flex items-center gap-6 group hover:translate-y-[-5px] transition-transform"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl">{f.title}</h3>
                  <p className="text-gray-500">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-primary/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="text-primary font-bold uppercase tracking-widest text-sm">{settings.home.topSellersBadge}</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold">{settings.home.topSellersTitle}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{settings.home.topSellersDesc}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((prod, i) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-3xl overflow-hidden group border-none"
              >
                <Link to={`/product/${prod.id}`} className="block relative aspect-square overflow-hidden bg-slate-100 flex items-center justify-center">
                  {prod.images && prod.images[0] ? (
                    <img 
                      src={prod.images[0]} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Image</span>
                  )}
                  {prod.isNew && (
                    <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">New</span>
                  )}
                  {prod.isBestSeller && (
                    <span className="absolute top-4 left-4 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Best Seller</span>
                  )}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </Link>
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-secondary font-bold uppercase">{prod.categoryName}</span>
                      {prod.specialOfferText && (
                        <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">{prod.specialOfferText}</span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg leading-tight mt-1 truncate">
                      <Link to={`/product/${prod.id}`} className="hover:text-primary transition-colors">{prod.name}</Link>
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-accent">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(prod.rating) ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">({prod.reviewsCount})</span>
                  </div>
                  <div className="flex flex-col space-y-3 pt-2">
                    <span className="text-xl font-display font-bold text-gray-900">Tk {prod.price}</span>
                    <div className="grid grid-cols-2 gap-2">
                       <button 
                        onClick={() => {
                          addToCart(prod, 1);
                          toast.success(`${prod.name} added to cart!`);
                        }}
                        className="h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => {
                          addToCart(prod, 1);
                          navigate('/checkout');
                        }}
                        className="h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all shadow-md active:scale-90 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {loading && <div className="text-center py-20 text-slate-500 font-display">Loading Premium Collection...</div>}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[3rem] overflow-hidden bg-primary py-20 px-8 text-center text-white">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-bold">{settings.home.newsletterTitle}</h2>
            <p className="text-primary-foreground/80 text-lg">{settings.home.newsletterDesc}</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow bg-white/20 backdrop-blur-sm border border-white/30 rounded-full py-4 px-8 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button type="submit" className="btn-secondary py-4 px-8 shadow-2xl">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

