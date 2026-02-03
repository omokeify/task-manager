import React from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskStatus } from '../types';
import { isOverdue, isToday } from '../utils';

export const RightSidebar: React.FC = () => {
  const { tasks } = useTasks();

  // Filter tasks for the visual timeline (Upcoming & Today that are pending)
  const timelineTasks = tasks
    .filter(t => t.status === TaskStatus.PENDING && !isOverdue(t.deadline))
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const completedCount = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <aside className="w-80 flex-shrink-0 border-l border-primary/10 dark:border-white/10 p-8 bg-white/20 dark:bg-black/10 backdrop-blur-md hidden lg:block h-full overflow-y-auto">
      <h2 className="text-lg font-bold mb-8">Timeline</h2>
      
      <div className="relative space-y-8 before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-primary/10 dark:before:bg-white/10">
        {timelineTasks.length === 0 ? (
           <div className="pl-10 text-sm text-ash opacity-60">No upcoming tasks scheduled.</div>
        ) : (
          timelineTasks.map((task, idx) => (
            <div key={task.id} className="relative pl-10 group">
              <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-background-light dark:border-background-dark shadow-sm z-10 ${
                  idx === 0 ? 'bg-lemon' : 'bg-primary'
              }`}></div>
              <p className="text-xs font-bold text-ash uppercase">
                {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <h5 className="font-semibold text-sm truncate">{task.title}</h5>
              {task.tags.length > 0 && (
                 <p className="text-xs text-ash mt-1 opacity-70">{task.tags[0]}</p>
              )}
            </div>
          ))
        )}
        
        {/* Decorative static entry to match design feel */}
        <div className="relative pl-10 opacity-50">
          <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-ash border-4 border-background-light dark:border-background-dark"></div>
          <p className="text-xs font-bold text-ash uppercase">Tommorrow</p>
          <h5 className="font-semibold text-sm">Review Sync</h5>
        </div>
      </div>

      <div className="mt-12">
        <div className="glass-card rounded-2xl p-6 bg-primary/5">
          <h4 className="font-bold text-sm mb-4">Productivity Stats</h4>
          
          {/* Simple CSS Bar Chart Simulation */}
          <div className="flex items-end gap-2 h-20 mb-2">
            <div className="flex-1 bg-primary/20 rounded-t-sm h-[40%]"></div>
            <div className="flex-1 bg-primary/20 rounded-t-sm h-[60%]"></div>
            <div className="flex-1 bg-lemon rounded-t-sm h-[90%] relative group">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Today
                </div>
            </div>
            <div className="flex-1 bg-primary/20 rounded-t-sm h-[50%]"></div>
            <div className="flex-1 bg-primary/20 rounded-t-sm h-[70%]"></div>
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-ash">
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span>
          </div>
          
          <div className="mt-4 pt-4 border-t border-primary/10 dark:border-white/10 flex justify-between items-center">
              <span className="text-xs text-ash">Completion Rate</span>
              <span className="text-sm font-bold text-primary dark:text-lemon">{Math.round(completionRate)}%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};