import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import { motion } from 'motion/react';
import { LogIn, ArrowLeft } from 'lucide-react';

export default function Auth() {
  const { user, signInWithGoogle, loading } = useAuth();
  const { settings } = useSite();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden bg-slate-50">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-[80px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-12 rounded-[3.5rem] shadow-2xl relative z-10 space-y-10 text-center"
      >
        <div className="space-y-4">
          <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center mx-auto shadow-lg rotate-3 transform hover:rotate-0 transition-transform">
            <span className="text-white font-display font-bold text-3xl">OB</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500">Sign in to {settings.siteName} to manage your orders, wishlist, and more.</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-4 bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-8 rounded-2xl border border-gray-100 shadow-sm transition-all active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/nps/google.svg" width="20" alt="Google" />
            Continue with Google
          </button>
          
          <div className="flex items-center gap-4 py-4">
            <div className="flex-grow h-px bg-gray-100" />
            <span className="text-[10px] uppercase font-bold text-gray-300 tracking-[0.2em]">Secure Authentication</span>
            <div className="flex-grow h-px bg-gray-100" />
          </div>

          <p className="text-xs text-gray-400">
            By continuing, you agree to our <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
        </div>

        <button 
          onClick={() => navigate('/')} 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </motion.div>
    </div>
  );
}
