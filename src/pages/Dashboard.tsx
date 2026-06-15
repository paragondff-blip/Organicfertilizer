import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { User, ShoppingBag, Heart, MapPin, Settings, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import Orders from './dashboard/Orders';
import Profile from './dashboard/Profile';

export default function Dashboard() {
  const { profile, user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Profile', path: '', icon: User },
    { name: 'My Orders', path: 'orders', icon: ShoppingBag },
    { name: 'Wishlist', path: 'wishlist', icon: Heart },
    { name: 'Addresses', path: 'addresses', icon: MapPin },
    { name: 'Settings', path: 'settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* sidebar */}
        <aside className="w-full lg:w-80 space-y-8">
          <div className="glass p-8 rounded-[3rem] text-center space-y-4">
            <div className="w-24 h-24 rounded-full border-4 border-primary/20 p-1 mx-auto overflow-hidden">
              <img src={user?.photoURL || 'https://via.placeholder.com/150'} alt="Profile" className="w-full h-full rounded-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">{profile?.displayName || 'User Name'}</h2>
              <p className="text-gray-400 text-sm font-medium">{profile?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase">Premium Member</span>
            </div>
          </div>

          <nav className="glass p-4 rounded-[3rem] space-y-2">
            {menuItems.map((item) => {
              const isActive = (item.path === '' && location.pathname === '/dashboard') || 
                               (item.path !== '' && location.pathname.includes(`/dashboard/${item.path}`));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all ${isActive ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className="w-5 h-5" />
                    <span className="font-bold">{item.name}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-50 ${isActive ? 'opacity-100' : ''}`} />
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-grow min-h-[60vh]">
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="*" element={<div className="glass p-20 rounded-[3.5rem] text-center font-display text-2xl font-bold text-gray-300">Feature Coming Soon</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
