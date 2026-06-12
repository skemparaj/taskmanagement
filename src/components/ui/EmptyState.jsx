// ═══════════════════════════════════════════════════════════════
// EmptyState — Shown when there are no tasks
// ═══════════════════════════════════════════════════════════════
// Uses a custom animated SVG illustration for the empty state.

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const EmptyState = ({ onAdd }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-12 text-center"
    >
      {/* Animated illustration */}
      <div className="w-48 h-48 mx-auto mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-violet-100 dark:from-primary-950/50 dark:to-violet-950/50 rounded-full" />
        <div className="relative flex items-center justify-center h-full">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Clipboard body */}
              <rect x="16" y="12" width="48" height="58" rx="8" className="fill-primary-200 dark:fill-primary-900/60" />
              <rect x="20" y="16" width="40" height="50" rx="6" className="fill-white dark:fill-slate-800" />
              {/* Clipboard clip */}
              <rect x="28" y="8" width="24" height="12" rx="4" className="fill-primary-400 dark:fill-primary-600" />
              {/* Lines */}
              <rect x="28" y="30" width="24" height="3" rx="1.5" className="fill-slate-200 dark:fill-slate-600" />
              <rect x="28" y="38" width="18" height="3" rx="1.5" className="fill-slate-200 dark:fill-slate-600" />
              <rect x="28" y="46" width="20" height="3" rx="1.5" className="fill-slate-200 dark:fill-slate-600" />
            </svg>
          </motion.div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 font-display">
        No tasks yet
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-xs mx-auto">
        Create your first task to start organizing your work and boost your productivity!
      </p>
      <button onClick={onAdd} className="btn-primary">
        <Plus size={18} />
        Create Your First Task
      </button>
    </motion.div>
  );
};

export default EmptyState;
