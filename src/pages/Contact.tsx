import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-toastify';
import { useSite } from '../context/SiteContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Contact() {
  const { settings } = useSite();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    } catch (e) {
      console.error(e);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="text-primary font-bold uppercase tracking-widest text-xs">{settings.contactPage?.badge || 'Reach Out'}</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold">{settings.contactPage?.title || "Let's Talk Biscuits"}</h1>
            <p className="text-gray-500 text-lg leading-relaxed">{settings.contactPage?.subtitle || "Have a question about our products, an existing order, or just want to share some love? We're here for you."}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest">Email Us</h4>
                <p className="font-bold text-lg">{settings.footer.email}</p>
              </div>
            </div>
            <div className="glass p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest">Call Us</h4>
                <p className="font-bold text-lg">{settings.footer.phone}</p>
              </div>
            </div>
            <div className="glass p-8 rounded-3xl space-y-4 md:col-span-2">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest">Visit Us</h4>
                <p className="font-bold text-lg">{settings.footer.address}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest">Follow Our Journey</h4>
            <div className="flex gap-4">
                {[
                  { icon: Facebook, link: settings.footer.facebook },
                  { icon: Instagram, link: settings.footer.instagram },
                  { icon: Twitter, link: settings.footer.twitter }
                ].filter(s => s.link).map((social, i) => (
                  <a 
                    key={i} 
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-12 rounded-[3.5rem] shadow-2xl space-y-8"
        >
          <h2 className="text-3xl font-display font-bold">{settings.contactPage?.formTitle || "Send a Message"}</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">First Name</label>
                <input 
                   type="text" required 
                   value={formData.firstName}
                   onChange={e => setFormData({...formData, firstName: e.target.value})}
                   className="w-full bg-slate-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Last Name</label>
                <input 
                   type="text" required 
                   value={formData.lastName}
                   onChange={e => setFormData({...formData, lastName: e.target.value})}
                   className="w-full bg-slate-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 outline-none" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
              <input 
                 type="email" required 
                 value={formData.email}
                 onChange={e => setFormData({...formData, email: e.target.value})}
                 className="w-full bg-slate-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Your Message</label>
              <textarea 
                 rows={5} required 
                 value={formData.message}
                 onChange={e => setFormData({...formData, message: e.target.value})}
                 className="w-full bg-slate-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 outline-none resize-none" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Sending...' : (
                <>
                  Send Message <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Map Placeholder */}
      <div className="h-[400px] bg-gray-200 rounded-[3rem] overflow-hidden grayscale relative group">
        <img 
          src={settings.contactPage?.mapImageUrl || "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=80"} 
          alt="Map" 
          className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-1000" 
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="glass p-6 rounded-3xl text-center space-y-2 max-w-xs animate-bounce shadow-2xl">
            <MapPin className="w-10 h-10 text-primary mx-auto" />
            <p className="font-bold text-gray-900">{settings.contactPage?.visitUsTitle || 'Visit our flagship store in Sweet City'}</p>
            {settings.contactPage?.visitUsText && <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{settings.contactPage.visitUsText}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
