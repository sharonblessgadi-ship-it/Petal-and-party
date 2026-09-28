import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { CategoryId } from '../types';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Filter,
  X,
} from 'lucide-react';

type SortOption = 'popularity' | 'price-low' | 'price-high' | 'rating' | 'newest';

export const ProductList: React.FC = () => {
  const {
    products,
    categories,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
  } = useShop();

  // Filters state
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [newArrivalsOnly, setNewArrivalsOnly] = useState<boolean>(false);
  const [bestSellersOnly, setBestSellersOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategoryFilter('all');
    setSearchQuery('');
    setMaxPrice(2000);
    setMinRating(0);
    setInStockOnly(false);
    setNewArrivalsOnly(false);
    setBestSellersOnly(false);
    setSortBy('popularity');
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search filter (name, category, tagline, description, materials)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            product.name.toLowerCase().includes(q) ||
            product.tagline.toLowerCase().includes(q) ||
            product.category.toLowerCase().includes(q) ||
            product.description.toLowerCase().includes(q) ||
            product.materials.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Category filter
        if (selectedCategoryFilter !== 'all') {
          const hasCategory =
            product.category === selectedCategoryFilter ||
            product.categories.includes(selectedCategoryFilter);
          if (!hasCategory) return false;
        }

        // Price filter
        if (product.basePrice > maxPrice) return false;

        // Rating filter
        if (minRating > 0 && product.rating < minRating) return false;

        // In-stock filter
        if (inStockOnly && !product.inStock) return false;

        // New arrivals filter
        if (newArrivalsOnly && !product.isNewArrival) return false;

        // Best sellers filter
        if (bestSellersOnly && !product.isBestSeller) return false;

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.basePrice - b.basePrice;
          case 'price-high':
            return b.basePrice - a.basePrice;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
          case 'popularity':
          default:
            return b.reviewCount - a.reviewCount;
        }
      });
  }, [
    products,
    searchQuery,
    selectedCategoryFilter,
    maxPrice,
    minRating,
    inStockOnly,
    newArrivalsOnly,
    bestSellersOnly,
    sortBy,
  ]);

  const filterSidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-900">
          <Filter className="w-3.5 h-3.5 text-[#9A4C32]" />
          <span>Filter Products</span>
        </div>
        <button
          onClick={resetFilters}
          className="text-[11px] text-[#9A4C32] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800 mb-2.5">
          Product Categories
        </h4>
        <div className="space-y-1.5">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex justify-between items-center ${
              selectedCategoryFilter === 'all'
                ? 'bg-[#2D1F1D] text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>All Creative Goods</span>
            <span className="text-[10px] opacity-80">{products.length}</span>
          </button>
          {categories.map((cat) => {
            const count = products.filter(
              (p) => p.category === cat.id || p.categories.includes(cat.id)
            ).length;
            const isSelected = selectedCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex justify-between items-center ${
                  isSelected
                    ? 'bg-[#2D1F1D] text-white font-semibold'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span className="truncate pr-2">{cat.name}</span>
                <span className="text-[10px] opacity-75 shrink-0">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-stone-200">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
            Price Range
          </h4>
          <span className="font-mono text-xs font-bold text-[#9A4C32]">
            Up to ₹{maxPrice}
          </span>
        </div>
        <input
          type="range"
          min="400"
          max="2000"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#9A4C32] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-stone-400 mt-1">
          <span>₹400</span>
          <span>₹1,200</span>
          <span>₹2,000+</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="pt-4 border-t border-stone-200">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800 mb-2">
          Minimum Customer Rating
        </h4>
        <div className="space-y-1.5">
          {[
            { val: 0, label: 'All Ratings' },
            { val: 4.8, label: '★ 4.8 & above' },
            { val: 4.5, label: '★ 4.5 & above' },
            { val: 4.0, label: '★ 4.0 & above' },
          ].map((r) => (
            <label
              key={r.val}
              className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer hover:text-stone-900"
            >
              <input
                type="radio"
                name="rating"
                checked={minRating === r.val}
                onChange={() => setMinRating(r.val)}
                className="text-[#9A4C32] focus:ring-[#9A4C32]"
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Toggles: Availability, New Arrivals, Best Sellers */}
      <div className="pt-4 border-t border-stone-200 space-y-2.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800 mb-1">
          Special Filters
        </h4>

        <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded text-[#9A4C32] focus:ring-[#9A4C32]"
          />
          <span>In Stock Items Only</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={newArrivalsOnly}
            onChange={(e) => setNewArrivalsOnly(e.target.checked)}
            className="rounded text-[#9A4C32] focus:ring-[#9A4C32]"
          />
          <span>New Arrivals This Week</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={bestSellersOnly}
            onChange={(e) => setBestSellersOnly(e.target.checked)}
            className="rounded text-[#9A4C32] focus:ring-[#9A4C32]"
          />
          <span>Top Best Sellers</span>
        </label>
      </div>
    </div>
  );

  return (
    <section className="py-10 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Search Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#9A4C32]">
                Celebration Storefront
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif-display font-medium text-[#2D1F1D] tracking-tight">
                {selectedCategoryFilter === 'all'
                  ? 'All Handcrafted Creations'
                  : categories.find((c) => c.id === selectedCategoryFilter)?.name || 'Products'}
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Showing {filteredProducts.length} unique handcrafted gifting products
              </p>
            </div>

            {/* Search Input in Product List Header */}
            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by flower, magazine, gift..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#9A4C32] focus:ring-1 focus:ring-[#9A4C32]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden p-2 rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 flex items-center gap-1 text-xs font-semibold"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#9A4C32]" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategoryFilter === 'all'
                  ? 'bg-[#2D1F1D] text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
              }`}
            >
              All Items ({products.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategoryFilter(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategoryFilter === c.id
                    ? 'bg-[#2D1F1D] text-white shadow-2xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Active Filters Summary & Sort Dropdown */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200/80">
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <span className="font-semibold text-stone-900">
                {filteredProducts.length} Results
              </span>
              {searchQuery && (
                <span className="bg-stone-200 text-stone-800 px-2 py-0.5 rounded text-[11px]">
                  Keyword: &quot;{searchQuery}&quot;
                </span>
              )}
              {selectedCategoryFilter !== 'all' && (
                <span className="bg-stone-200 text-stone-800 px-2 py-0.5 rounded text-[11px]">
                  Category: {selectedCategoryFilter.replace(/-/g, ' ')}
                </span>
              )}
            </div>

            {/* Sort by dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
              <label htmlFor="sort-select" className="text-xs font-semibold text-stone-700">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-white border border-stone-300 text-stone-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#9A4C32]"
              >
                <option value="popularity">Popularity (Most Reviewed)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar Filter */}
          <div className="hidden lg:block lg:col-span-3 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs sticky top-24">
            {filterSidebarContent}
          </div>

          {/* Mobile Filter Modal */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex justify-end">
              <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                  <span className="font-semibold text-stone-900">Filters</span>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 text-stone-400 hover:text-stone-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {filterSidebarContent}
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-2.5 bg-[#2D1F1D] text-white text-xs font-bold uppercase tracking-wider rounded-xl"
                >
                  Apply Filters ({filteredProducts.length} Items)
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200/90 p-12 text-center space-y-3">
                <Sparkles className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="text-base font-semibold text-stone-900">
                  No matching handcrafted products found
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try adjusting your price range, clearing your search query, or resetting filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2D1F1D] text-white text-xs font-semibold uppercase tracking-wider rounded-xl"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
