import { Search, Filter, ArrowUpDown } from 'lucide-react';

const FILTERS = [
  { value: 'all', label: 'All Tasks', emoji: '📋' },
  { value: 'pending', label: 'Pending', emoji: '⏳' },
  { value: 'completed', label: 'Completed', emoji: '✅' },
];

const PRIORITIES = [
  { value: 'all', label: 'All Priorities' },
  { value: 'critical', label: '🚨 Critical' },
  { value: 'high', label: '🔺 High' },
  { value: 'medium', label: '🔸 Medium' },
  { value: 'low', label: '🔹 Low' },
];

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'work', label: '💼 Work' },
  { value: 'personal', label: '👤 Personal' },
  { value: 'coding', label: '💻 Coding' },
  { value: 'shopping', label: '🛒 Shopping' },
  { value: 'health', label: '❤️ Health' },
  { value: 'finance', label: '💵 Finance' },
];

const SORTS = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority Level' },
  { value: 'title', label: 'Alphabetical' },
];

const TaskFilters = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortByChange,
  taskCounts,
}) => {
  return (
    <div className="space-y-4 bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-slate-200/50 dark:border-white/5">
      {/* Search Bar + Dropdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="input-field !pl-11"
          />
        </div>

        {/* Priority Filter */}
        <div className="relative">
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="input-field capitalize cursor-pointer appearance-none"
            title="Filter by priority"
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="input-field capitalize cursor-pointer appearance-none"
            title="Filter by category"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
        </div>
      </div>

      {/* Status Filter Buttons + Sort Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const count = taskCounts?.[f.value] ?? 0;
            const isActive = filter === f.value;

            return (
              <button
                key={f.value}
                type="button"
                onClick={() => onFilterChange(f.value)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold
                  transition-all duration-200 border
                  ${isActive
                    ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 shadow-sm'
                    : 'border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/10 hover:text-slate-700 dark:hover:text-white'
                  }`}
              >
                <span>{f.emoji}</span>
                <span>{f.label}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black
                  ${isActive
                    ? 'bg-primary-200/50 dark:bg-primary-800/50'
                    : 'bg-slate-100 dark:bg-white/10'
                  }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <ArrowUpDown size={14} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
