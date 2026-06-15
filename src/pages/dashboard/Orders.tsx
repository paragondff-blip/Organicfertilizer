import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { Order } from '../../types';
import { Package, Truck, CheckCircle2, XCircle, Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const fetchedOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Fetch orders error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'pending': return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100', label: 'Pending' };
      case 'processing': return { icon: Package, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Processing' };
      case 'shipped': return { icon: Truck, color: 'text-primary', bg: 'bg-primary/10', label: 'Shipped' };
      case 'delivered': return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' };
      case 'cancelled': return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'Cancelled' };
      default: return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-100', label: status };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-20 rounded-[3.5rem] text-center space-y-6"
      >
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-display font-bold">No Orders Yet</h3>
          <p className="text-gray-400">Once you place an order, it will appear here for you to track.</p>
        </div>
        <Link to="/shop" className="btn-primary inline-flex">Go to Shop</Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-end justify-between mb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-bold">Order History</h2>
          <p className="text-gray-500">Track and manage your recent biscuit purchases.</p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const status = getStatusInfo(order.status);
          const date = (order.createdAt as any)?.seconds 
            ? new Date((order.createdAt as any).seconds * 1000).toLocaleDateString()
            : new Date(order.createdAt).toLocaleDateString();

          return (
            <div key={order.id} className="glass rounded-[2.5rem] overflow-hidden border-none group hover:shadow-2xl transition-all duration-500">
              <div className="p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl ${status.bg} ${status.color} flex items-center justify-center`}>
                      <status.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Order ID: #{order.id.slice(-8).toUpperCase()}</p>
                      <h4 className="text-xl font-display font-bold mt-1">Placed on {date}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Amount</p>
                      <p className="text-2xl font-display font-bold text-primary">Tk {order.total.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                      <span className={`mt-1 text-[10px] font-bold uppercase tracking-tight ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-400'}`}>
                        {order.paymentStatus === 'paid' ? '● Payment Paid' : '○ Payment Unpaid'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {order.items.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl">
                      {item.image ? <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" /> : <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0"></div>}
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate leading-tight">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="flex items-center justify-center p-3 rounded-2xl border border-dashed border-gray-200">
                      <span className="text-xs font-bold text-gray-400">+{order.items.length - 4} more items</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-4">
                     <p className="text-sm text-gray-500">
                        Shipping to: <span className="font-bold text-gray-700">{order.shippingAddress.address}</span>
                     </p>
                  </div>
                  <button className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest group">
                    View Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
