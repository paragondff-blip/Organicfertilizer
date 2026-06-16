import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { CreditCard, Truck, MapPin, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { addDoc, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useSite } from '../context/SiteContext';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { settings } = useSite();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: profile?.displayName || '',
    email: profile?.email || '',
    address: profile?.address || '',
    city: '',
    zipCode: '',
    phone: profile?.phoneNumber || '',
    paymentMethod: 'cod',
    transactionId: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (formData.paymentMethod !== 'cod' && !formData.transactionId) {
      toast.error("Please enter the Transaction ID for your payment");
      return;
    }

    setLoading(true);
    try {
      // Check if customer is blocked/banned by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', formData.email.toLowerCase().trim()));
      const userSnap = await getDocs(q);
      
      if (!userSnap.empty) {
        // We use the first found user matching this email
        const userDoc = userSnap.docs[0];
        const existingUserInfo = userDoc.data();
        
        if (existingUserInfo.status === 'blocked' || existingUserInfo.status === 'banned') {
          toast.error("Your account has been blocked or banned. Please contact support.");
          setLoading(false);
          return;
        }
      } else {
        // Create a new user record for the customer management
        await addDoc(collection(db, 'users'), {
          email: formData.email.toLowerCase().trim(),
          displayName: formData.fullName,
          phoneNumber: formData.phone,
          address: formData.address,
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString()
        });
      }

      const orderData = {
        userId: user?.uid || 'guest',
        userName: formData.fullName,
        email: formData.email.toLowerCase().trim(),
        items: cart,
        total: cartTotal,
        status: 'pending',
        paymentStatus: formData.paymentMethod === 'cod' ? 'unpaid' : 'pending_verification',
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      clearCart();
      if (formData.paymentMethod === 'cod') {
        toast.success("Order successful! We will deliver soon.");
      } else {
        toast.success("Payment submitted! We will verify and process your order.");
      }
      
      if (user) {
        navigate('/dashboard/orders');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3 space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
            <div className={`h-1 flex-grow rounded-full transition-all ${step >= 2 ? 'bg-primary' : 'bg-gray-100'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
            <div className={`h-1 flex-grow rounded-full transition-all ${step >= 3 ? 'bg-primary' : 'bg-gray-100'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>3</div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-10 rounded-[2.5rem] space-y-8"
          >
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-7 h-7 text-primary" />
                  <h2 className="text-3xl font-display font-bold">Shipping Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-slate-50 border border-gray-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-slate-50 border border-gray-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none" required />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400 ml-1">Street Address</label>
                    <input name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-slate-50 border border-gray-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400 ml-1">City</label>
                    <input name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-slate-50 border border-gray-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                    <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-50 border border-gray-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-gray-400 ml-1">ZIP Code (Optional)</label>
                    <input name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full bg-slate-50 border border-gray-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="btn-primary w-full py-4 text-lg">Next Step <ChevronRight className="w-5 h-5" /></button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-7 h-7 text-secondary" />
                  <h2 className="text-3xl font-display font-bold">Payment Method</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {settings.payments.codActive && (
                    <label 
                      className={`flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-secondary bg-secondary/5' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="w-5 h-5 text-secondary focus:ring-secondary" />
                      <Truck className={`w-6 h-6 ${formData.paymentMethod === 'cod' ? 'text-secondary' : 'text-gray-400'}`} />
                      <div className="flex flex-col">
                        <span className="font-bold text-lg">Cash on Delivery</span>
                        <span className="text-xs text-gray-400">Pay when you receive the product</span>
                      </div>
                    </label>
                  )}
                  {settings.payments.bkashActive && (
                    <label 
                      className={`flex flex-col gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'bkash' ? 'border-[#e2136e] bg-[#e2136e]/5' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className="flex items-center gap-4">
                        <input type="radio" name="paymentMethod" value="bkash" checked={formData.paymentMethod === 'bkash'} onChange={handleInputChange} className="w-5 h-5 text-[#e2136e] focus:ring-[#e2136e]" />
                        <span className="font-bold text-lg">bKash</span>
                      </div>
                      {formData.paymentMethod === 'bkash' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-2 border-t border-[#e2136e]/20">
                          <p className="text-xs text-gray-500">Please Send Money (Personal) to: <b className="text-gray-900">{settings.payments.bkashNumber}</b></p>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-[#e2136e]">Transaction ID</label>
                             <input 
                               name="transactionId" 
                               value={formData.transactionId} 
                               onChange={handleInputChange} 
                               placeholder="Enter bKash TrxID"
                               className="w-full bg-white border border-[#e2136e]/20 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#e2136e]/20 outline-none" 
                             />
                          </div>
                        </motion.div>
                      )}
                    </label>
                  )}
                  {settings.payments.nagadActive && (
                    <label 
                      className={`flex flex-col gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'nagad' ? 'border-[#f7941d] bg-[#f7941d]/5' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className="flex items-center gap-4">
                        <input type="radio" name="paymentMethod" value="nagad" checked={formData.paymentMethod === 'nagad'} onChange={handleInputChange} className="w-5 h-5 text-[#f7941d] focus:ring-[#f7941d]" />
                        <span className="font-bold text-lg">Nagad</span>
                      </div>
                      {formData.paymentMethod === 'nagad' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-2 border-t border-[#f7941d]/20">
                          <p className="text-xs text-gray-500">Please Send Money (Personal) to: <b className="text-gray-900">{settings.payments.nagadNumber}</b></p>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-[#f7941d]">Transaction ID</label>
                             <input 
                               name="transactionId" 
                               value={formData.transactionId} 
                               onChange={handleInputChange} 
                               placeholder="Enter Nagad TrxID"
                               className="w-full bg-white border border-[#f7941d]/20 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#f7941d]/20 outline-none" 
                             />
                          </div>
                        </motion.div>
                      )}
                    </label>
                  )}
                  {settings.payments.rocketActive && (
                    <label 
                      className={`flex flex-col gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'rocket' ? 'border-[#8c3494] bg-[#8c3494]/5' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className="flex items-center gap-4">
                        <input type="radio" name="paymentMethod" value="rocket" checked={formData.paymentMethod === 'rocket'} onChange={handleInputChange} className="w-5 h-5 text-[#8c3494] focus:ring-[#8c3494]" />
                        <span className="font-bold text-lg">Rocket</span>
                      </div>
                      {formData.paymentMethod === 'rocket' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-2 border-t border-[#8c3494]/20">
                          <p className="text-xs text-gray-500">Please Send Money (Personal) to: <b className="text-gray-900">{settings.payments.rocketNumber}</b></p>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-[#8c3494]">Transaction ID</label>
                             <input 
                               name="transactionId" 
                               value={formData.transactionId} 
                               onChange={handleInputChange} 
                               placeholder="Enter Rocket TrxID"
                               className="w-full bg-white border border-[#8c3494]/20 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#8c3494]/20 outline-none" 
                             />
                          </div>
                        </motion.div>
                      )}
                    </label>
                  )}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-grow bg-gray-200 text-gray-600 hover:bg-gray-300">Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-grow">Review Order</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-7 h-7 text-primary" />
                  <h2 className="text-3xl font-display font-bold">Review & Confirm</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-8 rounded-[2rem]">
                  <div className="space-y-4">
                    <h3 className="font-bold uppercase tracking-widest text-xs text-gray-400">Shipping Details</h3>
                    <div className="space-y-1">
                      <p className="font-bold">{formData.fullName}</p>
                      <p className="text-gray-600">{formData.address}</p>
                      <p className="text-gray-600">{formData.city}, {formData.zipCode}</p>
                      <p className="text-gray-600">Phone: {formData.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold uppercase tracking-widest text-xs text-gray-400">Payment Information</h3>
                    <p className="font-bold flex items-center gap-2">
                       <span className="capitalize">{formData.paymentMethod}</span>
                       <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded italic">Secure</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handlePlaceOrder} 
                    disabled={loading}
                    className="btn-primary w-full py-4 text-xl flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : (
                      <>
                        Confirm and Place Order <Lock className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <button onClick={() => setStep(2)} className="w-full py-2 text-gray-400 font-bold uppercase tracking-widest text-[10px] hover:text-gray-600 transition-colors">Edit Payment or Shipping</button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:w-1/3">
          <div className="glass p-8 rounded-[2.5rem] sticky top-24">
            <h2 className="text-2xl font-display font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.productId} className="flex gap-4">
                  {item.image ? <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" /> : <div className="w-16 h-16 bg-slate-100 rounded-xl shrink-0"></div>}
                  <div className="flex-grow">
                    <h4 className="font-bold text-sm leading-tight line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} x Tk {item.price}</p>
                  </div>
                  <span className="font-bold text-sm">Tk {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
              <div className="flex justify-between font-bold">
                <span className="text-gray-400 uppercase tracking-tighter text-xs">Subtotal</span>
                <span>Tk {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-gray-400 uppercase tracking-tighter text-xs">Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="font-display font-bold text-xl uppercase tracking-widest text-primary">Total</span>
                <span className="text-3xl font-display font-bold">Tk {cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
