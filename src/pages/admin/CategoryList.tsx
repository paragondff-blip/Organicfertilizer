import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { Category } from '../../types';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const q = query(collection(db, 'categories'), orderBy('name'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete category: ${name}?`)) {
      try {
        await deleteDoc(doc(db, 'categories', id));
        toast.success("Category deleted");
        fetchCategories();
      } catch (e) {
        toast.error("Failed to delete category");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-slate-800 p-6 rounded-3xl border border-slate-700">
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" /> Management
        </h2>
        <button 
          onClick={() => navigate('add')}
          className="btn-primary py-2 px-4 text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-700">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-slate-700">
              <th className="px-8 py-6">Category Name</th>
              <th className="px-8 py-6">Slug</th>
              <th className="px-8 py-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            <AnimatePresence>
              {categories.map((c) => (
                <motion.tr 
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-8 py-6">
                    <p className="font-bold text-white text-sm">{c.name}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-900 rounded-full text-[10px] font-bold text-slate-400">{c.slug}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                         onClick={() => navigate(`edit/${c.id}`)}
                         className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(c.id, c.name)}
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
        {loading && <div className="p-10 text-center text-slate-500">Loading categories...</div>}
        {!loading && categories.length === 0 && <div className="p-10 text-center text-slate-500">No categories found.</div>}
      </div>
    </div>
  );
}
