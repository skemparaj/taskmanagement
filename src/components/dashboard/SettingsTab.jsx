import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Save, CheckCircle2 } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const AVATAR_COLORS = [
  { name: 'Indigo Violet', value: 'from-primary-500 to-violet-500' },
  { name: 'Emerald Teal', value: 'from-emerald-500 to-teal-500' },
  { name: 'Orange Amber', value: 'from-orange-500 to-amber-500' },
  { name: 'Rose Pink', value: 'from-rose-500 to-pink-500' },
  { name: 'Sky Cyan', value: 'from-sky-500 to-cyan-500' }
];

const SettingsTab = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(localStorage.getItem('taskflow_avatar_theme') || AVATAR_COLORS[0].value);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error('Display name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      if (auth && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName.trim()
        });
        
        // Save avatar color preference
        localStorage.setItem('taskflow_avatar_theme', selectedColor);
        
        toast.success('Profile updated successfully! ✏️');
        
        // Force refresh the page after a short delay to update context everywhere
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        // Local Demo Mode update
        const demoUser = JSON.parse(localStorage.getItem('taskflow_demo_user') || '{}');
        demoUser.displayName = displayName.trim();
        localStorage.setItem('taskflow_demo_user', JSON.stringify(demoUser));
        localStorage.setItem('taskflow_avatar_theme', selectedColor);
        
        toast.success('Profile updated locally! ✏️');
        
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      
      {/* Edit Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="font-bold text-slate-800 dark:text-slate-100 font-display text-base mb-6 flex items-center gap-2 border-b border-slate-200/50 dark:border-white/5 pb-3">
          <User size={18} className="text-primary-500" /> Personal Profile
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          {/* Email (Read Only) */}
          <div>
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                disabled
                className="input-field !pl-11 bg-slate-50 dark:bg-slate-900/30 text-slate-400 dark:text-slate-500 border-dashed cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Your registered email address cannot be changed.</p>
          </div>

          {/* Display Name */}
          <div>
            <label className="form-label">Display Name *</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. John Doe"
                className="input-field !pl-11"
                required
              />
            </div>
          </div>

          {/* Choose Avatar Highlight Theme (Visual Polish) */}
          <div>
            <label className="form-label">Avatar Highlight Color</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-2">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`relative flex flex-col items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all
                    ${selectedColor === color.value
                      ? 'border-primary-500 dark:border-primary-400 bg-primary-50/50 dark:bg-primary-950/20 text-slate-800 dark:text-white'
                      : 'border-slate-200 dark:border-white/5 text-slate-400 hover:border-slate-300 dark:hover:border-white/10'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color.value} shadow-md`} />
                  <span className="text-[10px] text-center truncate w-full">{color.name.split(' ')[0]}</span>
                  {selectedColor === color.value && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center text-[8px] text-white">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <Button type="submit" loading={loading} className="w-full sm:w-auto px-6">
              <Save size={16} /> Save Changes
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Account Info details */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h3 className="font-bold text-slate-800 dark:text-slate-100 font-display text-base mb-4 flex items-center gap-2 border-b border-slate-200/50 dark:border-white/5 pb-3">
          <Shield size={18} className="text-primary-500" /> Account Security & Metadata
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Calendar size={16} /> Member Since
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-200">{formattedDate}</span>
          </div>

          <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <CheckCircle2 size={16} /> Authentication
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">
              {auth ? 'Verified Firebase Auth' : 'LocalStorage Offline Mode'}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm py-1">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <User size={16} /> User ID (UID)
            </span>
            <span className="font-mono text-xs text-slate-400 dark:text-slate-500 select-all">{user?.uid || '—'}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsTab;
