'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  StarHalf,
  ShoppingCart,
  Minus,
  Plus,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

import type { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCartStore, type CartProduct } from '@/store/cartStore';
import Modal from '@/components/ui/Modal';

interface QuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const discount = calculateDiscount(product.originalPrice, product.price);
  const isOutOfStock = product.stock === 0;
  const images =
    product.images.length > 0
      ? product.images
      : ['/images/placeholder-product.png'];

  const fullStars = Math.floor(product.ratings.average);
  const hasHalf = product.ratings.average - fullStars >= 0.5;

  const handleAddToCart = () => {
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

    addItem(cartProduct, quantity);
    openCart();
    onClose();
    toast.success(`${product.name} added to cart`);
  };

  const specs = Object.entries(product.specifications ?? {}).slice(0, 6);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
        {/* ── Image Side ───────────────────────── */}
        <div className="flex flex-col gap-4 border-b border-white/[0.06] p-6 md:border-b-0 md:border-r">
          {/* Main image */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-[#0f1629] to-[#111827]">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-8"
            />
            {/* Sale badge */}
            {discount > 0 && (
              <span className="absolute left-3 top-3 rounded-lg bg-red-500/20 px-2.5 py-1 text-xs font-bold text-red-400 backdrop-blur-sm border border-red-500/20">
                -{discount}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === idx
                      ? 'border-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.2)]'
                      : 'border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="absolute inset-0 w-full h-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Details Side ─────────────────────── */}
        <div className="flex flex-col gap-4 p-6">
          {/* Brand */}
          <span className="text-xs font-semibold uppercase tracking-widest text-[#00d4ff]/70">
            {product.brand}
          </span>

          {/* Name */}
          <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl">
            {product.name}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: fullStars }).map((_, i) => (
                <Star
                  key={`f-${i}`}
                  size={16}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
              {hasHalf && (
                <StarHalf
                  size={16}
                  className="fill-amber-400 text-amber-400"
                />
              )}
              {Array.from({
                length: 5 - fullStars - (hasHalf ? 1 : 0),
              }).map((_, i) => (
                <Star key={`e-${i}`} size={16} className="text-gray-600" />
              ))}
            </div>
            <span className="text-sm text-gray-400">
              ({product.ratings.count} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-white">
              {formatPrice(product.price)}
            </span>
            {discount > 0 && (
              <span className="text-base text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-gray-400">
            {product.shortDescription || product.description}
          </p>

          {/* Key Specs */}
          {specs.length > 0 && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Key Specifications
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {specs.map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-[11px] text-gray-500">{key}</span>
                    <span className="text-sm font-medium text-gray-200">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="mt-auto flex flex-col gap-3 pt-4">
            {!isOutOfStock ? (
              <>
                {/* Quantity selector */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">Qty:</span>
                  <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/5">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex h-10 w-10 items-center justify-center text-gray-400 transition-colors hover:text-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center text-sm font-medium text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stock, q + 1))
                      }
                      className="flex h-10 w-10 items-center justify-center text-gray-400 transition-colors hover:text-white"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-600">
                    {product.stock} available
                  </span>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-sm font-bold text-[#0a0e1a] shadow-lg shadow-[#00d4ff]/20 transition-all hover:shadow-[#00d4ff]/30 hover:brightness-110"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </>
            ) : (
              <div className="flex h-12 w-full items-center justify-center rounded-xl border border-red-500/20 bg-red-950/30 text-sm font-semibold text-red-400">
                Out of Stock
              </div>
            )}

            {/* View full details link */}
            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 text-sm font-medium text-[#00d4ff] transition-colors hover:text-[#00d4ff]/80"
            >
              View Full Details
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
