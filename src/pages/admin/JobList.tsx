import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { Job } from '../../types';
import { Plus, Edit, Trash2, Briefcase, MapPin, Building2, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Job[]);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        await deleteDoc(doc(db, 'jobs', id));
        toast.success("Job deleted");
        fetchJobs();
      } catch (e) {
        toast.error("Failed to delete job");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-slate-800 p-6 rounded-3xl border border-slate-700">
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" /> Career Opportunities
        </h2>
        <button 
          onClick={() => navigate('add')}
          className="btn-primary py-2 px-4 text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Job
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-slate-500 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {job.department}
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-900 text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {job.type}
                    </span>
                    {job.active ? (
                      <span className="px-2.5 py-0.5 bg-green-900/30 text-green-400 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-red-900/30 text-red-400 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white">{job.title}</h3>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-primary" />
                      {job.department}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`edit/${job.id}`)}
                    className="p-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all"
                    title="Edit Job"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(job.id)}
                    className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    title="Delete Job"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {loading && <div className="py-20 text-center text-slate-500">Loading career posts...</div>}
      {!loading && jobs.length === 0 && (
        <div className="bg-slate-800 p-20 rounded-[3rem] border border-slate-700 border-dashed text-center">
          <p className="text-slate-500 font-display text-lg">No job openings found. Create your first career posting!</p>
        </div>
      )}
    </div>
  );
}
