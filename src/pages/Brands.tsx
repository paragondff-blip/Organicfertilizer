import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Brand } from '../types';
import { motion } from 'motion/react';
import { LayoutGrid, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const q = query(collection(db, 'brands'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        setBrands(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Brand[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) return <div className="py-20 text-center font-display text-xl">Discovering premium brands...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-secondary font-bold uppercase tracking-widest text-sm">Our Network</span>
        <h1 className="text-4xl md:text-6xl font-display font-bold">World Class Brands</h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          We partner with the finest biscuit makers to bring you premium quality and authentic taste from around the globe.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {brands.map((brand, i) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[3rem] group hover:border-primary transition-all flex flex-col items-center text-center space-y-6"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white flex items-center justify-center p-4 group-hover:scale-110 transition-transform">
              <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-display font-bold text-gray-900">{brand.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                {brand.description || "Premium biscuit brand committed to quality and tradition."}
              </p>
            </div>
            <Link 
              to={`/shop?search=${brand.name}`}
              className="mt-auto inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs border-b border-primary/20 pb-1 hover:border-primary transition-all"
            >
              Explore Products <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>

      {brands.length === 0 && (
        <div className="py-20 text-center bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
          <LayoutGrid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-display text-xl">No brands featured yet. Coming soon!</p>
        </div>
      )}
    </div>
  );
}
