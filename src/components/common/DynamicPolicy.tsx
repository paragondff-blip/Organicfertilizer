import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Markdown from 'react-markdown';

interface DynamicPolicyProps {
  settingKey: string;
  defaultTitle: string;
}

export default function DynamicPolicy({ settingKey, defaultTitle }: DynamicPolicyProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', settingKey));
        if (docSnap.exists()) {
          setContent(docSnap.data().content);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, [settingKey]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 prose prose-slate">
      <h1 className="text-4xl font-display font-bold mb-8">{defaultTitle}</h1>
      <div className="markdown-body">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
        ) : (
          <Markdown>{content || `Information for ${defaultTitle} is coming soon.`}</Markdown>
        )}
      </div>
    </div>
  );
}
