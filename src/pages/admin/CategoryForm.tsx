import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { motion } from 'motion/react';
import { Save, ArrowLeft } from 'lucide-react';
import { Category } from '../../types';

export default function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    order: 0,
  });

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        setFetching(true);
        try {
          const docSnap = await getDoc(doc(db, 'categories', id));
          if (docSnap.exists()) {
            setFormData(docSnap.data() as Category);
          }
        } catch (e) {
          toast.error("Failed to fetch category");
        } finally {
          setFetching(false);
        }
      };
      fetchCategory();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...formData,
        slug: formData.name?.toLowerCase().replace(/\s+/g, '-'),
        updatedAt: serverTimestamp(),
      };

      if (id) {
        await setDoc(doc(db, 'categories', id), data, { merge: true });
        toast.success("Category updated");
      } else {
        await addDoc(collection(db, 'categories'), { ...data, createdAt: serverTimestamp() });
        toast.success("Category added");
      }
      navigate('/admin/categories');
    } catch (e: any) {
      console.error(e);
      toast.error(`Error saving category: ${e.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-20 text-center">Fetching category...</div>;

  return (
    <div className="max-w-2xl space-y-8">
      <button 
        onClick={() => navigate('/admin/categories')}
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Categories
      </button>

      <div className="bg-slate-800 p-10 rounded-[3rem] border border-slate-700 space-y-10">
        <h2 className="text-3xl font-display font-bold text-white">{id ? 'Edit Category' : 'Add Category'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Category Name</label>
            <input 
              type="text" required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Description (Optional)</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" /> {loading ? 'Saving...' : 'Save Category'}
          </button>
        </form>
      </div>
    </div>
  );
}
