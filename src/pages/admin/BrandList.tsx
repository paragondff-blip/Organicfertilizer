import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { Brand } from '../../types';
import { Plus, Edit, Trash2, Tag, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function BrandList() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBrands = async () => {
    try {
      const q = query(collection(db, 'brands'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      setBrands(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Brand[]);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        await deleteDoc(doc(db, 'brands', id));
        toast.success("Brand deleted successfully");
        fetchBrands();
      } catch (e) {
        toast.error("Failed to delete brand");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-slate-800 p-6 rounded-3xl border border-slate-700">
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" /> Brands Management
        </h2>
        <button 
          onClick={() => navigate('add')}
          className="btn-primary py-2 px-4 text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Brand
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {brands.map((brand) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 group hover:border-slate-500 transition-all p-6 space-y-6"
            >
              <div className="aspect-square w-24 h-24 mx-auto rounded-2xl bg-white p-4 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="max-w-full max-h-full object-contain" 
                />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="font-bold text-white text-lg">{brand.name}</h3>
                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{brand.description || 'No description available.'}</p>
                {brand.order !== undefined && (
                  <span className="inline-block px-3 py-1 bg-slate-900 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest">Order: {brand.order}</span>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`edit/${brand.id}`)}
                    className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                    title="Edit Brand"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(brand.id)}
                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                    title="Delete Brand"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <a 
                  href={`/shop?search=${encodeURIComponent(brand.name)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all"
                  title="View Products"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {loading && <div className="py-20 text-center text-slate-500">Loading brands...</div>}
      {!loading && brands.length === 0 && (
        <div className="bg-slate-800 p-20 rounded-[3rem] border border-slate-700 border-dashed text-center">
          <p className="text-slate-500 font-display text-lg">No brands found. Start by adding your first partner brand!</p>
        </div>
      )}
    </div>
  );
}
