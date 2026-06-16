import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Tag, BarChart3, Settings, LogOut, PackagePlus, Image as ImageIcon, MessageSquare, Database, Briefcase, Plus, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { useSite } from '../../context/SiteContext';
import { toast } from 'react-toastify';
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
import ContactMessages from './ContactMessages';
import JobList from './JobList';
import JobForm from './JobForm';
import JobApplications from './JobApplications';

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
    { name: 'Careers', path: '/admin/careers', icon: Briefcase },
    { name: 'Applications', path: '/admin/applications', icon: FileText },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
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
            {location.pathname === '/admin/careers' && (
              <Link to="/admin/careers/add" className="btn-primary flex items-center gap-2 py-3 px-6 text-sm">
                <Plus className="w-5 h-5" /> Add Job
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
           <Route path="careers" element={<JobList />} />
           <Route path="careers/add" element={<JobForm />} />
           <Route path="careers/edit/:id" element={<JobForm />} />
           <Route path="applications" element={<JobApplications />} />
           <Route path="messages" element={<ContactMessages />} />
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
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
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

        const recentQ = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(4));
        const recentSnap = await getDocs(recentQ);
        setRecentOrders(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Revenue', value: `৳${(counts.orders * 1500).toLocaleString()}`, change: '+12.5%', icon: BarChart3, color: 'text-green-400' },
    { label: 'Active Orders', value: counts.orders.toString(), change: 'Real-time', icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'Total Customers', value: counts.customers.toString(), change: 'Registered', icon: Users, color: 'text-purple-400' },
    { label: 'Live Banners', value: counts.banners.toString(), change: 'Active', icon: Tag, color: 'text-orange-400' },
  ];

  const seedDemoData = async () => {
    if (!window.confirm("This will add demo Categories, Brands, Products, Banners, and Offers. Continue?")) return;
    try {
      toast.info("Seeding data... please wait.");
      
      // 1. Add Demo Categories
      const categories = [
        { name: 'Natural Fertilizers', slug: 'natural-fertilizers', description: 'Best organic fertilizers for your farm.' },
        { name: 'Eco Seeds', slug: 'eco-seeds', description: 'High-quality organic seeds.' },
        { name: 'Organic Pesticides', slug: 'organic-pesticides', description: 'Safe pesticides for healthy plants.' },
        { name: 'Fruit Saplings', slug: 'fruit-saplings', description: 'Healthy fruit tree saplings.' },
        { name: 'Farm Tools', slug: 'farm-tools', description: 'Essential tools for modern organic farming.' }
      ];
      for (const cat of categories) {
        await addDoc(collection(db, 'categories'), { ...cat, order: 1, createdAt: serverTimestamp() });
      }

      // 2. Add Demo Brands
      const brands = [
        { name: 'GreenGrow', description: 'Premium organic solutions.', logo: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=200&q=80' },
        { name: 'PureLeaf', description: 'Nature matched quality.', logo: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=200&q=80' },
        { name: 'EcoFarm', description: 'Sustainable agriculture.', logo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=200&q=80' }
      ];
      for (const brand of brands) {
        await addDoc(collection(db, 'brands'), { ...brand, order: 1, createdAt: serverTimestamp() });
      }

      // 3. Add Demo Products
      const products = [
        { 
          name: 'Premium Cow Dung Manure', brand: 'GreenGrow', categoryName: 'Natural Fertilizers', categoryId: 'natural-fertilizers', price: 250, stock: 100, 
          description: 'Finely aged organic manure for high yield.', 
          images: ['https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80'],
          isNew: true, isBestSeller: true 
        },
        { 
          name: 'Vermicompost Gold', brand: 'GreenGrow', categoryName: 'Natural Fertilizers', categoryId: 'natural-fertilizers', price: 300, stock: 80, 
          description: 'Worm-processed nutrient-rich earth fertilizer.', 
          images: ['https://images.unsplash.com/photo-1582213726895-32ac44edfb5d?auto=format&fit=crop&w=800&q=80'],
          isNew: false, isBestSeller: true 
        },
        { 
          name: 'Neem Oil Spray', brand: 'PureLeaf', categoryName: 'Organic Pesticides', categoryId: 'organic-pesticides', price: 420, stock: 50, 
          description: 'Natural protection against garden pests.', 
          images: ['https://images.unsplash.com/photo-1623912154378-6593a890479d?auto=format&fit=crop&w=800&q=80'],
          isNew: true, isBestSeller: false 
        },
        { 
          name: 'Organic Tomato Seeds', brand: 'EcoFarm', categoryName: 'Eco Seeds', categoryId: 'eco-seeds', price: 120, stock: 200, 
          description: 'High-germination native tomato seeds.', 
          images: ['https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80'],
          isNew: true, isBestSeller: true 
        },
        { 
          name: 'Chili Hybrid Seeds', brand: 'EcoFarm', categoryName: 'Eco Seeds', categoryId: 'eco-seeds', price: 150, stock: 150, 
          description: 'Spicy hybrid seeds for all seasons.', 
          images: ['https://images.unsplash.com/photo-1563513330615-a4112345337e?auto=format&fit=crop&w=800&q=80'],
          isNew: false, isBestSeller: false 
        },
        { 
          name: 'Mango Grafted Sapling', brand: 'GreenGrow', categoryName: 'Fruit Saplings', categoryId: 'fruit-saplings', price: 550, stock: 30, 
          description: 'Ready-to-plant Amrapali mango sapling.', 
          images: ['https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=800&q=80'],
          isNew: true, isBestSeller: true 
        },
        { 
          name: 'Organic Bone Meal', brand: 'PureLeaf', categoryName: 'Natural Fertilizers', categoryId: 'natural-fertilizers', price: 350, stock: 60, 
          description: 'High phosphorus organic supplement.', 
          images: ['https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=800&q=80'],
          isNew: false, isBestSeller: false 
        },
        { 
          name: 'Hand Trowel', brand: 'EcoFarm', categoryName: 'Farm Tools', categoryId: 'farm-tools', price: 180, stock: 40, 
          description: 'Stainless steel garden trowel with wooden handle.', 
          images: ['https://images.unsplash.com/photo-1617576621084-2453b34200bc?auto=format&fit=crop&w=800&q=80'],
          isNew: true, isBestSeller: false 
        }
      ];
      for (const prod of products) {
        await addDoc(collection(db, 'products'), { ...prod, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }

      // 4. Add Demo Banners
      const banners = [
        { title: 'Big Summer Sale', subtitle: 'Up to 50% Off on Fertilizers', link: '/shop', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1600&q=80', active: true },
        { title: 'Pure Organic Seeds', subtitle: 'New Season Arrivals', link: '/shop', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80', active: true },
        { title: 'Modern Farm Tools', subtitle: 'Work Smarter, Not Harder', link: '/shop', image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=1600&q=80', active: true }
      ];
      for (const banner of banners) {
        await addDoc(collection(db, 'banners'), { ...banner, createdAt: serverTimestamp() });
      }

      // 5. Add Demo Offers
      const offersList = [
        { code: 'SAVE10', discountType: 'percentage', discountValue: 10, minPurchase: 500, usageLimit: 100, usageCount: 0, active: true },
        { code: 'WELCOME50', discountType: 'fixed', discountValue: 50, minPurchase: 200, usageLimit: 50, usageCount: 0, active: true },
        { code: 'FREEHUNDRED', discountType: 'fixed', discountValue: 100, minPurchase: 1000, usageLimit: 10, usageCount: 0, active: true }
      ];
      for (const offer of offersList) {
        await addDoc(collection(db, 'offers'), { ...offer, createdAt: serverTimestamp() });
      }

      toast.success("All demo data seeded successfully!");
      window.location.reload();
    } catch (e: any) {
      console.error(e);
      toast.error(`Failed to seed data: ${e.message}`);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-end">
         <button 
           onClick={seedDemoData}
           className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-4 py-2 rounded-xl border border-slate-700 transition-all text-xs font-bold uppercase tracking-widest"
         >
           <Database className="w-4 h-4" /> Seed Demo Data
         </button>
      </div>
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
             {recentOrders.length === 0 ? (
               <p className="text-sm text-slate-500 py-4 text-center">No recent orders found.</p>
             ) : (
               recentOrders.map((order, idx) => (
                 <div key={order.id || idx} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold">
                        #{order.id ? order.id.slice(0, 3).toUpperCase() : 'N/A'}
                      </div>
                      <div>
                        <p className="font-bold text-sm truncate max-w-[120px]">{order.customerInfo?.name || 'Unknown'}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-primary">৳{order.total || 0}</p>
                      <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${order.status === 'delivered' ? 'bg-green-900/50 text-green-400' : 'bg-orange-900/50 text-orange-400'}`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                 </div>
               ))
             )}
          </div>
          <Link to="/admin/orders" className="block text-center w-full py-4 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors border-t border-slate-700 border-dashed pt-4">
            View All Transactions
          </Link>
        </div>

        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 flex flex-col justify-center items-center text-center space-y-4">
           <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center text-primary">
              <BarChart3 className="w-10 h-10" />
           </div>
           <h3 className="text-xl font-display font-bold">Sales Analytics</h3>
           <p className="text-slate-400 text-sm max-w-xs">Detailed visual reports and forecasting data will be available as more orders are processed.</p>
           <button onClick={() => toast.info('PDF generation will be available once enough data is tracked.')} className="btn-primary">Generate Monthly PDF</button>
        </div>
      </div>
    </div>
  );
}
