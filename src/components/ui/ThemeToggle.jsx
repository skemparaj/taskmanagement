// ═══════════════════════════════════════════════════════════════
// ThemeToggle — Dark / Light mode toggle button
// ═══════════════════════════════════════════════════════════════

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ compact = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center gap-2 rounded-xl transition-all duration-300
        ${compact
          ? 'w-10 h-10 justify-center hover:bg-slate-100 dark:hover:bg-white/10'
          : 'px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-white/10 w-full'
        }`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Moon size={18} className="text-violet-400" />
        ) : (
          <Sun size={18} className="text-amber-500" />
        )}
      </motion.div>
      {!compact && (
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
