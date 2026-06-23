'use client';

import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'size' | 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-gradient-to-r from-[#00d4ff] via-[#7c3aed] to-[#00d4ff]',
    'bg-[length:200%_100%] bg-left',
    'text-white font-semibold',
    'shadow-[0_0_20px_rgba(0,212,255,0.3)]',
    'hover:bg-right hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]',
    'border border-[#00d4ff]/20',
    'transition-all duration-500',
  ].join(' '),
  secondary: [
    'bg-white/[0.06] backdrop-blur-md',
    'border border-white/[0.12]',
    'text-gray-200',
    'hover:bg-white/[0.12] hover:border-[#00d4ff]/40 hover:text-white',
    'transition-all duration-300',
  ].join(' '),
  ghost: [
    'bg-transparent',
    'text-gray-400',
    'hover:bg-white/[0.08] hover:text-white',
    'transition-all duration-300',
  ].join(' '),
  danger: [
    'bg-gradient-to-r from-red-600 via-red-500 to-rose-600',
    'bg-[length:200%_100%] bg-left',
    'text-white font-semibold',
    'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    'hover:bg-right hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]',
    'border border-red-500/20',
    'transition-all duration-500',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  ...motionProps
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { scale: 1.03 }}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={[
        'relative inline-flex items-center justify-center',
        'font-medium cursor-pointer select-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4ff]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e1a]',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed saturate-50' : '',
        className,
      ].join(' ')}
      {...motionProps}
    >
      {loading && (
        <Loader2 className="animate-spin shrink-0" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
      <span className={loading ? 'opacity-80' : ''}>{children}</span>
    </motion.button>
  );
}
