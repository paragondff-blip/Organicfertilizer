import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Save, ArrowLeft, ToggleLeft, ToggleRight, Briefcase, MapPin, Building2, AlignLeft } from 'lucide-react';
import { Job } from '../../types';

export default function JobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: '',
    active: true,
  });

  useEffect(() => {
    if (id) {
      const fetchJob = async () => {
        setFetching(true);
        try {
          const docSnap = await getDoc(doc(db, 'jobs', id));
          if (docSnap.exists()) {
            setFormData(docSnap.data() as Job);
          }
        } catch (e) {
          toast.error("Failed to fetch job details");
        } finally {
          setFetching(false);
        }
      };
      fetchJob();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...formData,
        updatedAt: serverTimestamp(),
        createdAt: id ? (formData.createdAt || serverTimestamp()) : serverTimestamp(),
      };

      if (id) {
        await setDoc(doc(db, 'jobs', id), data);
        toast.success("Job updated successfully");
      } else {
        await addDoc(collection(db, 'jobs'), data);
        toast.success("New job added successfully");
      }
      navigate('/admin/careers');
    } catch (e: any) {
      console.error("Firestore Error:", e);
      toast.error(`Error saving job: ${e.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-20 text-center text-slate-400">Loading job data...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <button 
        onClick={() => navigate('/admin/careers')}
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Careers
      </button>

      <div className="bg-slate-800 p-10 rounded-[3rem] border border-slate-700 space-y-10">
        <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-primary" /> {id ? 'Edit Job Posting' : 'Create New Job Listing'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Job Title</label>
              <div className="relative">
                <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input 
                  type="text" required 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Senior Sales Representative"
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-16 pr-6 text-white outline-none focus:border-primary"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Department</label>
              <div className="relative">
                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input 
                  type="text" required 
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  placeholder="e.g., Sales & Marketing"
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-16 pr-6 text-white outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input 
                  type="text" required 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g., Dhaka, Bangladesh"
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-16 pr-6 text-white outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Job Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
              <AlignLeft className="w-4 h-4" /> Job Description
            </label>
            <textarea 
              required 
              rows={8}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detail the responsibilities, requirements, and benefits..."
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Job Status</span>
              <p className="text-xs text-slate-500 ml-2">Active jobs are visible to applicants on the careers page</p>
            </div>
            <button 
              type="button"
              onClick={() => setFormData({...formData, active: !formData.active})}
              className={`ml-auto flex items-center gap-2 font-bold text-xs p-1 rounded-full transition-all ${formData.active ? 'text-green-400' : 'text-slate-500'}`}
            >
              {formData.active ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
          >
            <Save className="w-6 h-6" /> {loading ? 'Saving Posting...' : 'Publish Job Opportunity'}
          </button>
        </form>
      </div>
    </div>
  );
}
