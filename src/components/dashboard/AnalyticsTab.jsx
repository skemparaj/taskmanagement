import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Clock, AlertCircle, BarChart3, CheckSquare } from 'lucide-react';
import { getPriorityDetails, getCategoryDetails, isOverdue } from '../../utils/helpers';

const AnalyticsTab = ({ tasks }) => {
  
  // Calculate analytics metrics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = tasks.filter((t) => t.status !== 'completed').length;
    
    const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Priority distributions
    const priorityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
    // Category distributions
    const categoryCounts = {};
    
    tasks.forEach((task) => {
      const p = task.priority?.toLowerCase() || 'medium';
      if (priorityCounts[p] !== undefined) priorityCounts[p]++;
      
      const c = task.category || 'work';
      categoryCounts[c] = (categoryCounts[c] || 0) + 1;
    });

    // Score evaluation
    let level = 'Beginner';
    let message = 'Start completing tasks to build momentum!';
    if (completionRate >= 80) {
      level = 'Productivity Ninja 🥷';
      message = 'Outstanding! You are on top of your game.';
    } else if (completionRate >= 50) {
      level = 'Task Achiever 🚀';
      message = 'Great job! Keep the streak alive.';
    } else if (completionRate > 0) {
      level = 'Organizer 📅';
      message = 'Good start. Try tackling high priority tasks first.';
    }

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate,
      priorityCounts,
      categoryCounts,
      level,
      message
    };
  }, [tasks]);

  // Priority SVG chart data calculations
  const maxPriorityCount = Math.max(...Object.values(stats.priorityCounts), 1);
  const priorityChartData = [
    { key: 'critical', label: 'Critical', count: stats.priorityCounts.critical, color: 'bg-red-500', fill: '#ef4444' },
    { key: 'high', label: 'High', count: stats.priorityCounts.high, color: 'bg-orange-500', fill: '#f97316' },
    { key: 'medium', label: 'Medium', count: stats.priorityCounts.medium, color: 'bg-indigo-500', fill: '#6366f1' },
    { key: 'low', label: 'Low', count: stats.priorityCounts.low, color: 'bg-emerald-500', fill: '#10b981' },
  ];

  // Category chart data calculations
  const categoryChartData = Object.entries(stats.categoryCounts)
    .map(([name, count]) => ({
      name,
      count,
      details: getCategoryDetails(name)
    }))
    .sort((a, b) => b.count - a.count);

  const maxCategoryCount = Math.max(...categoryChartData.map(c => c.count), 1);

  // SVG circular progress details
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.completionRate / 100) * circumference;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: stats.total, icon: CheckSquare, desc: 'Created all-time', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
          { label: 'Completed', value: stats.completed, icon: Award, desc: `${stats.completionRate}% completion rate`, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
          { label: 'Pending', value: stats.pending, icon: Clock, desc: 'Active in workflow', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
          { label: 'Overdue Tasks', value: stats.overdue, icon: AlertCircle, desc: 'Need immediate attention', color: stats.overdue > 0 ? 'text-red-500 bg-red-50 dark:bg-red-950/30' : 'text-slate-500 bg-slate-100 dark:bg-white/5' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{card.label}</p>
              <p className="text-3xl font-black font-display text-slate-800 dark:text-white mt-1">{card.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{card.desc}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
              <card.icon size={22} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Visualization Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core completion radial display */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 flex flex-col items-center justify-center text-center lg:col-span-1"
        >
          <h3 className="font-bold text-slate-800 dark:text-slate-200 font-display text-sm uppercase tracking-wider mb-6 flex items-center gap-1.5 self-start">
            <TrendingUp size={16} className="text-indigo-500" /> Completion Rate
          </h3>

          <div className="relative w-40 h-40 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-100 dark:stroke-white/5"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress ring */}
              <motion.circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-indigo-500 dark:stroke-indigo-400"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black font-display text-slate-800 dark:text-white">
                {stats.completionRate}%
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase mt-0.5">
                Completed
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-4 w-full">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{stats.level}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {stats.message}
            </p>
          </div>
        </motion.div>

        {/* Priority breakdown bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-6 lg:col-span-1"
        >
          <h3 className="font-bold text-slate-800 dark:text-slate-200 font-display text-sm uppercase tracking-wider mb-6 flex items-center gap-1.5">
            <BarChart3 size={16} className="text-indigo-500" /> Priority distribution
          </h3>

          <div className="space-y-4">
            {priorityChartData.map((item) => {
              const widthPct = stats.total > 0 ? (item.count / maxPriorityCount) * 100 : 0;
              return (
                <div key={item.key} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                    <span className="text-slate-400 font-bold">{item.count} tasks</span>
                  </div>
                  <div className="h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Categories breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 lg:col-span-1"
        >
          <h3 className="font-bold text-slate-800 dark:text-slate-200 font-display text-sm uppercase tracking-wider mb-6 flex items-center gap-1.5">
            <CheckSquare size={16} className="text-indigo-500" /> Category Breakdown
          </h3>

          {categoryChartData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs">
              No categories mapped yet. Add categories to see statistics.
            </div>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {categoryChartData.map((cat) => {
                const widthPct = (cat.count / maxCategoryCount) * 100;
                return (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold items-center">
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <span>{cat.details.emoji}</span>
                        <span>{cat.details.label}</span>
                      </span>
                      <span className="text-slate-400 font-bold">{cat.count} tasks</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Completion Velocity Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 font-display text-sm uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={16} className="text-indigo-500" /> Completion Velocity
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Tasks completed daily over the past week</p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-indigo-500 font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30">
              Avg. 4.2 tasks/day
            </span>
          </div>
        </div>

        {/* SVG Custom Line Graph */}
        <div className="w-full h-48 relative">
          <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="0" y1="50" x2="700" y2="50" className="stroke-slate-100 dark:stroke-white/5" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="100" x2="700" y2="100" className="stroke-slate-100 dark:stroke-white/5" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="150" x2="700" y2="150" className="stroke-slate-100 dark:stroke-white/5" strokeWidth="1" strokeDasharray="4 4" />
            
            {/* Area under the line */}
            <path
              d="M 50 170 C 130 160, 130 90, 200 90 C 270 90, 270 120, 350 120 C 430 120, 430 50, 500 50 C 570 50, 570 150, 650 150 L 650 180 L 50 180 Z"
              fill="url(#grad)"
              className="opacity-20 dark:opacity-10"
            />
            
            {/* Smooth Line */}
            <path
              d="M 50 170 C 130 160, 130 90, 200 90 C 270 90, 270 120, 350 120 C 430 120, 430 50, 500 50 C 570 50, 570 150, 650 150"
              fill="transparent"
              className="stroke-indigo-500 dark:stroke-indigo-400"
              strokeWidth="4"
              strokeLinecap="round"
            />
            
            {/* Dots */}
            {[
              { x: 50, y: 170, v: 1 },
              { x: 150, y: 125, v: 2 },
              { x: 200, y: 90, v: 4 },
              { x: 350, y: 120, v: 3 },
              { x: 500, y: 50, v: 6 },
              { x: 650, y: 150, v: 2 }
            ].map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="6" className="fill-indigo-500 dark:fill-indigo-400 stroke-white dark:stroke-slate-900" strokeWidth="2" />
                <circle cx={p.x} cy={p.y} r="10" className="stroke-indigo-500/30 dark:stroke-indigo-400/20 fill-transparent hover:fill-indigo-500/10 cursor-pointer" strokeWidth="1" />
              </g>
            ))}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-bold px-8 mt-2">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;
