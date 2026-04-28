'use client';

import { motion } from 'framer-motion';

interface GachaButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function GachaButton({ onClick, disabled }: GachaButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="relative w-36 h-36 rounded-full disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* 外側のリング */}
      <span
        className="absolute inset-0 rounded-full border-4 border-gold/60"
        style={{ boxShadow: '0 0 24px rgba(201,168,76,0.4)' }}
      />

      {/* 回転するリング */}
      <motion.span
        className="absolute inset-1 rounded-full border-2 border-dashed border-gold-light/40"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      {/* 背景 */}
      <span className="absolute inset-3 rounded-full bg-gradient-to-br from-lapis to-lapis-dark" />

      {/* 中央のアンク */}
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span className="text-4xl">𓂀</span>
        <span className="text-gold text-xs tracking-widest font-display">DRAW</span>
      </span>
    </motion.button>
  );
}
