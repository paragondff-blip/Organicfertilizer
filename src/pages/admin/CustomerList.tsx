import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, orderBy, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { UserProfile } from '../../types';
import { User, Mail, Calendar, MapPin, Search, UserX, Ban, Trash2, ShieldCheck, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-toastify';

export default function CustomerList() {
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as any as UserProfile[];
      setCustomers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (uid: string, newStatus: 'active' | 'blocked' | 'banned') => {
    try {
      await updateDoc(doc(db, 'users', uid), { status: newStatus });
      toast.success(`User successfully ${newStatus}`);
      fetchCustomers();
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
      toast.success('Customer deleted');
      fetchCustomers();
    } catch (e) {
      toast.error('Failed to delete customer');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c => 
    c.displayName?.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-slate-800 p-6 rounded-3xl border border-slate-700">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
             type="text" 
             placeholder="Search by name or email..." 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-12 text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-4 items-center">
           <p className="text-sm font-bold text-slate-500">Total: {customers.length} Customers</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-700">
        <table className="w-full text-left">
          <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-slate-700">
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-center">Joined</th>
                <th className="px-8 py-6">Role</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            <AnimatePresence>
              {filtered.map((c) => (
                <motion.tr 
                  key={c.uid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-primary">
                         {c.displayName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{c.displayName}</p>
                        <p className="text-[10px] text-slate-500">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      c.status === 'blocked' ? 'bg-orange-900/50 text-orange-400' : 
                      c.status === 'banned' ? 'bg-red-900/50 text-red-400' : 
                      'bg-green-900/50 text-green-400'
                    }`}>
                      {c.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <p className="text-xs text-slate-400">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${c.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-slate-900 text-slate-500'}`}>
                       {c.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                       {c.status !== 'blocked' && (
                         <button 
                           onClick={() => handleUpdateStatus(c.uid, 'blocked')}
                           title="Block User"
                           className="p-2 bg-slate-900 text-orange-400 hover:bg-orange-400 hover:text-white rounded-xl transition-all"
                         >
                           <UserX className="w-4 h-4" />
                         </button>
                       )}
                       {c.status !== 'banned' && (
                         <button 
                           onClick={() => handleUpdateStatus(c.uid, 'banned')}
                           title="Ban User"
                           className="p-2 bg-slate-900 text-red-400 hover:bg-red-400 hover:text-white rounded-xl transition-all"
                         >
                           <Ban className="w-4 h-4" />
                         </button>
                       )}
                       {c.status && c.status !== 'active' && (
                         <button 
                           onClick={() => handleUpdateStatus(c.uid, 'active')}
                           title="Activate User"
                           className="p-2 bg-slate-900 text-green-400 hover:bg-green-400 hover:text-white rounded-xl transition-all"
                         >
                           <ShieldCheck className="w-4 h-4" />
                         </button>
                       )}
                       <button 
                         onClick={() => handleDeleteUser(c.uid)}
                         title="Delete Customer"
                         className="p-2 bg-slate-900 text-slate-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
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
      </div>
    </div>
  );
}
