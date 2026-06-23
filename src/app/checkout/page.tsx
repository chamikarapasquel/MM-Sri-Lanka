'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { ShieldCheck, ArrowRight, CreditCard, ChevronRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'bank'>('cod');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: 'Colombo',
    postalCode: ''
  });

  const { items, getTotal, clearCart } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      toast.error('Please sign in to complete checkout.');
      router.push('/auth/login?callbackUrl=/checkout');
    }
  }, [mounted, status, router]);

  if (!mounted) return null;

  const subtotal = getTotal();
  const shipping = subtotal > 50000 ? 0 : 500;
  const grandTotal = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode) {
      toast.error('Please complete all shipping address fields.');
      return;
    }

    if (!session?.user) {
      toast.error('Please sign in to place your order.');
      router.push('/auth/login?callbackUrl=/checkout');
      return;
    }

    const toastId = toast.loading('Processing your order...');

    try {
      const orderItems = items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));

      const payload = {
        user: (session.user as any).id,
        items: orderItems,
        shippingAddress: {
          fullName: shippingInfo.fullName,
          phone: shippingInfo.phone,
          street: shippingInfo.address,
          city: shippingInfo.city,
          district: shippingInfo.district,
          postalCode: shippingInfo.postalCode,
        },
        totalAmount: grandTotal,
        shippingCost: shipping,
        discount: 0,
        status: 'pending',
        paymentMethod: paymentMethod === 'bank' ? 'bank_transfer' : paymentMethod,
        paymentStatus: 'pending',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const order = await res.json();
        toast.dismiss(toastId);
        toast.success('Order placed successfully!');
        clearCart();

        // Format WhatsApp invoice summary
        const orderNumber = order.orderNumber || `MM-${order._id.substring(0, 8).toUpperCase()}`;
        const itemsList = orderItems.map((item) => `- ${item.quantity}x ${item.name} (${formatPrice(item.price * item.quantity)})`).join('\n');
        
        const message = `*MM Sri Lanka - New Order Placed!* 🎮💻\n\n` +
          `*Order Number:* ${orderNumber}\n` +
          `*Customer:* ${shippingInfo.fullName}\n` +
          `*Phone:* ${shippingInfo.phone}\n` +
          `*Delivery Address:* ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.district}, ${shippingInfo.postalCode}\n\n` +
          `*Items Ordered:*\n${itemsList}\n\n` +
          `*Subtotal:* ${formatPrice(subtotal)}\n` +
          `*Shipping:* ${shipping === 0 ? 'FREE' : formatPrice(shipping)}\n` +
          `*Total Amount:* ${formatPrice(grandTotal)}\n` +
          `*Payment Method:* ${paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'bank' ? 'Bank Transfer' : 'Credit Card'}\n\n` +
          `Please confirm my order. Thank you!`;

        const whatsappUrl = `https://wa.me/94758273378?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');

        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        toast.dismiss(toastId);
        toast.error(data.error || 'Failed to place order.');
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 py-1">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/cart" className="hover:text-white transition-colors">Cart</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-300">Checkout</span>
      </nav>

      <h1 className="text-3xl font-extrabold text-white font-heading mb-8">
        Billing & Shipping Checkout
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Shipping Form & Payment Choices (Left, 8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Shipping Address */}
          <div className="bg-[#111827]/40 border border-white/5 p-6 rounded-2xl space-y-4 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              1. Delivery Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={shippingInfo.fullName}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                  placeholder="Receiver Name"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00d4ff]/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                  placeholder="077 123 4567"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00d4ff]/40"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Delivery Address
                </label>
                <input
                  type="text"
                  required
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                  placeholder="Street Address, Appartment"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00d4ff]/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Town / City
                </label>
                <input
                  type="text"
                  required
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  placeholder="Colombo 03"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00d4ff]/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  District
                </label>
                <select
                  value={shippingInfo.district}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, district: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00d4ff]/40 cursor-pointer"
                >
                  <option value="Colombo">Colombo</option>
                  <option value="Gampaha">Gampaha</option>
                  <option value="Kalutara">Kalutara</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={shippingInfo.postalCode}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                  placeholder="10000"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00d4ff]/40"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-[#111827]/40 border border-white/5 p-6 rounded-2xl space-y-4 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              2. Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'cod', name: 'Cash On Delivery', desc: 'Pay with cash upon arrival.' },
                { id: 'bank', name: 'Bank Transfer', desc: 'Direct wire deposit transfer.' },
                { id: 'card', name: 'Credit Card', desc: 'Pay online securely.' }
              ].map((method) => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === method.id
                      ? 'border-[#00d4ff] bg-[#00d4ff]/5'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-white">{method.name}</span>
                    {paymentMethod === method.id && (
                      <Check className="w-4 h-4 text-[#00d4ff]" />
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{method.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order review summary panel (Right, 4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-white/5 bg-[#111827]/40 backdrop-blur-md p-6 rounded-2xl space-y-6 shadow-xl">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              Review Items
            </h2>

            {/* Items summary */}
            <div className="max-h-40 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              {items.map((item) => (
                <div key={item.product._id} className="flex gap-3 text-xs text-gray-300">
                  <div className="w-10 h-10 bg-[#0f1629] rounded-lg shrink-0 flex items-center justify-center p-1 border border-white/5">
                    <img src={item.product.image} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white truncate">{item.product.name}</div>
                    <div className="mt-0.5 text-gray-500">Qty: {item.quantity}</div>
                  </div>
                  <span className="font-bold text-right shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-white/5" />

            <div className="space-y-3 text-sm font-medium">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-white font-bold">
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <hr className="border-white/5" />
              <div className="flex justify-between text-base font-bold text-white">
                <span>Total Amount</span>
                <span className="text-lg text-[#00ff88]">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-[#00d4ff]/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
            >
              Place Order
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

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
      </form>
    </div>
  );
}
