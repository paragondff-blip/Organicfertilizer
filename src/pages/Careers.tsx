import { motion, AnimatePresence } from 'motion/react';
import { Mail, Briefcase, MapPin, ArrowRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Job } from '../types';
import JobApplicationForm from '../components/careers/JobApplicationForm';

export default function Careers() {
  const { settings } = useSite();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(
          collection(db, 'jobs'), 
          where('active', '==', true),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Job[]);
      } catch (e) {
        console.error("Error fetching jobs:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="relative py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold tracking-widest uppercase"
          >
            Join Our Team
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-white"
          >
            Grow Your Career With <br /> <span className="italic opacity-80">Organic Values</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary-foreground/80 max-w-2xl mx-auto text-lg"
          >
            Join a company that values sustainability, health, and pure goodness. We're always looking for passionate individuals to join our mission.
          </motion.p>
        </div>
      </section>

      {/* Open Positions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -translate-y-10">
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20 text-white/50 font-display text-xl animate-pulse">Scanning for opportunities...</div>
          ) : jobs.length === 0 ? (
            <div className="glass p-20 rounded-[3rem] shadow-xl text-center border-2 border-dashed border-white/10">
              <Briefcase className="w-16 h-16 text-primary/20 mx-auto mb-6" />
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">No Openings Right Now</h3>
              <p className="text-gray-500 max-w-md mx-auto">We don't have any matching positions at the moment, but we're always growing! Check back soon.</p>
            </div>
          ) : (
            jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="glass p-8 rounded-3xl group hover:border-primary transition-all shadow-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">{job.department}</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-wider">{job.type}</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-primary" />
                        {job.department}
                      </div>
                    </div>
                    <p className="text-gray-500 max-w-2xl whitespace-pre-wrap">{job.description}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="btn-primary py-4 px-8 whitespace-nowrap"
                  >
                    Apply Now <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedJob && (
          <JobApplicationForm 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)} 
          />
        )}
      </AnimatePresence>

      {/* Contact Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-display font-bold">Don't see a fit?</h2>
          <p className="text-gray-500">We are always looking for talent. Send us your CV and we will keep you in mind for future openings.</p>
        </div>
        <div className="flex items-center justify-center gap-3 p-6 glass rounded-[2rem] inline-flex">
          <Mail className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">{settings.footer.email}</span>
        </div>
      </section>
    </div>
  );
}
