'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface BastetSpeechProps {
  text: string;
  visible: boolean;
}

export default function BastetSpeech({ text, visible }: BastetSpeechProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="relative mx-4 mt-3"
        >
          <div className="bg-lapis border border-gold/50 rounded-2xl px-5 py-4 text-sand text-sm leading-relaxed text-center font-serif shadow-lg">
            {/* 吹き出しの三角 */}
            <span
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: '10px solid #1B3A6B',
              }}
            />
            {text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
