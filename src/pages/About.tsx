import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Heart, Leaf, Users, Calendar, Award, Quote } from 'lucide-react';
import Markdown from 'react-markdown';
import { CompanyInfo } from '../types';

export default function About() {
  const [data, setData] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'company'));
        if (docSnap.exists()) {
          setData(docSnap.data() as CompanyInfo);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyInfo();
  }, []);

  const calculateDuration = (startDate: string) => {
    if (!startDate) return "Many years";
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
    return `${diffYears}+ Years`;
  };

  if (loading) return <div className="py-20 text-center font-display text-xl">Loading company profile...</div>;

  const defaultHeader = "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?auto=format&fit=crop&w=1600&q=80";
  const defaultMD = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="pb-20 space-y-24 overflow-x-hidden">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-primary">
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center transition-transform duration-[10s] hover:scale-110" 
          style={{ backgroundImage: `url(${data?.headerImage || defaultHeader})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-transparent to-primary/90" />
        <div className="relative z-10 text-center max-w-4xl px-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest border border-white/20">
              Established {data?.startDate ? new Date(data.startDate).getFullYear() : '1998'}
            </span>
            <h1 className="text-5xl md:text-8xl font-display font-bold text-white leading-tight">
              {data?.heroTitle || 'Our Legacy of Pure Goodness'}
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-white/80 font-medium"
          >
            {data?.heroSubtitle || 'Crafting premium organic solutions with a commitment to health, taste, and tradition.'}
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {(data?.stats?.length ? data.stats : [
            { icon: Calendar, label: 'Running Since', value: data?.startDate ? new Date(data.startDate).getFullYear() : '1998' },
            { icon: Award, label: 'Experience', value: calculateDuration(data?.startDate || '1998-01-01') },
            { icon: Users, label: 'Happy Families', value: '1M+' },
            { icon: Leaf, label: 'Organic Grade', value: 'A+' },
            ]).map((stat, i) => {
              const Icon = Leaf;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-center text-center space-y-2 group hover:border-primary transition-all"
                >
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-display font-bold text-gray-900">{stat.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </section>

      {/* MD Message */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 relative">
            <motion.div 
               whileHover={{ scale: 1.02 }}
               className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white"
            >
              <img 
                src={data?.mdImage || defaultMD} 
                alt="Managing Director" 
                className="w-full aspect-[4/5] object-cover" 
              />
            </motion.div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10" />
            
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl z-20 max-w-[240px]">
              <Quote className="w-8 h-8 text-secondary mb-2" />
              <p className="text-sm italic text-gray-600">"{data?.mdQuote || "Quality is not an act, it is a habit."}"</p>
              <p className="font-bold text-gray-900 mt-2">— {data?.mdName || "Managing Director"}</p>
            </div>
          </div>
          
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-secondary font-bold uppercase tracking-widest text-xs">{data?.mdSectionBadge || 'A Message From The MD'}</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-gray-900">
                {data?.mdSectionTitle ? (
                  data.mdSectionTitle.includes('<br />') ? (
                    <span dangerouslySetInnerHTML={{ __html: data.mdSectionTitle }} />
                  ) : (
                    data.mdSectionTitle
                  )
                ) : (
                  <>Leadership with <br /> <span className="text-primary italic">Vision</span></>
                )}
              </h2>
            </div>
            <p className="text-xl text-gray-500 leading-relaxed font-medium italic border-l-4 border-primary pl-8 py-2">
              {data?.mdMessage || "We are dedicated to providing the healthiest and most delicious organic products."}
            </p>
            <div className="markdown-body prose prose-lg prose-slate max-w-none text-gray-600">
               <Markdown>{data?.history || "Our detailed history is being prepared."}</Markdown>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-24 rounded-[5rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
             <h2 className="text-4xl font-display font-bold">{data?.valuesSectionTitle || 'Why Families Trust Us'}</h2>
             <p className="text-gray-500">{data?.valuesSectionSubtitle || 'For decades, we have maintained the highest standards in the industry.'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(data?.values?.length ? data.values : [
              { icon: Leaf, title: '100% Organic', desc: 'Every ingredient is sourced from certified organic farms.' },
              { icon: Users, title: 'Community Support', desc: 'We employ local artisans and support community development.' },
              { icon: Heart, title: 'Pure Goodness', desc: 'No synthetic chemicals or preservatives involved.' }
            ]).map((v, i) => {
              const Icon = Leaf;
              return (
                <div key={i} className="bg-white p-12 rounded-[4rem] shadow-sm border border-gray-100 space-y-6 text-center hover:shadow-xl transition-all duration-500 group">
                   <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mx-auto group-hover:bg-primary group-hover:text-white transition-colors">
                     <Icon className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-display font-bold">{v.title}</h3>
                   <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
