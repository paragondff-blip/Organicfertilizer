import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Job } from '../../types';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

interface JobApplicationFormProps {
  job: Job;
  onClose: () => void;
}

export default function JobApplicationForm({ job, onClose }: JobApplicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // 2MB limit (2048 KB)
      if (selectedFile.size > 2 * 1024 * 1024) {
        setFileError('File size exceeds 2MB limit');
        setFile(null);
      } else if (selectedFile.type !== 'application/pdf') {
        setFileError('Only PDF files are allowed');
        setFile(null);
      } else {
        setFileError('');
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setFileError('Please upload your CV (PDF)');
      return;
    }

    setLoading(true);
    try {
      // Convert file to Base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const cvBase64 = await base64Promise;

      const applicationData = {
        jobId: job.id,
        jobTitle: job.title,
        applicantName: formData.name,
        applicantEmail: formData.email,
        applicantPhone: formData.phone,
        cvUrl: cvBase64,
        cvName: file.name,
        status: 'pending',
        appliedAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'applications'), applicationData);
      setSuccess(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Application error:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 sm:p-10">
          {!success ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Apply for Position</h2>
                <p className="text-gray-500 font-medium">Applying for: <span className="text-primary font-bold">{job.title}</span></p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <input 
                      required
                      type="text"
                      className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                      <input 
                        required
                        type="email"
                        className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                      <input 
                        required
                        type="tel"
                        className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Upload CV (PDF)</label>
                    <div className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${file ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-gray-50 hover:border-primary/30'}`}>
                      <input 
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {file ? (
                        <>
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                            <FileText className="w-6 h-6 text-green-600" />
                          </div>
                          <p className="text-sm font-bold text-green-700">{file.name}</p>
                          <p className="text-xs text-green-600">{(file.size / 1024).toFixed(0)} KB</p>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <Upload className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-sm font-bold text-gray-700">Click or drag PDF to upload</p>
                          <p className="text-xs text-gray-400 mt-1">Suggested size: Max 2MB (2048 KB)</p>
                        </>
                      )}
                    </div>
                    {fileError && (
                      <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {fileError}
                      </p>
                    )}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="py-12 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold text-gray-900">Application Sent!</h2>
                <p className="text-gray-500 max-w-xs mx-auto">Thank you for your interest. Our HR team will review your CV and contact you soon.</p>
              </div>
              <button 
                onClick={onClose}
                className="btn-primary py-3 px-8 rounded-full"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
