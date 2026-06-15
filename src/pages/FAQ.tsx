import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<{q: string, a: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'faq'));
        if (docSnap.exists()) {
          setFaqs(docSnap.data().items || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold">Common Questions</h1>
        <p className="text-gray-500 text-lg">Everything you need to know about our organic delights and shipping.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-10 text-center text-gray-400">Loading FAQ...</div>
        ) : faqs.length > 0 ? (
          faqs.map((faq, i) => (
            <div key={i} className="glass rounded-[2rem] overflow-hidden border-none transition-all duration-300">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left p-8 flex items-center justify-between hover:bg-primary/5 transition-colors"
              >
                <span className="font-display font-bold text-xl md:text-2xl text-gray-800">{faq.q}</span>
                <ChevronDown className={`w-6 h-6 text-primary transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 text-gray-500 leading-relaxed text-lg italic">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-gray-400 italic">No FAQ items found.</div>
        )}
      </div>

      <div className="bg-secondary/10 p-12 rounded-[3.5rem] text-center space-y-6">
        <h3 className="text-2xl font-display font-bold">Still have questions?</h3>
        <p className="text-gray-600 max-w-md mx-auto">Our biscuit experts are always ready to help you with any inquiries you might have.</p>
        <a href="/contact" className="btn-secondary inline-flex">Contact Support Team</a>
      </div>
    </div>
  );
}

