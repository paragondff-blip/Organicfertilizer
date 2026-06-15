import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import { Order } from '../../types';
import { Truck, CheckCircle2, Clock, Eye, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-toastify';

export default function AdminOrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', id), { 
        status: status as any,
        updatedAt: new Date().toISOString()
      });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status: status as any });
      }
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-700">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-slate-700">
              <th className="px-8 py-6">Order ID</th>
              <th className="px-8 py-6">Customer</th>
              <th className="px-8 py-6">Total</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6">Payment</th>
              <th className="px-8 py-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            <AnimatePresence>
              {orders.map((o) => (
                <motion.tr 
                  key={o.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-8 py-6">
                    <p className="font-mono text-xs font-bold text-slate-300">#{o.id.slice(-8).toUpperCase()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-bold text-white text-sm">{o.userName || 'Guest'}</p>
                      <p className="text-[10px] text-slate-500">Items: {o.items.length}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-display font-bold text-primary">Tk {o.total.toFixed(2)}</p>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg py-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-300 focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-8 py-6">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${o.paymentStatus === 'paid' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                        {o.paymentStatus}
                     </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => setSelectedOrder(o)}
                        className="p-2 bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all"
                      >
                        <Eye className="w-4 h-4" />
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

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl p-8 md:p-12 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
               <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white">Order Details</h3>
                    <p className="text-slate-500 font-mono text-sm uppercase">#{selectedOrder.id}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl transition-all"
                  >
                    ×
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-4">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Customer Info</p>
                     <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                           {(selectedOrder.userName || 'G')[0]}
                        </div>
                        <div>
                           <p className="font-bold text-white">{selectedOrder.userName || 'Guest User'}</p>
                           <p className="text-xs text-slate-400">ID: {selectedOrder.userId}</p>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Shipping Address</p>
                     <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-800">
                        <p className="text-sm text-slate-300 leading-relaxed">
                           {selectedOrder.shippingAddress?.address || 'N/A'}
                        </p>
                        <p className="text-xs text-slate-500 font-bold mt-2">Ph: {selectedOrder.shippingAddress?.phone || 'N/A'}</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-4 mb-8">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Items Ordered</p>
                  <div className="divide-y divide-slate-800 border-y border-slate-800">
                     {selectedOrder.items.map((item, i) => (
                        <div key={i} className="py-4 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden">
                                 {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <Clock className="w-5 h-5 text-slate-600" />}
                              </div>
                              <div>
                                 <p className="font-bold text-white text-sm">{item.name}</p>
                                 <p className="text-[10px] text-slate-500 font-bold uppercase">Qty: {item.quantity} × Tk {item.price}</p>
                              </div>
                           </div>
                           <p className="font-bold text-white">Tk {item.quantity * item.price}</p>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="flex items-center justify-between p-6 bg-slate-950 rounded-3xl mb-8">
                  <span className="font-display font-medium text-slate-400">Total Order Value</span>
                  <span className="text-2xl font-display font-bold text-primary tracking-tight">Tk {selectedOrder.total.toFixed(2)}</span>
               </div>

               <div className="flex gap-4">
                  <select 
                    value={selectedOrder.status}
                    onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                    className="flex-grow bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary appearance-none cursor-pointer font-bold"
                  >
                    <option value="pending">Mark as Pending</option>
                    <option value="processing">Mark as Processing</option>
                    <option value="shipped">Mark as Shipped</option>
                    <option value="delivered">Mark as Delivered</option>
                    <option value="cancelled">Mark as Cancelled</option>
                  </select>
                  <button className="bg-slate-800 text-white font-bold px-8 rounded-2xl border border-slate-700 hover:bg-slate-700 transition-all">Print Invoice</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
