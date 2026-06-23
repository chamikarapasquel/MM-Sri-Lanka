'use client';

import { type ReactNode, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: ModalSize;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

const backdropVariants: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants: any = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 30, delay: 0.05 },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 20,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label={title ?? 'Modal dialog'}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={[
              'relative w-full',
              sizeStyles[size],
              'bg-[#111827]/80 backdrop-blur-xl',
              'border border-white/[0.1]',
              'rounded-2xl shadow-2xl shadow-black/40',
              'max-h-[90vh] overflow-hidden flex flex-col',
            ].join(' ')}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.08]">
              {title ? (
                <h2 className="text-lg font-semibold text-white truncate pr-4">
                  {title}
                </h2>
              ) : (
                <div />
              )}
              <button
                onClick={onClose}
                className={[
                  'shrink-0 p-1.5 rounded-lg',
                  'text-gray-400 hover:text-white',
                  'bg-white/[0.05] hover:bg-white/[0.1]',
                  'transition-all duration-200',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4ff]/50',
                  'cursor-pointer',
                ].join(' ')}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 overflow-y-auto flex-1 text-gray-300">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
