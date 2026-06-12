// ═══════════════════════════════════════════════════════════════
// Login Page — Firebase Email/Password Login
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, CheckSquare, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login, loginDemo, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error details:', error);
      const code = error?.code;
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        toast.error('Invalid email or password.');
      } else if (code === 'auth/too-many-requests') {
        toast.error('Too many attempts. Please try again later.');
      } else if (code === 'auth/operation-not-allowed' || code === 'auth/configuration-not-found') {
        toast.error('Email/Password authentication is disabled. Please enable it in your Firebase Console -> Authentication -> Sign-in method.');
      } else if (code === 'auth/network-request-failed' || error?.message?.includes('not configured')) {
        toast.error('Firebase not configured or network offline. Please enter Demo Mode!');
      } else {
        toast.error(error?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12
      bg-gradient-to-br from-slate-50 via-primary-50/30 to-violet-50/30
      dark:from-slate-950 dark:via-primary-950/20 dark:to-violet-950/20
      relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600
              flex items-center justify-center shadow-lg shadow-primary-500/30">
              <CheckSquare size={24} className="text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Welcome back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Log in to your account</p>
        </div>

        {/* Firebase Config Warning if applicable */}
        {!isFirebaseConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/25 border border-amber-200/50 dark:border-amber-900/30 flex items-start gap-3">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-semibold">
              Firebase configuration not detected. Please add your credentials in Vercel settings or use <strong>Offline / Demo Mode</strong> below.
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="input-field !pl-11"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="form-label">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="input-field !pl-11 !pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" loading={loading} className="w-full">
            <LogIn size={16} /> Log In
          </Button>

          {/* Demo Button */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-white/5"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-slate-200 dark:border-white/5"></div>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              loginDemo();
              navigate('/dashboard');
            }}
            className="w-full border border-slate-200/50 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
          >
            ⚡ Enter Offline / Demo Mode
          </Button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
            Sign up for free
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
