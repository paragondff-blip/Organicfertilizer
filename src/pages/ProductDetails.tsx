import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Heart, ArrowLeft, Truck, ShieldCheck, RefreshCw, Minus, Plus, Share2, Layers, ChevronRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, getDocs, orderBy, where, limit } from 'firebase/firestore';
import { Product, Category } from '../types';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { motion } from 'motion/react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'reviews'>('desc');
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docSnap = await getDoc(doc(db, 'products', id));
        if (docSnap.exists()) {
          const prodData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(prodData);
          
          // Fetch related
          const relatedQuery = query(
            collection(db, 'products'), 
            where('categoryId', '==', prodData.categoryId),
            limit(4)
          );
          const relatedSnap = await getDocs(relatedQuery);
          setRelatedProducts(relatedSnap.docs
            .map(d => ({ id: d.id, ...d.data() }) as Product)
            .filter(p => p.id !== id)
          );
        }

        const catSnap = await getDocs(query(collection(db, 'categories'), orderBy('name')));
        setCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="py-20 text-center font-display text-xl">Loading premium delights...</div>;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-display font-bold mb-4">Biscuit Not Found</h2>
        <p className="text-gray-500 mb-8">The biscuit you are looking for doesn't exist or is out of stock.</p>
        <Link to="/shop" className="btn-primary inline-flex">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Categories */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-8">
          <div className="glass p-8 rounded-[3rem] space-y-6">
            <h3 className="text-xl font-display font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" /> Categories
            </h3>
            <nav className="space-y-2">
              <Link 
                to="/shop"
                className="block w-full text-left p-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all flex items-center justify-between"
              >
                All Products
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.slug}`}
                  className={`block w-full text-left p-4 rounded-2xl font-bold transition-all flex items-center justify-between group ${product.categoryId === cat.slug ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  {cat.name}
                  <ChevronRight className={`w-4 h-4 ${product.categoryId === cat.slug ? 'text-white' : 'text-primary'} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="bg-slate-900 text-white p-10 rounded-[3rem] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <h4 className="text-xl font-display font-bold">Fast Delivery</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Orders placed before 2 PM are shipped the same day.</p>
            <Link to="/shop" className="inline-block font-bold text-xs uppercase tracking-widest text-primary border-b border-primary pb-1">Shop Now</Link>
          </div>
        </aside>

        {/* Product Details Content */}
        <div className="flex-grow space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="aspect-square rounded-[3rem] overflow-hidden bg-slate-100 flex items-center justify-center p-4">
            {product.images && product.images[0] ? (
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover rounded-[2.5rem]" 
              />
            ) : (
              <span className="text-slate-400 font-bold uppercase tracking-widest text-lg">No Image</span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images && product.images.length > 0 && product.images.map((img, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 border-primary cursor-pointer">
                {img ? <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200"></div>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-4 py-1.5 bg-secondary/10 text-secondary text-xs font-bold rounded-full uppercase tracking-widest">{product.categoryName}</span>
              <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-red-500 transition-colors"><Heart className="w-6 h-6" /></button>
                <button className="text-gray-400 hover:text-primary transition-colors"><Share2 className="w-6 h-6" /></button>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-gray-400 font-medium">({product.reviewsCount} verified reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-display font-bold text-gray-900">Tk {product.price}</span>
            {product.discountPrice && (
              <span className="text-xl text-gray-400 line-through">Tk {product.discountPrice}</span>
            )}
            <span className="text-green-600 font-bold text-sm bg-green-100 px-3 py-1 rounded-full">In Stock</span>
          </div>

          <p className="text-gray-600 leading-relaxed text-lg italic">
            "{product.description}"
          </p>

          <div className="space-y-6 pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center bg-gray-100 rounded-full p-1 h-14">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white text-gray-600 transition-all active:scale-90"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white text-gray-600 transition-all active:scale-90"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-4 flex-grow w-full">
                <button 
                  onClick={() => {
                    addToCart(product, quantity);
                    toast.success(`${product.name} added to cart!`);
                  }}
                  className="h-14 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all flex-grow"
                >
                  <ShoppingBag className="w-6 h-6" /> Add to Cart
                </button>
                <button 
                  onClick={() => {
                    addToCart(product, quantity);
                    navigate('/checkout');
                  }}
                  className="btn-primary h-14 text-lg font-bold flex-grow"
                >
                  Order Now
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Truck, text: 'Fast Delivery' },
                { icon: ShieldCheck, text: 'Secure Pay' },
                { icon: RefreshCw, text: 'Easy Return' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center gap-2 p-4 glass rounded-2xl text-center">
                  <item.icon className="w-6 h-6 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="pt-8">
            <div className="flex border-b border-gray-100">
              {[
                { id: 'desc', label: 'Description' },
                { id: 'ingredients', label: 'Ingredients' },
                { id: 'reviews', label: 'Reviews' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-4 font-bold text-sm uppercase tracking-widest relative transition-colors ${activeTab === tab.id ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
            <div className="py-8 text-gray-600 leading-relaxed min-h-[200px]">
              {activeTab === 'desc' && (
                <div className="space-y-4">
                  <p>{product.description}</p>
                  <p>Our {product.name} is a testament to the artisan biscuit-making tradition. We source the finest organic flour and sustainable ingredients to ensure every bite is a premium experience.</p>
                </div>
              )}
              {activeTab === 'ingredients' && (
                <div className="glass p-6 rounded-3xl">
                  <h4 className="font-bold text-gray-900 mb-4">Certified Organic Ingredients:</h4>
                  <p className="text-sm">Organic Wheat Flour, Pure Organic Butter, Madagascar Vanilla Extract, Organic Brown Sugar, Sea Salt, Natural Leavening Agent.</p>
                  <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase text-gray-400">Net Weight</span>
                      <p className="font-bold">250g / 8.8oz</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase text-gray-400">Shelf Life</span>
                      <p className="font-bold">6 Months</p>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Review placeholder */}
                  <div className="flex items-start gap-4 glass p-6 rounded-3xl">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-bold text-primary">JD</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">John Doe</span>
                        <div className="flex text-accent scale-75 origin-left">
                          <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                        </div>
                      </div>
                      <p className="text-sm">Absolutely the best biscuits I've ever had. Truly gourmet quality and the vanilla flavor is so natural and rich!</p>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">2 weeks ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 pt-24 border-t border-gray-100">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold">You May Also Like</h2>
              <p className="text-gray-500">More organic delights from the {product.categoryName} collection.</p>
            </div>
            <Link to="/shop" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
              See All <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map(prod => (
              <motion.div
                key={prod.id}
                whileHover={{ y: -5 }}
                className="glass rounded-3xl overflow-hidden group"
              >
                <Link to={`/product/${prod.id}`} className="block relative aspect-square overflow-hidden bg-slate-100 flex items-center justify-center">
                  {prod.images && prod.images[0] ? (
                    <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Image</span>
                  )}
                </Link>
                <div className="p-5 space-y-2">
                  <h3 className="font-display font-bold text-sm truncate">
                    <Link to={`/product/${prod.id}`} className="hover:text-primary transition-colors">{prod.name}</Link>
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-gray-900">${prod.price}</span>
                    <button 
                      onClick={() => {
                        addToCart(prod, 1);
                        toast.success(`${prod.name} added to cart!`);
                      }}
                      className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
        </div>
      </div>
    </div>
  );
}
