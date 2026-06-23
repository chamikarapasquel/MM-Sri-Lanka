'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface SpecRow {
  key: string;
  value: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [warranty, setWarranty] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [tags, setTags] = useState('');
  
  // Specifications
  const [specs, setSpecs] = useState<SpecRow[]>([]);

  useEffect(() => {
    if (!slug) return;

    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();

        if (res.ok && data.product) {
          const p = data.product;
          setName(p.name);
          setPrice(String(p.price));
          setOriginalPrice(p.originalPrice ? String(p.originalPrice) : '');
          setBrand(p.brand);
          setCategory(p.category);
          setSubcategory(p.subcategory || '');
          setStock(String(p.stock));
          setSku(p.sku || '');
          setWarranty(p.warranty || '');
          setImageUrls((p.images || []).join(', '));
          setDescription(p.description || '');
          setShortDescription(p.shortDescription || '');
          setTags((p.tags || []).join(', '));

          // Load specs Map into rows
          if (p.specifications) {
            const specRows = Object.entries(p.specifications).map(([key, value]) => ({
              key,
              value: String(value),
            }));
            setSpecs(specRows.length > 0 ? specRows : [{ key: 'Brand', value: p.brand }]);
          } else {
            setSpecs([{ key: 'Brand', value: p.brand }]);
          }
        } else {
          toast.error(data.error || 'Failed to load product details');
        }
      } catch (error) {
        console.error(error);
        toast.error('Error fetching product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [slug]);

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

    setSaving(true);

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
      };

      const res = await fetch(`/api/products/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Product updated successfully');
        router.push('/admin/products');
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update product');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4 text-gray-400">
        <div className="w-8 h-8 border-2 border-[#00ff88]/30 border-t-[#00ff88] rounded-full animate-spin" />
        <span className="text-sm">Loading product details...</span>
      </div>
    );
  }

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
          <h1 className="text-3xl font-extrabold tracking-tight">Edit Product</h1>
          <p className="text-gray-400 mt-1">Modify details for: &quot;{name}&quot;</p>
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
                placeholder="Product name"
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
                placeholder="SKU"
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
                placeholder="Price"
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
                placeholder="Original Price"
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
                placeholder="Stock"
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
                placeholder="Warranty terms"
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
                placeholder="URLs"
                className="w-full px-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              />
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
                placeholder="Short tagline or key highlights"
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
                placeholder="Detailed description..."
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
                placeholder="intel, cpu"
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
                  placeholder="Key"
                  className="flex-1 px-4 py-2 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                  placeholder="Value"
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
          disabled={saving}
          className="w-full py-4 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-gray-950 font-bold rounded-xl hover:shadow-lg hover:shadow-[#00ff88]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4.5 h-4.5" />
              Update Product
            </>
          )}
        </button>
      </form>
    </div>
  );
}
