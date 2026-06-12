// ═══════════════════════════════════════════════════════════════
// Auth Context — Manages Firebase Authentication State
// ═══════════════════════════════════════════════════════════════
// Provides: user, loading, login, register, logout
// Listens to onAuthStateChanged for persistent sessions
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register a demo user locally (Offline Mode)
  const loginDemo = () => {
    const demoUser = {
      uid: 'demo-user-123',
      displayName: 'Demo User',
      email: 'demo@taskflow.local',
    };
    localStorage.setItem('taskflow_demo_user', JSON.stringify(demoUser));
    setUser(demoUser);
    toast.success('Logged in to Offline Demo Mode! 🚀');
    return demoUser;
  };

  // Listen for auth state changes (handles page refresh)
  useEffect(() => {
    const demoUserStr = localStorage.getItem('taskflow_demo_user');
    if (demoUserStr) {
      setUser(JSON.parse(demoUserStr));
      setLoading(false);
      return;
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    }, (error) => {
      console.error('Auth state error:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Register a new user with email & password
  const register = async (name, email, password) => {
    if (!auth || !db) {
      throw new Error('Firebase authentication is not configured.');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Set display name on the Firebase Auth profile
    await updateProfile(userCredential.user, { displayName: name });

    // Create a user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name,
      email,
      createdAt: serverTimestamp(),
    });

    // Force refresh to get updated displayName
    setUser({ ...userCredential.user, displayName: name });
    toast.success(`Welcome, ${name}! 🎉`);
    return userCredential.user;
  };

  // Login with email & password
  const login = async (email, password) => {
    if (!auth) {
      throw new Error('Firebase authentication is not configured.');
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    toast.success(`Welcome back, ${userCredential.user.displayName || 'User'}! 👋`);
    return userCredential.user;
  };

  // Logout the current user
  const logout = async () => {
    localStorage.removeItem('taskflow_demo_user');
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginDemo, isFirebaseConfigured: !!auth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
