'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const {
    items,
    removeItem,
    updateQuantity,
    getTotal,
    clearCart
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Reviewing your cart items...</p>
      </div>
    );
  }

  const subtotal = getTotal();
  const shipping = subtotal > 50000 ? 0 : 500;
  const discount = subtotal * (discountPercent / 100);
  const grandTotal = subtotal + shipping - discount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'MMSAVE10') {
      setDiscountPercent(10);
      toast.success('Promo code MMSAVE10 applied! 10% Discount applied.');
    } else {
      toast.error('Invalid promo code. Try MMSAVE10');
    }
  };

  const handleCheckout = () => {
    toast.success('Redirecting to checkout flow...');
    window.location.href = '/checkout';
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-full flex items-center justify-center mx-auto text-gray-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-white font-heading">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-gray-400 max-w-md mx-auto text-sm">
          Before you proceed to checkout, you must add some tech gear or computer parts to your shopping cart.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#00d4ff]/20 transition-all hover:scale-[1.02] text-sm"
        >
          Browse Components <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 py-1">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-300">Shopping Cart</span>
      </nav>

      <h1 className="text-3xl font-extrabold text-white font-heading mb-8">
        Your Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item List (Left, 8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="border border-white/5 bg-[#111827]/40 backdrop-blur-md rounded-2xl overflow-hidden divide-y divide-white/5">
            {items.map((item) => {
              const itemTotal = item.product.price * item.quantity;
              return (
                <div key={item.product._id} className="flex flex-col sm:flex-row items-center gap-6 p-6">
                  {/* Item Image */}
                  <div className="relative w-24 h-24 bg-[#0f1629] rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-3 border border-white/5">
                    <img
                      src={item.product.image || '/images/placeholder-product.png'}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[10px] text-[#00d4ff] font-bold uppercase tracking-wider">
                      {item.product.brand}
                    </span>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="block text-sm font-bold text-white hover:text-[#00d4ff] transition-colors truncate"
                    >
                      {item.product.name}
                    </Link>
                    <div className="text-sm font-bold text-gray-400">
                      {formatPrice(item.product.price)}
                    </div>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right shrink-0 min-w-[100px]">
                    <div className="text-sm font-extrabold text-white">
                      {formatPrice(itemTotal)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      removeItem(item.product._id);
                      toast.success('Removed product from cart');
                    }}
                    className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl border border-transparent hover:border-red-500/10 transition-all shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Cart Helpers Actions */}
          <div className="flex justify-between items-center text-sm font-semibold">
            <Link href="/products" className="text-[#00d4ff] hover:text-[#00d4ff]/80">
              &larr; Continue Shopping
            </Link>
            <button
              onClick={() => {
                clearCart();
                toast.success('Cleared shopping cart');
              }}
              className="text-gray-500 hover:text-white transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary Sidebar (Right, 4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-white/5 bg-[#111827]/40 backdrop-blur-md p-6 rounded-2xl space-y-6 shadow-xl">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              Order Summary
            </h2>

            <div className="space-y-3.5 text-sm font-medium">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping Cost</span>
                <span className="text-white font-bold">
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#00ff88]">
                  <span>Discount ({discountPercent}%)</span>
                  <span className="font-bold">-{formatPrice(discount)}</span>
                </div>
              )}
              <hr className="border-white/5" />
              <div className="flex justify-between text-base font-bold text-white">
                <span>Total (LKR)</span>
                <span className="text-lg text-[#00ff88]">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Coupon Code Form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Promo Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/40"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-xl text-xs font-bold uppercase transition-all"
              >
                Apply
              </button>
            </form>

            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-[#00d4ff]/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Secure details card */}
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-3 text-xs font-medium text-gray-400">
            <ShieldCheck className="w-8 h-8 text-[#00ff88] shrink-0" />
            <div>
              <div className="text-white font-bold">Secure Purchase Guaranteed</div>
              <div className="mt-0.5 leading-relaxed">
                Authorized genuine components with islandwide dealer warranty claims support.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
