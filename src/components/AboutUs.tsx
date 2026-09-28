import React from 'react';
import { useShop } from '../context/ShopContext';
import { HERO_IMAGE, FLOWER_IMAGE, MAGAZINE_IMAGE } from '../data/initialData';
import { Sparkles, Heart, Award, ShieldCheck, ArrowRight } from 'lucide-react';

export const AboutUs: React.FC = () => {
  const { setActivePage } = useShop();

  return (
    <div className="bg-[#FAF8F5] py-12 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9A4C32]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Our Handcrafted Story</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-display font-medium text-stone-900 tracking-tight">
            Crafting Everlasting Memories &amp; Editorial Keepsakes
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Founded with a passion for creative celebrations, Petal &amp; Print reimagines traditional
            gifting through velvety chenille florals and bespoke glossy magazines.
          </p>
        </div>

        {/* Feature Story 1: The Pipe Cleaner Flowers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-2xs">
          <div className="space-y-4 text-xs sm:text-sm text-stone-600">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9A4C32] block">
              1. The Art of Chenille Stem Florals
            </span>
            <h2 className="text-xl sm:text-2xl font-serif-display font-medium text-stone-900 leading-tight">
              Flowers That Never Fade, Just Like Your Most Cherished Bonds
            </h2>
            <p className="leading-relaxed">
              Real flowers wither in days, but the memories of a milestone birthday or graduation deserve
              to last forever. We shape each petal, stamen, and leaf using ultra-plush, high-density velvet
              chenille wire.
            </p>
            <p className="leading-relaxed">
              Every tulip, rose, and sunflower bouquet is handcrafted over several hours at our studio
              benches, wrapped in frosted floral film, and tied with double-faced silk ribbons.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-4/3 bg-stone-100 shadow-sm border border-stone-200">
            <img
              src={FLOWER_IMAGE}
              alt="Pipe cleaner flowers handcrafting"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Feature Story 2: Birthday Magazines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-2xs">
          <div className="order-2 md:order-1 rounded-2xl overflow-hidden aspect-4/3 bg-stone-100 shadow-sm border border-stone-200">
            <img
              src={MAGAZINE_IMAGE}
              alt="Custom birthday magazines"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="order-1 md:order-2 space-y-4 text-xs sm:text-sm text-stone-600">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9A4C32] block">
              2. Editorial Publication Studio
            </span>
            <h2 className="text-xl sm:text-2xl font-serif-display font-medium text-stone-900 leading-tight">
              Making Everyday Legends Into Glossy Cover Stars
            </h2>
            <p className="leading-relaxed">
              Why settle for an ordinary paper greeting card when your loved one can be on the cover
              of their very own Vogue or Time-capsule style magazine?
            </p>
            <p className="leading-relaxed">
              Our graphic designers lay out genuine 12-page printed journals with customized interviews,
              photo collages, milestone timelines, and witty editorial articles. Dispatched in luxury presentation
              folders that become timeless family heirlooms.
            </p>
          </div>
        </div>

        {/* Quality Pledge */}
        <div className="bg-[#2D1F1D] text-white p-8 sm:p-10 rounded-3xl text-center space-y-4 shadow-lg">
          <Heart className="w-10 h-10 text-[#D44D5C] mx-auto fill-[#D44D5C]" />
          <h2 className="text-2xl font-serif-display font-medium">Our Artisan Commitment</h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
            Every order is custom-crafted to order. We never ship mass-manufactured plastics. When you
            hold a Petal &amp; Print creation, you hold hours of dedicated artistry made specifically for
            your special someone.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActivePage('products')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#9A4C32] hover:bg-[#833F29] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
            >
              <span>Explore Our Handcrafted Goods</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
