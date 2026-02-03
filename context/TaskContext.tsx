import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Task, TaskContextType, TaskStatus, TaskViewMode, Priority } from '../types';
import { generateId, isOverdue, isToday } from '../utils';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = 'focuscore_tasks_v1';

// Seed data for initial load if empty
const SEED_DATA: Task[] = [
  {
    id: '1',
    title: 'Review System Architecture',
    description: 'Analyze the current builder model and identifying bottlenecks.',
    deadline: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(), // Today 5pm
    priority: Priority.HIGH,
    tags: ['Architecture', 'Engineering'],
    status: TaskStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Update React Dependencies',
    description: 'Ensure all packages are on the latest stable versions.',
    deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    priority: Priority.MEDIUM,
    tags: ['Maintenance'],
    status: TaskStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Draft API Documentation',
    description: 'Document the new endpoints for the mobile team.',
    deadline: new Date(Date.now() - 86400000).toISOString(), // Yesterday (Overdue)
    priority: Priority.HIGH,
    tags: ['Docs'],
    status: TaskStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse tasks", e);
        setTasks(SEED_DATA);
      }
    } else {
      setTasks(SEED_DATA);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = (taskInput: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newTask: Task = {
      ...taskInput,
      id: generateId(),
      status: TaskStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === TaskStatus.PENDING ? TaskStatus.COMPLETED : TaskStatus.PENDING,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
  };

  const getTasksByView = (view: TaskViewMode): Task[] => {
    switch (view) {
      case 'AGENDA':
        return tasks.filter(
          (t) =>
            t.status === TaskStatus.PENDING && (isToday(t.deadline) || isOverdue(t.deadline))
        ).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      
      case 'OVERDUE':
        return tasks.filter((t) => t.status === TaskStatus.PENDING && isOverdue(t.deadline));
      
      case 'ALL_TASKS':
        return tasks; // Further filtering can be done in the component
      
      case 'TIMELINE':
        // Return all tasks for chart visualization
        return tasks;
      
      default:
        return tasks;
    }
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, toggleTaskStatus, deleteTask, updateTask, getTasksByView }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};