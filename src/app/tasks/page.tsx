'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTaskStore } from '@/stores/taskStore';
import TaskList from '@/components/task/TaskList';
import GoldButton from '@/components/ui/GoldButton';

export default function TasksPage() {
  const { tasks, completionHistory, resetAllCompleted } = useTaskStore();
  const activeCount = tasks.filter((t) => t.status === 'active').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const [confirming, setConfirming] = useState(false);

  const handleReset = () => {
    resetAllCompleted();
    setConfirming(false);
  };

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

      {/* フッターアクション */}
      <div className="max-w-sm mx-auto w-full mt-10 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="flex-1 border-t border-gold/10" />
          <span className="text-gold/20 text-xs">管理</span>
          <span className="flex-1 border-t border-gold/10" />
        </div>

        <Link
          href="/history"
          className="w-full text-center text-sand/50 hover:text-sand text-sm border border-sand/10 hover:border-sand/30 rounded-xl py-3 transition-colors"
        >
          📜 達成履歴を見る（{completionHistory.length}件）
        </Link>

        {!confirming ? (
          <GoldButton
            variant="ghost"
            size="sm"
            className="w-full text-sand/40 border-sand/20 hover:border-sand/40 hover:text-sand/70 disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={() => setConfirming(true)}
            disabled={completedCount === 0}
          >
            ↺ 使用済みを一斉リセット（{completedCount}件）
          </GoldButton>
        ) : (
          <div className="flex flex-col gap-2 border border-gold/30 rounded-xl p-4 bg-lapis/30">
            <p className="text-sand/70 text-sm text-center">
              完了済み課題をすべて「未完了」に戻し、引き済みの記録もリセットします。履歴は残ります。
            </p>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 text-sand/50 text-sm border border-sand/20 rounded-lg py-2 hover:border-sand/40 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleReset}
                className="flex-1 text-gold text-sm border border-gold/40 rounded-lg py-2 hover:bg-gold/10 transition-colors font-bold"
              >
                リセットする
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
