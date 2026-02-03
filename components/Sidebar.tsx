import React from 'react';
import { TaskViewMode } from '../types';
import { useTasks } from '../context/TaskContext';

interface SidebarProps {
  currentView: TaskViewMode;
  setView: (view: TaskViewMode) => void;
  onQuickAdd: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const { tasks } = useTasks();
  const inboxCount = tasks.filter(t => t.status === 'PENDING').length;
  
  const navItems = [
    { id: 'FOCUS', label: 'Focus Mode', icon: 'center_focus_strong', count: null, special: true },
    { id: 'AGENDA', label: 'Today', icon: 'calendar_today', count: null },
    { id: 'ALL_TASKS', label: 'Inbox', icon: 'inbox', count: inboxCount },
    { id: 'TIMELINE', label: 'Productivity', icon: 'bar_chart', count: null },
    { id: 'OVERDUE', label: 'Overdue', icon: 'warning', count: tasks.filter(t => new Date(t.deadline) < new Date() && t.status === 'PENDING').length, highlight: true },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-primary/10 dark:border-white/10 flex flex-col bg-white/30 dark:bg-black/20 backdrop-blur-md h-full hidden md:flex z-20">
      <div className="p-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-lemon rounded-full flex items-center justify-center">
             <span className="material-icons-round text-primary text-sm">bolt</span>
          </div>
          <span className="text-2xl font-bold tracking-tight uppercase text-primary dark:text-chalk">Blink</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as TaskViewMode)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentView === item.id
                ? 'bg-primary text-white font-medium shadow-lg shadow-primary/20'
                : item.special 
                  ? 'bg-lemon/50 text-primary hover:bg-lemon' 
                  : 'hover:bg-white/50 dark:hover:bg-white/10 text-ash dark:text-chalk/70'
            }`}
          >
            <span className={`material-icons-round text-[20px] ${item.highlight && currentView !== item.id ? 'text-red-500' : ''}`}>
                {item.icon}
            </span>
            {item.label}
            {item.count !== null && item.count > 0 && (
              <span className={`ml-auto px-2 py-0.5 rounded text-[10px] font-bold ${
                currentView === item.id 
                  ? 'bg-white/20 text-white' 
                  : item.highlight ? 'text-red-500 bg-red-100' : 'bg-lemon text-primary'
              }`}>
                {item.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="glass-card rounded-xl p-4">
          <p className="text-[10px] uppercase font-bold text-ash mb-2">Workspace</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-lemon"></div>
              <span className="opacity-80">Design System</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="opacity-80">Alpha Release</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};