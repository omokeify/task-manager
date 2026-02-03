import React, { useState } from 'react';
import { Priority } from '../types';
import { useTasks } from '../context/TaskContext';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({ isOpen, onClose }) => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [deadline, setDeadline] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalDeadline = deadline 
      ? new Date(deadline).toISOString() 
      : new Date(new Date().setHours(23, 59, 0, 0)).toISOString();

    addTask({
      title,
      description,
      priority,
      deadline: finalDeadline,
      tags: [],
    });

    setTitle('');
    setDescription('');
    setPriority(Priority.MEDIUM);
    setDeadline('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      
      <div className="glass-card bg-white/80 dark:bg-black/80 w-full max-w-lg rounded-2xl p-8 shadow-2xl relative z-10 animate-[fadeIn_0.2s_ease-out]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">New Task</h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <span className="material-icons-round">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              autoFocus
              type="text"
              placeholder="What needs to be done?"
              className="w-full bg-transparent border-b-2 border-primary/10 dark:border-white/10 focus:border-primary px-0 py-2 text-2xl font-bold placeholder-ash/40 outline-none transition-colors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            <textarea
              placeholder="Add details..."
              className="w-full bg-black/5 dark:bg-white/5 rounded-xl border-none p-4 text-sm resize-none h-24 focus:ring-2 focus:ring-primary/50 outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-wider opacity-50 mb-1 block">Priority</label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full appearance-none bg-black/5 dark:bg-white/5 rounded-xl border-none px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value={Priority.LOW}>Low</option>
                  <option value={Priority.MEDIUM}>Medium</option>
                  <option value={Priority.HIGH}>High</option>
                </select>
                <span className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">expand_more</span>
              </div>
            </div>

            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-wider opacity-50 mb-1 block">Deadline</label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 rounded-xl border-none px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={!title.trim()}
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};