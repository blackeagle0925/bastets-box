'use client';

import { useState } from 'react';
import { useTaskStore } from '@/stores/taskStore';
import { Task } from '@/types';
import GoldButton from '@/components/ui/GoldButton';

interface TaskFormProps {
  editTarget?: Task;
  onDone: () => void;
}

export default function TaskForm({ editTarget, onDone }: TaskFormProps) {
  const [title, setTitle] = useState(editTarget?.title ?? '');
  const [description, setDescription] = useState(editTarget?.description ?? '');
  const { addTask, updateTask } = useTaskStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editTarget) {
      updateTask(editTarget.id, { title: title.trim(), description: description.trim() || undefined });
    } else {
      addTask(title.trim(), description.trim() || undefined);
    }
    onDone();
  };

  const inputClass =
    'w-full bg-lapis border border-gold/40 rounded-xl px-4 py-3 text-sand placeholder-sand/40 focus:outline-none focus:border-gold transition-colors text-sm';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="text-gold/80 text-xs tracking-wider mb-1 block">課題のタイトル *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例：靴を磨く、人の話を最後まで聞く"
          className={inputClass}
          autoFocus
          maxLength={60}
        />
      </div>
      <div>
        <label className="text-gold/80 text-xs tracking-wider mb-1 block">メモ（任意）</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="詳細や出典など"
          className={`${inputClass} resize-none h-20`}
          maxLength={200}
        />
      </div>
      <div className="flex gap-2 justify-end pt-1">
        <GoldButton type="button" variant="ghost" size="sm" onClick={onDone}>
          キャンセル
        </GoldButton>
        <GoldButton type="submit" size="sm" disabled={!title.trim()}>
          {editTarget ? '保存する' : '登録する'}
        </GoldButton>
      </div>
    </form>
  );
}
