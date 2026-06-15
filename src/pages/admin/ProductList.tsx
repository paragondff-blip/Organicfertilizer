import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Product } from '../../types';
import { Edit, Trash2, Plus, Star, Box, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteDoc(doc(db, 'products', id));
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (e) {
        toast.error("Failed to delete product");
      }
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.categoryId.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-slate-800 p-6 rounded-3xl border border-slate-700">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
             type="text" 
             placeholder="Search by name or category..." 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-12 text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-4 items-center">
           <p className="text-sm font-bold text-slate-500">Total: {products.length} Products</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-700">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-slate-700">
              <th className="px-8 py-6">Product</th>
              <th className="px-8 py-6">Category</th>
              <th className="px-8 py-6">Price</th>
              <th className="px-8 py-6">Stock</th>
              <th className="px-8 py-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            <AnimatePresence>
              {filtered.map((p) => (
                <motion.tr 
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl object-cover border border-slate-600 bg-slate-900 flex items-center justify-center overflow-hidden">
                        {p.images && p.images[0] ? (
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[8px] font-bold text-slate-500 uppercase text-center leading-tight">No Img</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{p.name}</p>
                        <p className="text-[10px] text-slate-500">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-900 rounded-full text-[10px] font-bold text-primary">{p.categoryName}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-display font-bold text-white">Tk {p.price.toFixed(2)}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <Box className={`w-4 h-4 ${p.stock < 20 ? 'text-orange-400' : 'text-slate-500'}`} />
                       <span className={`font-bold ${p.stock < 20 ? 'text-orange-400' : 'text-white'}`}>{p.stock}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => navigate(`edit/${p.id}`)}
                        className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {loading && (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center text-slate-500">
             <p className="font-display text-xl font-bold">No products found.</p>
             <p className="text-sm">Try adjusting your search or add a new product.</p>
          </div>
        )}
      </div>
    </div>
  );
}
