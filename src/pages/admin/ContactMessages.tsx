import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Mail, Trash2, Calendar, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'motion/react';

interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: any;
}

export default function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ContactMessage[]);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteDoc(doc(db, 'contacts', id));
      toast.success("Message deleted");
      setMessages(messages.filter(m => m.id !== id));
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="p-20 text-center">Loading messages...</div>;

  return (
    <div className="space-y-8">
      {messages.length === 0 ? (
        <div className="bg-slate-800 p-20 rounded-3xl text-center border border-slate-700 border-dashed text-slate-500">
           No messages found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {messages.map((m, i) => (
            <motion.div 
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700 space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">{m.firstName} {m.lastName}</h3>
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                       <Mail className="w-3 h-3" /> {m.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-right">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1 justify-end">
                       <Calendar className="w-3 h-3" /> Sent On
                     </p>
                     <p className="text-sm font-bold text-slate-300">
                        {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleString() : 'Just now'}
                     </p>
                   </div>
                   <button 
                     onClick={() => handleDelete(m.id)}
                     className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                   >
                     <Trash2 className="w-5 h-5" />
                   </button>
                </div>
              </div>
              
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{m.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
