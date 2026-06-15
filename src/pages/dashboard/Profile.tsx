import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Phone, MapPin, User as UserIcon, Calendar, Camera } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  const { profile, user } = useAuth();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="glass p-10 rounded-[3rem] space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
          <div className="space-y-1">
            <h2 className="text-3xl font-display font-bold">Personal Profile</h2>
            <p className="text-gray-500">Manage your basic information and contact details.</p>
          </div>
          <button className="btn-primary py-3 px-8 text-sm">Edit Profile</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <label className="block space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 ml-1 tracking-widest">Full Display Name</span>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-gray-100">
                <UserIcon className="w-5 h-5 text-primary" />
                <span className="font-bold">{profile?.displayName}</span>
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 ml-1 tracking-widest">Email Address</span>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-gray-100">
                <Mail className="w-5 h-5 text-primary" />
                <span className="font-bold">{profile?.email}</span>
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 ml-1 tracking-widest">Phone Number</span>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-gray-100">
                <Phone className="w-5 h-5 text-primary" />
                <span className="font-bold">{profile?.phoneNumber || 'Not provided'}</span>
              </div>
            </label>
          </div>

          <div className="space-y-6">
            <label className="block space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 ml-1 tracking-widest">Main Delivery Address</span>
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-gray-100 min-h-[140px]">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <span className="font-bold leading-relaxed">{profile?.address || 'Set your primary address for faster checkout'}</span>
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 ml-1 tracking-widest">Member Since</span>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-gray-100">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-bold">{new Date(profile?.createdAt || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[2.5rem] bg-secondary/5 space-y-4">
          <h3 className="text-xl font-display font-bold text-secondary">Account Security</h3>
          <p className="text-sm text-gray-500">Your account is secured with Google Authentication. You can change your password or security settings in your Google Account dashboard.</p>
          <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="inline-block text-secondary font-bold text-sm hover:underline">Manage Google Security</a>
        </div>
        <div className="glass p-8 rounded-[2.5rem] bg-primary/5 space-y-4">
          <h3 className="text-xl font-display font-bold text-primary">Email Preferences</h3>
          <p className="text-sm text-gray-500">Stay updated with the latest biscuit drops and exclusive discounts. We only send the good stuff!</p>
          <div className="flex items-center gap-2">
            <div className="w-10 h-5 bg-primary rounded-full relative">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
            </div>
            <span className="text-sm font-bold text-gray-700">Subscribed to Newsletter</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
