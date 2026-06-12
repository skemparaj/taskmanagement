// ═══════════════════════════════════════════════════════════════
// TaskForm — Add / Edit task modal form
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

const CATEGORIES = ['work', 'personal', 'coding', 'shopping', 'health', 'finance'];

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20' },
  { value: 'medium', label: 'Medium', color: 'border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20' },
  { value: 'high', label: 'High', color: 'border-orange-200 dark:border-orange-900/50 text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20' },
  { value: 'critical', label: 'Critical', color: 'border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20' },
];

const STATUSES = [
  { value: 'todo', label: 'To Do', emoji: '📋' },
  { value: 'in_progress', label: 'In Progress', emoji: '⚡' },
  { value: 'in_review', label: 'In Review', emoji: '🔍' },
  { value: 'completed', label: 'Completed', emoji: '✅' },
];

const TaskForm = ({ task = null, onSubmit, onClose, loading = false }) => {
  const isEditing = !!task;

  // Initialize fields
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    category: task?.category || 'work',
    dueDate: task?.dueDate ? (task.dueDate.toDate ? task.dueDate.toDate().toISOString().split('T')[0] : new Date(task.dueDate).toISOString().split('T')[0]) : '',
  });

  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [errors, setErrors] = useState({});

  // Add a subtask to local form checklist
  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, { text: newSubtask.trim(), completed: false }]);
    setNewSubtask('');
  };

  // Delete a subtask from local checklist
  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, idx) => idx !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (form.title.trim().length > 100) newErrors.title = 'Title must be under 100 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      category: form.category,
      dueDate: form.dueDate ? new Date(form.dueDate) : null,
      subtasks: subtasks,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="form-label">Task Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g., Complete presentation slides"
          className={`input-field ${errors.title ? 'border-red-400 focus:ring-red-400/50' : ''}`}
          autoFocus
        />
        {errors.title && (
          <p className="text-xs text-red-500 mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="form-label">Description <span className="text-slate-400 font-normal">(optional)</span></label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Add details about this task..."
          rows={2}
          className="input-field resize-none"
        />
      </div>

      {/* Grid: Category and Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label className="form-label">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="input-field capitalize cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="form-label">Due Date <span className="text-slate-400 font-normal">(optional)</span></label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="input-field cursor-pointer"
          />
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="form-label">Priority</label>
        <div className="grid grid-cols-4 gap-2">
          {PRIORITIES.map((p) => {
            const isSelected = form.priority === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setForm({ ...form, priority: p.value })}
                className={`py-2 rounded-xl text-xs font-bold transition-all duration-200 border
                  ${isSelected
                    ? p.value === 'critical' ? 'bg-red-500 text-white border-red-600 shadow-md shadow-red-500/10'
                      : p.value === 'high' ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/10'
                      : p.value === 'medium' ? 'bg-indigo-500 text-white border-indigo-600 shadow-md shadow-indigo-500/10'
                      : 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/10'
                    : `border-slate-200 dark:border-white/5 text-slate-500 hover:border-slate-300 dark:hover:border-white/10 dark:text-slate-400`
                  }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="form-label">Status</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STATUSES.map((s) => {
            const isSelected = form.status === s.value;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => setForm({ ...form, status: s.value })}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border flex flex-col items-center gap-1
                  ${isSelected
                    ? 'bg-primary-50 dark:bg-primary-950/30 border-primary-400 dark:border-primary-800 text-primary-700 dark:text-primary-300 shadow-sm'
                    : 'border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/10'
                  }`}
              >
                <span className="text-sm">{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtasks Checklist Editor */}
      <div>
        <label className="form-label">Subtasks Checklist</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSubtask();
              }
            }}
            placeholder="Add a checklist item..."
            className="input-field flex-1"
          />
          <button
            type="button"
            onClick={handleAddSubtask}
            className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Subtask list */}
        {subtasks.length > 0 && (
          <div className="max-h-28 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/40 dark:border-white/5">
            {subtasks.map((st, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 px-2 hover:bg-white dark:hover:bg-slate-900 rounded-lg group transition-colors">
                <span className="text-slate-600 dark:text-slate-300 truncate">{st.text}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(idx)}
                  className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-3 border-t border-slate-200/30 dark:border-white/5">
        <button type="button" onClick={onClose} className="btn-ghost flex-1">
          Cancel
        </button>
        <Button type="submit" loading={loading} className="flex-1">
          {isEditing ? <><Save size={16} /> Update Task</> : <><Plus size={16} /> Create Task</>}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
