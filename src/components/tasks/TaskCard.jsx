// ═══════════════════════════════════════════════════════════════
// TaskCard — Individual task display card
// ═══════════════════════════════════════════════════════════════
// Supports: toggle status, edit, delete actions
// Uses glassmorphism styling with hover effects

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Edit3, Trash2, Clock, CircleCheckBig, Calendar, AlertCircle, ChevronDown, ChevronUp, ListTodo } from 'lucide-react';
import { formatDate, isOverdue, formatDueDate, getPriorityDetails, getCategoryDetails } from '../../utils/helpers';

const TaskCard = ({ task, index, onEdit, onDelete, onToggle, onToggleSubtask, isKanban = false }) => {
  const [expanded, setExpanded] = useState(false);
  
  const isCompleted = task.status === 'completed';
  const overdue = isOverdue(task.dueDate, task.status);
  const priorityInfo = getPriorityDetails(task.priority);
  const categoryInfo = getCategoryDetails(task.category);

  // Subtask calculations
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15, scale: 0.95 }}
      transition={{ delay: isKanban ? 0 : index * 0.05, duration: 0.3 }}
      layout
      className={`glass-card-hover p-4 group relative overflow-hidden flex flex-col justify-between h-full border-t-2
        ${isCompleted ? 'opacity-75' : ''}
        ${priorityInfo.glow}`}
      style={{
        borderTopColor: priorityInfo.label === 'Critical' ? '#ef4444' :
                        priorityInfo.label === 'High' ? '#f97316' :
                        priorityInfo.label === 'Medium' ? '#6366f1' : '#10b981'
      }}
    >
      <div className="flex-1">
        {/* Header: Priority + Category + Action Actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            {/* Priority Badge */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black border uppercase tracking-wider ${priorityInfo.color}`}>
              {priorityInfo.emoji} {priorityInfo.label}
            </span>
            {/* Category Badge */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${categoryInfo.bg}`}>
              {categoryInfo.emoji} {categoryInfo.label}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 z-10 bg-white/80 dark:bg-slate-900/80 p-0.5 rounded-lg border border-slate-100 dark:border-white/5 shadow-sm">
            <button
              onClick={() => onToggle(task)}
              className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors
                ${isCompleted
                  ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                  : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20'
                }`}
              title={isCompleted ? 'Reopen Task' : 'Complete Task'}
            >
              <Check size={14} className={isCompleted ? 'text-amber-500' : 'text-green-500'} strokeWidth={3} />
            </button>
            <button
              onClick={() => onEdit(task)}
              className="w-7 h-7 rounded-md flex items-center justify-center
                text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-colors"
              title="Edit Task"
            >
              <Edit3 size={12} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="w-7 h-7 rounded-md flex items-center justify-center
                text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              title="Delete Task"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-sm lg:text-base font-black text-slate-800 dark:text-white mb-1 leading-snug break-words
          ${isCompleted ? 'line-through opacity-50' : ''}`}>
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className={`text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed
            ${isCompleted ? 'opacity-40' : ''}`}>
            {task.description}
          </p>
        )}

        {/* Subtasks Progress Summary (If exists) */}
        {totalSubtasks > 0 && (
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-primary-500 hover:underline cursor-pointer"
              >
                <ListTodo size={11} />
                <span>Checklist ({completedSubtasks}/{totalSubtasks})</span>
                {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>
              <span>{subtaskProgress}%</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${subtaskProgress}%` }}
              />
            </div>

            {/* Expanded Subtask List */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-1 pt-1"
                >
                  {task.subtasks.map((st, sidx) => (
                    <div
                      key={sidx}
                      onClick={() => onToggleSubtask && onToggleSubtask(task, sidx)}
                      className="flex items-center gap-2 py-1 px-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer text-[11px] font-semibold text-slate-600 dark:text-slate-300 transition-colors select-none"
                    >
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors
                        ${st.completed
                          ? 'bg-green-500 border-green-600 text-white'
                          : 'border-slate-300 dark:border-white/10'
                        }`}
                      >
                        {st.completed && <Check size={8} strokeWidth={4} />}
                      </div>
                      <span className={`truncate ${st.completed ? 'line-through opacity-50' : ''}`}>
                        {st.text}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer Dates */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-2.5 mt-2.5 text-[10px] text-slate-400 font-semibold flex-shrink-0">
        <div className="flex items-center gap-1" title="Created date">
          <Clock size={11} className="text-slate-400" />
          <span>{formatDate(task.createdAt)}</span>
        </div>

        {/* Due Date Indicator */}
        {task.dueDate && (
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border font-bold
            ${overdue
              ? 'bg-red-500/10 border-red-200/50 text-red-500 dark:border-red-950/20 animate-pulse-subtle'
              : 'bg-slate-100 dark:bg-white/5 border-slate-200/40 dark:border-white/5 text-slate-500 dark:text-slate-400'
            }`}
          >
            {overdue ? <AlertCircle size={10} /> : <Calendar size={10} />}
            <span>{formatDueDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;
