'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTaskStore } from '@/stores/taskStore';
import TaskList from '@/components/task/TaskList';
import GoldButton from '@/components/ui/GoldButton';

export default function TasksPage() {
  const {
    playlists,
    activePlaylistId,
    createPlaylist,
    renamePlaylist,
    deletePlaylist,
    setActivePlaylist,
    resetAllCompleted,
  } = useTaskStore();

  const activePlaylist = playlists.find((p) => p.id === activePlaylistId);
  const activeCount = activePlaylist?.tasks.filter((t) => t.status === 'active').length ?? 0;
  const completedCount = activePlaylist?.tasks.filter((t) => t.status === 'completed').length ?? 0;
  const completionHistory = activePlaylist?.completionHistory ?? [];

  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const newNameRef = useRef<HTMLInputElement>(null);
  const editNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (creatingPlaylist) newNameRef.current?.focus();
  }, [creatingPlaylist]);

  useEffect(() => {
    if (editingId) editNameRef.current?.focus();
  }, [editingId]);

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    createPlaylist(name);
    setNewName('');
    setCreatingPlaylist(false);
  };

  const handleRename = () => {
    const name = editingName.trim();
    if (!name || !editingId) return;
    renamePlaylist(editingId, name);
    setEditingId(null);
  };

  const handleDelete = () => {
    if (!activePlaylistId) return;
    deletePlaylist(activePlaylistId);
    setConfirmDelete(false);
  };

  const handleReset = () => {
    resetAllCompleted();
    setConfirmReset(false);
  };

  return (
    <main className="min-h-dvh flex flex-col px-4 pt-8 pb-12">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-5 max-w-sm mx-auto w-full">
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

      {/* プレイリストタブ */}
      <div className="max-w-sm mx-auto w-full mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => {
                setActivePlaylist(pl.id);
                setEditingId(null);
                setConfirmDelete(false);
              }}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                pl.id === activePlaylistId
                  ? 'border-gold text-gold bg-gold/10'
                  : 'border-sand/20 text-sand/50 hover:border-sand/40 hover:text-sand/70'
              }`}
            >
              {pl.title}
            </button>
          ))}

          {creatingPlaylist ? null : (
            <button
              onClick={() => setCreatingPlaylist(true)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-dashed border-gold/30 text-gold/50 hover:border-gold/60 hover:text-gold/70 transition-colors"
            >
              ＋
            </button>
          )}
        </div>

        {/* 新規プレイリスト作成フォーム */}
        {creatingPlaylist && (
          <div className="flex gap-2 mt-3">
            <input
              ref={newNameRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
                if (e.key === 'Escape') { setCreatingPlaylist(false); setNewName(''); }
              }}
              placeholder="プレイリスト名"
              className="flex-1 text-sm bg-lapis/50 border border-gold/30 rounded-lg px-3 py-1.5 text-sand placeholder-sand/30 focus:outline-none focus:border-gold"
            />
            <button
              onClick={handleCreate}
              className="text-gold text-sm border border-gold/40 rounded-lg px-3 py-1.5 hover:bg-gold/10 transition-colors"
            >
              作成
            </button>
            <button
              onClick={() => { setCreatingPlaylist(false); setNewName(''); }}
              className="text-sand/50 text-sm border border-sand/20 rounded-lg px-3 py-1.5 hover:border-sand/40 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* アクティブプレイリストの編集 */}
        {activePlaylist && !creatingPlaylist && (
          <div className="mt-2 flex items-center gap-2">
            {editingId === activePlaylistId ? (
              <>
                <input
                  ref={editNameRef}
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename();
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="flex-1 text-xs bg-lapis/50 border border-gold/30 rounded-lg px-2 py-1 text-sand focus:outline-none focus:border-gold"
                />
                <button
                  onClick={handleRename}
                  className="text-gold text-xs border border-gold/40 rounded-lg px-2 py-1 hover:bg-gold/10 transition-colors"
                >
                  保存
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-sand/50 text-xs border border-sand/20 rounded-lg px-2 py-1 transition-colors"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setEditingId(activePlaylistId); setEditingName(activePlaylist.title); }}
                  className="text-gold/40 hover:text-gold/70 text-xs transition-colors flex items-center gap-1"
                >
                  ✏️ 名前を変更
                </button>
                {playlists.length > 1 && (
                  <>
                    {confirmDelete ? (
                      <div className="flex gap-1 ml-auto">
                        <button
                          onClick={handleDelete}
                          className="text-red-400 text-xs border border-red-400/50 rounded-lg px-2 py-1 hover:bg-red-400/10 transition-colors"
                        >
                          削除する
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="text-sand/50 text-xs border border-sand/20 rounded-lg px-2 py-1 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="text-sand/30 hover:text-red-400 text-xs transition-colors ml-auto"
                      >
                        削除
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* セパレーター */}
      <div className="max-w-sm mx-auto w-full flex items-center gap-3 mb-6">
        <span className="flex-1 border-t border-gold/20" />
        <span className="text-gold/40 text-sm">𓃭</span>
        <span className="flex-1 border-t border-gold/20" />
      </div>

      {/* プレイリストなし */}
      {playlists.length === 0 && (
        <div className="max-w-sm mx-auto w-full text-center py-16">
          <p className="text-sand/40 text-sm mb-4">プレイリストがまだありません</p>
          <button
            onClick={() => setCreatingPlaylist(true)}
            className="text-gold border border-gold/40 rounded-xl px-6 py-3 hover:bg-gold/10 transition-colors text-sm"
          >
            ＋ 最初のプレイリストを作る
          </button>
        </div>
      )}

      {/* 課題リスト */}
      {activePlaylist && (
        <div className="max-w-sm mx-auto w-full">
          <TaskList />
        </div>
      )}

      {/* フッターアクション */}
      {activePlaylist && (
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

          {!confirmReset ? (
            <GoldButton
              variant="ghost"
              size="sm"
              className="w-full text-sand/40 border-sand/20 hover:border-sand/40 hover:text-sand/70 disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => setConfirmReset(true)}
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
                  onClick={() => setConfirmReset(false)}
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
      )}
    </main>
  );
}
