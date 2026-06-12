// ═══════════════════════════════════════════════════════════════
// StatsCard — Dashboard statistic card with animation
// ═══════════════════════════════════════════════════════════════

import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, gradient, delay = 0, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-card-hover p-5 relative overflow-hidden"
    >
      {/* Background gradient accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-8 translate-x-8 ${gradient}`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{title}</p>
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
            className="text-3xl font-bold font-display text-slate-900 dark:text-white"
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>

        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${gradient}`}>
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
