'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, Grid, List, ChevronDown, RotateCcw } from 'lucide-react';
import ProductFilters from '@/components/products/ProductFilters';
import ProductCard from '@/components/products/ProductCard';
import type { Product, FilterState } from '@/types';
import toast from 'react-hot-toast';

// Simple category lookup for counts
const CATEGORIES = [
  'Processors', 'Motherboards', 'Graphics Cards', 'Memory', 'SSD', 'Storage',
  'Power Supply', 'PC Cases', 'Coolers', 'Thermal Paste', 'Monitors',
  'Keyboards', 'Mouse', 'Mouse Pad', 'Headsets', 'Speakers', 'Printers', 'Laptops'
];

const BRANDS = [
  'ASUS', 'MSI', 'Gigabyte', 'Corsair', 'AMD', 'Intel', 'NVIDIA', 'Samsung', 'WD',
  'Seagate', 'Logitech', 'Razer', 'HyperX', 'NZXT', 'Cooler Master', 'Thermaltake', 'Arctic'
];

// Fallback catalog products if fetch fails
const FALLBACK_PRODUCTS: Product[] = [
  {
    _id: 'prod1',
    name: 'AMD Ryzen 7 7800X3D 8-Core 16-Thread Processor',
    slug: 'amd-ryzen-7-7800x3d-8-core-16-thread-processor',
    description: 'The ultimate gaming processor with AMD 3D V-Cache technology.',
    shortDescription: 'AMD Socket AM5 Processor for gaming excellence.',
    price: 115000,
    originalPrice: 125000,
    category: 'Processors',
    brand: 'AMD',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { Socket: 'AM5', Cores: '8' },
    stock: 12,
    sku: 'AMD-7800X3D',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    ratings: { average: 5.0, count: 48 },
    reviews: [],
    tags: ['cpu', 'amd'],
    warranty: '3 Years Warranty',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod2',
    name: 'ASUS ROG Strix GeForce RTX 4070 Ti Super 16GB GDDR6X',
    slug: 'asus-rog-strix-geforce-rtx-4070-ti-super-16gb-gddr6x',
    description: 'ROG Strix Graphics Card with DLSS 3 and advanced thermal cooling.',
    shortDescription: 'Premium ROG Graphics Card.',
    price: 345000,
    originalPrice: 365000,
    category: 'Graphics Cards',
    brand: 'ASUS',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { GPU: 'RTX 4070 Ti Super' },
    stock: 8,
    sku: 'ASUS-4070TIS',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    ratings: { average: 4.8, count: 32 },
    reviews: [],
    tags: ['gpu', 'nvidia'],
    warranty: '3 Years Warranty',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod3',
    name: 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz CL36',
    slug: 'corsair-vengeance-rgb-ddr5-32gb-2x16gb-6000mhz-cl36',
    description: 'Corsair DDR5 RGB Gaming Memory kit.',
    shortDescription: 'High performance gaming memory.',
    price: 45000,
    originalPrice: 49000,
    category: 'Memory',
    brand: 'Corsair',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { Type: 'DDR5' },
    stock: 25,
    sku: 'COR-32G-6000',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    ratings: { average: 4.7, count: 19 },
    reviews: [],
    tags: ['ram', 'ddr5'],
    warranty: 'Lifetime Warranty',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod4',
    name: 'Samsung 990 Pro 2TB PCIe 4.0 NVMe M.2 SSD',
    slug: 'samsung-990-pro-2tb-pcie-4-0-nvme-m-2-ssd',
    description: 'The highest standard in solid state storage speed and longevity.',
    shortDescription: 'Samsung Pro M.2 NVMe SSD.',
    price: 68000,
    originalPrice: 72000,
    category: 'SSD',
    brand: 'Samsung',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { 'Form Factor': 'M.2 NVMe' },
    stock: 18,
    sku: 'SAM-990P-2T',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    ratings: { average: 4.9, count: 64 },
    reviews: [],
    tags: ['ssd', 'storage'],
    warranty: '5 Years Warranty',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'prod5',
    name: 'Arctic Liquid Freezer III 360 A-RGB CPU Cooler',
    slug: 'arctic-liquid-freezer-iii-360-a-rgb-cpu-cooler',
    description: 'Premium AIO liquid cooler with outstanding cooling performance.',
    shortDescription: 'Arctic 360mm CPU liquid cooler.',
    price: 49000,
    originalPrice: 53000,
    category: 'Coolers',
    brand: 'Arctic',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { Radiator: '360mm' },
    stock: 15,
    sku: 'ARC-LF3-360',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    ratings: { average: 4.9, count: 28 },
    reviews: [],
    tags: ['cooler', 'liquid'],
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
    specifications: { Weight: '60g' },
    stock: 14,
    sku: 'LOG-GPXSL-2',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    ratings: { average: 4.8, count: 57 },
    reviews: [],
    tags: ['mouse', 'gaming'],
    warranty: '2 Years Warranty',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Read URL query params
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const sortParam = searchParams.get('sort') || 'newest';

  // Apply filters
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    categories: categoryParam ? [categoryParam] : [],
    brands: brandParam ? brandParam.split(',') : [],
    priceRange: {
      min: minPriceParam ? parseInt(minPriceParam) : 0,
      max: maxPriceParam ? parseInt(maxPriceParam) : 1000000
    },
    minRating: 0,
    inStockOnly: false
  });

  const [sortOption, setSortOption] = useState(sortParam);

  // Sync state with URL params
  useEffect(() => {
    setActiveFilters({
      categories: categoryParam ? [categoryParam] : [],
      brands: brandParam ? brandParam.split(',') : [],
      priceRange: {
        min: minPriceParam ? parseInt(minPriceParam) : 0,
        max: maxPriceParam ? parseInt(maxPriceParam) : 1000000
      },
      minRating: 0,
      inStockOnly: false
    });
    setSortOption(sortParam);
  }, [categoryParam, brandParam, minPriceParam, maxPriceParam, sortParam]);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (activeFilters.categories.length > 0) {
          query.set('category', activeFilters.categories[0]);
        }
        if (activeFilters.brands.length > 0) {
          query.set('brand', activeFilters.brands.join(','));
        }
        if (activeFilters.priceRange.min > 0) {
          query.set('minPrice', activeFilters.priceRange.min.toString());
        }
        if (activeFilters.priceRange.max < 1000000) {
          query.set('maxPrice', activeFilters.priceRange.max.toString());
        }
        query.set('sort', sortOption === 'newest' ? 'createdAt' : sortOption === 'price-asc' || sortOption === 'price-desc' ? 'price' : 'rating');
        query.set('order', sortOption === 'price-asc' ? 'asc' : 'desc');

        const res = await fetch(`/api/products?${query.toString()}`);
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.warn('API error, falling back to static samples', err);
        // Apply local filtering to sample products as fallback
        let filtered = [...FALLBACK_PRODUCTS];
        if (activeFilters.categories.length > 0) {
          filtered = filtered.filter(p => activeFilters.categories.includes(p.category));
        }
        if (activeFilters.brands.length > 0) {
          filtered = filtered.filter(p => activeFilters.brands.includes(p.brand));
        }
        filtered = filtered.filter(p => p.price >= activeFilters.priceRange.min && p.price <= activeFilters.priceRange.max);
        
        if (sortOption === 'price-asc') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-desc') {
          filtered.sort((a, b) => b.price - a.price);
        }
        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeFilters, sortOption]);

  const handleFilterChange = (newFilters: FilterState) => {
    setActiveFilters(newFilters);
    
    // Update URL query parameters
    const params = new URLSearchParams();
    if (newFilters.categories.length > 0) params.set('category', newFilters.categories[0]);
    if (newFilters.brands.length > 0) params.set('brand', newFilters.brands.join(','));
    if (newFilters.priceRange.min > 0) params.set('minPrice', newFilters.priceRange.min.toString());
    if (newFilters.priceRange.max < 1000000) params.set('maxPrice', newFilters.priceRange.max.toString());
    params.set('sort', sortOption);
    router.push(`/products?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSortOption(val);
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', val);
    router.push(`/products?${params.toString()}`);
  };

  const resetAllFilters = () => {
    const defaultFilters: FilterState = {
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 1000000 },
      minRating: 0,
      inStockOnly: false
    };
    setActiveFilters(defaultFilters);
    router.push('/products');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            Computer Hardware & Gear
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Showing {products.length} products
          </p>
        </div>

        {/* Catalog Control Bar */}
        <div className="flex items-center gap-4 self-end md:self-auto">
          {/* Sorting */}
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300">
            <span className="text-gray-500 mr-2">Sort:</span>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="bg-transparent text-white focus:outline-none cursor-pointer pr-6"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Customer Rating</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 pointer-events-none text-gray-500" />
          </div>

          {/* View Toggle */}
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-[#00d4ff] text-[#0a0e1a]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-[#00d4ff] text-[#0a0e1a]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold text-white"
          >
            <SlidersHorizontal className="w-4.5 h-4.5 text-[#00d4ff]" />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block">
          <ProductFilters
            categories={CATEGORIES}
            brands={BRANDS}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Product Cards Container */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-white/5 border border-white/5 animate-pulse flex flex-col justify-between p-6">
                  <div className="aspect-square bg-white/5 rounded-xl w-full h-1/2" />
                  <div className="h-4 bg-white/5 rounded w-3/4 mt-4" />
                  <div className="h-4 bg-white/5 rounded w-1/2 mt-2" />
                  <div className="h-8 bg-white/5 rounded w-full mt-6" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="flex flex-col sm:flex-row gap-6 p-4 bg-[#111827]/40 border border-white/5 rounded-2xl hover:border-[#00d4ff]/20 transition-all backdrop-blur-md"
                  >
                    <div className="relative w-full sm:w-48 aspect-square bg-[#0f1629] rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-4">
                      <img
                        src={product.images[0] || '/images/placeholder-product.png'}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="space-y-2">
                        <span className="text-xs text-[#00d4ff] font-bold uppercase tracking-wider">
                          {product.brand}
                        </span>
                        <Link href={`/products/${product.slug}`} className="block text-lg font-bold text-white hover:text-[#00d4ff] transition-colors leading-snug">
                          {product.name}
                        </Link>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-xl font-bold text-white">
                          Rs. {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <Link
                          href={`/products/${product.slug}`}
                          className="px-5 py-2.5 bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white text-xs font-semibold rounded-xl"
                        >
                          View Product
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <RotateCcw className="w-12 h-12 text-gray-500 animate-spin" />
              <h3 className="text-xl font-bold text-white">No products found</h3>
              <p className="text-gray-400 text-sm max-w-md">
                Try widening your price range, choosing different categories/brands, or reset all active filters.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-6 py-3 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-xl text-sm font-semibold transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer (rendered conditionally) */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-[#0a0e1a] border-l border-white/10 p-6 overflow-y-auto flex flex-col z-50">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <span className="text-lg font-bold text-white">Filters</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-gray-300 font-semibold"
              >
                Close
              </button>
            </div>
            <div className="flex-1">
              <ProductFilters
                categories={CATEGORIES}
                brands={BRANDS}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading product catalog...</p>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
