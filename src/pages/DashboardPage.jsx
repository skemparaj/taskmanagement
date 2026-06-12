// ═══════════════════════════════════════════════════════════════
// Dashboard Page — Main task management interface
// ═══════════════════════════════════════════════════════════════
// Features:
// - Statistics cards (total, completed, pending)
// - Completion progress bar
// - Task search and filter
// - Task list with CRUD operations
// - Add/Edit task modal
// - Empty state when no tasks exist
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ListTodo,
  CheckCircle2,
  Clock,
  TrendingUp,
  LayoutGrid,
  Columns,
} from 'lucide-react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/dashboard/StatsCard';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import AnalyticsTab from '../components/dashboard/AnalyticsTab';
import SettingsTab from '../components/dashboard/SettingsTab';
import KanbanBoard from '../components/tasks/KanbanBoard';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();

  // ─── State ──────────────────────────────────────────────────
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('taskflow_view_mode') || 'grid';
  });
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  // ─── Firestore Real-time / LocalStorage Listener ───────────────────────────
  useEffect(() => {
    if (!user) return;

    if (user.uid === 'demo-user-123') {
      const loadLocalTasks = () => {
        const localTasks = JSON.parse(localStorage.getItem('taskflow_demo_tasks') || '[]');
        setTasks(localTasks);
        setLoading(false);
      };
      loadLocalTasks();
      window.addEventListener('storage', loadLocalTasks);
      return () => window.removeEventListener('storage', loadLocalTasks);
    }

    if (!db) {
      toast.error('Database connection not available. Running in local mode.');
      setLoading(false);
      return;
    }

    // Subscribe to user's tasks, ordered by createdAt descending
    const q = query(
      collection(db, 'users', user.uid, 'tasks'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => {
        const data = doc.data();
        let status = data.status || 'todo';
        // Normalize legacy status names
        if (status === 'pending') status = 'todo';

        return {
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          status,
          priority: data.priority || 'medium',
          category: data.category || 'work',
          dueDate: data.dueDate || null,
          subtasks: data.subtasks || [],
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      });
      setTasks(fetchedTasks);
      setLoading(false);
    }, (error) => {
      console.error('Firestore error:', error);
      toast.error('Failed to load tasks.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // ─── Computed Stats ─────────────────────────────────────────
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = tasks.filter((t) => t.status !== 'completed').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, percentage };
  }, [tasks]);

  // ─── Filtered, Searched & Sorted Tasks ──────────────────────
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Filter by status
    if (filter !== 'all') {
      if (filter === 'pending') {
        result = result.filter((t) => t.status !== 'completed');
      } else {
        result = result.filter((t) => t.status === filter);
      }
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.category === categoryFilter);
    }

    // Search by title or description
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((t) =>
        t.title.toLowerCase().includes(term) ||
        (t.description && t.description.toLowerCase().includes(term))
      );
    }

    // Sort tasks
    return [...result].sort((a, b) => {
      if (sortBy === 'createdAt') {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return timeB - timeA;
      }
      
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        const dateA = a.dueDate?.toDate ? a.dueDate.toDate().getTime() : new Date(a.dueDate).getTime();
        const dateB = b.dueDate?.toDate ? b.dueDate.toDate().getTime() : new Date(b.dueDate).getTime();
        return dateA - dateB;
      }
      
      if (sortBy === 'priority') {
        const weight = { critical: 4, high: 3, medium: 2, low: 1 };
        const weightA = weight[a.priority?.toLowerCase()] || 2;
        const weightB = weight[b.priority?.toLowerCase()] || 2;
        return weightB - weightA;
      }
      
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      
      return 0;
    });
  }, [tasks, filter, priorityFilter, categoryFilter, search, sortBy]);

  // Task counts for filter buttons
  const taskCounts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter((t) => t.status !== 'completed').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }), [tasks]);

  // ─── CRUD Operations ───────────────────────────────────────

  // CREATE a new task
  const handleCreateTask = async (taskData) => {
    setFormLoading(true);
    try {
      if (user.uid === 'demo-user-123') {
        const newTask = {
          id: 'local-' + Date.now(),
          ...taskData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [newTask, ...tasks];
        localStorage.setItem('taskflow_demo_tasks', JSON.stringify(updated));
        setTasks(updated);
        toast.success('Task created! ✅');
        setIsModalOpen(false);
        return;
      }

      await addDoc(collection(db, 'users', user.uid, 'tasks'), {
        ...taskData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('Task created! ✅');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Create error:', error);
      toast.error('Failed to create task.');
    } finally {
      setFormLoading(false);
    }
  };

  // UPDATE an existing task
  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    setFormLoading(true);
    try {
      if (user.uid === 'demo-user-123') {
        const updated = tasks.map((t) =>
          t.id === editingTask.id
            ? { ...t, ...taskData, updatedAt: new Date().toISOString() }
            : t
        );
        localStorage.setItem('taskflow_demo_tasks', JSON.stringify(updated));
        setTasks(updated);
        toast.success('Task updated! ✏️');
        setIsModalOpen(false);
        setEditingTask(null);
        return;
      }

      await updateDoc(doc(db, 'users', user.uid, 'tasks', editingTask.id), {
        ...taskData,
        updatedAt: serverTimestamp(),
      });
      toast.success('Task updated! ✏️');
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update task.');
    } finally {
      setFormLoading(false);
    }
  };

  // DELETE a task
  const handleDeleteTask = async (taskId) => {
    try {
      if (user.uid === 'demo-user-123') {
        const updated = tasks.filter((t) => t.id !== taskId);
        localStorage.setItem('taskflow_demo_tasks', JSON.stringify(updated));
        setTasks(updated);
        toast.success('Task deleted. 🗑️');
        return;
      }

      await deleteDoc(doc(db, 'users', user.uid, 'tasks', taskId));
      toast.success('Task deleted. 🗑️');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete task.');
    }
  };

  // TOGGLE task status (supports direct status strings e.g. for Kanban column changes)
  const handleToggleStatus = async (task, forcedStatus = null) => {
    let newStatus;
    if (forcedStatus) {
      newStatus = forcedStatus;
    } else {
      newStatus = task.status === 'completed' ? 'todo' : 'completed';
    }
    try {
      if (user.uid === 'demo-user-123') {
        const updated = tasks.map((t) =>
          t.id === task.id
            ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
            : t
        );
        localStorage.setItem('taskflow_demo_tasks', JSON.stringify(updated));
        setTasks(updated);
        toast.success(newStatus === 'completed' ? 'Task completed! 🎉' : 'Task status updated.');
        return;
      }

      await updateDoc(doc(db, 'users', user.uid, 'tasks', task.id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      toast.success(newStatus === 'completed' ? 'Task completed! 🎉' : 'Task status updated.');
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error('Failed to update task status.');
    }
  };

  // TOGGLE a subtask's completion state
  const handleToggleSubtask = async (task, subtaskIndex) => {
    const updatedSubtasks = [...task.subtasks];
    updatedSubtasks[subtaskIndex].completed = !updatedSubtasks[subtaskIndex].completed;
    try {
      if (user.uid === 'demo-user-123') {
        const updated = tasks.map((t) =>
          t.id === task.id
            ? { ...t, subtasks: updatedSubtasks, updatedAt: new Date().toISOString() }
            : t
        );
        localStorage.setItem('taskflow_demo_tasks', JSON.stringify(updated));
        setTasks(updated);
        return;
      }

      await updateDoc(doc(db, 'users', user.uid, 'tasks', task.id), {
        subtasks: updatedSubtasks,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Subtask toggle error:', error);
      toast.error('Failed to update subtask.');
    }
  };

  // Open edit modal
  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Open add modal
  const openAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // ─── Render ─────────────────────────────────────────────────
  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <div className="space-y-6 max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Manage your tasks and track your progress
              </p>
            </div>
            
            {/* View toggle + Add Button */}
            <div className="flex items-center gap-3">
              <div className="flex bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 p-1 rounded-xl">
                <button
                  onClick={() => {
                    setViewMode('grid');
                    localStorage.setItem('taskflow_view_mode', 'grid');
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-primary-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
                  title="Grid View"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => {
                    setViewMode('kanban');
                    localStorage.setItem('taskflow_view_mode', 'kanban');
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-800 text-primary-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
                  title="Kanban Board"
                >
                  <Columns size={16} />
                </button>
              </div>

              <button onClick={openAddModal} className="btn-primary">
                <Plus size={18} /> New Task
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard
              title="Total Tasks"
              value={stats.total}
              icon={ListTodo}
              gradient="bg-gradient-to-br from-primary-500 via-indigo-500 to-indigo-600"
              delay={0}
              subtitle="All your tasks"
            />
            <StatsCard
              title="Completed"
              value={stats.completed}
              icon={CheckCircle2}
              gradient="bg-gradient-to-br from-green-500 via-emerald-500 to-emerald-600"
              delay={0.1}
              subtitle={`${stats.percentage}% completion rate`}
            />
            <StatsCard
              title="Pending"
              value={stats.pending}
              icon={Clock}
              gradient="bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600"
              delay={0.2}
              subtitle="Tasks to complete"
            />
          </div>

          {/* Completion Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-primary-500" />
                <h3 className="font-bold text-slate-900 dark:text-white font-display text-sm uppercase tracking-wider">
                  Overall Completion Progress
                </h3>
              </div>
              <span className="text-2xl font-bold gradient-text font-display">
                {stats.percentage}%
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.percentage}%` }}
                transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 font-semibold">
              {stats.completed} of {stats.total} tasks completed
            </p>
          </motion.div>

          {/* Filters & Search */}
          {tasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <TaskFilters
                search={search}
                onSearchChange={setSearch}
                filter={filter}
                onFilterChange={setFilter}
                priorityFilter={priorityFilter}
                onPriorityFilterChange={setPriorityFilter}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                taskCounts={taskCounts}
              />
            </motion.div>
          )}

          {/* Task List / Kanban */}
          {loading ? (
            // Skeleton loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card p-5 animate-pulse">
                  <div className="h-5 w-20 bg-slate-200 dark:bg-white/10 rounded-lg mb-3" />
                  <div className="h-4 w-full bg-slate-200 dark:bg-white/10 rounded mb-2" />
                  <div className="h-4 w-2/3 bg-slate-200 dark:bg-white/10 rounded mb-4" />
                  <div className="h-3 w-24 bg-slate-200 dark:bg-white/10 rounded" />
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            // Empty state — no tasks at all
            <EmptyState onAdd={openAddModal} />
          ) : filteredTasks.length === 0 ? (
            // No tasks match search/filter
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <p className="text-slate-400 text-sm mb-2 font-medium">No tasks match your search or filter.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setFilter('all');
                  setPriorityFilter('all');
                  setCategoryFilter('all');
                  setSortBy('createdAt');
                }}
                className="text-primary-500 text-sm font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : viewMode === 'kanban' ? (
            <KanbanBoard
              tasks={filteredTasks}
              onEdit={openEditModal}
              onDelete={handleDeleteTask}
              onToggle={handleToggleStatus}
              onToggleSubtask={handleToggleSubtask}
            />
          ) : (
            // Task grid view
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={i}
                    onEdit={openEditModal}
                    onDelete={handleDeleteTask}
                    onToggle={(t) => handleToggleStatus(t)}
                    onToggleSubtask={handleToggleSubtask}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Add/Edit Task Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title={editingTask ? 'Edit Task' : 'Create New Task'}
          >
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onClose={closeModal}
              loading={formLoading}
            />
          </Modal>
        </div>
      )}
      {activeTab === 'analytics' && <AnalyticsTab tasks={tasks} />}
      {activeTab === 'settings' && <SettingsTab />}
    </Layout>
  );
};

export default DashboardPage;
