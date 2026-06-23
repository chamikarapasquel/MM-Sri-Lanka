'use client';

import { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Search,
  Star,
  X,
  SlidersHorizontal,
} from 'lucide-react';

import type { FilterState } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductFiltersProps {
  categories: string[];
  brands: string[];
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
  maxPrice?: number;
}

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/[0.06] pb-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold uppercase tracking-wider text-gray-300 transition-colors hover:text-white"
      >
        {title}
        {isOpen ? (
          <ChevronUp size={16} className="text-gray-500" />
        ) : (
          <ChevronDown size={16} className="text-gray-500" />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'mt-3 max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function ProductFilters({
  categories,
  brands,
  onFilterChange,
  activeFilters,
  maxPrice = 500000,
}: ProductFiltersProps) {
  const [brandSearch, setBrandSearch] = useState('');

  const filteredBrands = useMemo(
    () =>
      brands.filter((b) =>
        b.toLowerCase().includes(brandSearch.toLowerCase())
      ),
    [brands, brandSearch]
  );

  const activeCount =
    activeFilters.categories.length +
    activeFilters.brands.length +
    (activeFilters.minRating > 0 ? 1 : 0) +
    (activeFilters.inStockOnly ? 1 : 0) +
    (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < maxPrice
      ? 1
      : 0);

  /* Helper to update one key of the filter state */
  const update = (patch: Partial<FilterState>) => {
    onFilterChange({ ...activeFilters, ...patch });
  };

  const toggleArrayItem = (
    key: 'categories' | 'brands',
    value: string
  ) => {
    const list = activeFilters[key];
    update({
      [key]: list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value],
    });
  };

  const clearAll = () => {
    onFilterChange({
      categories: [],
      brands: [],
      priceRange: { min: 0, max: maxPrice },
      minRating: 0,
      inStockOnly: false,
    });
    setBrandSearch('');
  };

  return (
    <aside className="w-full rounded-2xl border border-white/[0.06] bg-[rgba(17,24,39,0.8)] p-5 backdrop-blur-md">
      {/* ── Header ──────────────────────────────── */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <SlidersHorizontal size={18} className="text-[#00d4ff]" />
          <span className="text-base font-bold">Filters</span>
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00d4ff] text-[10px] font-bold text-[#0a0e1a]">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs font-medium text-red-400 transition-colors hover:text-red-300"
          >
            <X size={12} />
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* ── Categories ────────────────────────── */}
        <CollapsibleSection title="Category">
          <ul className="flex flex-col gap-1.5">
            {categories.map((cat) => {
              const isActive = activeFilters.categories.includes(cat);
              return (
                <li key={cat}>
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => toggleArrayItem('categories', cat)}
                      className="h-4 w-4 rounded border-gray-600 bg-transparent text-[#00d4ff] accent-[#00d4ff] focus:ring-[#00d4ff]/30"
                    />
                    <span
                      className={`text-sm ${
                        isActive ? 'font-medium text-white' : 'text-gray-400'
                      }`}
                    >
                      {cat}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </CollapsibleSection>

        {/* ── Brands ────────────────────────────── */}
        <CollapsibleSection title="Brand">
          {/* Brand search */}
          {brands.length > 6 && (
            <div className="relative mb-3">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search brands…"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="w-full rounded-lg border border-white/[0.08] bg-white/5 py-2 pl-9 pr-3 text-sm text-gray-300 placeholder-gray-600 outline-none transition-colors focus:border-[#00d4ff]/30 focus:bg-white/[0.07]"
              />
            </div>
          )}
          <ul className="flex max-h-52 flex-col gap-1.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700">
            {filteredBrands.map((brand) => {
              const isActive = activeFilters.brands.includes(brand);
              return (
                <li key={brand}>
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => toggleArrayItem('brands', brand)}
                      className="h-4 w-4 rounded border-gray-600 bg-transparent text-[#00d4ff] accent-[#00d4ff] focus:ring-[#00d4ff]/30"
                    />
                    <span
                      className={`text-sm ${
                        isActive ? 'font-medium text-white' : 'text-gray-400'
                      }`}
                    >
                      {brand}
                    </span>
                  </label>
                </li>
              );
            })}
            {filteredBrands.length === 0 && (
              <li className="px-2 py-2 text-xs text-gray-600">
                No brands match &quot;{brandSearch}&quot;
              </li>
            )}
          </ul>
        </CollapsibleSection>

        {/* ── Price Range ───────────────────────── */}
        <CollapsibleSection title="Price Range">
          <div className="flex flex-col gap-4">
            {/* Min/Max inputs */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-gray-500">
                  Min
                </label>
                <input
                  type="number"
                  min={0}
                  max={activeFilters.priceRange.max}
                  value={activeFilters.priceRange.min}
                  onChange={(e) =>
                    update({
                      priceRange: {
                        ...activeFilters.priceRange,
                        min: Math.max(0, Number(e.target.value)),
                      },
                    })
                  }
                  className="w-full rounded-lg border border-white/[0.08] bg-white/5 px-3 py-2 text-sm text-gray-300 outline-none transition-colors focus:border-[#00d4ff]/30"
                />
              </div>
              <span className="mt-5 text-gray-600">–</span>
              <div className="flex-1">
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-gray-500">
                  Max
                </label>
                <input
                  type="number"
                  min={activeFilters.priceRange.min}
                  max={maxPrice}
                  value={activeFilters.priceRange.max}
                  onChange={(e) =>
                    update({
                      priceRange: {
                        ...activeFilters.priceRange,
                        max: Math.min(maxPrice, Number(e.target.value)),
                      },
                    })
                  }
                  className="w-full rounded-lg border border-white/[0.08] bg-white/5 px-3 py-2 text-sm text-gray-300 outline-none transition-colors focus:border-[#00d4ff]/30"
                />
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={0}
              max={maxPrice}
              step={1000}
              value={activeFilters.priceRange.max}
              onChange={(e) =>
                update({
                  priceRange: {
                    ...activeFilters.priceRange,
                    max: Number(e.target.value),
                  },
                })
              }
              className="w-full accent-[#00d4ff]"
            />
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>{formatPrice(activeFilters.priceRange.min)}</span>
              <span>{formatPrice(activeFilters.priceRange.max)}</span>
            </div>
          </div>
        </CollapsibleSection>

        {/* ── Rating ────────────────────────────── */}
        <CollapsibleSection title="Rating">
          <div className="flex flex-col gap-1.5">
            {[4, 3, 2, 1].map((minRating) => {
              const isActive = activeFilters.minRating === minRating;
              return (
                <button
                  key={minRating}
                  onClick={() =>
                    update({ minRating: isActive ? 0 : minRating })
                  }
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/5 ${
                    isActive ? 'bg-white/[0.07] ring-1 ring-[#00d4ff]/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < minRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-700'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">& up</span>
                </button>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* ── Availability ──────────────────────── */}
        <div className="pt-1">
          <label className="flex cursor-pointer items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 border border-white/[0.06] transition-colors hover:bg-white/[0.06]">
            <div>
              <span className="text-sm font-medium text-gray-300">
                In Stock Only
              </span>
              <p className="text-[11px] text-gray-600">
                Hide out-of-stock items
              </p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={activeFilters.inStockOnly}
                onChange={(e) => update({ inStockOnly: e.target.checked })}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-gray-700 transition-colors peer-checked:bg-[#00d4ff]" />
              <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
            </div>
          </label>
        </div>
      </div>
    </aside>
  );
}
