import type { Metadata, Viewport } from 'next';
import { Cinzel, Noto_Serif_JP } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-display' });
const notoSerifJP = Noto_Serif_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: "Bastet's Box | バステトの箱",
  description: '古代エジプトの猫神バステトが、今日の課題を授けてくれる',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: "Bastet's Box",
  },
};

export const viewport: Viewport = {
  themeColor: '#C9A84C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${cinzel.variable} ${notoSerifJP.variable}`}>
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
