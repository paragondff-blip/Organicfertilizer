import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { JobApplication } from '../../types';
import { FileText, Mail, Phone, Calendar, Search, Filter, Download, Trash2, CheckCircle2, XCircle, Clock, ExternalLink, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-toastify';

export default function JobApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchApplications = async () => {
    try {
      const q = query(collection(db, 'applications'), orderBy('appliedAt', 'desc'));
      const snapshot = await getDocs(q);
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as JobApplication[]);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'applications', id), { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchApplications();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await deleteDoc(doc(db, 'applications', id));
        toast.success("Application deleted");
        fetchApplications();
      } catch (e) {
        toast.error("Failed to delete application");
      }
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(search.toLowerCase()) || 
                         app.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
                         app.applicantEmail.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || app.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shortlisted': return 'bg-green-900/30 text-green-400 border-green-500/20';
      case 'rejected': return 'bg-red-900/30 text-red-400 border-red-500/20';
      case 'reviewed': return 'bg-blue-900/30 text-blue-400 border-blue-500/20';
      default: return 'bg-orange-900/30 text-orange-400 border-orange-500/20';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> Job Applications
          </h2>
          <p className="text-slate-400 text-sm mt-1">Review and manage candidates for open positions</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search candidate or job..."
              className="bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-primary w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select 
              className="bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-11 pr-8 text-sm text-white outline-none focus:border-primary appearance-none cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence>
          {filteredApps.map((app) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-slate-800 rounded-[2rem] border border-slate-700 p-6 hover:border-slate-500 transition-all flex flex-col lg:flex-row gap-8 items-start lg:items-center"
            >
              <div className="flex-grow space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 py-1 bg-slate-900 px-3 rounded-full flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {app.appliedAt?.toDate ? app.appliedAt.toDate().toLocaleDateString() : 'Just now'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">{app.applicantName}</h3>
                  <p className="text-primary font-display font-medium text-sm flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> {app.jobTitle}
                  </p>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    {app.applicantEmail}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    {app.applicantPhone}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-700">
                {app.cvUrl && (
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = app.cvUrl!;
                      link.download = app.cvName || 'CV.pdf';
                      link.click();
                    }}
                    className="flex items-center gap-2 py-3 px-6 bg-slate-900 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
                  >
                    <Download className="w-4 h-4" /> CV (PDF)
                  </button>
                )}
                
                <div className="flex items-center gap-2 ml-auto lg:ml-0">
                  <button 
                    onClick={() => handleUpdateStatus(app.id, 'shortlisted')}
                    className="p-3 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-xl transition-all"
                    title="Shortlist"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(app.id, 'rejected')}
                    className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    title="Reject"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(app.id)}
                    className="p-3 bg-slate-900 text-slate-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && <div className="py-20 text-center text-slate-500">Retrieving applications...</div>}
        {!loading && filteredApps.length === 0 && (
          <div className="bg-slate-800 p-20 rounded-[3rem] border border-slate-700 border-dashed text-center">
            <p className="text-slate-500 font-display text-lg">No applications found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
