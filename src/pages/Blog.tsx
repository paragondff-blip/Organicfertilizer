import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

export default function Blog() {
  const blogs = [
    {
      id: '1',
      title: 'The Art of Perfect Organic Dough',
      excerpt: 'Discover the secrets behind our world-famous biscuit dough texture and how we maintain organic integrity.',
      author: 'Master Baker Sarah',
      date: 'May 12, 2026',
      image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      title: 'Why Organic Grains Matter for Your Health',
      excerpt: 'Exploring the nutritional benefits of Switching to organic ancient grains in your daily snacks.',
      author: 'Dr. Emily Stones',
      date: 'June 2, 2026',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-display font-bold">The Biscuit Journal</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Insights, stories, and the science behind the most delicious organic biscuits on the planet.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {blogs.map((blog, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-[3rem] overflow-hidden group cursor-pointer"
          >
            <div className="aspect-video overflow-hidden">
               <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-10 space-y-6">
               <div className="flex items-center gap-6 text-[10px] uppercase font-bold tracking-widest text-primary">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> {blog.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" /> {blog.author}
                  </div>
               </div>
               <h2 className="text-3xl font-display font-bold leading-tight group-hover:text-primary transition-colors">{blog.title}</h2>
               <p className="text-gray-500 leading-relaxed italic">"{blog.excerpt}"</p>
               <Link to={`/blog/${blog.id}`} className="inline-flex items-center gap-2 text-secondary font-bold group-hover:gap-4 transition-all">
                  Read Full Story <ArrowRight className="w-5 h-5" />
               </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
