import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Tag, CheckCircle, XCircle, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'motion/react';
import { Coupon } from '../../types';

export default function OffersList() {
  const [offers, setOffers] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'offers'));
      const offersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Coupon[];
      setOffers(offersData);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    try {
      await deleteDoc(doc(db, 'offers', id));
      toast.success('Offer deleted');
      fetchOffers();
    } catch (e) {
      console.error(e);
      toast.error('Delete failed');
    }
  };

  const toggleStatus = async (offer: Coupon) => {
    try {
      await updateDoc(doc(db, 'offers', offer.id), {
        active: !offer.active
      });
      toast.success('Status updated');
      fetchOffers();
    } catch (e) {
      console.error(e);
      toast.error('Update failed');
    }
  };

  if (loading) return <div className="p-20 text-center">Loading offers...</div>;

  return (
    <div className="space-y-8">
      {offers.length === 0 ? (
        <div className="bg-slate-800 p-20 rounded-[3rem] border border-slate-700 border-dashed text-center space-y-4">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto text-slate-500">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-300">No active offers yet</h3>
          <p className="text-slate-500 max-w-xs mx-auto">Create discount coupons to boost your sales and reward your customers.</p>
          <Link to="/admin/offers/add" className="btn-primary inline-flex">Create First Offer</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <motion.div 
              key={offer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 rounded-[2.5rem] border border-slate-700 overflow-hidden group hover:border-primary transition-all"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${offer.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {offer.active ? 'Active' : 'Disabled'}
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/admin/offers/edit/${offer.id}`} className="p-2 bg-slate-700 text-slate-300 rounded-xl hover:bg-primary hover:text-white transition-all">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(offer.id)} className="p-2 bg-slate-700 text-slate-300 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-display font-black text-white tracking-tight">{offer.code}</h3>
                  <p className="text-slate-400 text-sm font-medium">
                    {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `৳${offer.discountValue} OFF`}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-700 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Min Purchase</p>
                    <p className="text-white font-bold">৳{offer.minPurchase || 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Usage</p>
                    <p className="text-white font-bold">{offer.usageCount} / {offer.usageLimit || '∞'}</p>
                  </div>
                </div>

                <button 
                  onClick={() => toggleStatus(offer)}
                  className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${offer.active ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'}`}
                >
                  {offer.active ? 'Disable Coupon' : 'Enable Coupon'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
