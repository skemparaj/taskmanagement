// ═══════════════════════════════════════════════════════════════
// Landing Page — Public homepage with hero section
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  BarChart3,
  Layout,
  Moon,
} from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle';

const features = [
  {
    icon: CheckSquare,
    title: 'Task Management',
    description: 'Create, edit, delete, and organize tasks with a beautiful interface.',
    gradient: 'from-primary-500 to-primary-600',
  },
  {
    icon: BarChart3,
    title: 'Smart Dashboard',
    description: 'Track your progress with real-time statistics and completion progress.',
    gradient: 'from-violet-500 to-violet-600',
  },
  {
    icon: Shield,
    title: 'Secure Auth',
    description: 'Firebase authentication keeps your data safe and private.',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Zap,
    title: 'Real-time Sync',
    description: 'Powered by Firestore — your tasks sync instantly across devices.',
    gradient: 'from-amber-500 to-amber-600',
  },
  {
    icon: Layout,
    title: 'Responsive Design',
    description: 'Works perfectly on desktop, tablet, and mobile devices.',
    gradient: 'from-pink-500 to-pink-600',
  },
  {
    icon: Moon,
    title: 'Dark Mode',
    description: 'Beautiful dark theme for comfortable night-time usage.',
    gradient: 'from-slate-600 to-slate-700',
  },
];

const LandingPage = () => {
  const [mockTasks, setMockTasks] = useState([
    { id: 1, title: 'Redesign Landing Page UI', priority: 'High', category: 'Design', completed: true },
    { id: 2, title: 'Integrate Firebase Auth & Firestore', priority: 'Critical', category: 'Coding', completed: true },
    { id: 3, title: 'Build interactive SVG productivity charts', priority: 'Medium', category: 'Coding', completed: false },
    { id: 4, title: 'Configure profile custom settings', priority: 'Low', category: 'Personal', completed: false }
  ]);

  const totalMock = mockTasks.length;
  const completedMock = mockTasks.filter((t) => t.completed).length;
  const pendingMock = totalMock - completedMock;
  const mockPercentage = totalMock > 0 ? Math.round((completedMock / totalMock) * 100) : 0;

  const toggleMockTask = (id) => {
    setMockTasks(mockTasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-pink-400/10 dark:bg-pink-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600
            flex items-center justify-center shadow-lg shadow-primary-500/30">
            <CheckSquare size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold font-display gradient-text">TaskFlow</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle compact />
          <Link to="/login" className="btn-ghost text-sm">Log In</Link>
          <Link to="/register" className="btn-primary text-sm">
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full
            bg-primary-50 dark:bg-primary-950/40 border border-primary-200/50 dark:border-primary-700/50
            text-primary-700 dark:text-primary-300 text-sm font-medium mb-8"
        >
          <Sparkles size={14} />
          Powered by Firebase & React
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black font-display
            text-slate-900 dark:text-white leading-tight mb-6"
        >
          Organize your work
          <br />
          <span className="gradient-text">effortlessly.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 text-balance"
        >
          A beautiful, modern task management app that helps you stay productive.
          Track progress, manage tasks, and achieve your goals — all in one place.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/register" className="btn-primary text-base px-8 py-3 shadow-xl shadow-primary-500/30">
            Start For Free <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-ghost text-base px-8 py-3">
            I have an account
          </Link>
        </motion.div>

        {/* Dashboard preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 relative"
        >
          <div className="glass-card p-6 lg:p-8 max-w-4xl mx-auto relative overflow-hidden">
            {/* Fake dashboard preview */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Total Tasks', value: totalMock, color: 'from-primary-500 to-primary-600' },
                { label: 'Completed', value: completedMock, color: 'from-green-500 to-emerald-600' },
                { label: 'Pending', value: pendingMock, color: 'from-amber-500 to-orange-600' },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4 text-center">
                  <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold font-display gradient-text">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Progress bar mockup */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Interactive Mockup Progress</span>
                <span className="font-bold gradient-text">{mockPercentage}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{ width: `${mockPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-primary-500 via-violet-500 to-pink-500 rounded-full"
                />
              </div>
            </div>

            {/* Fake task cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              {mockTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleMockTask(t.id)}
                  className={`glass-card p-4 flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-slate-100/30 dark:hover:bg-white/5 border border-slate-200/50 dark:border-white/5 select-none
                    ${t.completed ? 'opacity-70 bg-slate-50/50 dark:bg-[#0f172a]/20' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Checkbox */}
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors flex-shrink-0
                      ${t.completed
                        ? 'bg-green-500 border-green-600 text-white'
                        : 'border-slate-300 dark:border-white/10'
                      }`}
                    >
                      {t.completed && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    {/* Title */}
                    <span className={`text-sm font-semibold text-slate-700 dark:text-slate-300 truncate
                      ${t.completed ? 'line-through opacity-50' : ''}`}>
                      {t.title}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-1 flex-shrink-0">
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded
                      ${t.priority === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                        : t.priority === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Glow effect behind the preview */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 to-violet-500/10 rounded-2xl blur-3xl -z-10" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display text-slate-900 dark:text-white mb-4"
          >
            Everything you need to
            <span className="gradient-text"> stay productive</span>
          </motion.h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Built with modern technologies for a seamless experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-6"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient}
                flex items-center justify-center text-white mb-4 shadow-lg`}>
                <feature.icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/50 dark:border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckSquare size={16} className="text-primary-500" />
            <span className="text-sm font-semibold gradient-text">TaskFlow</span>
          </div>
          <p className="text-xs text-slate-400">
            Built with React, Tailwind CSS & Firebase
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
