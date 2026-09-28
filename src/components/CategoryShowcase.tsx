import React from 'react';
import { useShop } from '../context/ShopContext';
import { CategoryId } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

export const CategoryShowcase: React.FC = () => {
  const { categories, setSelectedCategoryFilter, setActivePage } = useShop();

  const handleCategoryClick = (catId: CategoryId) => {
    setSelectedCategoryFilter(catId);
    setActivePage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-14 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9A4C32]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Curated Celebration Categories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-display font-medium text-[#2D1F1D] tracking-tight">
            Explore Our Handcrafted Collections
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            From playful velvet flowers to personalized editorial publications, find the perfect
            artisan gift for every milestone.
          </p>
        </div>

        {/* 9 Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Category Image */}
              <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Badge count */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#2D1F1D] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-stone-200">
                  {category.count} Designs
                </div>

                {/* Category title on image */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif-display text-base sm:text-lg font-medium leading-snug group-hover:text-[#F5C27E] transition-colors">
                    {category.name}
                  </h3>
                </div>
              </div>

              {/* Tagline & View Action */}
              <div className="p-3.5 sm:p-4 bg-white flex items-center justify-between gap-2 border-t border-stone-100">
                <p className="text-xs text-stone-500 line-clamp-1">
                  {category.tagline}
                </p>
                <span className="shrink-0 text-xs font-semibold text-[#9A4C32] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span className="hidden sm:inline">Browse</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
