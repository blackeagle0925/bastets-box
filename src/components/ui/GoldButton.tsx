'use client';

import { ButtonHTMLAttributes } from 'react';

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function GoldButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: GoldButtonProps) {
  const base =
    'font-serif font-bold tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gold text-lapis-dark border-2 border-gold-light hover:bg-gold-light shadow-lg shadow-gold/20',
    ghost:
      'bg-transparent text-gold border-2 border-gold hover:bg-gold/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
