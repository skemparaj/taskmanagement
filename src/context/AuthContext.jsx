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

  // Listen for auth state changes (handles page refresh)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Register a new user with email & password
  const register = async (name, email, password) => {
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    toast.success(`Welcome back, ${userCredential.user.displayName || 'User'}! 👋`);
    return userCredential.user;
  };

  // Logout the current user
  const logout = async () => {
    await signOut(auth);
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
