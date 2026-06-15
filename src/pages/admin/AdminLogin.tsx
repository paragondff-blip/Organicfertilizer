import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { Lock, User, ArrowLeft, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminLogin() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(id, password);
    if (success) {
      toast.success("Admin access granted");
      navigate('/admin');
    } else {
      toast.error("Invalid Admin Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-slate-900 border border-slate-800 p-12 rounded-[3rem] shadow-2xl relative z-10 space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto text-primary border border-primary/30">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold text-white">Admin Access</h1>
            <p className="text-slate-400 text-sm">Secure terminal for platform management.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Admin Identifier</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                required 
                value={id}
                onChange={(e) => setId(e.target.value)}
                autoComplete="username"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-12 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                placeholder="Enter admin ID..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-12 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 text-lg"
          >
            Authorize Access
          </button>
        </form>

        <div className="pt-4 text-center">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Main Site
          </button>
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em]">
        Management Console v2.0
      </div>
    </div>
  );
}
