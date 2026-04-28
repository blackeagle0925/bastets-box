interface EgyptianBorderProps {
  children: React.ReactNode;
  className?: string;
}

export default function EgyptianBorder({ children, className = '' }: EgyptianBorderProps) {
  return (
    <div
      className={`relative border-2 border-gold/60 rounded-2xl bg-lapis/40 backdrop-blur-sm ${className}`}
      style={{
        boxShadow: '0 0 20px rgba(201, 168, 76, 0.15), inset 0 0 20px rgba(201, 168, 76, 0.05)',
      }}
    >
      {/* 四隅の装飾 */}
      <span className="absolute -top-1 -left-1 text-gold text-xs">✦</span>
      <span className="absolute -top-1 -right-1 text-gold text-xs">✦</span>
      <span className="absolute -bottom-1 -left-1 text-gold text-xs">✦</span>
      <span className="absolute -bottom-1 -right-1 text-gold text-xs">✦</span>
      {children}
    </div>
  );
}
