// ═══════════════════════════════════════════════════════════════
// Register Page — Firebase Email/Password Registration
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, CheckSquare, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register, loginDemo, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name.trim() || !form.email || !form.password) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(form.name.trim(), form.email, form.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error details:', error);
      const code = error?.code;
      if (code === 'auth/email-already-in-use') {
        toast.error('This email is already registered.');
      } else if (code === 'auth/weak-password') {
        toast.error('Password is too weak. Use at least 6 characters.');
      } else if (code === 'auth/invalid-email') {
        toast.error('Please enter a valid email address.');
      } else if (code === 'auth/operation-not-allowed' || code === 'auth/configuration-not-found') {
        toast.error('Email/Password authentication is disabled. Please enable it in your Firebase Console -> Authentication -> Sign-in method.');
      } else if (code === 'auth/network-request-failed' || error?.message?.includes('not configured')) {
        toast.error('Firebase not configured or network offline. Please enter Demo Mode!');
      } else {
        toast.error(error?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12
      bg-gradient-to-br from-slate-50 via-violet-50/30 to-primary-50/30
      dark:from-slate-950 dark:via-violet-950/20 dark:to-primary-950/20
      relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-3xl" />

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
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Create your account</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Start managing your tasks today</p>
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
          {/* Name */}
          <div>
            <label className="form-label">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="input-field !pl-11"
                required
              />
            </div>
          </div>

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
                placeholder="Min. 6 characters"
                className="input-field !pl-11 !pr-11"
                required
                minLength={6}
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

          {/* Confirm Password */}
          <div>
            <label className="form-label">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Repeat your password"
                className="input-field !pl-11"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            loading={loading}
            disabled={!isFirebaseConfigured}
            className="w-full"
            title={!isFirebaseConfigured ? 'Firebase is not configured. Use Demo Mode.' : 'Create Account'}
          >
            <UserPlus size={16} /> Create Account
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

        {/* Login link */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
