'use client';

import Link from 'next/link';
import { useTaskStore } from '@/stores/taskStore';
import { CompletionRecord } from '@/types';
import EgyptianBorder from '@/components/ui/EgyptianBorder';

function formatMonth(month: string): string {
  const [y, m] = month.split('-');
  return `${y}年${parseInt(m)}月`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function HistoryPage() {
  const { playlists, activePlaylistId } = useTaskStore();
  const activePlaylist = playlists.find((p) => p.id === activePlaylistId);
  const completionHistory = activePlaylist?.completionHistory ?? [];

  const byMonth: Record<string, CompletionRecord[]> = {};
  for (const record of completionHistory) {
    const month = record.completedAt.slice(0, 7);
    if (!byMonth[month]) byMonth[month] = [];
    byMonth[month].push(record);
  }
  const months = Object.keys(byMonth).sort().reverse();

  return (
    <main className="min-h-dvh flex flex-col px-4 pt-8 pb-12">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6 max-w-sm mx-auto w-full">
        <div>
          <h1 className="text-gold font-display tracking-widest text-xl">達成の記録</h1>
          <p className="text-sand/50 text-xs mt-1">
            {activePlaylist ? `${activePlaylist.title} — ` : ''}通算 {completionHistory.length} 件の課題を達成
          </p>
        </div>
        <Link
          href="/tasks"
          className="text-sand/60 hover:text-sand text-sm border border-sand/20 hover:border-sand/40 rounded-lg px-3 py-1.5 transition-colors"
        >
          ← 課題管理
        </Link>
      </div>

      {/* セパレーター */}
      <div className="max-w-sm mx-auto w-full flex items-center gap-3 mb-6">
        <span className="flex-1 border-t border-gold/20" />
        <span className="text-gold/40 text-sm">𓃭</span>
        <span className="flex-1 border-t border-gold/20" />
      </div>

      <div className="max-w-sm mx-auto w-full flex flex-col gap-6">
        {months.length === 0 ? (
          <p className="text-sand/40 text-sm text-center py-16">
            まだ達成した課題がありません。<br />バステトの試練を受けよ、我が子よ。
          </p>
        ) : (
          months.map((month) => {
            const records = byMonth[month].slice().sort(
              (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
            );
            return (
              <div key={month}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-gold/70 text-xs tracking-widest font-bold">
                    {formatMonth(month)}
                  </span>
                  <span className="flex-1 border-t border-gold/15" />
                  <span className="text-sand/40 text-xs">{records.length}件</span>
                </div>
                <EgyptianBorder className="px-4 py-3 divide-y divide-gold/10">
                  {records.map((record, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 gap-3">
                      <span className="text-sand/80 text-sm leading-snug flex-1">
                        {record.taskTitle}
                      </span>
                      <span className="text-sand/30 text-xs shrink-0">
                        {formatDate(record.completedAt)}
                      </span>
                    </div>
                  ))}
                </EgyptianBorder>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
