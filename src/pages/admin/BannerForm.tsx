import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Save, ArrowLeft, Link as LinkIcon, ToggleLeft, ToggleRight } from 'lucide-react';
import { BannerItem } from '../../types';
import ImageUpload from '../../components/admin/ImageUpload';

export default function BannerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [formData, setFormData] = useState<Partial<BannerItem>>({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    active: true,
  });

  useEffect(() => {
    if (id) {
      const fetchBanner = async () => {
        setFetching(true);
        try {
          const docSnap = await getDoc(doc(db, 'banners', id));
          if (docSnap.exists()) {
            setFormData(docSnap.data() as BannerItem);
          }
        } catch (e) {
          toast.error("Failed to fetch banner details");
        } finally {
          setFetching(false);
        }
      };
      fetchBanner();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...formData,
        updatedAt: serverTimestamp(),
        createdAt: id ? (formData.createdAt || serverTimestamp()) : serverTimestamp(),
      };

      if (id) {
        await setDoc(doc(db, 'banners', id), data);
        toast.success("Banner updated successfully");
      } else {
        await addDoc(collection(db, 'banners'), data);
        toast.success("New banner added successfully");
      }
      navigate('/admin/banners');
    } catch (e: any) {
      console.error("Firestore Error:", e);
      toast.error(`Error saving banner: ${e.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-20 text-center text-slate-400">Loading banner data...</div>;

  return (
    <div className="max-w-3xl space-y-8">
      <button 
        onClick={() => navigate('/admin/banners')}
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Banners
      </button>

      <div className="bg-slate-800 p-10 rounded-[3rem] border border-slate-700 space-y-10">
        <h2 className="text-3xl font-display font-bold text-white">{id ? 'Edit Banner' : 'Create New Banner'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Banner Title</label>
              <input 
                type="text" required 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Summer Collection"
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Subtitle / Call to Action</label>
              <input 
                type="text" required 
                value={formData.subtitle}
                onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                placeholder="e.g., Get up to 50% Off"
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary"
              />
            </div>
          </div>

          <ImageUpload 
            label="Banner Image"
            value={formData.image || ''}
            onChange={(val) => setFormData({...formData, image: val})}
            suggestion="Landscape, 1920x600px"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Redirect Link</label>
              <div className="relative">
                <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input 
                  type="text" required 
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  placeholder="/shop or https://..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-16 pr-6 text-white outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-700 h-[60px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Active Status</span>
              <button 
                type="button"
                onClick={() => setFormData({...formData, active: !formData.active})}
                className={`ml-auto flex items-center gap-2 font-bold text-xs p-1 rounded-full transition-all ${formData.active ? 'text-green-400' : 'text-slate-500'}`}
              >
                {formData.active ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
          >
            <Save className="w-6 h-6" /> {loading ? 'Saving Changes...' : 'Publish Banner'}
          </button>
        </form>
      </div>
    </div>
  );
}
