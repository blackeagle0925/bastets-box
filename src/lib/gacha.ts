import { Task } from '@/types';

export function drawRandom(tasks: Task[]): Task | null {
  const active = tasks.filter((t) => t.status === 'active');
  if (active.length === 0) return null;
  return active[Math.floor(Math.random() * active.length)];
}
