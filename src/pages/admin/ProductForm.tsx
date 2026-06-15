import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { motion } from 'motion/react';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Product, Category } from '../../types';
import ImageUpload from '../../components/admin/ImageUpload';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 'all',
    categoryName: '',
    brand: '',
    images: [''],
    ingredients: '',
    nutritionInfo: '',
    isNew: true,
    isBestSeller: false,
    discountPrice: 0,
    rating: 5,
    reviewsCount: 0,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const q = query(collection(db, 'categories'), orderBy('name'));
        const snap = await getDocs(q);
        setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[]);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCategories();

    if (id) {
      const fetchProduct = async () => {
        setFetching(true);
        try {
          const docSnap = await getDoc(doc(db, 'products', id));
          if (docSnap.exists()) {
            setFormData(docSnap.data() as Product);
          }
        } catch (e) {
          toast.error("Failed to fetch product");
        } finally {
          setFetching(false);
        }
      };
      fetchProduct();
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
        await setDoc(doc(db, 'products', id), data);
        toast.success("Product updated successfully");
      } else {
        await addDoc(collection(db, 'products'), data);
        toast.success("Product added successfully");
      }
      navigate('/admin/products');
    } catch (e: any) {
      console.error("Firestore Error:", e);
      toast.error(`Error saving product: ${e.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (index: number, val: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = val;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...(formData.images || []), ''] });
  };

  const removeImageField = (index: number) => {
    setFormData({ ...formData, images: formData.images?.filter((_, i) => i !== index) });
  };

  if (fetching) return <div className="p-20 text-center">Fetching product data...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <button 
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>

      <div className="bg-slate-800 p-8 md:p-12 rounded-[3.5rem] border border-slate-700 space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-display font-bold text-white">{id ? 'Edit Product' : 'Add New Product'}</h2>
          <button 
            type="submit" 
            form="product-form"
            disabled={loading}
            className="btn-primary flex items-center gap-2 py-3 px-8"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>

        <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Product Name</label>
              <input 
                type="text" required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Brand Name</label>
              <input 
                type="text" required 
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Price ($)</label>
              <input 
                type="number" step="0.01" required 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Stock Quantity</label>
              <input 
                type="number" required 
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Category Link</label>
              <select 
                value={formData.categoryId}
                onChange={(e) => {
                  const cat = e.target.value;
                  const name = e.target.options[e.target.selectedIndex].text;
                  setFormData({...formData, categoryId: cat, categoryName: name});
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="all">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Label (Text above Name)</label>
              <input 
                type="text" 
                value={formData.categoryName || ''}
                onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                placeholder="e.g. Classic Biscuits"
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Display Rating (Stars)</label>
              <input 
                type="number" step="0.1" min="0" max="5" 
                value={formData.rating || 5}
                onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Number of Reviews</label>
              <input 
                type="number" 
                value={formData.reviewsCount || 0}
                onChange={(e) => setFormData({...formData, reviewsCount: parseInt(e.target.value)})}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Description</label>
            <textarea 
              rows={4} required 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Product Images</label>
              <button 
                type="button" 
                onClick={addImageField}
                className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase"
              >
                <Plus className="w-3 h-3" /> Add Image Slot
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.images?.map((url, i) => (
                <div key={i} className="relative bg-slate-900 p-4 rounded-3xl border border-slate-700">
                  <div className="absolute top-4 right-4 z-10">
                    {formData.images!.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeImageField(i)}
                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <ImageUpload 
                    label={`Image ${i + 1}`}
                    value={url}
                    onChange={(val) => handleImageChange(i, val)}
                    suggestion="Square, 800x800px"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Ingredients</label>
              <textarea 
                value={formData.ingredients}
                onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nutrition Info</label>
              <textarea 
                value={formData.nutritionInfo}
                onChange={(e) => setFormData({...formData, nutritionInfo: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary text-sm"
              />
            </div>
          </div>

          <div className="flex gap-8 py-4 px-2">
             <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={formData.isNew}
                  onChange={(e) => setFormData({...formData, isNew: e.target.checked})}
                  className="w-5 h-5 accent-primary" 
                />
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Mark as New Arrival</span>
             </label>
             <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={formData.isBestSeller}
                  onChange={(e) => setFormData({...formData, isBestSeller: e.target.checked})}
                  className="w-5 h-5 accent-secondary" 
                />
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Mark as Bestseller</span>
             </label>
          </div>
        </form>
      </div>
    </div>
  );
}
