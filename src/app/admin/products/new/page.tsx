'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Plus, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface SpecRow {
  key: string;
  value: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [stock, setStock] = useState('10');
  const [sku, setSku] = useState('');
  const [warranty, setWarranty] = useState('1 Year Warranty');
  const [imageUrls, setImageUrls] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [tags, setTags] = useState('');

  // Specifications
  const [specs, setSpecs] = useState<SpecRow[]>([
    { key: 'Brand', value: '' },
    { key: 'Model', value: '' },
  ]);

  const addSpecRow = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpecRow = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !brand || !category) {
      toast.error('Name, Price, Brand, and Category are required');
      return;
    }

    setLoading(true);

    try {
      // Process specifications map
      const specifications: Record<string, string> = {};
      specs.forEach((spec) => {
        if (spec.key.trim() && spec.value.trim()) {
          specifications[spec.key.trim()] = spec.value.trim();
        }
      });

      // Process image URLs
      const images = imageUrls
        .split(',')
        .map((url) => url.trim())
        .filter((url) => url !== '');

      if (images.length === 0) {
        images.push('https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&auto=format&fit=crop&q=60'); // fallback image
      }

      // Process tags
      const tagList = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');

      const payload = {
        name,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
        brand,
        category,
        subcategory: subcategory || undefined,
        stock: parseInt(stock) || 0,
        sku: sku || undefined,
        warranty,
        images,
        description,
        shortDescription,
        tags: tagList,
        specifications,
        ratings: { average: 0, count: 0 },
        reviews: []
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Product created successfully');
        router.push('/admin/products');
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to create product');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Create Product</h1>
          <p className="text-gray-400 mt-1">Add a new tech item to your catalog.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Details Panel */}
        <div className="bg-[#111827]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-white/5 pb-3">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Intel Core i9-14900K Processor"
                className="w-full px-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Brand *
              </label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Intel"
                className="w-full px-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                SKU / Part Number
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="BX8071514900K"
                className="w-full px-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Category *
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Processors"
                className="w-full px-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Subcategory
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="Intel LGA1700"
                className="w-full px-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Price (LKR) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="185000"
                className="w-full px-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Original Price (For Discounts)
              </label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="195000"
                className="w-full px-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                className="w-full px-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
            </div>

            {/* Warranty */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Warranty
              </label>
              <input
                type="text"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                placeholder="3 Years Warranty"
                className="w-full px-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Media & Details */}
        <div className="bg-[#111827]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-white/5 pb-3">Media & Descriptions</h2>

          <div className="space-y-4">
            {/* Image URLs */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Image URLs (Comma separated)
              </label>
              <input
                type="text"
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                className="w-full px-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
              <p className="text-[11px] text-gray-500 mt-1">Leave empty to use a standard tech placeholder image.</p>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Short Description
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Latest 14th Gen Intel Core desktop processor featuring 24 cores..."
                className="w-full px-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Full Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed overview of product features and specs..."
                className="w-full px-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors resize-y min-h-[100px]"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Search Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="intel, i9, cpu, processor, LGA1700"
                className="w-full px-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Specifications Builder */}
        <div className="bg-[#111827]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 className="text-xl font-bold text-white">Technical Specifications</h2>
            <button
              type="button"
              onClick={addSpecRow}
              className="flex items-center gap-1 text-xs font-bold text-[#00ff88] hover:text-[#00ff88]/80 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Row
            </button>
          </div>

          <div className="space-y-3">
            {specs.map((spec, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                  placeholder="Key (e.g. Socket)"
                  className="flex-1 px-4 py-2 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                  placeholder="Value (e.g. LGA1700)"
                  className="flex-1 px-4 py-2 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(idx)}
                  disabled={specs.length <= 1}
                  className="p-2 bg-white/5 border border-white/10 hover:border-red-500/30 text-gray-500 hover:text-red-400 rounded-xl transition-all disabled:opacity-20 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-gray-950 font-bold rounded-xl hover:shadow-lg hover:shadow-[#00ff88]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4.5 h-4.5" />
              Save Product
            </>
          )}
        </button>
      </form>
    </div>
  );
}
