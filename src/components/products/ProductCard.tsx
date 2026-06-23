'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Star,
  StarHalf,
  Eye,
  Package,
} from 'lucide-react';
import toast from 'react-hot-toast';

import type { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCartStore, type CartProduct } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  const stars: React.ReactNode[] = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star
        key={`full-${i}`}
        size={14}
        className="fill-amber-400 text-amber-400"
      />
    );
  }
  if (hasHalf) {
    stars.push(
      <StarHalf
        key="half"
        size={14}
        className="fill-amber-400 text-amber-400"
      />
    );
  }
  const remaining = 5 - fullStars - (hasHalf ? 1 : 0);
  for (let i = 0; i < remaining; i++) {
    stars.push(
      <Star key={`empty-${i}`} size={14} className="text-gray-600" />
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">{stars}</div>
      <span className="text-xs text-gray-500">({count})</span>
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product._id));

  const discount = calculateDiscount(product.originalPrice, product.price);
  const isOutOfStock = product.stock === 0;
  const mainImage =
    !imgError && product.images.length > 0
      ? product.images[0]
      : '/images/placeholder-product.png';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    const cartProduct: CartProduct = {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0] ?? '',
      brand: product.brand,
      stock: product.stock,
    };

    addItem(cartProduct, 1);
    openCart();
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product._id);
    toast.success(
      isInWishlist ? 'Removed from wishlist' : 'Added to wishlist'
    );
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[rgba(17,24,39,0.8)] shadow-lg shadow-black/20 backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.08)] hover:border-white/[0.12]"
    >
      {/* ── Image Area ─────────────────────────────── */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#0f1629] to-[#111827]"
      >
        {/* Badges (top-left) */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {/* Category */}
          <span className="rounded-md bg-[rgba(0,212,255,0.12)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#00d4ff] backdrop-blur-sm border border-[rgba(0,212,255,0.15)]">
            {product.category}
          </span>
          {/* New badge */}
          {product.isNewArrival && (
            <span className="rounded-md bg-[rgba(0,255,136,0.12)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#00ff88] backdrop-blur-sm border border-[rgba(0,255,136,0.15)]">
              New
            </span>
          )}
          {/* Sale badge */}
          {discount > 0 && (
            <span className="rounded-md bg-[rgba(239,68,68,0.15)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-400 backdrop-blur-sm border border-[rgba(239,68,68,0.2)]">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist heart (top-right) */}
        <button
          onClick={handleToggleWishlist}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-110 hover:bg-black/60"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={16}
            className={
              isInWishlist
                ? 'fill-red-500 text-red-500'
                : 'text-gray-300 hover:text-red-400'
            }
          />
        </button>

        {/* Product image */}
        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="h-full w-full"
        >
          <img
            src={mainImage}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-contain p-6"
            onError={() => setImgError(true)}
          />
        </motion.div>

        {/* Out-of-stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
            <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/60 px-4 py-2 backdrop-blur-sm">
              <Package size={16} className="text-red-400" />
              <span className="text-sm font-semibold text-red-300">
                Out of Stock
              </span>
            </div>
          </div>
        )}

        {/* Quick View overlay (shown on hover) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered && !isOutOfStock ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
        >
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md border border-white/15">
            <Eye size={16} />
            Quick View
          </div>
        </motion.div>
      </Link>

      {/* ── Content Area ───────────────────────────── */}
      <div className="flex flex-1 flex-col gap-2 p-4 pt-3.5">
        {/* Brand */}
        <span className="text-[11px] font-medium uppercase tracking-widest text-[#00d4ff]/70">
          {product.brand}
        </span>

        {/* Name */}
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-gray-100 transition-colors hover:text-[#00d4ff]"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <StarRating
          rating={product.ratings.average}
          count={product.ratings.count}
        />

        {/* Price & Cart */}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex flex-col">
            {discount > 0 && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-lg font-bold text-white">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Add to Cart – slides up on hover */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isHovered && !isOutOfStock ? 1 : 0,
              y: isHovered && !isOutOfStock ? 0 : 10,
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-[#0a0e1a] shadow-lg shadow-[#00d4ff]/20 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </motion.button>
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00d4ff]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
}
