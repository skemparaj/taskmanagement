// ═══════════════════════════════════════════════════════════════
// Navbar — Top navigation bar for the dashboard
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing, Sparkles, AlertTriangle, CheckCircle, Info, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getGreeting, getInitials } from '../../utils/helpers';

const Navbar = ({ activeTab = 'dashboard' }) => {
  const { user } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Sample notification items
  const notifications = [
    {
      id: 1,
      type: 'warning',
      icon: AlertTriangle,
      title: 'Task Overdue',
      message: 'Design landing page is past its due date!',
      time: '10m ago',
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20'
    },
    {
      id: 2,
      type: 'success',
      icon: CheckCircle,
      title: 'Milestone Reached!',
      message: 'You completed all High priority tasks for today.',
      time: '1h ago',
      color: 'text-green-500 bg-green-50 dark:bg-green-950/20'
    },
    {
      id: 3,
      type: 'info',
      icon: Sparkles,
      title: 'Analytics Updated',
      message: 'Check out your new weekly progress chart.',
      time: '3h ago',
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
    }
  ];

  return (
    <header className="sticky top-0 z-20
      bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl
      border-b border-slate-200/50 dark:border-white/5
      px-6 py-4 lg:px-8">
      <div className="flex items-center justify-between">
        
        {/* Dynamic Contextual Header */}
        <div className="pl-12 lg:pl-0">
          {activeTab === 'dashboard' ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {getGreeting()}
              </p>
              <h1 className="text-xl lg:text-2xl font-black font-display text-slate-900 dark:text-white mt-0.5">
                {user?.displayName?.split(' ')[0] || 'User'} 👋
              </h1>
            </>
          ) : activeTab === 'analytics' ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Insights & Performance
              </p>
              <h1 className="text-xl lg:text-2xl font-black font-display text-slate-900 dark:text-white mt-0.5">
                Productivity Analytics 📈
              </h1>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Account Settings
              </p>
              <h1 className="text-xl lg:text-2xl font-black font-display text-slate-900 dark:text-white mt-0.5">
                Settings & Profile ⚙️
              </h1>
            </>
          )}
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-4 relative">
          
          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="w-10 h-10 rounded-xl flex items-center justify-center
                text-slate-500 hover:text-slate-800 dark:hover:text-white
                bg-slate-100/50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10
                border border-slate-200/50 dark:border-white/5 transition-all"
            >
              <Bell size={18} className="animate-pulse-subtle" />
              {/* Pulsing indicator dot */}
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-2 ring-white dark:ring-slate-950" />
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {notificationsOpen && (
                <>
                  {/* Overlay to close */}
                  <div className="fixed inset-0 z-30" onClick={() => setNotificationsOpen(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-80 lg:w-96 glass-card p-4 z-40 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/10"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2 mb-3">
                      <h3 className="font-bold text-slate-900 dark:text-white font-display text-sm flex items-center gap-1.5">
                        <BellRing size={16} className="text-primary-500" /> Notifications
                      </h3>
                      <button 
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs text-primary-500 hover:underline font-semibold"
                      >
                        Clear all
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {notifications.map((item) => (
                        <div key={item.id} className="flex gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-white/5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                            <item.icon size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-baseline mb-0.5">
                              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                {item.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                {item.time}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                              {item.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Vertical Separator */}
          <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />

          {/* User profile detail */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                {user?.displayName || 'User'}
              </p>
              <p className="text-[11px] text-slate-400">
                {user?.email}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 via-indigo-500 to-violet-500
              flex items-center justify-center text-white text-sm font-bold
              shadow-lg shadow-indigo-500/20 border border-white/20 dark:border-white/10">
              {getInitials(user?.displayName)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
