'use client';

import { useState, useCallback } from 'react';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const imageList =
    images.length > 0 ? images : ['/images/placeholder-product.png'];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoomed) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    },
    [isZoomed]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* ── Main Image ─────────────────────────── */}
      <div
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0f1629] to-[#111827]"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Normal image */}
        <img
          src={imageList[activeIndex]}
          alt={`Product image ${activeIndex + 1}`}
          className={`absolute inset-0 w-full h-full object-contain p-8 transition-opacity duration-300 ${
            isZoomed ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Zoomed image overlay */}
        {isZoomed && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${imageList[activeIndex]})`,
              backgroundSize: '200%',
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}

        {/* Image counter */}
        <div className="absolute bottom-3 right-3 rounded-lg bg-black/50 px-3 py-1 text-xs font-medium text-gray-300 backdrop-blur-sm">
          {activeIndex + 1} / {imageList.length}
        </div>
      </div>

      {/* ── Thumbnails ─────────────────────────── */}
      {imageList.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-200 ${
                activeIndex === idx
                  ? 'border-2 border-[#00d4ff] shadow-[0_0_12px_rgba(0,212,255,0.25)] ring-1 ring-[#00d4ff]/20'
                  : 'border-2 border-white/[0.06] hover:border-white/20 opacity-60 hover:opacity-100'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="absolute inset-0 w-full h-full object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
