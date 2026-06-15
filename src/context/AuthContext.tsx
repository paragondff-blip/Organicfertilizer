import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  adminLogin: (id: string, pass: string) => boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isManualAdmin, setIsManualAdmin] = useState(() => {
    return localStorage.getItem('admin_session') === 'true';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch or create profile
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            role: 'user',
            createdAt: new Date().toISOString()
          };
          await setDoc(userDocRef, {
            ...newProfile,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const adminLogin = (id: string, pass: string) => {
    // Specifically requested credentials
    if (id === 'salesadmin' && pass === '123456') {
      setIsManualAdmin(true);
      localStorage.setItem('admin_session', 'true');
      return true;
    }
    return false;
  };

  const logout = async () => {
    await signOut(auth);
    setIsManualAdmin(false);
    localStorage.removeItem('admin_session');
  };

  const isAdmin = isManualAdmin || profile?.role === 'admin' || user?.email === 'nahid.mfal.mis@gmail.com';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, signInWithGoogle, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
