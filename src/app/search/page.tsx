'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2, RotateCcw } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import type { Product } from '@/types';

// Fallback search sample
const SAMPLE_RESULTS: Product[] = [
  {
    _id: 'prod1',
    name: 'AMD Ryzen 7 7800X3D 8-Core 16-Thread Processor',
    slug: 'amd-ryzen-7-7800x3d',
    description: 'The ultimate gaming processor with AMD 3D V-Cache technology.',
    shortDescription: 'AMD Socket AM5 Processor for gaming excellence.',
    price: 115000,
    originalPrice: 125000,
    category: 'Processors',
    brand: 'AMD',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { Socket: 'AM5' },
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
  }
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data.products || []);
      } catch (err) {
        console.warn('API Search error, falling back to local filter:', err);
        // Fallback local filter
        const regex = new RegExp(query, 'i');
        const filtered = SAMPLE_RESULTS.filter(
          (p) =>
            regex.test(p.name) ||
            regex.test(p.brand) ||
            regex.test(p.category) ||
            regex.test(p.description)
        );
        setResults(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Input Panel */}
      <div className="max-w-2xl mx-auto text-center space-y-6 mb-12">
        <h1 className="text-3xl font-extrabold text-white font-heading">
          Search Store Catalog
        </h1>
        
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search processors, graphics cards, motherboards..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-6 py-4 pl-14 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/40 focus:ring-1 focus:ring-[#00d4ff]/20 transition-all shadow-2xl"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a0e1a] font-bold rounded-xl text-sm transition-all"
          >
            Search
          </button>
        </form>

        {query && (
          <p className="text-gray-400 text-sm">
            Found {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;
            <span className="text-white font-bold">{query}</span>&rdquo;
          </p>
        )}
      </div>

      {/* Results Rendering */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-10 h-10 text-[#00d4ff] animate-spin" />
          <p className="text-gray-400 text-sm">Searching store databases...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : query ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <RotateCcw className="w-12 h-12 text-gray-500" />
          <h3 className="text-xl font-bold text-white">No products matched your search</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Double check spelling, try using more general search keywords, or browse product categories.
          </p>
          <a
            href="/products"
            className="inline-block px-6 py-3 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-xl text-sm font-semibold transition-all"
          >
            Browse All Products
          </a>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 text-sm">
          Enter search terms above to query the catalog.
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Initializing search engine...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
