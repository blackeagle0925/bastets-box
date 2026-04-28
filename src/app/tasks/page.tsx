'use client';

import Link from 'next/link';
import { useTaskStore } from '@/stores/taskStore';
import TaskList from '@/components/task/TaskList';

export default function TasksPage() {
  const { tasks } = useTaskStore();
  const activeCount = tasks.filter((t) => t.status === 'active').length;

  return (
    <main className="min-h-dvh flex flex-col px-4 pt-8 pb-12">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6 max-w-sm mx-auto w-full">
        <div>
          <h1 className="text-gold font-display tracking-widest text-xl">課題の管理</h1>
          <p className="text-sand/50 text-xs mt-1">
            現在 {activeCount} 件の課題が箱に入っている
          </p>
        </div>
        <Link
          href="/"
          className="text-sand/60 hover:text-sand text-sm border border-sand/20 hover:border-sand/40 rounded-lg px-3 py-1.5 transition-colors"
        >
          ← ガチャへ
        </Link>
      </div>

      {/* セパレーター */}
      <div className="max-w-sm mx-auto w-full flex items-center gap-3 mb-6">
        <span className="flex-1 border-t border-gold/20" />
        <span className="text-gold/40 text-sm">𓃭</span>
        <span className="flex-1 border-t border-gold/20" />
      </div>

      {/* 課題リスト */}
      <div className="max-w-sm mx-auto w-full">
        <TaskList />
      </div>
    </main>
  );
}
