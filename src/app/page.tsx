'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '@/stores/taskStore';
import { GachaPhase } from '@/types';
import BastetIdol from '@/components/bastet/BastetIdol';
import BastetSpeech from '@/components/bastet/BastetSpeech';
import GachaButton from '@/components/gacha/GachaButton';
import GachaReveal from '@/components/gacha/GachaReveal';
import {
  BASTET_GREETINGS,
  BASTET_BLESSINGS,
  BASTET_EMPTY,
  BASTET_DRAW_VOICES,
  BASTET_ALL_DRAWN,
  randomLine,
} from '@/lib/bastetLines';

export default function HomePage() {
  const [phase, setPhase] = useState<GachaPhase>('idle');
  const [speech, setSpeech] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { playlists, activePlaylistId, drawTask, completeTask, resetTodayTask, checkMonthlyReset } =
    useTaskStore();

  const activePlaylist = playlists.find((p) => p.id === activePlaylistId);
  const tasks = activePlaylist?.tasks ?? [];
  const todayTask = activePlaylist?.todayTask ?? null;
  const drawnIds = activePlaylist?.drawnIds ?? [];

  const activeTasks = tasks.filter((t) => t.status === 'active');
  const activeCount = activeTasks.length;
  const availableCount = activeTasks.filter((t) => !drawnIds.includes(t.id)).length;
  const allDrawn = activeCount > 0 && availableCount === 0;

  useEffect(() => {
    checkMonthlyReset();
    if (todayTask) {
      setPhase('revealed');
      setSpeech('今日の課題が待っておるぞ、我が子よ。');
    } else if (activeCount === 0) {
      setSpeech(randomLine(BASTET_EMPTY));
    } else if (allDrawn) {
      setSpeech(randomLine(BASTET_ALL_DRAWN));
    } else {
      setSpeech(randomLine(BASTET_GREETINGS));
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDraw = () => {
    if (activeCount === 0) {
      setSpeech(randomLine(BASTET_EMPTY));
      return;
    }
    if (allDrawn) {
      setSpeech(randomLine(BASTET_ALL_DRAWN));
      return;
    }
    setPhase('drawing');
    setSpeech(randomLine(BASTET_DRAW_VOICES));

    timerRef.current = setTimeout(() => {
      const drawn = drawTask();
      if (drawn) {
        setPhase('revealed');
        setSpeech('これが今日そなたに与えられた試練じゃ。');
      } else {
        setPhase('idle');
        setSpeech(randomLine(BASTET_ALL_DRAWN));
      }
    }, 2000);
  };

  const handleComplete = () => {
    if (!todayTask) return;
    completeTask(todayTask.id);
    setPhase('blessing');
    setSpeech(randomLine(BASTET_BLESSINGS));

    timerRef.current = setTimeout(() => {
      setPhase('idle');
      setSpeech(randomLine(BASTET_GREETINGS));
    }, 4000);
  };

  const handleSkip = () => {
    resetTodayTask();
    setPhase('idle');
    setSpeech('また改めて課題を引くがよい、我が子よ。');
  };

  const idolPhase =
    phase === 'blessing' ? 'blessing' : phase === 'drawing' ? 'drawing' : 'idle';

  const drawDisabled = !activePlaylist || activeCount === 0 || allDrawn;
  const drawLabel =
    !activePlaylist
      ? 'プレイリストを作成してください'
      : activeCount === 0
        ? '課題を登録してください'
        : allDrawn
          ? 'すべての課題を引き尽くした'
          : `${availableCount}件の課題が待っている`;

  return (
    <main className="min-h-dvh flex flex-col items-center px-4 pt-10 pb-8 relative overflow-hidden">
      {/* 背景の星 */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {Array.from({ length: 20 }, (_, i) => (
          <span
            key={i}
            className="absolute text-gold/10"
            style={{
              top: `${(i * 17 + 5) % 100}%`,
              left: `${(i * 23 + 8) % 100}%`,
              fontSize: `${6 + (i % 5) * 2}px`,
            }}
          >
            ✦
          </span>
        ))}
      </div>

      {/* ヘッダー */}
      <div className="w-full max-w-sm flex justify-between items-center mb-2 z-10">
        <div>
          <h1 className="text-gold text-lg font-display tracking-widest">Bastet&apos;s Box</h1>
          {activePlaylist && (
            <p className="text-sand/30 text-xs mt-0.5 tracking-wider">{activePlaylist.title}</p>
          )}
        </div>
        <Link
          href="/tasks"
          className="text-sand/60 hover:text-sand text-sm border border-sand/20 hover:border-sand/40 rounded-lg px-3 py-1.5 transition-colors"
        >
          課題管理
        </Link>
      </div>

      {/* バステト神 */}
      <div className="z-10 mt-4 w-full max-w-sm">
        <BastetIdol phase={idolPhase} />
        <BastetSpeech text={speech} visible={!!speech} />
      </div>

      {/* メインコンテンツ */}
      <div className="z-10 mt-8 w-full max-w-sm flex flex-col items-center gap-6">
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-3"
            >
              <GachaButton onClick={handleDraw} disabled={drawDisabled} />
              <p className="text-sand/40 text-xs tracking-wider">{drawLabel}</p>
              {allDrawn && (
                <Link
                  href="/tasks"
                  className="text-gold/60 hover:text-gold text-xs border border-gold/20 hover:border-gold/40 rounded-lg px-3 py-1.5 transition-colors"
                >
                  リセットする →
                </Link>
              )}
            </motion.div>
          )}

          {phase === 'drawing' && (
            <motion.div
              key="drawing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="text-gold text-5xl"
              >
                ☥
              </motion.div>
              <p className="text-gold/60 text-sm tracking-widest">運命を紡ぐ…</p>
            </motion.div>
          )}

          {phase === 'revealed' && todayTask && (
            <motion.div key="revealed" className="w-full">
              <GachaReveal
                task={todayTask}
                onComplete={handleComplete}
                onSkip={handleSkip}
              />
            </motion.div>
          )}

          {phase === 'blessing' && (
            <motion.div
              key="blessing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.p
                className="text-4xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6, repeat: 3 }}
              >
                🎊
              </motion.p>
              <p className="text-gold shimmer text-xl font-bold mt-2">課題を達成！</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
