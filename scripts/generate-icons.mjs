import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'icons');

// アイコン本体のSVG（猫の目 + アンク + エジプト装飾）
function buildSvg(size) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.45;
  const s = size / 512; // スケール係数

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1B3A6B"/>
      <stop offset="100%" stop-color="#0F2040"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#C9A84C" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#C9A84C" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- 背景 -->
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bg)"/>

  <!-- 後光グロー -->
  <circle cx="${cx}" cy="${cy * 0.92}" r="${r * 0.75}" fill="url(#glow)"/>

  <!-- 外周リング -->
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#C9A84C" stroke-width="${2.5 * s}" opacity="0.7"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.93}" fill="none" stroke="#C9A84C" stroke-width="${1 * s}" opacity="0.3"/>

  <!-- 四隅の装飾 -->
  <text x="${size * 0.12}" y="${size * 0.18}" font-size="${18 * s}" fill="#C9A84C" opacity="0.6" text-anchor="middle">✦</text>
  <text x="${size * 0.88}" y="${size * 0.18}" font-size="${18 * s}" fill="#C9A84C" opacity="0.6" text-anchor="middle">✦</text>
  <text x="${size * 0.12}" y="${size * 0.95}" font-size="${18 * s}" fill="#C9A84C" opacity="0.6" text-anchor="middle">✦</text>
  <text x="${size * 0.88}" y="${size * 0.95}" font-size="${18 * s}" fill="#C9A84C" opacity="0.6" text-anchor="middle">✦</text>

  <!-- バステトの猫耳シルエット（上部） -->
  <polygon points="${cx - r*0.38},${cy - r*0.55} ${cx - r*0.55},${cy - r*0.85} ${cx - r*0.18},${cy - r*0.52}"
    fill="#2E5BA8" stroke="#C9A84C" stroke-width="${1.5*s}"/>
  <polygon points="${cx + r*0.38},${cy - r*0.55} ${cx + r*0.55},${cy - r*0.85} ${cx + r*0.18},${cy - r*0.52}"
    fill="#2E5BA8" stroke="#C9A84C" stroke-width="${1.5*s}"/>
  <!-- 耳の内側 -->
  <polygon points="${cx - r*0.35},${cy - r*0.56} ${cx - r*0.50},${cy - r*0.78} ${cx - r*0.20},${cy - r*0.54}"
    fill="#C9A84C" opacity="0.35"/>
  <polygon points="${cx + r*0.35},${cy - r*0.56} ${cx + r*0.50},${cy - r*0.78} ${cx + r*0.20},${cy - r*0.54}"
    fill="#C9A84C" opacity="0.35"/>

  <!-- 顔の輪郭 -->
  <ellipse cx="${cx}" cy="${cy - r*0.18}" rx="${r*0.38}" ry="${r*0.35}" fill="#2E5BA8" stroke="#C9A84C" stroke-width="${1.5*s}"/>

  <!-- 目（エジプト風・細長いアーモンド形） -->
  <!-- 左目 -->
  <ellipse cx="${cx - r*0.16}" cy="${cy - r*0.22}" rx="${r*0.13}" ry="${r*0.08}" fill="#0F2040"/>
  <ellipse cx="${cx - r*0.16}" cy="${cy - r*0.22}" rx="${r*0.1}" ry="${r*0.065}" fill="#E4C46A"/>
  <ellipse cx="${cx - r*0.16}" cy="${cy - r*0.22}" rx="${r*0.06}" ry="${r*0.06}" fill="#050c1a"/>
  <circle cx="${cx - r*0.14}" cy="${cy - r*0.24}" r="${r*0.018}" fill="white"/>
  <!-- 目尻のカール（エジプト風） -->
  <path d="M ${cx - r*0.28} ${cy - r*0.22} Q ${cx - r*0.32} ${cy - r*0.15} ${cx - r*0.26} ${cy - r*0.12}"
    stroke="#C9A84C" stroke-width="${1.5*s}" fill="none" stroke-linecap="round"/>

  <!-- 右目 -->
  <ellipse cx="${cx + r*0.16}" cy="${cy - r*0.22}" rx="${r*0.13}" ry="${r*0.08}" fill="#0F2040"/>
  <ellipse cx="${cx + r*0.16}" cy="${cy - r*0.22}" rx="${r*0.1}" ry="${r*0.065}" fill="#E4C46A"/>
  <ellipse cx="${cx + r*0.16}" cy="${cy - r*0.22}" rx="${r*0.06}" ry="${r*0.06}" fill="#050c1a"/>
  <circle cx="${cx + r*0.18}" cy="${cy - r*0.24}" r="${r*0.018}" fill="white"/>
  <!-- 目尻のカール（エジプト風） -->
  <path d="M ${cx + r*0.28} ${cy - r*0.22} Q ${cx + r*0.32} ${cy - r*0.15} ${cx + r*0.26} ${cy - r*0.12}"
    stroke="#C9A84C" stroke-width="${1.5*s}" fill="none" stroke-linecap="round"/>

  <!-- 鼻 -->
  <ellipse cx="${cx}" cy="${cy - r*0.1}" rx="${r*0.04}" ry="${r*0.03}" fill="#C9A84C"/>

  <!-- 首飾り（胸元装飾） -->
  <path d="M ${cx - r*0.32} ${cy + r*0.06} Q ${cx} ${cy + r*0.18} ${cx + r*0.32} ${cy + r*0.06}"
    stroke="#C9A84C" stroke-width="${3*s}" fill="none"/>
  <circle cx="${cx - r*0.2}" cy="${cy + r*0.1}" r="${r*0.04}" fill="#E4C46A"/>
  <circle cx="${cx}" cy="${cy + r*0.14}" r="${r*0.05}" fill="#E4C46A"/>
  <circle cx="${cx + r*0.2}" cy="${cy + r*0.1}" r="${r*0.04}" fill="#E4C46A"/>

  <!-- アンク（下部中央） -->
  <circle cx="${cx}" cy="${cy + r*0.42}" r="${r*0.1}" fill="none" stroke="#E4C46A" stroke-width="${2.5*s}"/>
  <line x1="${cx}" y1="${cy + r*0.52}" x2="${cx}" y2="${cy + r*0.72}" stroke="#E4C46A" stroke-width="${2.5*s}" stroke-linecap="round"/>
  <line x1="${cx - r*0.12}" y1="${cy + r*0.59}" x2="${cx + r*0.12}" y2="${cy + r*0.59}" stroke="#E4C46A" stroke-width="${2.5*s}" stroke-linecap="round"/>
</svg>`.trim();
}

async function generateIcon(size, filename) {
  const svg = Buffer.from(buildSvg(size));
  await sharp(svg).png().toFile(join(OUT, filename));
  console.log(`✓ ${filename} (${size}x${size})`);
}

await generateIcon(192, 'icon-192.png');
await generateIcon(512, 'icon-512.png');
await generateIcon(180, 'apple-touch-icon.png');
await generateIcon(32,  'favicon-32.png');

// favicon.ico 代わりに favicon.png を public/ に配置
const faviconSvg = Buffer.from(buildSvg(64));
await sharp(faviconSvg).png().toFile(join(OUT, '..', 'favicon.png'));
console.log('✓ favicon.png (64x64)');

console.log('\nAll icons generated!');
