import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Star, ShoppingBag, Truck, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, limit, getDocs, where, orderBy } from 'firebase/firestore';
import { Product, BannerItem } from '../types';

import { useSite } from '../context/SiteContext';

export default function Home() {
  const { addToCart } = useCart();
  const { settings } = useSite();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodSnap = await getDocs(query(collection(db, 'products'), limit(4)));
        setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
        
        const bannerSnap = await getDocs(query(collection(db, 'banners'), where('active', '==', true), orderBy('createdAt', 'desc')));
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

  // Slider controls
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000); // 5 seconds display + 0.2s transition effect (duration)

    return () => clearInterval(timer);
  }, [banners.length]);

  const defaultBanner = {
    title: `Premium ${settings.siteName}`,
    subtitle: 'High-quality solutions for your organic farming and gardening',
    image: 'https://images.unsplash.com/photo-1598214814594-cce8b3353e87?q=80&w=2000&auto=format&fit=crop',
    link: '/shop'
  };

  const activeBanners = banners.length > 0 ? banners : [defaultBanner];
  const slide = activeBanners[currentSlide];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section Slider */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ x: 1000, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -1000, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 0.2 }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover brightness-75 transition-transform duration-[10000ms] ease-linear scale-100 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          </motion.div>
        </AnimatePresence>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:max-w-3xl space-y-6"
            >
              <span className="inline-block px-4 py-1.5 bg-secondary text-white rounded-full text-sm font-bold tracking-widest uppercase mb-4">
                {settings.home.heroTagline}
              </span>
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-200">
                {slide.subtitle}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to={slide.link || "/shop"} className="btn-primary py-4 px-8 text-lg">
                  {settings.home.heroBtn1Text} <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/about" className="glass py-4 px-8 text-lg rounded-full text-white hover:bg-white/30 transition-all font-medium">
                  {settings.home.heroBtn2Text}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Navigation Dots */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white'}`}
              />
            ))}
          </div>
        )}

        {/* Slider Arrow Controls */}
        {activeBanners.length > 1 && (
          <>
            <button 
              onClick={() => setCurrentSlide(prev => (prev - 1 + activeBanners.length) % activeBanners.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-primary transition-all md:flex hidden"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setCurrentSlide(prev => (prev + 1) % activeBanners.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-primary transition-all md:flex hidden"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </>
        )}
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
                  {prod.categoryName?.toLowerCase().includes('upcoming') && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                      <div className="bg-primary/90 text-white py-1.5 px-6 -rotate-12 font-display font-black text-lg tracking-[0.2em] shadow-2xl border-2 border-white/30 backdrop-blur-sm">
                        UPCOMING
                      </div>
                    </div>
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
                      {prod.categoryName?.toLowerCase().includes('upcoming') && (
                        <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">Upcoming</span>
                      )}
                      {prod.specialOfferText && !prod.categoryName?.toLowerCase().includes('upcoming') && (
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
                          if (prod.categoryName?.toLowerCase().includes('upcoming')) {
                            toast.info("This product is coming soon!");
                            return;
                          }
                          addToCart(prod, 1);
                          toast.success(`${prod.name} added to cart!`);
                        }}
                        className="h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        <span className="text-[10px] font-bold font-display uppercase tracking-widest sm:inline hidden">Cart</span>
                      </button>
                      {prod.stock > 0 && !prod.categoryName?.toLowerCase().includes('upcoming') && (
                        <button 
                          onClick={() => {
                            addToCart(prod, 1);
                            navigate('/checkout');
                          }}
                          className="h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all shadow-md active:scale-90 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap"
                        >
                          Order Now
                        </button>
                      )}
                      {(prod.categoryName?.toLowerCase().includes('upcoming') || prod.stock <= 0) && (
                         <div className="h-10 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center font-bold text-[10px] uppercase tracking-widest border border-gray-200">
                           {prod.categoryName?.toLowerCase().includes('upcoming') ? 'Soon' : 'Out of Stock'}
                         </div>
                      )}
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

