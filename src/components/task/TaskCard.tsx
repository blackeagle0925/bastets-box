'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types';
import { useTaskStore } from '@/stores/taskStore';
import TaskForm from './TaskForm';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { deleteTask, resetTask } = useTaskStore();

  const isCompleted = task.status === 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`border rounded-xl p-4 ${
        isCompleted
          ? 'border-gold/20 bg-lapis/20 opacity-60'
          : 'border-gold/40 bg-lapis/40'
      }`}
    >
      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TaskForm editTarget={task} onDone={() => setEditing(false)} />
          </motion.div>
        ) : (
          <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm leading-relaxed ${isCompleted ? 'line-through text-sand/50' : 'text-sand'}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sand/50 text-xs mt-1 leading-relaxed">{task.description}</p>
                )}
                {isCompleted && task.completedAt && (
                  <p className="text-gold/40 text-xs mt-1">
                    完了: {new Date(task.completedAt).toLocaleDateString('ja-JP')}
                  </p>
                )}
              </div>

              {isCompleted ? (
                <button
                  onClick={() => resetTask(task.id)}
                  className="text-gold/50 hover:text-gold text-xs border border-gold/30 hover:border-gold/60 rounded-lg px-2 py-1 transition-colors shrink-0"
                  aria-label="ガチャに戻す"
                >
                  ↺ 戻す
                </button>
              ) : (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditing(true)}
                    className="text-gold/60 hover:text-gold text-lg transition-colors"
                    aria-label="編集"
                  >
                    ✏️
                  </button>
                  {confirmDelete ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-400 text-xs border border-red-400/60 rounded px-2 py-1"
                      >
                        削除
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="text-sand/60 text-xs border border-sand/20 rounded px-2 py-1"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="text-sand/40 hover:text-red-400 text-lg transition-colors"
                      aria-label="削除"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
