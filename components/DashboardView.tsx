import React from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import { TaskStatus } from '../types';
import { isOverdue, isToday } from '../utils';

export const DashboardView: React.FC = () => {
  const { tasks } = useTasks();

  const activeTasks = tasks.filter(t => t.status === TaskStatus.PENDING);
  const overdueTasks = activeTasks.filter(t => isOverdue(t.deadline)).sort((a,b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  const todayTasks = activeTasks.filter(t => !isOverdue(t.deadline) && isToday(t.deadline)).sort((a,b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  
  // Group rest as "Later" or simple list
  const otherTasks = activeTasks.filter(t => !isOverdue(t.deadline) && !isToday(t.deadline));

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-primary dark:text-chalk">Daily Agenda</h1>
          <p className="text-ash dark:text-ash/80">Focused productivity for {dateStr}</p>
        </div>
      </header>

      {overdueTasks.length > 0 && (
        <div>
          <h3 className="text-xs uppercase font-bold tracking-widest text-red-500 mb-4 px-2">Attention Needed</h3>
          <div className="grid gap-4">
             {overdueTasks.map(task => <TaskCard key={task.id} task={task} />)}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xs uppercase font-bold tracking-widest text-ash mb-4 px-2">Today's Focus</h3>
        {todayTasks.length === 0 && overdueTasks.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl">
                <p className="text-ash font-medium">No tasks for today. Enjoy the calm.</p>
            </div>
        ) : (
            <div className="grid gap-4">
                {todayTasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
        )}
      </div>

      {otherTasks.length > 0 && (
        <div>
           <h3 className="text-xs uppercase font-bold tracking-widest text-ash mb-4 px-2">Up Next</h3>
           <div className="grid gap-4">
               {otherTasks.slice(0, 3).map(task => <TaskCard key={task.id} task={task} />)}
           </div>
        </div>
      )}
    </div>
  );
};