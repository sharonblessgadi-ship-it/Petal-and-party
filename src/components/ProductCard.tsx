import React from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Star, Heart, ShoppingBag, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    openProductDetails,
    addToCart,
    startBuyNow,
    toggleWishlist,
    isWishlisted,
  } = useShop();

  const wishlisted = isWishlisted(product.id);
  const defaultDesign = product.designs[0];

  const handleCardClick = () => {
    openProductDetails(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, defaultDesign, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    startBuyNow(product, defaultDesign, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Media Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Wishlist Button (Heart Icon) */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs text-stone-700 hover:text-red-600 shadow-sm transition-transform active:scale-90 z-10 cursor-pointer"
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted ? 'fill-[#D44D5C] text-[#D44D5C]' : 'text-stone-600'
            }`}
          />
        </button>

        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-[#9A4C32] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
            {product.discountPercent}% OFF
          </div>
        )}

        {/* Design Count Pill */}
        <div className="absolute bottom-2 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
          {product.designs.length} Designs Available
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category kicker */}
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#9A4C32] block mb-1">
            {product.category.replace(/-/g, ' ')}
          </span>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-stone-900 group-hover:text-[#9A4C32] transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200/60 px-1.5 py-0.5 rounded text-[11px] font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-[11px] text-stone-400">({product.reviewCount} reviews)</span>
          </div>

          {/* Stock / Availability Status */}
          <div className="mt-2 flex items-center gap-1 text-[11px]">
            {product.inStock ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Available</span>
                {product.stock <= 5 && (
                  <span className="text-amber-700 font-normal ml-1">
                    (Only {product.stock} left!)
                  </span>
                )}
              </span>
            ) : (
              <span className="text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>Out of Stock</span>
              </span>
            )}
          </div>

          {/* Price, Discounted Price, & Discount % */}
          <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold font-mono text-stone-900 tabular-nums">
              ₹{product.basePrice}
            </span>
            {product.originalPrice > product.basePrice && (
              <>
                <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                  ₹{product.originalPrice}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  ({product.discountPercent}% OFF)
                </span>
              </>
            )}
          </div>
        </div>

        {/* Buttons: [Add to Cart] [Buy Now] as requested */}
        <div className="mt-3.5 pt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white hover:bg-stone-50 border border-[#2D1F1D] text-[#2D1F1D] text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 bg-[#9A4C32] hover:bg-[#833F29] text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
