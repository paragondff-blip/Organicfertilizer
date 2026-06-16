import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid, List as ListIcon, Star, ShoppingBag, Heart, X, Layers } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSite } from '../context/SiteContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { Product, Category } from '../types';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { settings } = useSite();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodSnap = await getDocs(collection(db, 'products'));
        setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
        
        const catSnap = await getDocs(query(collection(db, 'categories'), orderBy('name')));
        setCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const selectedCategory = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sort') || 'newest';

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.brand.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'popular') return b.reviewsCount - a.reviewsCount;
        return 0;
      });
  }, [products, selectedCategory, sortBy, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold">{settings.home.catalogTitle || 'The Catalog'}</h1>
          <p className="text-gray-500">{settings.home.catalogSubtitle || `Showing ${filteredProducts.length} Premium Organic Delights`}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-200 rounded-full py-3 px-12 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full md:w-80 shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`md:hidden p-3 rounded-xl border flex items-center gap-2 transition-all ${showFilters ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 text-gray-600'}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-12">
        {/* sidebar Filters - Desktop */}
        <aside className="hidden md:block w-64 space-y-10">
          <div className="space-y-6">
            <h3 className="font-display font-bold text-xl pb-2 border-b border-gray-200">Categories</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setSearchParams({ category: 'all', sort: sortBy })}
                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors font-medium ${selectedCategory === 'all' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSearchParams({ category: cat.slug, sort: sortBy })}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors font-medium ${selectedCategory === cat.slug ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-display font-bold text-xl pb-2 border-b border-gray-200">Sort By</h3>
            <select 
              value={sortBy}
              onChange={(e) => setSearchParams({ category: selectedCategory, sort: e.target.value })}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {settings.specialOffer?.active && (
            <div className="bg-secondary/10 p-6 rounded-3xl space-y-4">
              <h4 className="font-display font-bold text-lg text-secondary">{settings.specialOffer.title || 'Special Offer!'}</h4>
              <p className="text-sm text-gray-600">{settings.specialOffer.description}</p>
              {settings.specialOffer.endDate && (
                <div className="mt-2 text-xs font-bold text-secondary bg-white/50 px-3 py-2 rounded-lg inline-block">
                  Valid Until: {new Date(settings.specialOffer.endDate).toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <div className="flex-grow">
          {/* View Toolbar */}
          <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                <ListIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-400 font-medium">Viewing 1 - {filteredProducts.length} of {filteredProducts.length} products</p>
          </div>

          {/* Product Grid/List */}
          {filteredProducts.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "space-y-6"
            }>
              <AnimatePresence>
                {filteredProducts.map((prod, idx) => (
                  <motion.div
                    key={prod.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className={viewMode === 'grid' 
                      ? "glass rounded-3xl overflow-hidden group border-none" 
                      : "glass rounded-3xl overflow-hidden group border-none flex flex-col sm:flex-row"
                    }
                  >
                    {/* Thumbnail */}
                    <Link 
                      to={`/product/${prod.id}`} 
                      className={viewMode === 'grid' 
                        ? "block relative aspect-square overflow-hidden" 
                        : "block relative w-full sm:w-64 aspect-square sm:aspect-auto overflow-hidden shrink-0"
                      }
                    >
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
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
                      </div>
                      <button className="absolute top-4 right-4 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                    </Link>

                    {/* Content */}
                    <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">{prod.categoryName}</span>
                          <div className="flex items-center gap-2">
                             {prod.specialOfferText && (
                               <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">{prod.specialOfferText}</span>
                             )}
                             <div className="flex items-center gap-1 text-accent">
                               <Star className="w-3 h-3 fill-current" />
                               <span className="text-xs text-gray-400 font-bold">{prod.rating}</span>
                             </div>
                          </div>
                        </div>
                        <h3 className="font-display font-bold text-xl leading-tight">
                          <Link to={`/product/${prod.id}`} className="hover:text-primary transition-colors">{prod.name}</Link>
                        </h3>
                        {viewMode === 'list' && (
                          <p className="text-sm text-gray-500 line-clamp-2">{prod.description}</p>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                           <span className="text-2xl font-display font-bold text-gray-900">Tk {prod.price}</span>
                        </div>
                        <div className={`flex gap-2 ${prod.categoryName?.toLowerCase().includes('upcoming') || prod.stock <= 0 ? 'flex-col' : ''}`}>
                           <button 
                            onClick={() => {
                              if (prod.categoryName?.toLowerCase().includes('upcoming')) {
                                toast.info("This product is coming soon!");
                                return;
                              }
                              addToCart(prod, 1);
                              toast.success(`${prod.name} added to cart!`);
                            }}
                            className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center flex-grow"
                            title="Add to Cart"
                          >
                            <ShoppingBag className="w-5 h-5" />
                            {(viewMode === 'list' || prod.categoryName?.toLowerCase().includes('upcoming') || prod.stock <= 0) && <span className="ml-2 font-bold text-[10px] uppercase tracking-widest">Add to Cart</span>}
                          </button>
                          {prod.stock > 0 && !prod.categoryName?.toLowerCase().includes('upcoming') && (
                            <button 
                              onClick={() => {
                                addToCart(prod, 1);
                                navigate('/checkout');
                              }}
                              className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 flex items-center justify-center flex-grow font-bold text-[10px] uppercase tracking-widest"
                            >
                              Order Now
                            </button>
                          )}
                          {(prod.categoryName?.toLowerCase().includes('upcoming') || prod.stock <= 0) && (
                             <div className="h-10 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center font-bold text-[10px] uppercase tracking-widest border border-gray-200 flex-grow text-center">
                              {prod.categoryName?.toLowerCase().includes('upcoming') ? 'Coming Soon' : 'Out of Stock'}
                             </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-8">We couldn't find any products matching your search or filters.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSearchParams({});
                }}
                className="btn-primary"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
