import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, Minus, Plus, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto space-y-8 glass p-12 rounded-[3.5rem]"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-display font-bold">Your Cart is Empty</h2>
            <p className="text-gray-500">Looks like you haven't added any biscuits to your cart yet. Let's find something delicious!</p>
          </div>
          <Link to="/shop" className="btn-primary w-full py-4 text-lg">
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold">Shopping Cart</h1>
          <p className="text-gray-500">You have {cart.length} items in your tray</p>
        </div>
        <Link to="/shop" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
          <ArrowLeft className="w-5 h-5" /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass p-6 rounded-[2rem] flex flex-col sm:flex-row items-center gap-8 border-none"
              >
                <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                  {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-slate-400 font-bold text-xs uppercase">No Img</span>}
                </div>
                
                <div className="flex-grow space-y-2 text-center sm:text-left">
                  <h3 className="text-xl font-display font-bold">{item.name}</h3>
                  <p className="text-gray-400 font-medium">Unit Price: Tk {item.price}</p>
                </div>

                <div className="flex items-center bg-gray-100 rounded-full p-1 w-32 justify-between">
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-gray-600 transition-all active:scale-90"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-lg">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-gray-600 transition-all active:scale-90"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center sm:text-right w-24">
                  <p className="text-2xl font-display font-bold text-gray-900">Tk {(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] space-y-6">
            <h2 className="text-2xl font-display font-bold border-b border-gray-100 pb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between font-medium">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">Tk {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600">Calculated at checkout</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                <span className="text-lg font-display font-bold">Estimated Total</span>
                <span className="text-3xl font-display font-bold text-primary">Tk {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div className="relative group">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Promo Code" 
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-12 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                />
                <button className="absolute right-2 top-2 bottom-2 px-3 bg-white border border-gray-100 text-secondary rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-secondary hover:text-white transition-all">Apply</button>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="btn-secondary w-full py-4 text-lg group"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="glass p-6 rounded-[2rem] flex items-center gap-4 border-dashed">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-500 font-medium leading-tight">
              Encrypted payments & secure checkout powered by industry giants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
