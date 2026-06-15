import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useSite } from '../../context/SiteContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, profile, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const { settings } = useSite();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`flex items-center justify-center transform group-hover:rotate-6 transition-transform shrink-0 ${!settings.logo ? 'w-10 h-10 bg-primary rounded-xl' : ''}`}>
              {settings.logo ? (
                <img src={settings.logo} alt={settings.siteName} className="w-10 h-10 object-contain" />
              ) : (
                <span className="text-white font-display font-bold text-xl">
                  {settings.siteName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-xl font-display font-bold tracking-tight flex flex-wrap">
              {settings.siteName.split(' ').map((word, i) => (
                <span key={i} className={i === 0 ? 'text-green-600' : 'text-orange-500 ml-1'}>
                  {word}
                </span>
              ))}
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {settings.navigation.headerLinks.map((link, i) => (
              <Link key={i} to={link.path} className="text-gray-600 hover:text-primary font-medium transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-5">
            <div className="relative">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`transition-colors ${isSearchOpen ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
              >
                <Search className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form 
                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 20 }}
                    onSubmit={handleSearch}
                    className="absolute right-0 top-12 w-64 md:w-80 bg-white shadow-2xl rounded-2xl p-2 border border-gray-100 flex items-center"
                  >
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Search biscuits..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-grow px-4 py-2 border-none focus:ring-0 text-sm"
                    />
                    <button type="submit" className="p-2 bg-primary text-white rounded-xl">
                      <Search className="w-4 h-4" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
            <Link to="/cart" className="relative group">
              <ShoppingCart className="w-6 h-6 text-gray-500 group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 group-hover:border-primary transition-colors overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                    )}
                  </div>
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-500 hover:text-primary transition-colors" title="Admin Panel">
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                )}
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-500" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-primary">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 py-6 space-y-4">
              {settings.navigation.headerLinks.map((link, i) => (
                <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)} className="block text-gray-600 hover:text-primary font-medium">
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100">
                {user && (
                  <div className="flex flex-col gap-4">
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-gray-600">
                      <User className="w-5 h-5" />
                      <span>My Profile</span>
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-primary font-medium">
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-medium">
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
