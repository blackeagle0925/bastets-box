'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from '@/types';
import { drawRandom } from '@/lib/gacha';

interface TaskStore {
  tasks: Task[];
  todayTask: Task | null;
  addTask: (title: string, description?: string) => void;
  updateTask: (id: string, updates: Partial<Pick<Task, 'title' | 'description'>>) => void;
  deleteTask: (id: string) => void;
  drawTask: () => Task | null;
  completeTask: (id: string) => void;
  resetTodayTask: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      todayTask: null,

      addTask: (title, description) => {
        const task: Task = {
          id: crypto.randomUUID(),
          title,
          description,
          createdAt: new Date().toISOString(),
          status: 'active',
        };
        set((s) => ({ tasks: [...s.tasks, task] }));
      },

      updateTask: (id, updates) => {
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      deleteTask: (id) => {
        set((s) => ({
          tasks: s.tasks.filter((t) => t.id !== id),
          todayTask: s.todayTask?.id === id ? null : s.todayTask,
        }));
      },

      drawTask: () => {
        const drawn = drawRandom(get().tasks);
        set({ todayTask: drawn });
        return drawn;
      },

      completeTask: (id) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? { ...t, status: 'completed', completedAt: new Date().toISOString() }
              : t
          ),
          todayTask: null,
        }));
      },

      resetTodayTask: () => set({ todayTask: null }),
    }),
    { name: 'bastet-box-v1' }
  )
);
