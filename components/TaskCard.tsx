import React from 'react';
import { Task, TaskStatus, Priority } from '../types';
import { getPriorityColor, isOverdue } from '../utils';
import { useTasks } from '../context/TaskContext';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleTaskStatus, deleteTask } = useTasks();
  const overdue = isOverdue(task.deadline) && task.status !== TaskStatus.COMPLETED;

  const formatTime = (dateStr: string) => {
      return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`glass-card p-6 rounded-2xl flex items-center gap-6 group hover:shadow-xl transition-all duration-300 relative overflow-hidden ${task.status === TaskStatus.COMPLETED ? 'opacity-60' : ''}`}>
      {overdue && <div className="absolute left-0 inset-y-0 w-1 bg-red-500"></div>}
      
      <button 
        onClick={() => toggleTaskStatus(task.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
            task.status === TaskStatus.COMPLETED 
            ? 'bg-primary border-primary' 
            : 'border-primary/20 hover:border-lemon hover:bg-lemon/10'
        }`}
      >
        {task.status === TaskStatus.COMPLETED ? (
            <span className="material-icons-round text-white text-sm">check</span>
        ) : (
            <div className="w-2 h-2 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform"></div>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h4 className={`font-semibold text-lg truncate ${task.status === TaskStatus.COMPLETED ? 'line-through text-ash' : ''}`}>
            {task.title}
        </h4>
        <div className="flex items-center gap-4 mt-1">
          <span className={`text-xs font-medium text-ash flex items-center gap-1 ${overdue ? 'text-red-500' : ''}`}>
            <span className="material-icons-round text-sm">{overdue ? 'warning' : 'schedule'}</span> 
            {formatTime(task.deadline)}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
            {task.priority === Priority.HIGH ? 'High Priority' : task.priority}
          </span>
        </div>
      </div>

      <div className="flex items-center -space-x-2">
         {/* Placeholder avatars as per design */}
        <div className="w-8 h-8 rounded-full border-2 border-chalk bg-primary flex items-center justify-center text-[10px] text-white">Me</div>
      </div>
      
      <button 
        onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
        className="opacity-0 group-hover:opacity-100 p-2 text-ash hover:text-red-500 transition-all"
      >
          <span className="material-icons-round">delete</span>
      </button>
    </div>
  );
};