'use client';

import { motion } from 'framer-motion';
import { Task } from '@/types';
import EgyptianBorder from '@/components/ui/EgyptianBorder';
import GoldButton from '@/components/ui/GoldButton';

interface GachaRevealProps {
  task: Task;
  onComplete: () => void;
  onSkip: () => void;
}

export default function GachaReveal({ task, onComplete, onSkip }: GachaRevealProps) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="w-full px-4"
    >
      <EgyptianBorder className="p-6 text-center">
        {/* 上部装飾 */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-gold/60 text-lg">━━</span>
          <span className="text-gold text-xl">𓃭</span>
          <span className="text-gold/60 text-lg">━━</span>
        </div>

        <p className="text-gold/70 text-xs tracking-widest mb-3 font-display uppercase">
          Today&apos;s Challenge
        </p>

        {/* 課題タイトル */}
        <motion.h2
          className="text-sand text-xl font-bold leading-relaxed mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {task.title}
        </motion.h2>

        {task.description && (
          <motion.p
            className="text-sand/70 text-sm leading-relaxed mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {task.description}
          </motion.p>
        )}

        {/* 下部装飾 */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-gold/40 flex-1 border-t border-gold/20" />
          <span className="text-gold/60 text-sm">𓂀</span>
          <span className="text-gold/40 flex-1 border-t border-gold/20" />
        </div>

        <div className="flex gap-3 justify-center">
          <GoldButton variant="ghost" size="sm" onClick={onSkip}>
            別の課題へ
          </GoldButton>
          <GoldButton size="sm" onClick={onComplete}>
            ✓ 完了した！
          </GoldButton>
        </div>
      </EgyptianBorder>
    </motion.div>
  );
}
