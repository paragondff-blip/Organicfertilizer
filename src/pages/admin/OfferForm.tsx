import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { motion } from 'motion/react';
import { Save, ArrowLeft, Tag, Calendar, Percent, CreditCard } from 'lucide-react';
import { Coupon } from '../../types';

export default function OfferForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    minPurchase: 0,
    expiryDate: '',
    usageLimit: 0,
    active: true,
    usageCount: 0
  });

  useEffect(() => {
    if (id) {
      const fetchOffer = async () => {
        const docSnap = await getDoc(doc(db, 'offers', id));
        if (docSnap.exists()) {
          setFormData(docSnap.data() as Coupon);
        }
      };
      fetchOffer();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...formData,
        code: formData.code?.toUpperCase(),
        updatedAt: serverTimestamp(),
        createdAt: formData.createdAt || serverTimestamp()
      };

      if (id) {
        await setDoc(doc(db, 'offers', id), data);
        toast.success('Offer updated successfully');
      } else {
        await addDoc(collection(db, 'offers'), data);
        toast.success('Offer created successfully');
      }
      navigate('/admin/offers');
    } catch (e: any) {
      console.error(e);
      toast.error(`Operation failed: ${e.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <button 
        onClick={() => navigate('/admin/offers')}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Offers
      </button>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="bg-slate-800 p-8 md:p-12 rounded-[3.5rem] border border-slate-700 shadow-2xl space-y-10"
      >
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-bold text-white">{id ? 'Edit Promo Code' : 'Create New Promo Code'}</h2>
          <p className="text-slate-400 text-sm">Define your discount parameters and distribution rules.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Promo Code</label>
            <div className="relative">
              <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              <input 
                type="text" required 
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                placeholder="E.G. SUMMER25"
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-16 pr-6 text-white font-mono font-bold tracking-widest outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Discount Type</label>
            <div className="flex gap-2 p-1 bg-slate-900 border border-slate-700 rounded-2xl">
              <button 
                type="button"
                onClick={() => setFormData({...formData, discountType: 'percentage'})}
                className={`flex-grow flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${formData.discountType === 'percentage' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-800'}`}
              >
                <Percent className="w-4 h-4" /> Percentage
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, discountType: 'fixed'})}
                className={`flex-grow flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${formData.discountType === 'fixed' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-800'}`}
              >
                <CreditCard className="w-4 h-4" /> Fixed Amount
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
              Discount Value ({formData.discountType === 'percentage' ? '%' : '৳'})
            </label>
            <input 
              type="number" required 
              value={formData.discountValue}
              onChange={(e) => setFormData({...formData, discountValue: Number(e.target.value)})}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Minimum Purchase (৳)</label>
            <input 
              type="number" required 
              value={formData.minPurchase}
              onChange={(e) => setFormData({...formData, minPurchase: Number(e.target.value)})}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Expiry Date</label>
            <div className="relative">
              <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              <input 
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-16 pr-6 text-white outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Usage Limit (0 for ∞)</label>
            <input 
              type="number" required 
              value={formData.usageLimit}
              onChange={(e) => setFormData({...formData, usageLimit: Number(e.target.value)})}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-4">
           <label className="flex items-center gap-3 cursor-pointer group">
              <div 
                onClick={() => setFormData({...formData, active: !formData.active})}
                className={`w-12 h-6 rounded-full transition-all relative ${formData.active ? 'bg-primary' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.active ? 'left-7' : 'left-1'}`} />
              </div>
              <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Active & Redeemable</span>
           </label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full btn-primary py-5 rounded-2xl text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
        >
          <Save className="w-6 h-6" /> {loading ? 'Saving Offer...' : 'Save Promotion'}
        </button>
      </motion.form>
    </div>
  );
}
