import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Tag, BarChart3, Settings, LogOut, PackagePlus, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useSite } from '../../context/SiteContext';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import BannerList from './BannerList';
import BannerForm from './BannerForm';
import BrandList from './BrandList';
import BrandForm from './BrandForm';
import CategoryList from './CategoryList';
import CategoryForm from './CategoryForm';
import AdminOrderList from './AdminOrderList';
import CustomerList from './CustomerList';
import OffersList from './OffersList';
import OfferForm from './OfferForm';
import SettingsManager from './SettingsManager';
import Analytics from './Analytics';

export default function AdminDashboard() {
  const { isAdmin, loading, logout } = useAuth();
  const { settings } = useSite();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) return null;
  if (!isAdmin) return <Navigate to="/admin-login" />;

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Banners', path: '/admin/banners', icon: ImageIcon },
    { name: 'Offers', path: '/admin/offers', icon: Tag },
    { name: 'Brands', path: '/admin/brands', icon: Tag },
    { name: 'Categories', path: '/admin/categories', icon: Tag },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-8 pb-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">OB</span>
            </div>
            <span className="text-lg font-display font-bold tracking-tight text-white">
              Admin<span className="text-secondary">Panel</span>
            </span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                             (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
              >
                <item.icon className="w-5 h-5 font-bold" />
                <span className="font-bold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
           <button 
             onClick={async () => {
               await logout();
               navigate('/');
             }} 
             className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
           >
              <LogOut className="w-5 h-5" />
              <span className="font-bold text-sm">Exit Admin</span>
           </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-grow p-8 md:p-12 overflow-y-auto max-h-screen custom-scrollbar">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-bold text-white">
              {menuItems.find(i => i.path !== '/admin' && location.pathname.startsWith(i.path))?.name || 'Admin Overview'}
            </h1>
            <p className="text-slate-400">Welcome back, Sales Admin. Here is what's happening with {settings.siteName} today.</p>
          </div>
          <div className="flex gap-4">
            {location.pathname === '/admin/products' && (
              <Link to="/admin/products/add" className="btn-primary flex items-center gap-2 py-3 px-6 text-sm">
                <PackagePlus className="w-5 h-5" /> Add Product
              </Link>
            )}
            {location.pathname === '/admin/banners' && (
              <Link to="/admin/banners/add" className="btn-primary flex items-center gap-2 py-3 px-6 text-sm">
                <PackagePlus className="w-5 h-5" /> Add Banner
              </Link>
            )}
            {location.pathname === '/admin/offers' && (
              <Link to="/admin/offers/add" className="btn-primary flex items-center gap-2 py-3 px-6 text-sm">
                <PackagePlus className="w-5 h-5" /> Add Offer
              </Link>
            )}
            {location.pathname === '/admin/brands' && (
              <Link to="/admin/brands/add" className="btn-primary flex items-center gap-2 py-3 px-6 text-sm">
                <PackagePlus className="w-5 h-5" /> Add Brand
              </Link>
            )}
            {location.pathname === '/admin/categories' && (
              <Link to="/admin/categories/add" className="btn-primary flex items-center gap-2 py-3 px-6 text-sm">
                <PackagePlus className="w-5 h-5" /> Add Category
              </Link>
            )}
          </div>
        </header>

        <Routes>
           <Route path="/" element={<AdminOverview />} />
           <Route path="banners" element={<BannerList />} />
           <Route path="banners/add" element={<BannerForm />} />
           <Route path="banners/edit/:id" element={<BannerForm />} />
           <Route path="brands" element={<BrandList />} />
           <Route path="brands/add" element={<BrandForm />} />
           <Route path="brands/edit/:id" element={<BrandForm />} />
           <Route path="categories" element={<CategoryList />} />
           <Route path="categories/add" element={<CategoryForm />} />
           <Route path="categories/edit/:id" element={<CategoryForm />} />
           <Route path="products" element={<ProductList />} />
           <Route path="products/add" element={<ProductForm />} />
           <Route path="products/edit/:id" element={<ProductForm />} />
           <Route path="orders" element={<AdminOrderList />} />
           <Route path="customers" element={<CustomerList />} />
           <Route path="offers" element={<OffersList />} />
           <Route path="offers/add" element={<OfferForm />} />
           <Route path="offers/edit/:id" element={<OfferForm />} />
           <Route path="analytics" element={<Analytics />} />
           <Route path="settings" element={<SettingsManager />} />
           <Route path="*" element={<div className="bg-slate-800 p-20 rounded-3xl text-center text-slate-500 font-display text-2xl font-bold border border-slate-700 border-dashed">Module Implementation in Progress</div>} />
        </Routes>
      </main>
    </div>
  );
}

function AdminOverview() {
  const [counts, setCounts] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    banners: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const pSnap = await getDocs(collection(db, 'products'));
        const oSnap = await getDocs(collection(db, 'orders'));
        const cSnap = await getDocs(collection(db, 'users'));
        const bSnap = await getDocs(collection(db, 'banners'));
        
        setCounts({
          products: pSnap.size,
          orders: oSnap.size,
          customers: cSnap.size,
          banners: bSnap.size
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchCounts();
  }, []);

  const stats = [
    { label: 'Total Revenue', value: `৳${(counts.orders * 1500).toLocaleString()}`, change: '+12.5%', icon: BarChart3, color: 'text-green-400' },
    { label: 'Active Orders', value: counts.orders.toString(), change: 'Real-time', icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'Total Customers', value: counts.customers.toString(), change: 'Registered', icon: Users, color: 'text-purple-400' },
    { label: 'Live Banners', value: counts.banners.toString(), change: 'Active', icon: Tag, color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-800 p-8 rounded-3xl border border-slate-700 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl bg-opacity-10 ${s.color} bg-current`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <span className={`text-xs font-bold ${s.change.startsWith('+') ? 'text-green-400' : 'text-orange-400'}`}>{s.change}</span>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{s.label}</p>
              <p className="text-3xl font-display font-bold text-white mt-1">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 space-y-6">
          <h3 className="text-xl font-display font-bold">Recent Orders</h3>
          <div className="space-y-4">
             {[1,2,3,4].map(idx => (
               <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold">#O4</div>
                    <div>
                      <p className="font-bold text-sm">Customer Name</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Today at 10:45 AM</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-primary">৳45.99</p>
                    <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 bg-green-900/50 text-green-400 rounded">Paid</span>
                  </div>
               </div>
             ))}
          </div>
          <button className="w-full py-4 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors border-t border-slate-700 border-dashed pt-4">View All Transactions</button>
        </div>

        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 flex flex-col justify-center items-center text-center space-y-4">
           <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center text-primary">
              <BarChart3 className="w-10 h-10" />
           </div>
           <h3 className="text-xl font-display font-bold">Sales Analytics</h3>
           <p className="text-slate-400 text-sm max-w-xs">Detailed visual reports and forecasting data will be available as more orders are processed.</p>
           <button className="btn-primary">Generate Monthly PDF</button>
        </div>
      </div>
    </div>
  );
}
