import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { motion } from 'motion/react';
import { Save, ArrowLeft, Tag } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';

export default function BrandForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    order: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchBrand = async () => {
        try {
          const docRef = doc(db, 'brands', id);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setFormData(snap.data() as any);
          }
        } catch (e) {
          console.error(e);
          toast.error("Failed to load brand data");
        }
      };
      fetchBrand();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await setDoc(doc(db, 'brands', id), {
          ...formData,
          order: Number(formData.order),
          updatedAt: serverTimestamp()
        }, { merge: true });
        toast.success("Brand updated successfully");
      } else {
        await addDoc(collection(db, 'brands'), {
          ...formData,
          order: Number(formData.order),
          createdAt: serverTimestamp()
        });
        toast.success("Brand added successfully");
      }
      navigate('/admin/brands');
    } catch (e: any) {
      console.error(e);
      toast.error(`Failed to save brand: ${e.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate('/admin/brands')}
          className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-3xl font-display font-bold text-white">{isEditing ? 'Edit Brand' : 'Add New Brand'}</h2>
          <p className="text-slate-400">Manage your partner brands and their visual presence.</p>
        </div>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="bg-slate-800 p-10 rounded-[3rem] border border-slate-700 space-y-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Brand Name</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white transition-all"
              placeholder="e.g. Olympic Biscuits"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Display Order</label>
            <input
              required
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white transition-all"
            />
          </div>
        </div>

        <ImageUpload 
          label="Brand Logo"
          value={formData.logo}
          onChange={(val) => setFormData({ ...formData, logo: val })}
          suggestion="Square, 400x400px"
        />

        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white transition-all resize-none"
            placeholder="Tell something about this brand..."
          />
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-slate-700">
          <button
            type="button"
            onClick={() => navigate('/admin/brands')}
            className="px-8 py-4 text-slate-400 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            type="submit"
            className="btn-primary flex items-center gap-2 px-10 h-16 disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-5 h-5" />}
            {isEditing ? 'Update Brand' : 'Save Brand'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
