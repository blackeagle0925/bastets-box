'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Playlist } from '@/types';
import { drawRandom } from '@/lib/gacha';

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function newPlaylist(title: string): Playlist {
  return {
    id: crypto.randomUUID(),
    title,
    tasks: [],
    todayTask: null,
    drawnIds: [],
    completionHistory: [],
    lastResetMonth: '',
    createdAt: new Date().toISOString(),
  };
}

interface TaskStore {
  playlists: Playlist[];
  activePlaylistId: string | null;

  createPlaylist: (title: string) => void;
  renamePlaylist: (id: string, title: string) => void;
  deletePlaylist: (id: string) => void;
  setActivePlaylist: (id: string) => void;

  addTask: (title: string, description?: string) => void;
  updateTask: (id: string, updates: Partial<Pick<Task, 'title' | 'description'>>) => void;
  deleteTask: (id: string) => void;
  drawTask: () => Task | null;
  completeTask: (id: string) => void;
  resetTask: (id: string) => void;
  resetAllCompleted: () => void;
  resetTodayTask: () => void;
  monthlyReset: () => void;
  checkMonthlyReset: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => {
      const updateActive = (updater: (p: Playlist) => Partial<Playlist>) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === s.activePlaylistId ? { ...p, ...updater(p) } : p
          ),
        }));

      return {
        playlists: [],
        activePlaylistId: null,

        createPlaylist: (title) => {
          const pl = newPlaylist(title);
          set((s) => ({
            playlists: [...s.playlists, pl],
            activePlaylistId: s.activePlaylistId ?? pl.id,
          }));
        },

        renamePlaylist: (id, title) =>
          set((s) => ({
            playlists: s.playlists.map((p) => (p.id === id ? { ...p, title } : p)),
          })),

        deletePlaylist: (id) =>
          set((s) => {
            const remaining = s.playlists.filter((p) => p.id !== id);
            return {
              playlists: remaining,
              activePlaylistId:
                s.activePlaylistId === id ? (remaining[0]?.id ?? null) : s.activePlaylistId,
            };
          }),

        setActivePlaylist: (id) => set({ activePlaylistId: id }),

        addTask: (title, description) => {
          const task: Task = {
            id: crypto.randomUUID(),
            title,
            description,
            createdAt: new Date().toISOString(),
            status: 'active',
          };
          updateActive((p) => ({ tasks: [...p.tasks, task] }));
        },

        updateTask: (id, updates) =>
          updateActive((p) => ({
            tasks: p.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
          })),

        deleteTask: (id) =>
          updateActive((p) => ({
            tasks: p.tasks.filter((t) => t.id !== id),
            drawnIds: p.drawnIds.filter((did) => did !== id),
            todayTask: p.todayTask?.id === id ? null : p.todayTask,
          })),

        drawTask: () => {
          const { playlists, activePlaylistId } = get();
          const pl = playlists.find((p) => p.id === activePlaylistId);
          if (!pl) return null;
          const drawn = drawRandom(pl.tasks, pl.drawnIds);
          if (drawn) {
            updateActive((p) => ({
              todayTask: drawn,
              drawnIds: [...p.drawnIds, drawn.id],
            }));
          }
          return drawn;
        },

        completeTask: (id) => {
          const { playlists, activePlaylistId } = get();
          const task = playlists.find((p) => p.id === activePlaylistId)?.tasks.find((t) => t.id === id);
          const now = new Date().toISOString();
          updateActive((p) => ({
            tasks: p.tasks.map((t) =>
              t.id === id ? { ...t, status: 'completed', completedAt: now } : t
            ),
            todayTask: null,
            completionHistory: task
              ? [...p.completionHistory, { taskId: id, taskTitle: task.title, completedAt: now }]
              : p.completionHistory,
          }));
        },

        resetTask: (id) =>
          updateActive((p) => ({
            tasks: p.tasks.map((t) =>
              t.id === id ? { ...t, status: 'active', completedAt: undefined } : t
            ),
            drawnIds: p.drawnIds.filter((did) => did !== id),
          })),

        resetAllCompleted: () =>
          updateActive((p) => {
            const completedIds = new Set(
              p.tasks.filter((t) => t.status === 'completed').map((t) => t.id)
            );
            return {
              tasks: p.tasks.map((t) =>
                t.status === 'completed' ? { ...t, status: 'active', completedAt: undefined } : t
              ),
              drawnIds: p.drawnIds.filter((id) => !completedIds.has(id)),
            };
          }),

        resetTodayTask: () => updateActive(() => ({ todayTask: null })),

        monthlyReset: () =>
          updateActive((p) => ({
            tasks: p.tasks.map((t) =>
              t.status === 'completed' ? { ...t, status: 'active', completedAt: undefined } : t
            ),
            drawnIds: [],
            todayTask: null,
            lastResetMonth: currentMonth(),
          })),

        checkMonthlyReset: () => {
          const { playlists, activePlaylistId } = get();
          const pl = playlists.find((p) => p.id === activePlaylistId);
          if (pl && pl.lastResetMonth !== currentMonth()) {
            get().monthlyReset();
          }
        },
      };
    },
    {
      name: 'bastet-box-v1',
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        if (version < 2) {
          const old = persisted as Record<string, unknown>;
          const pl: Playlist = {
            id: crypto.randomUUID(),
            title: 'メインリスト',
            tasks: (old.tasks as Task[]) ?? [],
            todayTask: (old.todayTask as Task | null) ?? null,
            drawnIds: (old.drawnIds as string[]) ?? [],
            completionHistory: [],
            lastResetMonth: (old.lastResetMonth as string) ?? '',
            createdAt: new Date().toISOString(),
          };
          return { playlists: [pl], activePlaylistId: pl.id };
        }
        return persisted;
      },
    }
  )
);
