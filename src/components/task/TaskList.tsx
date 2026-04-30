'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '@/stores/taskStore';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import GoldButton from '@/components/ui/GoldButton';
import EgyptianBorder from '@/components/ui/EgyptianBorder';

export default function TaskList() {
  const [showForm, setShowForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const { playlists, activePlaylistId } = useTaskStore();
  const tasks = playlists.find((p) => p.id === activePlaylistId)?.tasks ?? [];

  const activeTasks = tasks.filter((t) => t.status === 'active');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <EgyptianBorder className="p-4">
              <TaskForm onDone={() => setShowForm(false)} />
            </EgyptianBorder>
          </motion.div>
        )}
      </AnimatePresence>

      {!showForm && (
        <GoldButton onClick={() => setShowForm(true)} size="md" className="w-full">
          ＋ 課題を追加する
        </GoldButton>
      )}

      <div>
        <p className="text-gold/60 text-xs tracking-widest mb-3">
          授かりし課題 — {activeTasks.length}件
        </p>
        {activeTasks.length === 0 ? (
          <p className="text-sand/40 text-sm text-center py-8">
            課題がまだありません。<br />上のボタンから追加してください。
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {activeTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-gold/40 text-xs tracking-widest flex items-center gap-2 mb-2"
          >
            <span>{showCompleted ? '▾' : '▸'}</span>
            完了済み — {completedTasks.length}件
          </button>
          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-2"
              >
                {completedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
