import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductDesign, CustomizationData, ProductReview } from '../types';
import { db } from '../services/db';
import { ProductCard } from './ProductCard';
import {
  Star,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Zap,
  Heart,
  Palette,
  Edit3,
  Calendar,
  Layers,
  Send,
  ArrowLeft,
} from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const {
    selectedProductId,
    selectedDesignId,
    products,
    openProductDetails,
    addToCart,
    startBuyNow,
    toggleWishlist,
    isWishlisted,
    user,
    setActivePage,
    showToast,
  } = useShop();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  // Active Design state
  const [activeDesignId, setActiveDesignId] = useState<string>(() => {
    return selectedDesignId || product?.designs[0]?.id || '';
  });

  // Selected thumbnail image
  const [activeImage, setActiveImage] = useState<string>(() => {
    return product?.images[0] || '';
  });

  // Quantity
  const [quantity, setQuantity] = useState<number>(1);

  // Customization inputs (as required in user prompt)
  const [recipientName, setRecipientName] = useState<string>('');
  const [birthdayDate, setBirthdayDate] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [preferredColor, setPreferredColor] = useState<string>('');

  // Reviews state & new review form
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    return db.getReviews(product?.id);
  });
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [newReviewAuthor, setNewReviewAuthor] = useState<string>('');

  // Keep synced if product or design changes
  useEffect(() => {
    if (product) {
      const design =
        (selectedDesignId && product.designs.find((d) => d.id === selectedDesignId)) ||
        product.designs[0];
      if (design) {
        setActiveDesignId(design.id);
        setActiveImage(design.image || product.images[0]);
      } else {
        setActiveImage(product.images[0]);
      }
      setReviews(db.getReviews(product.id));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product, selectedDesignId]);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p>Product not found.</p>
        <button
          onClick={() => setActivePage('products')}
          className="mt-4 px-4 py-2 bg-[#2D1F1D] text-white rounded-lg text-xs"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const activeDesign: ProductDesign =
    product.designs.find((d) => d.id === activeDesignId) || product.designs[0];

  const handleDesignSelect = (design: ProductDesign) => {
    setActiveDesignId(design.id);
    if (design.image) {
      setActiveImage(design.image);
    }
  };

  // Price calculation with design delta
  const effectiveBasePrice = product.basePrice + (activeDesign?.priceDelta || 0);
  const effectiveOriginalPrice = product.originalPrice + (activeDesign?.priceDelta || 0);
  const totalAmount = effectiveBasePrice * quantity;
  const wishlisted = isWishlisted(product.id);

  const getCustomizationData = (): CustomizationData | undefined => {
    if (!product.allowCustomization) return undefined;
    return {
      recipientName: recipientName.trim() || undefined,
      birthdayDate: birthdayDate.trim() || undefined,
      customMessage: customMessage.trim() || undefined,
      preferredColor: preferredColor.trim() || activeDesign.colorName,
    };
  };

  const handleAddToCart = () => {
    addToCart(product, activeDesign, quantity, getCustomizationData());
  };

  const handleBuyNow = () => {
    startBuyNow(product, activeDesign, quantity, getCustomizationData());
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const author = user?.fullName || newReviewAuthor.trim() || 'Happy Customer';
    const email = user?.email || 'customer@example.com';

    const created = db.addReview({
      productId: product.id,
      userName: author,
      userEmail: email,
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      verifiedPurchase: true,
    });

    setReviews([created, ...reviews]);
    setNewReviewComment('');
    setNewReviewAuthor('');
    showToast('Thank you! Your customer review was submitted.');
  };

  // Similar products & Customers also viewed
  const similarProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const customersAlsoViewed = products
    .filter((p) => p.id !== product.id && !similarProducts.includes(p))
    .slice(0, 3);

  return (
    <div className="bg-[#FAF8F5] py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back navigation button */}
        <div>
          <button
            onClick={() => setActivePage('products')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#9A4C32] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Products</span>
          </button>
        </div>

        {/* Section 1: Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm">
          {/* Left Column: Image Gallery & Previews */}
          <div className="lg:col-span-6 space-y-4">
            {/* Large Hero Image */}
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 group">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Wishlist Heart on Large Image */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-xs text-stone-700 hover:text-red-600 shadow-md transition-all active:scale-95 cursor-pointer"
                title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart
                  className={`w-5 h-5 ${
                    wishlisted ? 'fill-[#D44D5C] text-[#D44D5C]' : 'text-stone-600'
                  }`}
                />
              </button>

              {/* Discount Tag */}
              {product.discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-[#9A4C32] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-xs">
                  {product.discountPercent}% OFF
                </div>
              )}

              {/* Active Design Badge */}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-lg">
                Selected: <span className="font-semibold">{activeDesign.name}</span>
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImage === img
                      ? 'border-[#9A4C32] ring-2 ring-[#9A4C32]/20'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
              {product.designs.map((des) => (
                <button
                  key={des.id}
                  onClick={() => handleDesignSelect(des)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 relative cursor-pointer ${
                    activeDesign.id === des.id
                      ? 'border-[#9A4C32] ring-2 ring-[#9A4C32]/20'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                  title={des.name}
                >
                  <img
                    src={des.image}
                    alt={des.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center py-0.5 truncate px-1">
                    {des.code}
                  </div>
                </button>
              ))}
            </div>

            {/* Assurance badges */}
            <div className="pt-4 border-t border-stone-100 grid grid-cols-3 gap-2 text-center text-[11px] text-stone-600">
              <div className="p-2 bg-[#FAF8F5] rounded-xl border border-stone-200/60">
                <Truck className="w-4 h-4 mx-auto text-[#9A4C32] mb-1" />
                <span className="font-semibold block text-stone-900">Pan-India Express</span>
                <span>3–5 Business Days</span>
              </div>
              <div className="p-2 bg-[#FAF8F5] rounded-xl border border-stone-200/60">
                <ShieldCheck className="w-4 h-4 mx-auto text-[#9A4C32] mb-1" />
                <span className="font-semibold block text-stone-900">Quality Checked</span>
                <span>Flawless Handcrafted Finish</span>
              </div>
              <div className="p-2 bg-[#FAF8F5] rounded-xl border border-stone-200/60">
                <RotateCcw className="w-4 h-4 mx-auto text-[#9A4C32] mb-1" />
                <span className="font-semibold block text-stone-900">Transit Safe</span>
                <span>Damage Replacement Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Design Selector, Customization, Add to Cart & Buy Now */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              {/* Category & Code */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span className="text-xs uppercase font-bold tracking-wider text-[#9A4C32]">
                  {product.category.replace(/-/g, ' ')}
                </span>
                <span className="font-mono text-stone-400">SKU: {activeDesign.code}</span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-serif-display font-medium text-stone-900 leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
                {product.tagline}
              </p>

              {/* Star Rating & Reviews */}
              <div className="flex items-center gap-3 mt-3">
                <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-stone-500">
                  Based on {product.reviewCount} customer reviews
                </span>
                <span className="text-stone-300">·</span>
                {product.inStock ? (
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock ({product.stock} units available)</span>
                  </span>
                ) : (
                  <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Currently Out of Stock</span>
                  </span>
                )}
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold font-mono text-stone-900 tabular-nums">
                  ₹{effectiveBasePrice}
                </span>
                {effectiveOriginalPrice > effectiveBasePrice && (
                  <>
                    <span className="text-sm text-stone-400 line-through font-mono tabular-nums">
                      ₹{effectiveOriginalPrice}
                    </span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                      Save ₹{effectiveOriginalPrice - effectiveBasePrice} ({product.discountPercent}% OFF)
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-stone-500">
                Inclusive of all crafting taxes · Free doorstep delivery on orders above ₹799
              </p>
              {activeDesign.priceDelta > 0 && (
                <p className="text-[11px] text-[#9A4C32] font-semibold pt-1">
                  Includes +₹{activeDesign.priceDelta} upgrade for {activeDesign.name}
                </p>
              )}
            </div>

            {/* SECTION 8: DESIGN SELECTION */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-900">
                  <Palette className="w-3.5 h-3.5 text-[#9A4C32]" />
                  <span>Choose Design / Model ({product.designs.length} Variations)</span>
                </div>
                <span className="text-xs text-stone-500">
                  Active: <strong className="text-stone-800">{activeDesign.colorName}</strong>
                </span>
              </div>

              {/* Design buttons grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.designs.map((design) => {
                  const isSelected = design.id === activeDesign.id;
                  return (
                    <button
                      key={design.id}
                      type="button"
                      onClick={() => handleDesignSelect(design)}
                      className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                        isSelected
                          ? 'border-[#9A4C32] bg-[#FAF2ED] ring-2 ring-[#9A4C32]/30 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        {/* Color swatches */}
                        <div className="flex items-center gap-1.5">
                          {design.colorHexList.map((hex, i) => (
                            <div
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-stone-200 shadow-2xs"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>

                        {design.priceDelta > 0 && (
                          <span className="text-[10px] font-mono text-[#9A4C32] font-semibold bg-white px-1.5 py-0.2 rounded border border-stone-200">
                            +₹{design.priceDelta}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-stone-900 mt-2 leading-tight">
                        {design.name}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5 truncate">
                        {design.colorName}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customization Options Input (as requested in user prompt) */}
            {product.allowCustomization && (
              <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/80 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-900">
                  <Edit3 className="w-3.5 h-3.5 text-[#9A4C32]" />
                  <span>Personalize This Creation (Free Customization)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Recipient / Star Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sharon Bless"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:border-[#9A4C32]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Birthday / Event Date
                    </label>
                    <input
                      type="date"
                      value={birthdayDate}
                      onChange={(e) => setBirthdayDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:border-[#9A4C32]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Birthday Wishes / Special Message (Printed on Ribbon or Magazine editorial)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Happy 25th Birthday to our brightest star! Forever grateful for you."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:border-[#9A4C32]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Preferred Color Theme
                  </label>
                  <input
                    type="text"
                    placeholder={`Default: ${activeDesign.colorName}`}
                    value={preferredColor}
                    onChange={(e) => setPreferredColor(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:border-[#9A4C32]"
                  />
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Quantity:
              </span>
              <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-1.5 text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold font-mono tabular-nums text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3.5 py-1.5 text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  +
                </button>
              </div>

              <span className="text-xs font-mono font-semibold text-stone-600">
                Total: ₹{totalAmount}
              </span>
            </div>

            {/* Buttons: [Add to Cart] [Buy Now] */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-white hover:bg-stone-50 border-2 border-[#2D1F1D] text-[#2D1F1D] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-[#9A4C32] hover:bg-[#833F29] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now · ₹{totalAmount}</span>
              </button>
            </div>

            {/* Materials, Dimensions, Dispatch Time */}
            <div className="pt-4 border-t border-stone-200 text-xs space-y-2 text-stone-600">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <strong className="text-stone-800">Materials: </strong>
                  {product.materials}
                </div>
                <div>
                  <strong className="text-stone-800">Dimensions: </strong>
                  {product.dimensions}
                </div>
              </div>
              <div>
                <strong className="text-stone-800">Care Instructions: </strong>
                {product.careInstructions}
              </div>
              <div className="text-[#9A4C32] font-medium">
                <strong>Dispatch: </strong>
                {product.dispatchTime}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Detailed Description & Product Story */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-4">
          <h3 className="text-xl font-serif-display font-medium text-stone-900">
            About This Handcrafted Piece
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
            {product.description}
          </p>
        </div>

        {/* Section 3: Customer Ratings & Reviews */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-xl font-serif-display font-medium text-stone-900">
                Customer Ratings &amp; Reviews ({reviews.length})
              </h3>
              <p className="text-xs text-stone-500">
                Real feedback from celebrators who received this creation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="font-mono font-bold text-stone-900">{product.rating.toFixed(1)} / 5</span>
            </div>
          </div>

          {/* Leave a review form */}
          <form
            onSubmit={handleReviewSubmit}
            className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-3"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Share Your Celebration Experience
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-600">Your Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNewReviewRating(num)}
                    className="p-1 text-amber-400"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        num <= newReviewRating ? 'fill-amber-400' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {!user && (
              <input
                type="text"
                placeholder="Your Name (e.g. Sharon G.)"
                value={newReviewAuthor}
                onChange={(e) => setNewReviewAuthor(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
              />
            )}

            <textarea
              rows={2}
              placeholder="What made this gift memorable? How was the velvet flower texture or magazine print?"
              value={newReviewComment}
              onChange={(e) => setNewReviewComment(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:border-[#9A4C32]"
            />

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2D1F1D] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#3D2C29]"
            >
              <Send className="w-3 h-3" />
              <span>Submit Review</span>
            </button>
          </form>

          {/* Existing reviews list */}
          <div className="space-y-4 pt-2">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-stone-900">{rev.userName}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-medium">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-400">{rev.date}</span>
                </div>

                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < rev.rating ? 'fill-amber-400' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Similar Products & Customers Also Viewed */}
        {similarProducts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9A4C32]" />
              <h3 className="text-xl font-serif-display font-medium text-stone-900">
                Similar Handcrafted Products
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {customersAlsoViewed.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-serif-display font-medium text-stone-900">
              Customers Also Viewed
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {customersAlsoViewed.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
