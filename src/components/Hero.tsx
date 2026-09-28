import React from 'react';
import { useShop } from '../context/ShopContext';
import { HERO_IMAGE } from '../data/initialData';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Truck, Gift } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActivePage, setSelectedCategoryFilter } = useShop();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] to-[#F5EFE6] border-b border-[#EAE3D6] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0E6] border border-[#EED9C7] text-xs font-semibold text-[#9A4C32] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Boutique Creative Gifting Studio</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-display font-medium text-[#2D1F1D] leading-[1.12] tracking-tight">
              Make Every Celebration Special
            </h1>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl">
              Discover everlasting handmade pipe cleaner flower bouquets that never wilt, personalized
              glossy birthday magazines customized with your photos and stories, and handcrafted celebration gift
              boxes made to create unforgettable memories.
            </p>

            {/* Buttons required by user */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedCategoryFilter('all');
                  setActivePage('products');
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#2D1F1D] hover:bg-[#3D2C29] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategoryFilter('best-sellers');
                  setActivePage('products');
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-stone-50 border-2 border-[#9A4C32] text-[#9A4C32] text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                <span>Explore Collections</span>
                <Gift className="w-4 h-4" />
              </button>
            </div>

            {/* Trust highlights */}
            <div className="pt-6 border-t border-stone-300/60 grid grid-cols-3 gap-3 text-xs text-stone-700">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#9A4C32] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-stone-900">100% Handcrafted</span>
                  <span className="text-[11px] text-stone-500">Meticulous wire shaping</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#9A4C32] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-stone-900">Safe Pan-India Delivery</span>
                  <span className="text-[11px] text-stone-500">Rigid protective boxing</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <HeartHandshake className="w-4 h-4 text-[#9A4C32] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-stone-900">Personalized Proofs</span>
                  <span className="text-[11px] text-stone-500">WhatsApp review before print</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Visual */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200/90 group bg-stone-100">
              <img
                src={HERO_IMAGE}
                alt="Handcrafted pipe cleaner flowers and birthday magazines on studio craft table"
                className="w-full h-80 sm:h-96 lg:h-[440px] object-cover object-center group-hover:scale-103 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

              {/* Float badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-semibold text-[#2D1F1D] shadow-sm border border-white/60">
                ✨ Over 1,500+ Celebrations Made Magical
              </div>

              {/* Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <p className="font-serif-display text-base font-medium">Boutique Everlasting Blooms</p>
                  <p className="text-stone-300 text-[11px]">Chenille Tulips · Roses · Birthday Magazines · Custom Hampers</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategoryFilter('pipe-cleaner-flowers');
                    setActivePage('products');
                  }}
                  className="bg-[#9A4C32] hover:bg-[#833F29] text-white px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  View Flowers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
