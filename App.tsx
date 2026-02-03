import React, { useState } from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import { Sidebar } from './components/Sidebar';
import { RightSidebar } from './components/RightSidebar';
import { QuickCaptureModal } from './components/QuickCaptureModal';
import { DashboardView } from './components/DashboardView';
import { TimelineView } from './components/TimelineView';
import { FocusModeView } from './components/FocusModeView';
import { TaskCard } from './components/TaskCard';
import { TaskViewMode, TaskStatus, Priority } from './types';

const AppContent = () => {
  const [currentView, setCurrentView] = useState<TaskViewMode>('AGENDA');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getTasksByView, tasks } = useTasks();

  const renderContent = () => {
    switch (currentView) {
      case 'AGENDA':
        return <DashboardView />;
      case 'FOCUS':
        return <FocusModeView />;
      case 'TIMELINE':
        return <TimelineView />;
      case 'ALL_TASKS':
        const allTasks = tasks.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return (
          <div className="space-y-8 pb-20">
             <header>
                 <h1 className="text-4xl font-bold tracking-tight mb-2 text-primary dark:text-chalk">Inbox</h1>
                 <p className="text-ash dark:text-ash/80">All tasks collected ({allTasks.length})</p>
             </header>
             <div className="grid grid-cols-1 gap-4">
               {allTasks.map(t => <TaskCard key={t.id} task={t} />)}
             </div>
          </div>
        );
      case 'OVERDUE':
         const overdueTasks = getTasksByView('OVERDUE');
         return (
           <div className="space-y-8 pb-20">
             <header>
                <h1 className="text-4xl font-bold tracking-tight mb-2 text-red-600">Overdue</h1>
                <p className="text-ash dark:text-ash/80">Tasks requiring immediate attention ({overdueTasks.length})</p>
             </header>
             {overdueTasks.length === 0 ? (
                <div className="glass-card p-12 rounded-2xl text-center">
                    <p className="opacity-60 font-bold text-lg">No overdue tasks. Great job!</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 gap-4">
                 {overdueTasks.map(t => <TaskCard key={t.id} task={t} />)}
                </div>
             )}
           </div>
         );
      default:
        return <DashboardView />;
    }
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  // Focus View takes up full width (except nav sidebar), so we hide the right sidebar
  const isFocusMode = currentView === 'FOCUS';

  return (
    <div className="flex h-screen overflow-hidden relative">
       {/* Ambient Background Effect */}
       <div className="absolute top-0 right-0 w-96 h-96 bg-lemon/20 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none z-0"></div>

       {/* Left Sidebar */}
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        onQuickAdd={() => setIsModalOpen(true)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative z-10 flex flex-col">
        
        {/* Mobile Header */}
        <header className="flex items-center justify-between p-4 md:hidden">
            <span className="text-2xl font-bold text-primary">Blink</span>
            <button className="p-2 bg-white/30 rounded-full" onClick={() => setCurrentView(currentView === 'AGENDA' ? 'ALL_TASKS' : 'AGENDA')}>
                <span className="material-icons-round">menu</span>
            </button>
        </header>

        <div className={`p-6 md:p-12 w-full flex-1 ${isFocusMode ? 'max-w-7xl mx-auto h-full' : 'max-w-5xl mx-auto'}`}>
            {renderContent()}
        </div>
      </main>

      {/* Right Sidebar - Hidden in Focus Mode */}
      {!isFocusMode && <RightSidebar />}

      {/* FAB */}
      <div className="fixed bottom-6 right-6 flex gap-4 z-50">
        <button 
            onClick={toggleDarkMode}
            className="w-12 h-12 bg-white/80 dark:bg-black/80 text-primary dark:text-chalk rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all backdrop-blur-md"
        >
            <span className="material-icons-round">dark_mode</span>
        </button>
        
        <button 
            onClick={() => setIsModalOpen(true)}
            className="w-12 h-12 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all hover:shadow-primary/30"
        >
            <span className="material-icons-round">add</span>
        </button>
      </div>

      <QuickCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

const App = () => {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
};

export default App;