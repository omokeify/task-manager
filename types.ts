export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string; // ISO Date string
  priority: Priority;
  tags: string[];
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export type TaskViewMode = 'AGENDA' | 'ALL_TASKS' | 'TIMELINE' | 'OVERDUE' | 'FOCUS';

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  getTasksByView: (view: TaskViewMode) => Task[];
}