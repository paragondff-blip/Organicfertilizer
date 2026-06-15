import { useState } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Package, MapPin, Calendar, Clock, CheckCircle2, CircleDashed, Truck, AlertCircle } from 'lucide-react';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const docRef = doc(db, 'orders', orderId.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError('Order not found. Please check your Order ID and try again.');
      }
    } catch (e) {
      console.error(e);
      setError('An error occurred while fetching your order.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'processing':
        return { 
          icon: CircleDashed, 
          color: 'text-blue-500', 
          bg: 'bg-blue-50', 
          label: 'Processing',
          step: 1
        };
      case 'shipped':
        return { 
          icon: Truck, 
          color: 'text-orange-500', 
          bg: 'bg-orange-50', 
          label: 'Shipped',
          step: 2
        };
      case 'delivered':
        return { 
          icon: CheckCircle2, 
          color: 'text-green-500', 
          bg: 'bg-green-50', 
          label: 'Delivered',
          step: 3
        };
      case 'cancelled':
        return { 
          icon: AlertCircle, 
          color: 'text-red-500', 
          bg: 'bg-red-50', 
          label: 'Cancelled',
          step: 0
        };
      default:
        return { 
          icon: Clock, 
          color: 'text-gray-500', 
          bg: 'bg-gray-50', 
          label: 'Pending',
          step: 1
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold">Track Your Order</h1>
        <p className="text-gray-500 text-lg">Enter your order ID to see the real-time status of your biscuits.</p>
      </div>

      <form onSubmit={handleTrack} className="max-w-2xl mx-auto">
        <div className="flex gap-4 p-2 bg-white rounded-3xl shadow-xl border border-gray-100">
          <input
            required
            type="text"
            placeholder="Enter Order ID (e.g. order_123...)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-grow px-6 py-4 bg-transparent border-none focus:ring-0 outline-none text-gray-900 font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2 px-8 py-4 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            Track
          </button>
        </div>
      </form>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 flex items-center gap-4 max-w-2xl mx-auto"
          >
            <AlertCircle className="shrink-0" />
            <p className="font-medium">{error}</p>
          </motion.div>
        )}

        {order && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Status Card */}
            <div className="glass p-8 rounded-[3rem] border-2 border-primary/10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Order ID: {order.id}</p>
                  <h2 className="text-2xl font-display font-bold">Order Breakdown</h2>
                </div>
                <div className={`px-6 py-2 rounded-full flex items-center gap-2 ${getStatusInfo(order.status).bg} ${getStatusInfo(order.status).color}`}>
                  {(() => {
                    const status = getStatusInfo(order.status);
                    const Icon = status.icon;
                    return (
                      <>
                        <Icon className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-widest text-xs">{status.label}</span>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Progress Steps */}
              {order.status !== 'cancelled' && (
                <div className="mt-12 relative flex justify-between items-center max-w-2xl mx-auto">
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -translate-y-1/2" />
                  <div 
                    className="absolute top-1/2 left-0 h-[2px] bg-primary transition-all duration-1000 -translate-y-1/2" 
                    style={{ width: `${(getStatusInfo(order.status).step / 3) * 100}%` }}
                  />
                  {[
                    { label: 'Processing', step: 1 },
                    { label: 'Shipped', step: 2 },
                    { label: 'Delivered', step: 3 }
                  ].map((step) => (
                    <div key={step.step} className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 transition-colors duration-500 ${getStatusInfo(order.status).step >= step.step ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${getStatusInfo(order.status).step >= step.step ? 'text-primary' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Info */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 space-y-6 shadow-sm">
                <h3 className="font-display font-bold text-xl">Order Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-gray-500">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest">Order Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {order.createdAt?.seconds 
                          ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                          : new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest">Shipping Address</p>
                      <p className="text-sm font-medium text-gray-900">{order.shippingAddress?.address || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500">
                    <Package className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest">Customer</p>
                      <p className="text-sm font-medium text-gray-900">{order.userName || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 space-y-6 shadow-sm">
                 <div className="flex justify-between items-center">
                    <h3 className="font-display font-bold text-xl">Amount Summary</h3>
                    <span className="text-2xl font-display font-bold text-primary">Tk {order.total?.toFixed(2)}</span>
                 </div>
                 <div className="space-y-4 max-h-[200px] overflow-y-auto pr-4 custom-scrollbar">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                        {item.image ? <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" /> : <div className="w-12 h-12 bg-slate-100 rounded-xl shrink-0"></div>}
                        <div className="flex-grow">
                          <p className="text-sm font-bold leading-tight">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.quantity} x Tk {item.price}</p>
                        </div>
                        <span className="text-sm font-bold">Tk {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center py-12">
         <p className="text-gray-400 text-sm">Need help? <a href="/contact" className="text-primary font-bold hover:underline">Contact our support team</a></p>
      </div>
    </div>
  );
}
