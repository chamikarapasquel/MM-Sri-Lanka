'use client';

import { motion } from 'framer-motion';
import type { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  columns?: 2 | 3 | 4;
}

/* ── Skeleton card shown during loading ──────── */
function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-white/[0.06] bg-[rgba(17,24,39,0.8)]">
      {/* Image placeholder */}
      <div className="aspect-square bg-gradient-to-br from-gray-800/50 to-gray-900/50">
        <div className="flex h-full items-center justify-center">
          <div className="h-20 w-20 rounded-xl bg-gray-700/30" />
        </div>
      </div>
      {/* Content placeholders */}
      <div className="flex flex-col gap-3 p-4">
        <div className="h-3 w-16 rounded-full bg-gray-700/40" />
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-full rounded-full bg-gray-700/40" />
          <div className="h-4 w-3/4 rounded-full bg-gray-700/40" />
        </div>
        <div className="h-3 w-24 rounded-full bg-gray-700/40" />
        <div className="flex items-end justify-between pt-2">
          <div className="flex flex-col gap-1">
            <div className="h-3 w-16 rounded-full bg-gray-700/30" />
            <div className="h-6 w-28 rounded-full bg-gray-700/40" />
          </div>
          <div className="h-10 w-10 rounded-xl bg-gray-700/30" />
        </div>
      </div>
    </div>
  );
}

const containerVariants: any = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ProductGrid({
  products,
  loading = false,
  columns,
}: ProductGridProps) {
  /* Tailwind grid column classes based on optional `columns` prop */
  const colClasses = columns
    ? {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      }[columns]
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  /* ── Loading skeletons ───────────────────────── */
  if (loading) {
    return (
      <div className={`grid ${colClasses} gap-5`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  /* ── Empty state ─────────────────────────────── */
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.12)]">
          <svg
            className="h-10 w-10 text-[#00d4ff]/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 11.625l2.25-2.25M12 11.625l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-300">
          No products found
        </h3>
        <p className="mt-1 max-w-sm text-sm text-gray-500">
          Try adjusting your filters or search to find what you&apos;re looking
          for.
        </p>
      </div>
    );
  }

  /* ── Product grid ────────────────────────────── */
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid ${colClasses} gap-5`}
    >
      {products.map((product) => (
        <motion.div key={product._id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
