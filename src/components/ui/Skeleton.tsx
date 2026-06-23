interface SkeletonProps {
  variant?: 'text' | 'card' | 'image' | 'productCard';
  className?: string;
  lines?: number;
}

function ShimmerBase({ className = '' }: { className?: string }) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-xl bg-white/[0.06]',
        className,
      ].join(' ')}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
        }}
      />
    </div>
  );
}

function TextSkeleton({ lines = 3 }: { lines: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <ShimmerBase
          key={i}
          className={[
            'h-4',
            i === lines - 1 ? 'w-3/5' : 'w-full',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4">
      <ShimmerBase className="h-5 w-2/3" />
      <div className="space-y-2.5">
        <ShimmerBase className="h-3.5 w-full" />
        <ShimmerBase className="h-3.5 w-full" />
        <ShimmerBase className="h-3.5 w-4/5" />
      </div>
      <div className="flex gap-3 pt-1">
        <ShimmerBase className="h-9 w-24 rounded-lg" />
        <ShimmerBase className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
}

function ImageSkeleton() {
  return <ShimmerBase className="aspect-square w-full rounded-2xl" />;
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
      {/* Image placeholder */}
      <ShimmerBase className="aspect-[4/3] w-full rounded-none" />
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <ShimmerBase className="h-3 w-16 rounded-full" />
        {/* Title */}
        <div className="space-y-2">
          <ShimmerBase className="h-4 w-full" />
          <ShimmerBase className="h-4 w-3/4" />
        </div>
        {/* Rating */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <ShimmerBase key={i} className="h-4 w-4 rounded" />
          ))}
          <ShimmerBase className="h-4 w-10 ml-2 rounded" />
        </div>
        {/* Price */}
        <div className="flex items-center gap-3 pt-1">
          <ShimmerBase className="h-6 w-28 rounded-lg" />
          <ShimmerBase className="h-4 w-20 rounded-lg" />
        </div>
        {/* Button */}
        <ShimmerBase className="h-10 w-full rounded-xl mt-2" />
      </div>
    </div>
  );
}

export default function Skeleton({
  variant = 'text',
  className = '',
  lines = 3,
}: SkeletonProps) {
  return (
    <div className={className}>
      {variant === 'text' && <TextSkeleton lines={lines} />}
      {variant === 'card' && <CardSkeleton />}
      {variant === 'image' && <ImageSkeleton />}
      {variant === 'productCard' && <ProductCardSkeleton />}
    </div>
  );
}
