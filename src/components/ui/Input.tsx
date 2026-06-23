'use client';

import {
  type InputHTMLAttributes,
  type ReactNode,
  useState,
  useId,
} from 'react';
import type { LucideIcon } from 'lucide-react';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  className?: string;
}

export default function Input({
  label,
  error,
  icon: Icon,
  className = '',
  type = 'text',
  placeholder,
  required,
  name,
  id: propId,
  onFocus,
  onBlur,
  value,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = propId ?? generatedId;
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== '';

  const showFloatingLabel = isFocused || hasValue;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Input wrapper */}
      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div
            className={[
              'absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none transition-colors duration-300',
              isFocused
                ? 'text-[#00d4ff]'
                : error
                  ? 'text-red-400'
                  : 'text-gray-500',
            ].join(' ')}
          >
            <Icon size={18} />
          </div>
        )}

        {/* Input element */}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          required={required}
          placeholder={showFloatingLabel ? placeholder : ' '}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          className={[
            'peer w-full rounded-xl bg-white/[0.06] backdrop-blur-md',
            'text-white text-sm placeholder:text-gray-600',
            'outline-none transition-all duration-300',
            'border',
            Icon ? 'pl-11 pr-4' : 'px-4',
            label ? 'pt-5 pb-2' : 'py-3',
            // Border states
            error
              ? 'border-red-500/60 focus:border-red-400 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : [
                  'border-white/[0.1]',
                  'focus:border-[#00d4ff]/60 focus:shadow-[0_0_15px_rgba(0,212,255,0.15)]',
                  'hover:border-white/[0.2]',
                ].join(' '),
          ].join(' ')}
          {...rest}
        />

        {/* Floating label */}
        {label && (
          <label
            htmlFor={inputId}
            className={[
              'absolute transition-all duration-300 pointer-events-none select-none',
              Icon ? 'left-11' : 'left-4',
              showFloatingLabel
                ? 'top-1.5 text-[10px] font-medium'
                : 'top-1/2 -translate-y-1/2 text-sm',
              // Color
              error
                ? 'text-red-400'
                : isFocused
                  ? 'text-[#00d4ff]'
                  : 'text-gray-500',
            ].join(' ')}
          >
            {label}
            {required && <span className="text-red-400 ml-0.5">*</span>}
          </label>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5 pl-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
