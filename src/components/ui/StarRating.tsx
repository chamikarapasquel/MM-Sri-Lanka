'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

type StarSize = 'sm' | 'md' | 'lg';

interface StarRatingProps {
  rating: number;
  count?: number;
  onRate?: (rating: number) => void;
  interactive?: boolean;
  size?: StarSize;
}

const sizeMap: Record<StarSize, number> = {
  sm: 14,
  md: 18,
  lg: 24,
};

export default function StarRating({
  rating,
  count,
  onRate,
  interactive = false,
  size = 'md',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const iconSize = sizeMap[size];
  const displayRating = hoverRating || rating;

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const starIndex = i + 1;
          const isFilled = starIndex <= Math.floor(displayRating);
          const isHalf =
            !isFilled &&
            starIndex === Math.ceil(displayRating) &&
            displayRating % 1 >= 0.25;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRate?.(starIndex)}
              onMouseEnter={() => interactive && setHoverRating(starIndex)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={[
                'relative p-0 border-none bg-transparent',
                interactive
                  ? 'cursor-pointer hover:scale-125 transition-transform duration-150'
                  : 'cursor-default',
                'focus:outline-none',
              ].join(' ')}
              aria-label={
                interactive ? `Rate ${starIndex} star${starIndex > 1 ? 's' : ''}` : undefined
              }
            >
              {/* Background star (empty) */}
              <Star
                size={iconSize}
                className="text-gray-600"
                strokeWidth={1.5}
              />

              {/* Filled overlay */}
              {(isFilled || isHalf) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: isHalf ? '50%' : '100%' }}
                >
                  <Star
                    size={iconSize}
                    className="text-amber-400 fill-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.4)]"
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Rating number */}
      {rating > 0 && (
        <span
          className={[
            'font-medium text-amber-400/90 ml-1',
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm',
          ].join(' ')}
        >
          {rating.toFixed(1)}
        </span>
      )}

      {/* Review count */}
      {count !== undefined && (
        <span
          className={[
            'text-gray-500',
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs',
          ].join(' ')}
        >
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
