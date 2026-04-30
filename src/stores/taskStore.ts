'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, CompletionRecord } from '@/types';
import { drawRandom } from '@/lib/gacha';

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7); // "2026-04"
}

interface TaskStore {
  tasks: Task[];
  todayTask: Task | null;
  drawnIds: string[];
  completionHistory: CompletionRecord[];
  lastResetMonth: string;

  addTask: (title: string, description?: string) => void;
  updateTask: (id: string, updates: Partial<Pick<Task, 'title' | 'description'>>) => void;
  deleteTask: (id: string) => void;
  drawTask: () => Task | null;
  completeTask: (id: string) => void;
  resetTask: (id: string) => void;
  resetTodayTask: () => void;
  monthlyReset: () => void;
  checkMonthlyReset: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      todayTask: null,
      drawnIds: [],
      completionHistory: [],
      lastResetMonth: '',

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
          drawnIds: s.drawnIds.filter((did) => did !== id),
          todayTask: s.todayTask?.id === id ? null : s.todayTask,
        }));
      },

      drawTask: () => {
        const { tasks, drawnIds } = get();
        const drawn = drawRandom(tasks, drawnIds);
        if (drawn) {
          set((s) => ({
            todayTask: drawn,
            drawnIds: [...s.drawnIds, drawn.id],
          }));
        }
        return drawn;
      },

      completeTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        const now = new Date().toISOString();
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, status: 'completed', completedAt: now } : t
          ),
          todayTask: null,
          completionHistory: task
            ? [...s.completionHistory, { taskId: id, taskTitle: task.title, completedAt: now }]
            : s.completionHistory,
        }));
      },

      resetTask: (id) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, status: 'active', completedAt: undefined } : t
          ),
          drawnIds: s.drawnIds.filter((did) => did !== id),
        }));
      },

      resetTodayTask: () => set({ todayTask: null }),

      monthlyReset: () => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.status === 'completed' ? { ...t, status: 'active', completedAt: undefined } : t
          ),
          drawnIds: [],
          todayTask: null,
          lastResetMonth: currentMonth(),
        }));
      },

      checkMonthlyReset: () => {
        if (get().lastResetMonth !== currentMonth()) {
          get().monthlyReset();
        }
      },
    }),
    { name: 'bastet-box-v1' }
  )
);
