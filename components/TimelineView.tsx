import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { useTasks } from '../context/TaskContext';
import { Priority, TaskStatus } from '../types';

export const TimelineView: React.FC = () => {
  const { tasks } = useTasks();

  // Colors: High (Lemon/Red), Med (Eucalyptus), Low (Ash)
  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === Priority.HIGH && t.status === TaskStatus.PENDING).length, color: '#FFFA7E' }, 
    { name: 'Medium', value: tasks.filter(t => t.priority === Priority.MEDIUM && t.status === TaskStatus.PENDING).length, color: '#D1E2C0' }, 
    { name: 'Low', value: tasks.filter(t => t.priority === Priority.LOW && t.status === TaskStatus.PENDING).length, color: '#686868' }, 
  ];

  const completedCount = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const pendingCount = tasks.filter(t => t.status === TaskStatus.PENDING).length;
  
  const statusData = [
      { name: 'Done', value: completedCount, color: '#D1E2C0' },
      { name: 'Pending', value: pendingCount, color: '#3B472F' }
  ];

  return (
    <div className="space-y-8 pb-20">
      <header>
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-primary dark:text-chalk">Productivity</h1>
          <p className="text-ash dark:text-ash/80">Analytics and insights</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <div className="glass-card p-6 rounded-2xl flex flex-col h-80">
            <h2 className="text-lg font-bold mb-6 text-primary dark:text-chalk">Workload by Priority</h2>
            <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={60} tick={{ fill: '#686868', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.1)'}} 
                    contentStyle={{ borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                    {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={index === 0 ? '#3B472F' : 'none'} strokeWidth={1} />
                    ))}
                </Bar>
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col h-80">
            <h2 className="text-lg font-bold mb-6 text-primary dark:text-chalk">Completion Status</h2>
            <div className="flex-1 w-full min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                >
                    {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.9)' }} />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-3xl font-bold text-primary dark:text-chalk">{Math.round((completedCount / (tasks.length || 1)) * 100)}%</span>
                <span className="text-xs uppercase tracking-widest opacity-50">Done</span>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};