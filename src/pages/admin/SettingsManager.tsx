import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { motion } from 'motion/react';
import { Save, FileText, HelpCircle, Shield, Truck, RefreshCcw, Globe, LayoutDashboard, Trash2, CreditCard, Tag } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';

export default function SettingsManager() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
   const [settings, setSettings] = useState({
    general: {
      siteName: 'Organic Fertilizer',
      logo: '',
      favicon: '',
      footer: {
        address: '',
        phone: '',
        email: '',
        facebook: '',
        instagram: '',
        twitter: '',
        description: '',
        quickLinks: [{ name: '', path: '' }],
        categories: [{ name: '', path: '' }],
        rightsReserved: ''
      }
    },
    company: { 
      mdName: '', 
      mdMessage: '', 
      mdImage: '', 
      mdQuote: '',
      startDate: '', 
      history: '', 
      headerImage: '',
      heroTitle: '',
      heroSubtitle: '',
      stats: [
        { label: '', value: '' }
      ],
      values: [
        { title: '', desc: '' }
      ]
    },
    privacy: { content: '' },
    terms: { content: '' },
    refund: { content: '' },
    shipping: { content: '' },
    faq: { items: [{ q: '', a: '' }] },
    home: {
      heroTagline: '',
      heroBtn1Text: '',
      heroBtn2Text: '',
      features: [{ title: '', desc: '' }],
      topSellersBadge: '',
      topSellersTitle: '',
      topSellersDesc: '',
      newsletterTitle: '',
      newsletterDesc: ''
    },
    navigation: {
      headerLinks: [{ name: '', path: '' }]
    },
    payments: {
      codActive: true,
      bkashActive: true,
      bkashNumber: '',
      nagadActive: true,
      nagadNumber: '',
      rocketActive: false,
      rocketNumber: ''
    },
    specialOffer: {
      active: true,
      title: '',
      description: '',
      endDate: ''
    }
  });

  useEffect(() => {
    const fetchAllSettings = async () => {
      setFetching(true);
      try {
        const docKeys = ['general', 'company', 'privacy', 'terms', 'refund', 'shipping', 'faq', 'home', 'navigation', 'payments', 'specialOffer'];
        const newSettings = { ...settings };
        
        for (const key of docKeys) {
          const docSnap = await getDoc(doc(db, 'settings', key));
          if (docSnap.exists()) {
             (newSettings as any)[key] = { ...(newSettings as any)[key], ...docSnap.data() };
          }
        }
        setSettings(newSettings);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load settings");
      } finally {
        setFetching(false);
      }
    };
    fetchAllSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const dataToSave = (settings as any)[activeTab];
      await setDoc(doc(db, 'settings', activeTab), {
        ...dataToSave,
        updatedAt: serverTimestamp()
      });
      toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings saved!`);
    } catch (e) {
      console.error(e);
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const updateContent = (content: string) => {
    setSettings({
      ...settings,
      [activeTab]: { ...(settings as any)[activeTab], content }
    });
  };

  const addFaqItem = () => {
    setSettings({
      ...settings,
      faq: { items: [...settings.faq.items, { q: '', a: '' }] }
    });
  };

  const updateFaqItem = (index: number, field: 'q' | 'a', value: string) => {
    const newItems = [...settings.faq.items];
    newItems[index][field] = value;
    setSettings({
      ...settings,
      faq: { items: newItems }
    });
  };

  const removeFaqItem = (index: number) => {
    const newItems = settings.faq.items.filter((_, i) => i !== index);
    setSettings({
      ...settings,
      faq: { items: newItems }
    });
  };

  const addStat = () => {
    setSettings({
      ...settings,
      company: { ...settings.company, stats: [...settings.company.stats, { label: '', value: '' }] }
    });
  };

  const updateStat = (index: number, field: 'label' | 'value', value: string) => {
    const newStats = [...settings.company.stats];
    newStats[index][field] = value;
    setSettings({
      ...settings,
      company: { ...settings.company, stats: newStats }
    });
  };

  const removeStat = (index: number) => {
    const newStats = settings.company.stats.filter((_, i) => i !== index);
    setSettings({
      ...settings,
      company: { ...settings.company, stats: newStats }
    });
  };

  const addValue = () => {
    setSettings({
      ...settings,
      company: { ...settings.company, values: [...settings.company.values, { title: '', desc: '' }] }
    });
  };

  const updateValue = (index: number, field: 'title' | 'desc', value: string) => {
    const newValues = [...settings.company.values];
    newValues[index][field] = value;
    setSettings({
      ...settings,
      company: { ...settings.company, values: newValues }
    });
  };

  const removeValue = (index: number) => {
    const newValues = settings.company.values.filter((_, i) => i !== index);
    setSettings({
      ...settings,
      company: { ...settings.company, values: newValues }
    });
  };

  const addHomeFeature = () => {
    setSettings({
      ...settings,
      home: { ...settings.home, features: [...settings.home.features, { title: '', desc: '' }] }
    });
  };

  const updateHomeFeature = (index: number, field: 'title' | 'desc', value: string) => {
    const newFeatures = [...settings.home.features];
    newFeatures[index][field] = value;
    setSettings({
      ...settings,
      home: { ...settings.home, features: newFeatures }
    });
  };

  const removeHomeFeature = (index: number) => {
    const newFeatures = settings.home.features.filter((_, i) => i !== index);
    setSettings({
      ...settings,
      home: { ...settings.home, features: newFeatures }
    });
  };

  const addHeaderLink = () => {
    setSettings({
      ...settings,
      navigation: { ...settings.navigation, headerLinks: [...settings.navigation.headerLinks, { name: '', path: '' }] }
    });
  };

  const updateHeaderLink = (index: number, field: 'name' | 'path', value: string) => {
    const newLinks = [...settings.navigation.headerLinks];
    newLinks[index][field] = value;
    setSettings({
      ...settings,
      navigation: { ...settings.navigation, headerLinks: newLinks }
    });
  };

  const removeHeaderLink = (index: number) => {
    const newLinks = settings.navigation.headerLinks.filter((_, i) => i !== index);
    setSettings({
      ...settings,
      navigation: { ...settings.navigation, headerLinks: newLinks }
    });
  };

  const addFooterLink = (type: 'quickLinks' | 'categories') => {
    setSettings({
      ...settings,
      general: {
        ...settings.general,
        footer: {
          ...settings.general.footer,
          [type]: [...(settings.general.footer[type as keyof typeof settings.general.footer] as any[] || []), { name: '', path: '' }]
        }
      }
    });
  };

  const updateFooterLink = (type: 'quickLinks' | 'categories', index: number, field: 'name' | 'path', value: string) => {
    const newLinks = [...(settings.general.footer[type as keyof typeof settings.general.footer] as any[] || [])];
    newLinks[index][field] = value;
    setSettings({
      ...settings,
      general: {
        ...settings.general,
        footer: { ...settings.general.footer, [type]: newLinks }
      }
    });
  };

  const removeFooterLink = (type: 'quickLinks' | 'categories', index: number) => {
    const newLinks = (settings.general.footer[type as keyof typeof settings.general.footer] as any[] || []).filter((_, i) => i !== index);
    setSettings({
      ...settings,
      general: {
        ...settings.general,
        footer: { ...settings.general.footer, [type]: newLinks }
      }
    });
  };

  if (fetching) return <div className="p-20 text-center">Loading settings...</div>;

  const tabs = [
    { id: 'general', label: 'Identity', icon: Globe },
    { id: 'navigation', label: 'Navigation', icon: FileText },
    { id: 'specialOffer', label: 'Special Offer', icon: Tag },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'home', label: 'Home Page', icon: LayoutDashboard },
    { id: 'company', label: 'Our Company', icon: FileText },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms & Conditions', icon: Shield },
    { id: 'refund', label: 'Refund Policy', icon: RefreshCcw },
    { id: 'shipping', label: 'Shipping Policy', icon: Truck },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <nav className="flex flex-wrap gap-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </nav>

      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700 space-y-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-white capitalize">{activeTab.replace(/([A-Z])/g, ' $1')} Management</h2>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="btn-primary flex items-center gap-2 py-3 px-6 text-sm"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {activeTab === 'general' ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Website Name</label>
                <input 
                  type="text" 
                  value={settings.general.siteName}
                  onChange={(e) => setSettings({ ...settings, general: { ...settings.general, siteName: e.target.value } })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary"
                  placeholder="Organic Fertilizer"
                />
              </div>
              <ImageUpload 
                label="Website Logo"
                value={settings.general.logo}
                onChange={(val) => setSettings({ ...settings, general: { ...settings.general, logo: val } })}
                suggestion="256x256px"
                sizeSuggestion="Max 500KB"
              />
              <ImageUpload 
                label="Favicon"
                value={settings.general.favicon}
                onChange={(val) => setSettings({ ...settings, general: { ...settings.general, favicon: val } })}
                suggestion="32x32px"
                sizeSuggestion="Max 50KB"
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary border-b border-slate-700 pb-2">Footer & Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Office Address</label>
                  <input 
                    type="text" 
                    value={settings.general.footer.address}
                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, footer: { ...settings.general.footer, address: e.target.value } } })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                    placeholder="Factory/Office Address..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Contact Phone</label>
                  <input 
                    type="text" 
                    value={settings.general.footer.phone}
                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, footer: { ...settings.general.footer, phone: e.target.value } } })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                    placeholder="+880..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Contact Email</label>
                  <input 
                    type="email" 
                    value={settings.general.footer.email}
                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, footer: { ...settings.general.footer, email: e.target.value } } })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                    placeholder="support@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Facebook Page URL</label>
                  <input 
                    type="text" 
                    value={settings.general.footer.facebook}
                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, footer: { ...settings.general.footer, facebook: e.target.value } } })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Instagram Profile URL</label>
                  <input 
                    type="text" 
                    value={settings.general.footer.instagram}
                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, footer: { ...settings.general.footer, instagram: e.target.value } } })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Twitter/X Profile URL</label>
                  <input 
                    type="text" 
                    value={settings.general.footer.twitter}
                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, footer: { ...settings.general.footer, twitter: e.target.value } } })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Footer Short Description</label>
                  <textarea 
                    rows={2}
                    value={settings.general.footer.description}
                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, footer: { ...settings.general.footer, description: e.target.value } } })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm resize-none"
                    placeholder="Short description for the footer..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Copyright / Rights Reserved Text</label>
                  <input 
                    type="text" 
                    value={settings.general.footer.rightsReserved}
                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, footer: { ...settings.general.footer, rightsReserved: e.target.value } } })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                    placeholder="© 2026 My Website..."
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Footer Quick Links</h3>
                  <button onClick={() => addFooterLink('quickLinks')} className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold hover:bg-primary hover:text-white transition-all">+ Add Link</button>
                </div>
                <div className="space-y-4">
                  {settings.general.footer.quickLinks?.map((link, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-slate-900 rounded-2xl border border-slate-700 items-end">
                      <div className="flex-grow space-y-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-500">Link Name</label>
                        <input 
                          type="text" value={link.name} onChange={(e) => updateFooterLink('quickLinks', i, 'name', e.target.value)}
                          className="w-full bg-slate-800 border-none rounded-lg px-4 py-2 text-white text-sm font-bold"
                          placeholder="FAQ"
                        />
                      </div>
                      <div className="flex-grow space-y-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-500">Path / URL</label>
                        <input 
                          type="text" value={link.path} onChange={(e) => updateFooterLink('quickLinks', i, 'path', e.target.value)}
                          className="w-full bg-slate-800 border-none rounded-lg px-4 py-2 text-white text-sm font-mono"
                          placeholder="/faq"
                        />
                      </div>
                      <button onClick={() => removeFooterLink('quickLinks', i)} className="mb-2 p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Footer Categories</h3>
                  <button onClick={() => addFooterLink('categories')} className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold hover:bg-primary hover:text-white transition-all">+ Add Category</button>
                </div>
                <div className="space-y-4">
                  {settings.general.footer.categories?.map((link, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-slate-900 rounded-2xl border border-slate-700 items-end">
                      <div className="flex-grow space-y-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-500">Category Name</label>
                        <input 
                          type="text" value={link.name} onChange={(e) => updateFooterLink('categories', i, 'name', e.target.value)}
                          className="w-full bg-slate-800 border-none rounded-lg px-4 py-2 text-white text-sm font-bold"
                          placeholder="Best Sellers"
                        />
                      </div>
                      <div className="flex-grow space-y-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-500">Path / URL</label>
                        <input 
                          type="text" value={link.path} onChange={(e) => updateFooterLink('categories', i, 'path', e.target.value)}
                          className="w-full bg-slate-800 border-none rounded-lg px-4 py-2 text-white text-sm font-mono"
                          placeholder="/shop?sort=popular"
                        />
                      </div>
                      <button onClick={() => removeFooterLink('categories', i)} className="mb-2 p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'specialOffer' ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div className="space-y-1">
                <h3 className="text-xl font-display font-bold text-white">Sidebar Special Offer</h3>
                <p className="text-slate-400 text-sm">Display a promotional box in the Shop sidebar.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.specialOffer.active}
                  onChange={(e) => setSettings({ ...settings, specialOffer: { ...settings.specialOffer, active: e.target.checked } })}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            {settings.specialOffer.active && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Offer Title</label>
                  <input 
                    type="text" 
                    value={settings.specialOffer.title}
                    onChange={(e) => setSettings({ ...settings, specialOffer: { ...settings.specialOffer, title: e.target.value } })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                    placeholder="e.g. Special Offer!"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">End Date (Optional)</label>
                  <input 
                    type="date" 
                    value={settings.specialOffer.endDate}
                    onChange={(e) => setSettings({ ...settings, specialOffer: { ...settings.specialOffer, endDate: e.target.value } })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                  />
                  <p className="text-[10px] text-slate-500">Leave blank if this offer doesn't expire.</p>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Offer Description</label>
                  <textarea 
                    rows={3}
                    value={settings.specialOffer.description}
                    onChange={(e) => setSettings({ ...settings, specialOffer: { ...settings.specialOffer, description: e.target.value } })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm resize-none"
                    placeholder="e.g. Get 15% off on your first order with code WELCOME15"
                  />
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'payments' ? (
          <div className="space-y-12">
            <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-700 space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-bold text-white">Cash on Delivery (COD)</h3>
                  <p className="text-slate-400 text-xs">Allow users to pay when they receive the product.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.payments.codActive}
                    onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, codActive: e.target.checked } })}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-700 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-200">bKash Payment</h4>
                    <label className="relative inline-flex items-center cursor-pointer scale-75">
                      <input 
                        type="checkbox" 
                        checked={settings.payments.bkashActive}
                        onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, bkashActive: e.target.checked } })}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e2136e]"></div>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">bKash Personal Number</label>
                    <input 
                      type="text" 
                      value={settings.payments.bkashNumber}
                      onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, bkashNumber: e.target.value } })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                      placeholder="01712345678"
                    />
                  </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-700 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-200">Nagad Payment</h4>
                    <label className="relative inline-flex items-center cursor-pointer scale-75">
                      <input 
                        type="checkbox" 
                        checked={settings.payments.nagadActive}
                        onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, nagadActive: e.target.checked } })}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f7941d]"></div>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Nagad Personal Number</label>
                    <input 
                      type="text" 
                      value={settings.payments.nagadNumber}
                      onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, nagadNumber: e.target.value } })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                      placeholder="01712345678"
                    />
                  </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-700 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-200">Rocket Payment</h4>
                    <label className="relative inline-flex items-center cursor-pointer scale-75">
                      <input 
                        type="checkbox" 
                        checked={settings.payments.rocketActive}
                        onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, rocketActive: e.target.checked } })}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8c3494]"></div>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Rocket Personal Number</label>
                    <input 
                      type="text" 
                      value={settings.payments.rocketNumber}
                      onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, rocketNumber: e.target.value } })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                      placeholder="01712345678-x"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'home' ? (
          <div className="space-y-12">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary border-b border-slate-700 pb-2">Hero Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Hero Tagline</label>
                  <input 
                    type="text" 
                    value={settings.home.heroTagline}
                    onChange={(e) => setSettings({ ...settings, home: { ...settings.home, heroTagline: e.target.value } })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Hero Button 1 Text</label>
                  <input 
                    type="text" 
                    value={settings.home.heroBtn1Text}
                    onChange={(e) => setSettings({ ...settings, home: { ...settings.home, heroBtn1Text: e.target.value } })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500">Hero Button 2 Text</label>
                  <input 
                    type="text" 
                    value={settings.home.heroBtn2Text}
                    onChange={(e) => setSettings({ ...settings, home: { ...settings.home, heroBtn2Text: e.target.value } })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Features Section</h3>
                <button onClick={addHomeFeature} className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold hover:bg-primary hover:text-white transition-all">+ Add Feature</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {settings.home.features.map((feature, i) => (
                  <div key={i} className="p-4 bg-slate-900 rounded-2xl border border-slate-700 relative space-y-3">
                    <button onClick={() => removeHomeFeature(i)} className="absolute top-2 right-2 text-red-500 text-[10px] hover:underline">Remove</button>
                    <input 
                      type="text" value={feature.title} onChange={(e) => updateHomeFeature(i, 'title', e.target.value)}
                      className="w-full bg-slate-800 border-none rounded-lg px-3 py-2 text-white text-sm font-bold"
                      placeholder="Title"
                    />
                    <textarea 
                      rows={2} value={feature.desc} onChange={(e) => updateHomeFeature(i, 'desc', e.target.value)}
                      className="w-full bg-slate-800 border-none rounded-lg px-3 py-2 text-white text-xs resize-none"
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary border-b border-slate-700 pb-2">Top Sellers Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Top Sellers Badge</label>
                    <input 
                      type="text" 
                      value={settings.home.topSellersBadge}
                      onChange={(e) => setSettings({ ...settings, home: { ...settings.home, topSellersBadge: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Section Title</label>
                    <input 
                      type="text" 
                      value={settings.home.topSellersTitle}
                      onChange={(e) => setSettings({ ...settings, home: { ...settings.home, topSellersTitle: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Section Description</label>
                    <textarea 
                      rows={2}
                      value={settings.home.topSellersDesc}
                      onChange={(e) => setSettings({ ...settings, home: { ...settings.home, topSellersDesc: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary border-b border-slate-700 pb-2">Newsletter Section</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Newsletter Title</label>
                    <input 
                      type="text" 
                      value={settings.home.newsletterTitle}
                      onChange={(e) => setSettings({ ...settings, home: { ...settings.home, newsletterTitle: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Newsletter Description</label>
                    <textarea 
                      rows={2}
                      value={settings.home.newsletterDesc}
                      onChange={(e) => setSettings({ ...settings, home: { ...settings.home, newsletterDesc: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'navigation' ? (
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Header Links</h3>
                <button onClick={addHeaderLink} className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold hover:bg-primary hover:text-white transition-all">+ Add Link</button>
              </div>
              <div className="space-y-4">
                {settings.navigation.headerLinks.map((link, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-900 rounded-2xl border border-slate-700 items-end">
                    <div className="flex-grow space-y-2">
                      <label className="block text-[10px] font-bold uppercase text-slate-500">Link Name</label>
                      <input 
                        type="text" value={link.name} onChange={(e) => updateHeaderLink(i, 'name', e.target.value)}
                        className="w-full bg-slate-800 border-none rounded-lg px-4 py-2 text-white text-sm font-bold"
                        placeholder="Home"
                      />
                    </div>
                    <div className="flex-grow space-y-2">
                      <label className="block text-[10px] font-bold uppercase text-slate-500">Path / URL</label>
                      <input 
                        type="text" value={link.path} onChange={(e) => updateHeaderLink(i, 'path', e.target.value)}
                        className="w-full bg-slate-800 border-none rounded-lg px-4 py-2 text-white text-sm font-mono"
                        placeholder="/"
                      />
                    </div>
                    <button onClick={() => removeHeaderLink(i)} className="mb-2 p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'company' ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary border-b border-slate-700 pb-2">Hero Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Hero Main Title</label>
                    <input 
                      type="text" 
                      value={settings.company.heroTitle || ''}
                      onChange={(e) => setSettings({ ...settings, company: { ...settings.company, heroTitle: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                      placeholder="e.g. Our Legacy of Pure Goodness"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Hero Subtitle</label>
                    <input 
                      type="text" 
                      value={settings.company.heroSubtitle || ''}
                      onChange={(e) => setSettings({ ...settings, company: { ...settings.company, heroSubtitle: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                      placeholder="e.g. Crafting premium organic products..."
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary border-b border-slate-700 pb-2">Managing Director Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">MD Name</label>
                    <input 
                      type="text" 
                      value={settings.company.mdName}
                      onChange={(e) => setSettings({ ...settings, company: { ...settings.company, mdName: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                      placeholder="MD Name..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Business Start Date</label>
                    <input 
                      type="date" 
                      value={settings.company.startDate}
                      onChange={(e) => setSettings({ ...settings, company: { ...settings.company, startDate: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">MD Short Message / Bio</label>
                    <textarea 
                      rows={3}
                      value={settings.company.mdMessage}
                      onChange={(e) => setSettings({ ...settings, company: { ...settings.company, mdMessage: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary resize-none text-sm"
                      placeholder="MD Message..."
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500">MD Featured Quote</label>
                    <input 
                      type="text" 
                      value={settings.company.mdQuote || ''}
                      onChange={(e) => setSettings({ ...settings, company: { ...settings.company, mdQuote: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary text-sm"
                      placeholder="e.g. Quality is not an act, it is a habit."
                    />
                  </div>
                </div>
              </div>

              <ImageUpload 
                label="MD Official Image"
                value={settings.company.mdImage}
                onChange={(val) => setSettings({ ...settings, company: { ...settings.company, mdImage: val } })}
                suggestion="400x500px (Portrait)"
                sizeSuggestion="Max 500KB"
              />
              <ImageUpload 
                label="Hero Background Image"
                value={settings.company.headerImage}
                onChange={(val) => setSettings({ ...settings, company: { ...settings.company, headerImage: val } })}
                suggestion="1920x800px"
                sizeSuggestion="Max 2MB"
              />

              <div className="md:col-span-2 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Company Stats</h3>
                  <button onClick={addStat} className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold hover:bg-primary hover:text-white transition-all">+ Add Stat</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {settings.company.stats?.map((stat, i) => (
                    <div key={i} className="p-4 bg-slate-900 rounded-2xl border border-slate-700 relative">
                      <button onClick={() => removeStat(i)} className="absolute top-2 right-2 text-red-500 text-[10px] hover:underline">Remove</button>
                      <div className="space-y-2">
                        <input 
                          type="text" value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)}
                          className="w-full bg-slate-800 border-none rounded-lg px-2 py-1 text-white text-[10px] font-bold uppercase tracking-wider"
                          placeholder="Label (e.g. Happy Families)"
                        />
                        <input 
                          type="text" value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)}
                          className="w-full bg-slate-800 border-none rounded-lg px-2 py-1 text-white text-lg font-display font-bold"
                          placeholder="Value (e.g. 1M+)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Our Values</h3>
                  <button onClick={addValue} className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold hover:bg-primary hover:text-white transition-all">+ Add Value</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {settings.company.values?.map((val, i) => (
                    <div key={i} className="p-4 bg-slate-900 rounded-2xl border border-slate-700 relative space-y-3">
                      <button onClick={() => removeValue(i)} className="absolute top-2 right-2 text-red-500 text-[10px] hover:underline">Remove</button>
                      <input 
                        type="text" value={val.title} onChange={(e) => updateValue(i, 'title', e.target.value)}
                        className="w-full bg-slate-800 border-none rounded-lg px-3 py-2 text-white text-sm font-bold"
                        placeholder="Title (e.g. 100% Organic)"
                      />
                      <textarea 
                        rows={3} value={val.desc} onChange={(e) => updateValue(i, 'desc', e.target.value)}
                        className="w-full bg-slate-800 border-none rounded-lg px-3 py-2 text-white text-xs resize-none"
                        placeholder="Description..."
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Detailed Company History (Markdown)</label>
                <textarea 
                  rows={10}
                  value={settings.company.history}
                  onChange={(e) => setSettings({ ...settings, company: { ...settings.company, history: e.target.value } })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary resize-none font-mono text-sm leading-relaxed"
                  placeholder="Write company history..."
                />
              </div>
            </div>
          </div>
        ) : activeTab === 'faq' ? (
          <div className="space-y-6">
            {settings.faq.items.map((item, i) => (
              <div key={i} className="p-6 bg-slate-900 rounded-2xl border border-slate-700 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500">
                   <span>Question {i + 1}</span>
                   <button onClick={() => removeFaqItem(i)} className="text-red-400 hover:text-red-300">Remove</button>
                </div>
                <input 
                  type="text" 
                  value={item.q}
                  onChange={(e) => updateFaqItem(i, 'q', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary"
                  placeholder="Question..."
                />
                <textarea 
                  rows={3}
                  value={item.a}
                  onChange={(e) => updateFaqItem(i, 'a', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary resize-none"
                  placeholder="Answer..."
                />
              </div>
            ))}
            <button onClick={addFaqItem} className="w-full py-4 border-2 border-dashed border-slate-700 rounded-2xl text-slate-500 hover:text-white hover:border-slate-500 transition-all font-bold">
              + Add New FAQ Item
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Page Markdown Content</label>
            <textarea 
              rows={20}
              value={(settings as any)[activeTab].content}
              onChange={(e) => updateContent(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 text-white font-mono text-sm focus:outline-none focus:border-primary leading-relaxed"
              placeholder={`Write the content for ${activeTab} in markdown or plain text...`}
            />
            <p className="text-[10px] text-slate-500 font-medium">Tip: Use Markdown for headings, bold text, and lists.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
