'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Search, 
  Edit, 
  Trash2, 
  Plus, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';

interface ProductData {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  images: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Categories list for filter
  const [categories, setCategories] = useState<string[]>([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch products without limit for easy client-side filtering
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      
      if (res.ok) {
        setProducts(data.products || []);
        
        // Extract unique categories
        const cats = Array.from(
          new Set((data.products || []).map((p: ProductData) => p.category))
        ) as string[];
        setCategories(cats);
      } else {
        toast.error('Failed to load products');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Product deleted successfully');
        setProducts(products.filter((p) => p.slug !== slug));
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting product');
    }
  };

  // Filter products in memory
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.brand.toLowerCase().includes(search.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(search.toLowerCase()));
      
    const matchesCategory = 
      categoryFilter === '' || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Paginated products
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 text-[#00ff88]" />
            Products Management
          </h1>
          <p className="text-gray-400 mt-1">Add, update, or remove computer parts from your store inventory.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#00d4ff]/20 transition-all text-sm tracking-wider uppercase self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-[#111827]/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, brand, SKU..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-[#111827]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-gray-400">
            <div className="w-8 h-8 border-2 border-[#00ff88]/30 border-t-[#00ff88] rounded-full animate-spin" />
            <span className="text-sm">Fetching catalog...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-gray-600" />
            <span>No products match your filters.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider text-xs">
                  <th className="pb-3 pr-4">Product Info</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">SKU</th>
                  <th className="pb-3 pr-4">Price</th>
                  <th className="pb-3 pr-4 text-center">Stock</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentItems.map((product) => (
                  <tr key={product._id} className="group hover:bg-white/5 transition-colors">
                    {/* Info */}
                    <td className="py-3.5 pr-4 flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-white/5 border border-white/10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div className="max-w-[280px] sm:max-w-md truncate">
                        <div className="text-white font-medium truncate" title={product.name}>
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{product.brand}</div>
                      </div>
                    </td>
                    
                    {/* Category */}
                    <td className="py-3.5 pr-4 text-gray-300 font-medium">{product.category}</td>
                    
                    {/* SKU */}
                    <td className="py-3.5 pr-4 font-mono text-xs text-gray-400">
                      {product.sku || 'N/A'}
                    </td>
                    
                    {/* Price */}
                    <td className="py-3.5 pr-4 font-semibold text-gray-200">
                      {formatPrice(product.price)}
                    </td>
                    
                    {/* Stock */}
                    <td className="py-3.5 pr-4 text-center">
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold ${
                        product.stock > 10 ? 'bg-[#00ff88]/10 text-[#00ff88]' :
                        product.stock > 0 ? 'bg-amber-500/10 text-amber-500' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    
                    {/* Actions */}
                    <td className="py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        href={`/admin/products/${product.slug}/edit`}
                        className="inline-flex p-2 bg-white/5 border border-white/10 hover:border-[#00d4ff]/40 hover:bg-[#00d4ff]/10 text-gray-400 hover:text-[#00d4ff] rounded-lg transition-all"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.slug, product.name)}
                        className="inline-flex p-2 bg-white/5 border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-6 text-sm text-gray-400">
            <span>
              Showing <span className="font-semibold text-white">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-semibold text-white">
                {Math.min(indexOfLastItem, filteredProducts.length)}
              </span>{' '}
              of <span className="font-semibold text-white">{filteredProducts.length}</span> products
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-2 bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-lg disabled:opacity-30 disabled:hover:border-white/10 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-2 bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-lg disabled:opacity-30 disabled:hover:border-white/10 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
