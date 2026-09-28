import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlistIds, products, setActivePage } = useShop();

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="py-20 text-center bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-[#D44D5C] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-serif-display font-medium text-stone-900">
            Your Wishlist is empty
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Tap the heart icon on any bouquet, birthday magazine, or gift box to save it here for
            later celebrations.
          </p>
          <button
            onClick={() => setActivePage('products')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2D1F1D] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#3D2C29] transition-all cursor-pointer"
          >
            <span>Explore Handcrafted Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9A4C32]">
              Saved Creations
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif-display font-medium text-stone-900">
              My Celebration Wishlist ({wishlistedProducts.length})
            </h1>
          </div>

          <button
            onClick={() => setActivePage('products')}
            className="text-xs font-semibold text-stone-600 hover:text-[#9A4C32] flex items-center gap-1 cursor-pointer"
          >
            <span>Browse More</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlistedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
};
