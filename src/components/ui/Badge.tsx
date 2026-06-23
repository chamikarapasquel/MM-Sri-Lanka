import type { ReactNode } from 'react';

type BadgeVariant = 'new' | 'sale' | 'outOfStock' | 'featured' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  new: [
    'bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/25',
    'shadow-[0_0_10px_rgba(0,255,136,0.15)]',
  ].join(' '),
  sale: [
    'bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/25',
    'shadow-[0_0_10px_rgba(0,212,255,0.15)]',
  ].join(' '),
  outOfStock: [
    'bg-red-500/15 text-red-400 border border-red-500/25',
  ].join(' '),
  featured: [
    'bg-gradient-to-r from-[#7c3aed]/20 to-[#00d4ff]/20',
    'text-purple-300 border border-[#7c3aed]/30',
    'shadow-[0_0_10px_rgba(124,58,237,0.15)]',
  ].join(' '),
  default: [
    'bg-gray-500/15 text-gray-400 border border-gray-500/25',
  ].join(' '),
};

export default function Badge({
  variant = 'default',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center justify-center',
        'px-2.5 py-0.5 rounded-full',
        'text-[10px] font-bold uppercase tracking-wider',
        'whitespace-nowrap',
        variantStyles[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
