import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, MessageCircle, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export default function BlogDetails() {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <Link to="/blog" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
        <ArrowLeft className="w-5 h-5" /> Back to Journal
      </Link>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-10"
      >
        <div className="space-y-6">
           <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">The Art of Perfect Organic Dough</h1>
           <div className="flex items-center justify-between pb-8 border-b border-gray-100">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">SB</div>
                 <div>
                    <p className="font-bold">Master Baker Sarah</p>
                    <p className="text-xs text-gray-400">Published on May 12, 2026</p>
                 </div>
              </div>
              <div className="flex gap-4 text-gray-400">
                 <button className="hover:text-primary"><Share2 className="w-5 h-5" /></button>
                 <button className="hover:text-red-500"><Heart className="w-5 h-5" /></button>
              </div>
           </div>
        </div>

        <div className="aspect-video rounded-[3rem] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=1600&q=80" alt="Dough" className="w-full h-full object-cover" />
        </div>

        <article className="prose prose-slate lg:prose-xl max-w-none prose-display italic">
           <p className="lead">When we talk about organic dough, we're not just talking about the ingredients. We're talking about the soul of the biscuit.</p>
           <p>The journey starts with the soil. The organic heritage wheat we use is grown without chemical interferance, which preserves the natural protein structure of the grain. This makes a massive difference when we begin the hydration process.</p>
           <h3>The Science of Hydration</h3>
           <p>Unlike industrial biscuits that use chemical softeners, we rely on the natural interaction between our organic butter and filtered spring water. The resting period is crucial—we allow our dough to mature for 24 hours in a temperature-controlled environment.</p>
           <blockquote className="bg-primary/5 p-8 rounded-[2rem] border-l-8 border-primary not-italic font-display font-bold text-gray-800">
              "A biscuit is only as good as the time you're willing to give it."
           </blockquote>
           <p>Maintaining biological activity within the dough while ensuring a crisp, golden bake is a delicate balance. It's what gives our biscuits that signature 'snap' followed by a melt-in-your-mouth finish.</p>
        </article>

        <div className="pt-12 border-t border-gray-100 flex items-center justify-between">
           <div className="flex gap-2">
              {['Baking', 'Organic', 'Handcrafted'].map(tag => (
                <span key={tag} className="px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">#{tag}</span>
              ))}
           </div>
           <div className="flex items-center gap-2 text-gray-400">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-bold">12 Comments</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
