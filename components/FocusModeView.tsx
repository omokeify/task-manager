import React, { useEffect, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskStatus, Priority } from '../types';
import { isOverdue, isToday } from '../utils';

// Simple synthesized chime using Web Audio API to avoid external assets
const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.05, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Play a pleasant ascending major triad (C5 - E5 - G5)
    const now = ctx.currentTime;
    playNote(523.25, now, 0.3);       // C5
    playNote(659.25, now + 0.1, 0.3); // E5
    playNote(783.99, now + 0.2, 0.6); // G5
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

export const FocusModeView: React.FC = () => {
  const { tasks, toggleTaskStatus } = useTasks();
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);

  // Filter tasks: Prioritize Overdue -> Today -> High Priority
  const pendingTasks = tasks.filter(t => t.status === TaskStatus.PENDING);
  
  const sortedTasks = pendingTasks.sort((a, b) => {
    // 1. Overdue first
    const aOverdue = isOverdue(a.deadline);
    const bOverdue = isOverdue(b.deadline);
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    // 2. Today next
    const aToday = isToday(a.deadline);
    const bToday = isToday(b.deadline);
    if (aToday && !bToday) return -1;
    if (!aToday && bToday) return 1;

    // 3. Priority
    const priorityOrder = { [Priority.HIGH]: 0, [Priority.MEDIUM]: 1, [Priority.LOW]: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const activeTask = sortedTasks[0];
  const nextUpTasks = sortedTasks.slice(1, 4);
  const completedToday = tasks.filter(t => t.status === TaskStatus.COMPLETED && isToday(t.updatedAt)).length;

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      playNotificationSound();
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
      if (activeTask) {
          playNotificationSound();
          toggleTaskStatus(activeTask.id);
          setTimeLeft(25 * 60); // Reset timer for next task
          setIsActive(false);
      }
  };

  if (!activeTask) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-24 h-24 bg-eucalyptus rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <span className="material-icons-round text-4xl text-primary">check</span>
              </div>
              <h1 className="text-4xl font-bold text-primary dark:text-chalk mb-4">All Caught Up!</h1>
              <p className="text-ash text-lg max-w-md">You've cleared your high-priority tasks. Take a break or add new tasks to the inbox.</p>
          </div>
      );
  }

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
        
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lemon/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Left Column: Next Up */}
      <aside className="lg:col-span-3 flex flex-col gap-4 order-2 lg:order-1 opacity-60 hover:opacity-100 transition-opacity duration-300">
        <h2 className="text-xs font-bold tracking-widest uppercase text-ash mb-2 px-1">Up Next</h2>
        {nextUpTasks.length === 0 ? (
            <div className="p-4 text-sm text-ash italic">No more tasks queued.</div>
        ) : (
            nextUpTasks.map(task => (
            <div key={task.id} className="glass-card p-4 rounded-xl border border-white/20">
                <span className="text-[10px] font-bold text-primary/60 dark:text-lemon/60 block mb-1 uppercase tracking-wider">{task.priority}</span>
                <p className="font-medium text-sm text-primary dark:text-chalk truncate">{task.title}</p>
            </div>
            ))
        )}
      </aside>

      {/* Center Column: Active Task & Timer */}
      <section className="lg:col-span-6 flex flex-col items-center justify-center text-center order-1 lg:order-2 z-10">
        <div className="w-full glass-card bg-white/40 dark:bg-black/40 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl backdrop-blur-xl border border-white/40 dark:border-white/10">
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-lemon text-xs font-bold mb-8 shadow-lg">
                <span className={`w-1.5 h-1.5 rounded-full bg-lemon ${isActive ? 'animate-pulse' : ''}`}></span>
                FOCUS MODE
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-primary dark:text-white mb-6 leading-tight">
                {activeTask.title}
            </h1>
            
            <p className="text-lg text-ash dark:text-gray-300 mb-10 max-w-lg mx-auto line-clamp-2">
                {activeTask.description || "No additional details provided for this task."}
            </p>

            {/* Timer Display */}
            <div className="flex flex-col items-center mb-12">
                <div className="text-7xl md:text-8xl font-mono font-bold tracking-tighter text-primary dark:text-lemon tabular-nums">
                    {formatTime(timeLeft)}
                </div>
                <div className="text-xs font-bold tracking-[0.3em] text-ash/50 uppercase mt-2">
                    {isActive ? 'Running' : 'Paused'}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
                <button 
                    onClick={() => setIsActive(!isActive)}
                    className="px-8 py-4 bg-white dark:bg-white/10 text-primary dark:text-white font-bold rounded-2xl hover:bg-lemon hover:text-primary transition-all flex items-center gap-2 min-w-[140px] justify-center"
                >
                    <span className="material-icons-round">{isActive ? 'pause' : 'play_arrow'}</span>
                    {isActive ? 'Pause' : 'Start'}
                </button>
                
                <button 
                    onClick={handleComplete}
                    className="px-8 py-4 bg-primary text-lemon font-bold rounded-2xl hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-primary/20 min-w-[140px] justify-center"
                >
                    <span className="material-icons-round">check_circle</span>
                    Complete
                </button>
            </div>
        </div>
      </section>

      {/* Right Column: Stats */}
      <aside className="lg:col-span-3 flex flex-col justify-end gap-6 order-3 opacity-80 h-full">
        <div className="glass-card p-6 rounded-2xl mt-auto">
            <h3 className="text-xs font-bold text-ash uppercase tracking-widest mb-4">Daily Velocity</h3>
            <div className="flex items-end gap-2 h-24">
                <div className="w-full bg-primary/20 rounded-t-md h-[40%]"></div>
                <div className="w-full bg-primary/20 rounded-t-md h-[60%]"></div>
                <div className="w-full bg-primary/20 rounded-t-md h-[30%]"></div>
                <div className="w-full bg-lemon rounded-t-md h-[80%] relative group">
                     <div className="absolute bottom-0 w-full bg-primary/20 h-full"></div>
                </div>
                <div className="w-full bg-primary/20 rounded-t-md h-[50%]"></div>
            </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-eucalyptus flex items-center justify-center shadow-inner">
                <span className="material-icons-round text-primary text-xl">bolt</span>
            </div>
            <div>
                <p className="text-xs font-bold text-ash uppercase">Current Session</p>
                <p className="text-xl font-bold text-primary dark:text-chalk">{completedToday} Tasks Done</p>
            </div>
        </div>
      </aside>
    </div>
  );
};