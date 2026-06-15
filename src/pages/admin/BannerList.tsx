import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { BannerItem } from '../../types';
import { Plus, Edit, Trash2, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function BannerList() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBanners = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'banners'));
      setBanners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BannerItem[]);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteDoc(doc(db, 'banners', id));
        toast.success("Banner deleted");
        fetchBanners();
      } catch (e) {
        toast.error("Failed to delete banner");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-slate-800 p-6 rounded-3xl border border-slate-700">
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" /> Promotional Banners
        </h2>
        <button 
          onClick={() => navigate('add')}
          className="btn-primary py-2 px-4 text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {banners.map((banner) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 group hover:border-slate-500 transition-all"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-900 flex items-center justify-center">
                {banner.image ? (
                  <img 
                    src={banner.image} 
                    alt={banner.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">No Image</span>
                )}
                {!banner.active && (
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                    <span className="bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-red-500/20">Inactive</span>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-white mb-1 line-clamp-1">{banner.title}</h3>
                  <p className="text-slate-400 text-xs line-clamp-1">{banner.subtitle}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`edit/${banner.id}`)}
                      className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {banner.active ? <Eye className="w-4 h-4 text-green-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {loading && <div className="py-20 text-center text-slate-500">Loading banners...</div>}
      {!loading && banners.length === 0 && (
        <div className="bg-slate-800 p-20 rounded-[3rem] border border-slate-700 border-dashed text-center">
          <p className="text-slate-500 font-display text-lg">No banners found. Create your first promotion!</p>
        </div>
      )}
    </div>
  );
}
