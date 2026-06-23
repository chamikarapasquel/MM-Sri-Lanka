'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

import type { Product } from '@/types';
import ProductCard from './ProductCard';

import 'swiper/css';
import 'swiper/css/navigation';

interface ProductCarouselProps {
  products: Product[];
  title: string;
  viewAllLink?: string;
}

export default function ProductCarousel({
  products,
  title,
  viewAllLink,
}: ProductCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  if (products.length === 0) return null;

  return (
    <section className="relative">
      {/* ── Header ──────────────────────────────── */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {title}
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88]" />
        </div>

        <div className="flex items-center gap-3">
          {/* Nav arrows */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 backdrop-blur-sm transition-all hover:border-[#00d4ff]/30 hover:bg-white/10 hover:text-white"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 backdrop-blur-sm transition-all hover:border-[#00d4ff]/30 hover:bg-white/10 hover:text-white"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>

          {/* View All link */}
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="ml-2 hidden items-center gap-1.5 rounded-xl border border-[#00d4ff]/20 bg-[rgba(0,212,255,0.06)] px-4 py-2.5 text-sm font-medium text-[#00d4ff] backdrop-blur-sm transition-all hover:border-[#00d4ff]/40 hover:bg-[rgba(0,212,255,0.12)] sm:flex"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* ── Swiper Carousel ─────────────────────── */}
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          480: { slidesPerView: 1.5, spaceBetween: 16 },
          640: { slidesPerView: 2, spaceBetween: 18 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
          1280: { slidesPerView: 4, spaceBetween: 20 },
        }}
        className="!overflow-visible"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id} className="!h-auto">
            <div className="pb-2">
              <ProductCard product={product} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Mobile "View All" link */}
      {viewAllLink && (
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href={viewAllLink}
            className="flex items-center gap-1.5 rounded-xl border border-[#00d4ff]/20 bg-[rgba(0,212,255,0.06)] px-5 py-2.5 text-sm font-medium text-[#00d4ff] backdrop-blur-sm transition-all hover:border-[#00d4ff]/40 hover:bg-[rgba(0,212,255,0.12)]"
          >
            View All Products
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </section>
  );
}
