export type TaskStatus = 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  completedAt?: string;
  status: TaskStatus;
}

export interface CompletionRecord {
  taskId: string;
  taskTitle: string;
  completedAt: string;
}

export interface Playlist {
  id: string;
  title: string;
  tasks: Task[];
  todayTask: Task | null;
  drawnIds: string[];
  completionHistory: CompletionRecord[];
  lastResetMonth: string;
  createdAt: string;
}

export type GachaPhase = 'idle' | 'drawing' | 'revealed' | 'blessing';
