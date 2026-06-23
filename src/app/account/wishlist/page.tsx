'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatPrice } from '@/lib/utils';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore, type CartProduct } from '@/store/cartStore';

// Fallback local products if API doesn't find them (e.g. dummy hardcoded homepage products)
const FALLBACK_PRODUCTS = [
  {
    _id: 'prod1',
    name: 'AMD Ryzen 7 7800X3D 8-Core 16-Thread Processor',
    slug: 'amd-ryzen-7-7800x3d-8-core-16-thread-processor',
    price: 115000,
    brand: 'AMD',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    stock: 12
  },
  {
    _id: 'prod2',
    name: 'ASUS ROG Strix GeForce RTX 4070 Ti Super 16GB GDDR6X',
    slug: 'asus-rog-strix-geforce-rtx-4070-ti-super-16gb-gddr6x',
    price: 345000,
    brand: 'ASUS',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    stock: 8
  },
  {
    _id: 'prod3',
    name: 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz CL36',
    slug: 'corsair-vengeance-rgb-ddr5-32gb-2x16gb-6000mhz-cl36',
    price: 45000,
    brand: 'Corsair',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    stock: 25
  },
  {
    _id: 'prod4',
    name: 'Samsung 990 Pro 2TB PCIe 4.0 NVMe M.2 SSD',
    slug: 'samsung-990-pro-2tb-pcie-4-0-nvme-m-2-ssd',
    price: 68000,
    brand: 'Samsung',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    stock: 18
  },
  {
    _id: 'prod5',
    name: 'Arctic Liquid Freezer III 360 A-RGB CPU Cooler',
    slug: 'arctic-liquid-freezer-iii-360-a-rgb-cpu-cooler',
    price: 49000,
    brand: 'Arctic',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    stock: 15
  },
  {
    _id: 'prod6',
    name: 'Logitech G PRO X SUPERLIGHT 2 Wireless Gaming Mouse',
    slug: 'logitech-g-pro-x-superlight-2-wireless-gaming-mouse',
    price: 52000,
    brand: 'Logitech',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    stock: 14
  }
];

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (items.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchWishlistProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?ids=${items.join(',')}&limit=100`);
        const data = await res.json();
        if (res.ok) {
          const dbProducts = data.products || [];
          setProducts(dbProducts);

          // Identify IDs that actually exist (either in the database or in the fallback list)
          const validIds = items.filter(id => 
            dbProducts.some((p: any) => p._id === id) || 
            FALLBACK_PRODUCTS.some(p => p._id === id)
          );

          // If some IDs in localStorage are invalid/deleted, remove them from the store to sync the badge count
          if (validIds.length !== items.length) {
            const staleIds = items.filter(id => !validIds.includes(id));
            staleIds.forEach(id => removeItem(id));
            toast.error('Some unavailable products were removed from your wishlist');
          }
        } else {
          toast.error('Failed to load wishlist products');
        }
      } catch (error) {
        console.error(error);
        toast.error('Error loading wishlist products');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [mounted, items]);

  if (!mounted) return null;

  // Merge database items and fallback items
  const wishlistProducts = [
    ...products,
    ...FALLBACK_PRODUCTS.filter(p => items.includes(p._id) && !products.some(dbP => dbP._id === p._id))
  ];

  const handleAddToCart = (product: any) => {
    const cartProduct: CartProduct = {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images?.[0] || '',
      brand: product.brand,
      stock: product.stock
    };
    addItem(cartProduct, 1);
    openCart();
    toast.success('Product added to shopping cart');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#00d4ff]/30 border-t-[#00d4ff] rounded-full animate-spin mx-auto mb-4" />
        <span className="text-sm text-gray-400">Loading your wishlist...</span>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-full flex items-center justify-center mx-auto text-gray-500">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-white font-heading">
          Your Wishlist is Empty
        </h1>
        <p className="text-gray-400 max-w-md mx-auto text-sm">
          Save components and accessories you are interested in buying later.
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
      <h1 className="text-3xl font-extrabold text-white font-heading mb-8">
        My Wishlist
      </h1>

      <div className="border border-white/5 bg-[#111827]/40 backdrop-blur-md rounded-2xl overflow-hidden divide-y divide-white/5 max-w-4xl mx-auto">
        {wishlistProducts.map((product) => (
          <div key={product._id} className="flex flex-col sm:flex-row items-center gap-6 p-6">
            <div className="relative w-20 h-20 bg-[#0f1629] rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2 border border-white/5">
              <img src={product.images?.[0] || '/images/placeholder-product.png'} className="max-h-full max-w-full object-contain" />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <span className="text-[10px] text-[#00d4ff] font-bold uppercase tracking-wider">
                {product.brand}
              </span>
              <Link
                href={`/products/${product.slug}`}
                className="block text-sm font-bold text-white hover:text-[#00d4ff] transition-colors truncate"
              >
                {product.name}
              </Link>
              <div className="text-sm font-bold text-gray-400">
                {formatPrice(product.price)}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 mt-4 sm:mt-0">
              <button
                onClick={() => handleAddToCart(product)}
                className="px-4 py-2.5 bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                onClick={() => {
                  removeItem(product._id);
                  toast.success('Removed product from wishlist');
                }}
                className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl border border-transparent hover:border-red-500/10 transition-all cursor-pointer"
                aria-label="Remove item"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
