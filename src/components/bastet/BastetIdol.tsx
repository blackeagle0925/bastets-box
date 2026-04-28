'use client';

import { motion } from 'framer-motion';

interface BastetIdolProps {
  phase: 'idle' | 'drawing' | 'blessing';
}

export default function BastetIdol({ phase }: BastetIdolProps) {
  const isDrawing = phase === 'drawing';
  const isBlessing = phase === 'blessing';

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="relative w-52 h-52"
        animate={
          isBlessing
            ? { scale: [1, 1.08, 1, 1.05, 1], rotate: [0, -2, 2, -1, 0] }
            : isDrawing
            ? { y: [0, -6, 0] }
            : { y: [0, -3, 0] }
        }
        transition={
          isDrawing
            ? { duration: 1.0, repeat: Infinity, ease: 'easeInOut' }
            : isBlessing
            ? { duration: 0.7, ease: 'easeInOut' }
            : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <BastetSvg phase={phase} />

        {/* 祝福のキラキラ */}
        {isBlessing && (
          <>
            {[
              { top: '-8%', right: '4%', delay: 0,   size: 'text-2xl' },
              { top: '5%',  left: '0%',  delay: 0.2, size: 'text-xl' },
              { top: '-4%', left: '30%', delay: 0.4, size: 'text-lg' },
            ].map((s, i) => (
              <motion.span
                key={i}
                className={`absolute ${s.size} pointer-events-none`}
                style={{ top: s.top, right: s.right, left: s.left }}
                animate={{ opacity: [0, 1, 0], y: [0, -24], scale: [0.6, 1.2, 0.6] }}
                transition={{ duration: 1.4, repeat: 3, delay: s.delay }}
              >
                ✨
              </motion.span>
            ))}
          </>
        )}

        {/* 抽選時の光芒 */}
        {isDrawing && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{ opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 1.0, repeat: Infinity }}
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(228,196,106,0.5) 0%, transparent 70%)',
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   バステト神 本体 SVG
   正面向きのエジプト風猫の女神
   ──────────────────────────────────────────────────── */
function BastetSvg({ phase }: { phase: string }) {
  const isDrawing = phase === 'drawing';

  return (
    <svg
      viewBox="0 0 200 220"
      className="w-full h-full drop-shadow-2xl"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#2E5BA8" />
          <stop offset="100%" stopColor="#1B3A6B" />
        </radialGradient>
        <radialGradient id="faceGrad" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#3A6EC0" />
          <stop offset="100%" stopColor="#2050A0" />
        </radialGradient>
        <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── 後光 ── */}
      <circle cx="100" cy="85" r="70" fill="url(#haloGrad)" />
      <motion.circle
        cx="100" cy="85" r="66"
        fill="none" stroke="#C9A84C" strokeWidth="0.8" opacity="0.5"
        animate={isDrawing ? { r: [66, 70, 66], opacity: [0.5, 0.9, 0.5] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <circle cx="100" cy="85" r="58" fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.25" />

      {/* ── 胴体 ── */}
      <ellipse cx="100" cy="175" rx="34" ry="42" fill="url(#bodyGrad)" stroke="#C9A84C" strokeWidth="1.2" />

      {/* 胴体の装飾ライン */}
      <line x1="100" y1="138" x2="100" y2="200" stroke="#C9A84C" strokeWidth="0.6" opacity="0.4" />
      <ellipse cx="100" cy="165" rx="14" ry="18" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.3" />

      {/* ── 腕 ── */}
      {/* 左腕 */}
      <path d="M 68 148 Q 52 158 46 175" stroke="#C9A84C" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* 右腕 (アンク持ち) */}
      <path d="M 132 148 Q 148 158 154 172" stroke="#C9A84C" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* 左手の蓮の花 */}
      <circle cx="44" cy="178" r="5" fill="none" stroke="#E4C46A" strokeWidth="1.5" />
      <path d="M44 183 L44 196 M38 188 L50 188" stroke="#E4C46A" strokeWidth="1.5" strokeLinecap="round" />

      {/* 右手のアンク */}
      <circle cx="154" cy="166" r="7" fill="none" stroke="#E4C46A" strokeWidth="2" filter="url(#glow)" />
      <line x1="154" y1="173" x2="154" y2="190" stroke="#E4C46A" strokeWidth="2" strokeLinecap="round" />
      <line x1="148" y1="180" x2="160" y2="180" stroke="#E4C46A" strokeWidth="2" strokeLinecap="round" />

      {/* ── 首 ── */}
      <rect x="90" y="105" width="20" height="18" rx="8" fill="url(#faceGrad)" stroke="#C9A84C" strokeWidth="1" />

      {/* ── 首飾り（ウシェブティ風） ── */}
      <path d="M 66 118 Q 100 132 134 118" fill="none" stroke="#C9A84C" strokeWidth="2.5" />
      {/* 首飾りの宝石 */}
      {[
        { cx: 74,  cy: 121 },
        { cx: 84,  cy: 125 },
        { cx: 100, cy: 128 },
        { cx: 116, cy: 125 },
        { cx: 126, cy: 121 },
      ].map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={i === 2 ? 4.5 : 3.5} fill="#E4C46A" />
      ))}
      {/* 首飾り第2列 */}
      <path d="M 72 128 Q 100 140 128 128" fill="none" stroke="#C9A84C" strokeWidth="1.5" opacity="0.6" />
      {[76, 88, 100, 112, 124].map((x, i) => (
        <circle key={i} cx={x} cy={130 + (i === 2 ? 3 : i === 1 || i === 3 ? 1.5 : 0)} r="2.5" fill="#C9A84C" opacity="0.8" />
      ))}

      {/* ── 頭部 ── */}
      <ellipse cx="100" cy="82" rx="33" ry="30" fill="url(#faceGrad)" stroke="#C9A84C" strokeWidth="1.5" />

      {/* 頭頂の王冠（簡略化） */}
      <rect x="88" y="52" width="24" height="8" rx="2" fill="#C9A84C" opacity="0.8" />
      <rect x="92" y="44" width="16" height="9" rx="2" fill="#C9A84C" opacity="0.9" />
      <rect x="97" y="37" width="6" height="8" rx="1" fill="#E4C46A" />

      {/* ── 猫耳 ── */}
      {/* 左耳 */}
      <polygon points="68,68 58,44 82,65" fill="url(#faceGrad)" stroke="#C9A84C" strokeWidth="1.5" />
      <polygon points="70,67 62,50 80,65" fill="#C9A84C" opacity="0.3" />
      {/* 右耳 */}
      <polygon points="132,68 142,44 118,65" fill="url(#faceGrad)" stroke="#C9A84C" strokeWidth="1.5" />
      <polygon points="130,67 138,50 120,65" fill="#C9A84C" opacity="0.3" />

      {/* ── 目（エジプト風・アーモンド形）── */}
      {/* 左目 */}
      <ellipse cx="83" cy="82" rx="12" ry="9" fill="#0a1628" stroke="#C9A84C" strokeWidth="1" />
      <ellipse cx="83" cy="82" rx="9" ry="7" fill="#D4A820" />
      <ellipse cx="83" cy="82" rx="5.5" ry="6.5" fill="#050c1a" />
      <circle cx="85" cy="79.5" r="1.8" fill="white" opacity="0.9" />
      {/* 目尻カール（ホルスの目モチーフ） */}
      <path d="M 72 83 Q 68 88 71 93" stroke="#C9A84C" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M 72 83 Q 70 78 73 75" stroke="#C9A84C" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* 右目 */}
      <ellipse cx="117" cy="82" rx="12" ry="9" fill="#0a1628" stroke="#C9A84C" strokeWidth="1" />
      <ellipse cx="117" cy="82" rx="9" ry="7" fill="#D4A820" />
      <ellipse cx="117" cy="82" rx="5.5" ry="6.5" fill="#050c1a" />
      <circle cx="119" cy="79.5" r="1.8" fill="white" opacity="0.9" />
      {/* 目尻カール */}
      <path d="M 128 83 Q 132 88 129 93" stroke="#C9A84C" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M 128 83 Q 130 78 127 75" stroke="#C9A84C" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* ── 鼻と口 ── */}
      <ellipse cx="100" cy="92" rx="3.5" ry="2.5" fill="#C9A84C" />
      <path d="M 96.5 95 Q 100 100 103.5 95" stroke="#C9A84C" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* ── ひげ ── */}
      <line x1="100" y1="93" x2="78" y2="89" stroke="#C9A84C" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
      <line x1="100" y1="95" x2="77" y2="94" stroke="#C9A84C" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
      <line x1="100" y1="93" x2="122" y2="89" stroke="#C9A84C" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
      <line x1="100" y1="95" x2="123" y2="94" stroke="#C9A84C" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />

      {/* ── 足と台座 ── */}
      <rect x="82" y="210" width="12" height="6" rx="3" fill="#C9A84C" opacity="0.7" />
      <rect x="106" y="210" width="12" height="6" rx="3" fill="#C9A84C" opacity="0.7" />
      <rect x="72" y="214" width="56" height="4" rx="2" fill="#C9A84C" opacity="0.4" />

      {/* ── 下部のヒエログリフ風装飾 ── */}
      <text x="100" y="208" textAnchor="middle" fontSize="9" fill="#C9A84C" opacity="0.5" fontFamily="serif">
        𓃭 𓂀 𓆃
      </text>
    </svg>
  );
}
