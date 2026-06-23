'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingCart,
  ShieldAlert,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Star
} from 'lucide-react';
import { useCartStore, type CartProduct } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import ProductCard from '@/components/products/ProductCard';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

// Fallback product list if API fails
const FALLBACK_PRODUCTS: Product[] = [
  {
    _id: 'prod1',
    name: 'AMD Ryzen 7 7800X3D 8-Core 16-Thread Processor',
    slug: 'amd-ryzen-7-7800x3d-8-core-16-thread-processor',
    description: 'The ultimate gaming processor with AMD 3D V-Cache technology. Features 8 cores, 16 threads, and massive 96MB of L3 cache to deliver unparalleled frame rates in gaming. Built on Socket AM5 architecture supporting high-speed DDR5 memory and PCIe Gen 5 peripherals. Perfect for both hardware enthusiasts and competitive esport players looking to optimize bottlenecks.',
    shortDescription: 'AMD Socket AM5 Processor optimized for unmatched gaming efficiency.',
    price: 115000,
    originalPrice: 125000,
    category: 'Processors',
    subcategory: 'AMD',
    brand: 'AMD',
    images: [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'
    ],
    specifications: {
      Manufacturer: 'AMD',
      Model: 'Ryzen 7 7800X3D',
      Socket: 'Socket AM5',
      'Cores / Threads': '8 Cores / 16 Threads',
      'Base / Boost Clock': '4.2GHz / 5.0GHz',
      'L3 Cache': '96MB',
      TDP: '120W'
    },
    stock: 10,
    sku: 'AMD-RYZEN7-7800X3D',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    ratings: { average: 5.0, count: 48 },
    reviews: [
      { user: 'User 1', rating: 5, comment: 'Phenomenal frame rates. Idle temps are a bit high but performance under load is outstanding.', createdAt: new Date() },
      { user: 'User 2', rating: 5, comment: 'Best CPU for gaming in 2024. Runs cool with my 360mm AIO cooler.', createdAt: new Date() }
    ],
    tags: ['cpu', 'amd', 'AM5'],
    warranty: '3 Years Warranty',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod2',
    name: 'ASUS ROG Strix GeForce RTX 4070 Ti Super 16GB GDDR6X',
    slug: 'asus-rog-strix-geforce-rtx-4070-ti-super-16gb-gddr6x',
    description: 'High performance graphics card with DLSS 3 and advanced thermal cooling design. Power up your gaming workstation with cutting edge ray tracing performance, 16GB of high-speed memory and military-grade components. The massive heatsink and triple Axial-tech fans keep temperatures low while keeping acoustics practically silent.',
    shortDescription: 'ASUS ROG Strix GeForce RTX 4070 Ti Super 16GB gaming graphics card.',
    price: 345000,
    originalPrice: 365000,
    category: 'Graphics Cards',
    brand: 'ASUS',
    images: [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'
    ],
    specifications: {
      Manufacturer: 'ASUS',
      Model: 'ROG Strix RTX 4070 Ti Super',
      GPU: 'RTX 4070 Ti Super',
      'Video Memory': '16GB GDDR6X',
      'Memory Interface': '256-bit',
      Interface: 'PCIe 4.0'
    },
    stock: 8,
    sku: 'ASUS-4070TIS-ROG',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    ratings: { average: 4.8, count: 32 },
    reviews: [
      { user: 'Reviewer 1', rating: 5, comment: 'Runs absolutely silent. 1440p ultra gaming is a breeze.', createdAt: new Date() }
    ],
    tags: ['gpu', 'nvidia', 'rtx', 'asus'],
    warranty: '3 Years Warranty',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod3',
    name: 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz CL36',
    slug: 'corsair-vengeance-rgb-ddr5-32gb-2x16gb-6000mhz-cl36',
    description: 'Stunning RGB styling and optimized performance for Intel and AMD motherboards. Corsair Vengeance RGB DDR5 memory delivers the higher frequencies and greater capacities of DDR5 technology in a high-quality, compact module that fits your build style. Dynamic ten-zone RGB lighting illuminates your system while onboard voltage regulation enables easy, finely controlled overclocking.',
    shortDescription: 'Corsair Vengeance DDR5 32GB high-frequency desktop memory with dynamic RGB.',
    price: 45000,
    originalPrice: 49000,
    category: 'Memory',
    brand: 'Corsair',
    images: [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80'
    ],
    specifications: {
      Manufacturer: 'Corsair',
      Model: 'Vengeance RGB DDR5',
      Type: 'DDR5',
      Capacity: '32GB (2x16GB)',
      Speed: '6000MHz',
      Latency: 'CL36 (36-36-36-76)'
    },
    stock: 25,
    sku: 'COR-VEN-32G-DDR5',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    ratings: { average: 4.7, count: 19 },
    reviews: [],
    tags: ['ram', 'ddr5', 'corsair', 'rgb'],
    warranty: 'Lifetime Warranty',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod4',
    name: 'Samsung 990 Pro 2TB PCIe 4.0 NVMe M.2 SSD',
    slug: 'samsung-990-pro-2tb-pcie-4-0-nvme-m-2-ssd',
    description: 'Experience the best SSD speed and reliability with V-NAND technology. Samsung 990 Pro PCIe 4.0 NVMe M.2 SSD delivers write speeds up to 6900 MB/s and read speeds up to 7450 MB/s, pushing the boundaries of what PCIe Gen 4 can do. Optimized power efficiency allows cool operations under heavy workflow loads.',
    shortDescription: 'Premium Samsung PCIe 4.0 NVMe M.2 solid state drive.',
    price: 68000,
    originalPrice: 72000,
    category: 'SSD',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80'
    ],
    specifications: {
      Manufacturer: 'Samsung',
      Model: '990 Pro 2TB',
      'Form Factor': 'M.2 2280',
      Interface: 'PCIe 4.0 x4',
      'Read Speed': '7450 MB/s',
      'Write Speed': '6900 MB/s'
    },
    stock: 18,
    sku: 'SAM-990P-2T',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    ratings: { average: 4.9, count: 64 },
    reviews: [],
    tags: ['ssd', 'nvme', 'samsung', 'storage'],
    warranty: '5 Years Warranty',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod5',
    name: 'Arctic Liquid Freezer III 360 A-RGB CPU Cooler',
    slug: 'arctic-liquid-freezer-iii-360-a-rgb-cpu-cooler',
    description: 'Premium AIO liquid cooler with outstanding cooling performance and quiet operation. The Arctic Liquid Freezer III 360 features a customized water pump, optimized radiator cooling fins, and premium high-performance A-RGB fans for silent computer cooling. Perfect for handling hot TDPs of Ryzen 7000/9000 and Intel Core 13th/14th Gen processors.',
    shortDescription: 'Arctic 360mm high-performance liquid CPU cooler with addressable RGB.',
    price: 49000,
    originalPrice: 53000,
    category: 'Coolers',
    brand: 'Arctic',
    images: [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80'
    ],
    specifications: {
      Manufacturer: 'Arctic',
      Model: 'Liquid Freezer III 360 A-RGB',
      'Radiator Size': '360mm',
      Fans: '3x 120mm A-RGB',
      'Supported Sockets': 'AM4/AM5/LGA1700'
    },
    stock: 15,
    sku: 'ARC-LF3-360',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    ratings: { average: 4.9, count: 28 },
    reviews: [],
    tags: ['cooler', 'arctic', 'liquid', 'aio'],
    warranty: '6 Years Warranty',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod6',
    name: 'Logitech G PRO X SUPERLIGHT 2 Wireless Gaming Mouse',
    slug: 'logitech-g-pro-x-superlight-2-wireless-gaming-mouse',
    description: 'The next generation icon of championship-winning wireless gaming mice. The Logitech G PRO X SUPERLIGHT 2 wireless gaming mouse has been upgraded with hybrid optical-mechanical switches, a state of the art HERO 2 sensor, and ultra-fast 2000Hz polling rate. Weight is optimized at just 60 grams to enable rapid reaction times in competitive e-sports.',
    shortDescription: 'Ultra-lightweight Logitech wireless gaming mouse with 2K Hz polling rate.',
    price: 52000,
    originalPrice: 56000,
    category: 'Mouse',
    brand: 'Logitech',
    images: [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80'
    ],
    specifications: {
      Manufacturer: 'Logitech',
      Model: 'G PRO X SUPERLIGHT 2',
      Weight: '60g',
      Sensor: 'HERO 2',
      Connection: 'LIGHTSPEED Wireless'
    },
    stock: 14,
    sku: 'LOG-GPXSL-2',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    ratings: { average: 4.8, count: 57 },
    reviews: [],
    tags: ['mouse', 'logitech', 'gaming', 'wireless'],
    warranty: '2 Years Warranty',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product?._id || ''));

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts || []);
      } catch (err) {
        console.warn('Using fallback data due to fetch error:', err);
        // Find matching fallback by slug
        const fallback = FALLBACK_PRODUCTS.find(p => p.slug === slug) || FALLBACK_PRODUCTS[0];
        setProduct(fallback);
        setRelatedProducts(FALLBACK_PRODUCTS.filter(p => p.slug !== fallback.slug).slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-sm">Retrieving product technical specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <p className="text-gray-400">The product you requested might have been removed or discontinued.</p>
        <Link href="/products" className="inline-block px-6 py-3 bg-[#00d4ff] text-[#0a0e1a] font-bold rounded-xl text-sm">
          Return to Shop
        </Link>
      </div>
    );
  }

  const discountPercentage = calculateDiscount(product.originalPrice, product.price);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const cartProduct: CartProduct = {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0] || '',
      brand: product.brand,
      stock: product.stock
    };
    addItem(cartProduct, quantity);
    openCart();
    toast.success(`${product.name} added to cart (${quantity} unit${quantity > 1 ? 's' : ''})`);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product._id);
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 overflow-x-auto whitespace-nowrap py-1">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-white transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-white transition-colors uppercase">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-300 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
        {/* Left Side: Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl bg-[#0f1629] border border-white/5 overflow-hidden flex items-center justify-center p-8 group shadow-xl">
            <img
              src={product.images[activeImageIndex] || '/images/placeholder-product.png'}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            />
            {discountPercentage > 0 && (
              <span className="absolute left-6 top-6 bg-red-500/20 border border-red-500/30 text-red-400 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider backdrop-blur-md">
                -{discountPercentage}% Off
              </span>
            )}
            {product.isNewArrival && (
              <span className="absolute right-6 top-6 bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider backdrop-blur-md">
                New Arrival
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto py-1 hide-scrollbar">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-20 aspect-square rounded-xl bg-[#0f1629] border shrink-0 overflow-hidden p-2 transition-all ${
                    activeImageIndex === index ? 'border-[#00d4ff] shadow-md shadow-[#00d4ff]/10' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <img src={img} alt={`thumbnail-${index}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-[#00d4ff] uppercase tracking-widest">
              {product.brand}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-heading">
              {product.name}
            </h1>
            <div className="flex items-center gap-3">
              {/* Stars */}
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.ratings.count} customer reviews)
              </span>
              <span className="text-gray-600">|</span>
              <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">
                SKU: {product.sku}
              </span>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Price details */}
          <div className="space-y-1">
            {discountPercentage > 0 && (
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-extrabold text-white">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-[#00ff88] bg-[#00ff88]/5 border border-[#00ff88]/10 px-2 py-0.5 rounded-md font-bold uppercase">
                Free Delivery Included
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Price inclusive of all taxes. Warranty card is included.</p>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            {product.shortDescription || product.description.substring(0, 150) + '...'}
          </p>

          <hr className="border-white/5" />

          {/* Add to Cart Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-400">Quantity:</span>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                  disabled={isOutOfStock}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                  disabled={isOutOfStock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-[#00ff88]' : 'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} units in stock` : 'Out of Stock'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-4 bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-[#00d4ff]/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
              >
                <ShoppingCart className="w-5 h-5" />
                Add To Cart
              </button>
              
              <button
                onClick={handleToggleWishlist}
                className={`py-4 px-6 border rounded-2xl transition-all hover:scale-[1.01] flex items-center justify-center gap-2 text-sm ${
                  isInWishlist
                    ? 'border-red-500/30 bg-red-500/5 text-red-500'
                    : 'border-white/10 text-gray-300 hover:border-white/20 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500' : ''}`} />
                {isInWishlist ? 'Saved' : 'Wishlist'}
              </button>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Delivery & Warranty info badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-gray-400">
            <div className="flex items-center gap-2.5 p-3.5 bg-white/5 rounded-xl border border-white/5">
              <ShieldAlert className="w-4.5 h-4.5 text-[#00ff88]" />
              <span>{product.warranty || 'Local Agent Warranty'}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3.5 bg-white/5 rounded-xl border border-white/5">
              <Truck className="w-4.5 h-4.5 text-[#00d4ff]" />
              <span>Islandwide Shipping</span>
            </div>
            <div className="flex items-center gap-2.5 p-3.5 bg-white/5 rounded-xl border border-white/5">
              <RotateCcw className="w-4.5 h-4.5 text-amber-400" />
              <span>7 Day Easy Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs description / specifications / reviews */}
      <div className="border-b border-white/5 mb-8 flex gap-8 text-sm font-semibold overflow-x-auto whitespace-nowrap py-1">
        <button
          onClick={() => setActiveTab('desc')}
          className={`pb-4 border-b-2 transition-all ${
            activeTab === 'desc' ? 'border-[#00d4ff] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`pb-4 border-b-2 transition-all ${
            activeTab === 'specs' ? 'border-[#00d4ff] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Specifications
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-4 border-b-2 transition-all ${
            activeTab === 'reviews' ? 'border-[#00d4ff] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Customer Reviews ({product.reviews?.length || 0})
        </button>
      </div>

      <div className="min-h-[200px] mb-20 bg-[#111827]/40 border border-white/5 p-8 rounded-3xl backdrop-blur-md">
        {activeTab === 'desc' && (
          <div className="text-gray-300 text-sm leading-relaxed space-y-4">
            <p>{product.description}</p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="max-w-3xl">
            <table className="w-full text-sm text-left">
              <tbody>
                {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
                  <tr key={key} className="border-b border-white/5">
                    <td className="py-3 px-4 font-semibold text-gray-400 w-1/3 uppercase tracking-wider text-[11px]">
                      {key}
                    </td>
                    <td className="py-3 px-4 text-white">
                      {String(val)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev, idx) => (
                <div key={idx} className="border-b border-white/5 pb-6 last:border-b-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-white text-sm">{rev.user}</div>
                    <span className="text-[10px] text-gray-500">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-amber-400 gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed italic">&ldquo;{rev.comment}&rdquo;</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No customer reviews yet. Be the first to leave a review!</p>
            )}
          </div>
        )}
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-2xl font-extrabold text-white font-heading">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
