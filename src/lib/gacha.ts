import { Task } from '@/types';

export function drawRandom(tasks: Task[], excludeIds: string[] = []): Task | null {
  const pool = tasks.filter((t) => t.status === 'active' && !excludeIds.includes(t.id));
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
