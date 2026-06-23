'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import {
  Cpu,
  Monitor,
  Keyboard,
  Laptop,
  ArrowRight,
  ShieldCheck,
  Truck,
  Wrench,
  ThumbsUp,
  Search,
  Star
} from 'lucide-react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ProductCard from '@/components/products/ProductCard';
import type { Product } from '@/types';

// Realistic sample computer parts for homepage showcases (LKR prices)
// Realistic sample computer parts for homepage showcases (LKR prices)
const SAMPLE_PRODUCTS: Product[] = [
  {
    _id: 'prod1',
    name: 'AMD Ryzen 7 7800X3D 8-Core 16-Thread Processor',
    slug: 'amd-ryzen-7-7800x3d-8-core-16-thread-processor',
    description: 'The ultimate gaming processor with AMD 3D V-Cache technology.',
    shortDescription: 'AMD Socket AM5 Processor for gaming excellence.',
    price: 115000,
    originalPrice: 125000,
    category: 'Processors',
    subcategory: 'AMD',
    brand: 'AMD',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { Socket: 'AM5', Cores: '8', Threads: '16', Cache: '96MB L3' },
    stock: 12,
    sku: 'AMD-7800X3D',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    ratings: { average: 5.0, count: 48 },
    reviews: [],
    tags: ['cpu', 'amd', 'ryzen', 'gaming'],
    warranty: '3 Years Warranty',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod2',
    name: 'ASUS ROG Strix GeForce RTX 4070 Ti Super 16GB GDDR6X',
    slug: 'asus-rog-strix-geforce-rtx-4070-ti-super-16gb-gddr6x',
    description: 'High performance graphics card with DLSS 3 and advanced thermal design.',
    shortDescription: 'ASUS ROG Strix Nvidia graphics card.',
    price: 345000,
    originalPrice: 365000,
    category: 'Graphics Cards',
    brand: 'ASUS',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { GPU: 'RTX 4070 Ti Super', Memory: '16GB GDDR6X', Interface: 'PCIe 4.0' },
    stock: 8,
    sku: 'ASUS-4070TIS',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    ratings: { average: 4.8, count: 32 },
    reviews: [],
    tags: ['gpu', 'nvidia', 'rtx', 'asus'],
    warranty: '3 Years Warranty',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod3',
    name: 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz CL36',
    slug: 'corsair-vengeance-rgb-ddr5-32gb-2x16gb-6000mhz-cl36',
    description: 'Stunning RGB styling and optimized performance for Intel and AMD motherboards.',
    shortDescription: 'Corsair DDR5 Gaming Memory Kit.',
    price: 45000,
    originalPrice: 49000,
    category: 'Memory',
    brand: 'Corsair',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { Type: 'DDR5', Capacity: '32GB (2x16GB)', Speed: '6000MHz' },
    stock: 25,
    sku: 'COR-32G-6000',
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
    description: 'Experience the best SSD speed and reliability with V-NAND technology.',
    shortDescription: 'Samsung PCIe 4.0 NVMe M.2 SSD.',
    price: 68000,
    originalPrice: 72000,
    category: 'SSD',
    brand: 'Samsung',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { 'Form Factor': 'M.2 2280', Interface: 'PCIe 4.0 x4', 'Read Speed': '7450 MB/s' },
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
    description: 'Premium AIO liquid cooler with outstanding cooling performance and quiet operation.',
    shortDescription: 'Arctic 360mm Liquid CPU Cooler with A-RGB.',
    price: 49000,
    originalPrice: 53000,
    category: 'Coolers',
    brand: 'Arctic',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { 'Radiator Size': '360mm', Fans: '3x 120mm A-RGB', 'Supported Sockets': 'AM4/AM5/LGA1700' },
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
    description: 'The next generation icon of championship-winning wireless gaming mice.',
    shortDescription: 'Ultra-lightweight wireless gaming mouse.',
    price: 52000,
    originalPrice: 56000,
    category: 'Mouse',
    brand: 'Logitech',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { Weight: '60g', Sensor: 'HERO 2', Connection: 'LIGHTSPEED Wireless' },
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

const BRANDS = [
  'ASUS', 'MSI', 'Gigabyte', 'Corsair', 'AMD', 'Intel', 'NVIDIA', 'Samsung', 'Logitech', 'Razer'
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchHomepageProducts = async () => {
      try {
        setLoading(true);
        const [newRes, bestRes] = await Promise.all([
          fetch('/api/products?newArrivals=true&limit=8'),
          fetch('/api/products?bestSellers=true&limit=8')
        ]);
        if (newRes.ok && bestRes.ok) {
          const newData = await newRes.json();
          const bestData = await bestRes.json();
          setNewArrivals(newData.products?.length > 0 ? newData.products : SAMPLE_PRODUCTS);
          setBestSellers(bestData.products?.length > 0 ? bestData.products : SAMPLE_PRODUCTS.slice(0, 4));
        } else {
          setNewArrivals(SAMPLE_PRODUCTS);
          setBestSellers(SAMPLE_PRODUCTS.slice(0, 4));
        }
      } catch (err) {
        console.warn('Failed to fetch homepage products:', err);
        setNewArrivals(SAMPLE_PRODUCTS);
        setBestSellers(SAMPLE_PRODUCTS.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageProducts();
  }, [mounted]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-20 pb-16">
      {/* ── HERO SECTION ─────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        {/* Tech Grid Background Pattern */}
        <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-[0.03]" />
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-transparent to-[#0a0e1a]" />
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-[#00d4ff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-[#7c3aed]/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Title / Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-heading"
            >
              Build Your{' '}
              <span className="bg-gradient-to-r from-[#00d4ff] via-[#7c3aed] to-[#00ff88] bg-clip-text text-transparent">
                Dream PC
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto lg:mx-0"
            >
              Sri Lanka&apos;s premier destination for custom gaming rigs, workstations, and high-performance hardware. Quality components with trusted local warranty.
            </motion.p>

            {/* Quick Search */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSearchSubmit}
              className="relative max-w-xl mx-auto lg:mx-0"
            >
              <input
                type="text"
                placeholder="Search processors, graphics cards, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/40 focus:ring-1 focus:ring-[#00d4ff]/20 transition-all shadow-2xl"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a0e1a] font-bold rounded-xl text-sm transition-all"
              >
                Search
              </button>
            </motion.form>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <Link
                href="/products"
                className="px-8 py-3.5 bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#00d4ff]/20 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                Shop Components <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/build-my-pc"
                className="px-8 py-3.5 border border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-200 hover:text-white font-semibold rounded-xl transition-all flex items-center gap-2"
              >
                PC Configurator <Wrench className="w-5 h-5 text-[#00ff88]" />
              </Link>
            </motion.div>
          </div>

          {/* Hero Tech Illustration */}
          <div className="lg:col-span-5 hidden lg:block relative h-[500px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Central glowing box representing PC build */}
              <div className="w-80 h-96 relative border border-white/10 rounded-3xl bg-gradient-to-br from-[#0c1224]/80 to-[#111827]/80 backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
                {/* Internal components visualization */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ff88]/5 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#00d4ff]/5 rounded-full blur-xl animate-pulse" />

                <div className="flex justify-between items-start">
                  <div className="p-3 bg-[#00d4ff]/10 rounded-2xl border border-[#00d4ff]/20">
                    <Cpu className="w-8 h-8 text-[#00d4ff] animate-pulse" />
                  </div>
                  <span className="text-xs font-bold text-[#00ff88] uppercase tracking-wider bg-[#00ff88]/10 px-2.5 py-1 rounded-full">
                    Active Build
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                  <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                  <div className="h-2 w-5/6 bg-[#00d4ff]/30 rounded-full" />
                </div>

                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Total Power</div>
                    <div className="text-xl font-bold text-white">750 Watts</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">LKR Estimate</div>
                    <div className="text-xl font-bold text-[#00ff88]">Rs. 450,000</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Info stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#060a14]/60 border-t border-white/5 py-6">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">5,000+</div>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Products Available</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Major Tech Brands</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#00ff88]">100%</div>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Genuine Warranty</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">Islandwide</div>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Safe Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUE PROPOSITIONS ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Wrench,
              title: 'Custom PC Builds',
              desc: 'Tailored gaming rigs & professional workstations custom-built by experts.',
              color: 'text-[#00d4ff]'
            },
            {
              icon: ThumbsUp,
              title: '100% Genuine Parts',
              desc: 'We stock only authorized premium brands direct from official distributors.',
              color: 'text-[#00ff88]'
            },
            {
              icon: ShieldCheck,
              title: 'Warranty Support',
              desc: 'Reliable customer service with swift warranty claim processing.',
              color: 'text-[#7c3aed]'
            },
            {
              icon: Truck,
              title: 'Island-wide Delivery',
              desc: 'Securely packaged and delivered straight to your doorstep in Sri Lanka.',
              color: 'text-amber-400'
            }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-[#111827]/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md hover:border-[#00d4ff]/20 transition-all hover:-translate-y-1 space-y-4"
              >
                <div className={`p-3 bg-white/5 rounded-xl inline-block ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── NEW ARRIVALS ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              New Arrivals
            </h2>
            <p className="text-gray-400 text-sm mt-1">Freshly landed products in stock right now.</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-[#00d4ff] hover:text-[#00d4ff]/80 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 }
          }}
          className="product-carousel pb-6"
        >
          {newArrivals.map((prod) => (
            <SwiperSlide key={prod._id}>
              <ProductCard product={prod} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ── PRO CATEGORIES ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Shop by Pro Categories
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Top grade configurations and components to optimize your computing experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Processors',
              desc: 'Multi-core CPUs from AMD and Intel for gaming and high workloads.',
              image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
              href: '/products?category=processors'
            },
            {
              title: 'Graphics Cards',
              desc: 'High refresh rate and Ray-Tracing enabled GPUs from Nvidia and AMD.',
              image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
              href: '/products?category=graphics%20cards'
            },
            {
              title: 'Monitors',
              desc: 'Stunning clarity and fast responses for gaming and professional design.',
              image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
              href: '/products?category=monitors'
            }
          ].map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group relative h-80 rounded-3xl overflow-hidden border border-white/5 hover:border-[#00d4ff]/30 shadow-xl transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/60 to-transparent z-10" />
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-[#00d4ff] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {cat.desc}
                </p>
                <div className="inline-flex items-center gap-1 text-xs text-[#00ff88] font-bold">
                  Explore More <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BEST SELLERS ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Best Sellers
            </h2>
            <p className="text-gray-400 text-sm mt-1">Our most popular hardware components.</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-[#00d4ff] hover:text-[#00d4ff]/80 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellers.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>

      {/* ── BRAND SHOWCASE ──────────────────────────── */}
      <section className="bg-[#05070f] py-12 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center mb-6">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
            AUTHORIZED PARTNER BRANDS
          </span>
        </div>
        <div className="flex whitespace-nowrap overflow-x-auto pr-6 pl-6 gap-12 justify-center items-center py-2 select-none hide-scrollbar">
          {BRANDS.map((brand) => (
            <span
              key={brand}
              className="text-lg font-bold text-gray-600 hover:text-white transition-colors tracking-widest cursor-default uppercase"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            What Our Customers Say
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Read comments from gamers, design experts, and professionals who trust us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "I recently built an AMD gaming PC with MM Sri Lanka. The service was exceptional, and they guided me perfectly on compatibility. Extremely satisfied!",
              author: "Praneeth Randunu",
              role: "Gamer / Software Dev"
            },
            {
              quote: "The technical support team resolved my AIO cooler installation query in minutes. Genuine parts, reliable warranty support. Will buy again.",
              author: "Ariyadasa Kalindu",
              role: "Video Editor"
            },
            {
              quote: "Best pricing for DDR5 memory and SSDs in Colombo. Quick checkout and prompt cash-on-delivery service. Highly recommended!",
              author: "Ashan Fernando",
              role: "Full-Stack Dev"
            }
          ].map((test, index) => (
            <div
              key={index}
              className="bg-[#111827]/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md flex flex-col justify-between space-y-6"
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed italic">&ldquo;{test.quote}&rdquo;</p>
              <div>
                <div className="font-bold text-white text-sm">{test.author}</div>
                <div className="text-xs text-[#00d4ff] mt-0.5">{test.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
