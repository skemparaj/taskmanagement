import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'todo', title: 'To Do', emoji: '📋', gradient: 'from-blue-500 to-indigo-500' },
  { id: 'in_progress', title: 'In Progress', emoji: '⚡', gradient: 'from-amber-500 to-orange-500' },
  { id: 'in_review', title: 'In Review', emoji: '🔍', gradient: 'from-violet-500 to-purple-500' },
  { id: 'completed', title: 'Completed', emoji: '✅', gradient: 'from-emerald-500 to-teal-500' },
];

const KanbanBoard = ({ tasks, onEdit, onDelete, onToggle, onToggleSubtask }) => {
  
  // Move task status forwards or backwards
  const shiftStatus = (task, direction) => {
    const statusOrder = ['todo', 'in_progress', 'in_review', 'completed'];
    const currentIndex = statusOrder.indexOf(task.status);
    let newIndex = currentIndex;
    
    if (direction === 'next' && currentIndex < statusOrder.length - 1) {
      newIndex += 1;
    } else if (direction === 'prev' && currentIndex > 0) {
      newIndex -= 1;
    }
    
    if (newIndex !== currentIndex) {
      onToggle(task, statusOrder[newIndex]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        
        return (
          <div key={col.id} className="flex flex-col bg-slate-100/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-white/5 rounded-2xl p-4 min-h-[600px]">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/50 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{col.emoji}</span>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm uppercase tracking-wider">
                  {col.title}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                {colTasks.length}
              </span>
            </div>

            {/* Tasks list */}
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[70vh] pr-1">
              <AnimatePresence mode="popLayout">
                {colTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-28 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-xl text-slate-400 dark:text-slate-500 text-xs p-4 text-center"
                  >
                    Drop items or create tasks here
                  </motion.div>
                ) : (
                  colTasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                      className="relative group/kanbancard"
                    >
                      <TaskCard
                        task={task}
                        index={i}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onToggle={(t) => onToggle(t, t.status === 'completed' ? 'todo' : 'completed')}
                        onToggleSubtask={onToggleSubtask}
                        isKanban={true}
                      />

                      {/* Shift status quick controls overlay */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/kanbancard:opacity-100 transition-opacity z-10 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-md border border-slate-200/50 dark:border-white/10">
                        <button
                          disabled={col.id === 'todo'}
                          onClick={() => shiftStatus(task, 'prev')}
                          className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 disabled:hover:text-slate-500"
                          title="Move Left"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          disabled={col.id === 'completed'}
                          onClick={() => shiftStatus(task, 'next')}
                          className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 disabled:hover:text-slate-500"
                          title="Move Right"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
