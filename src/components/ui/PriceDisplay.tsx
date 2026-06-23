type PriceSize = 'sm' | 'md' | 'lg';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: PriceSize;
  className?: string;
}

function formatLKR(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getDiscountPercent(price: number, originalPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

const priceTextSize: Record<PriceSize, string> = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
};

const originalTextSize: Record<PriceSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const badgeTextSize: Record<PriceSize, string> = {
  sm: 'text-[9px] px-1.5 py-0.5',
  md: 'text-[10px] px-2 py-0.5',
  lg: 'text-xs px-2.5 py-1',
};

export default function PriceDisplay({
  price,
  originalPrice,
  size = 'md',
  className = '',
}: PriceDisplayProps) {
  const hasDiscount = originalPrice !== undefined && originalPrice > price;
  const discountPercent = hasDiscount
    ? getDiscountPercent(price, originalPrice)
    : 0;

  return (
    <div className={`flex items-center flex-wrap gap-2 ${className}`}>
      {/* Current price */}
      <span
        className={[
          'font-bold text-white tracking-tight',
          priceTextSize[size],
        ].join(' ')}
      >
        {formatLKR(price)}
      </span>

      {/* Original price */}
      {hasDiscount && (
        <span
          className={[
            'text-gray-500 line-through',
            originalTextSize[size],
          ].join(' ')}
        >
          {formatLKR(originalPrice)}
        </span>
      )}

      {/* Discount badge */}
      {hasDiscount && discountPercent > 0 && (
        <span
          className={[
            'inline-flex items-center rounded-full font-bold',
            'bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/25',
            badgeTextSize[size],
          ].join(' ')}
        >
          -{discountPercent}%
        </span>
      )}
    </div>
  );
}
