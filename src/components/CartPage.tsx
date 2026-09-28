import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Tag,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotals,
    setActivePage,
    appliedCoupon,
    applyCouponCode,
    removeCouponCode,
    openProductDetails,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCouponCode(couponInput.trim());
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] py-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-serif-display font-medium text-stone-900">
            Your shopping bag is empty
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Discover our hand-sculpted pipe cleaner bouquets, personalized birthday magazines, and
            keepsake gift hampers to begin your celebration.
          </p>
          <button
            onClick={() => setActivePage('products')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2D1F1D] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#3D2C29] transition-all cursor-pointer"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const freeShippingThreshold = 799;
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - cartTotals.subtotal);
  const progressPercent = Math.min(100, (cartTotals.subtotal / freeShippingThreshold) * 100);

  return (
    <div className="bg-[#FAF8F5] py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9A4C32]">
              Shopping Bag
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif-display font-medium text-stone-900">
              Your Selected Celebrations ({cartTotals.count} items)
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-stone-500 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Empty Bag</span>
          </button>
        </div>

        {/* Free Shipping Progress Callout */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs space-y-2">
          {neededForFreeShipping > 0 ? (
            <p className="text-xs text-stone-700">
              Add <strong className="font-mono text-[#9A4C32]">₹{neededForFreeShipping}</strong> more to your cart for <span className="font-semibold text-emerald-700">Free Express Delivery</span>!
            </p>
          ) : (
            <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Congratulations! Your order qualifies for Free Express Delivery across India.</span>
            </p>
          )}
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#9A4C32] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Main Grid: Items List + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 shadow-2xs"
              >
                {/* Product Image */}
                <div
                  onClick={() => openProductDetails(item.product.id, item.selectedDesign.id)}
                  className="w-full sm:w-28 sm:h-28 aspect-4/3 sm:aspect-square rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 cursor-pointer"
                >
                  <img
                    src={item.selectedDesign.image || item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info & Options */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          onClick={() => openProductDetails(item.product.id, item.selectedDesign.id)}
                          className="text-sm sm:text-base font-semibold text-stone-900 hover:text-[#9A4C32] transition-colors cursor-pointer"
                        >
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-[#9A4C32] font-medium mt-0.5">
                          Selected Model: {item.selectedDesign.name}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Palette: {item.selectedDesign.colorName} · Code: {item.selectedDesign.code}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Customization Details preview */}
                    {item.customization && (
                      <div className="mt-2 p-2 bg-[#FAF8F5] rounded-lg border border-stone-200/60 text-[11px] text-stone-700 space-y-0.5">
                        {item.customization.recipientName && (
                          <p>
                            <strong>Star Name: </strong>
                            {item.customization.recipientName}
                          </p>
                        )}
                        {item.customization.birthdayDate && (
                          <p>
                            <strong>Date: </strong>
                            {item.customization.birthdayDate}
                          </p>
                        )}
                        {item.customization.customMessage && (
                          <p className="italic text-stone-600">
                            &quot;{item.customization.customMessage}&quot;
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quantity & Unit Price */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500">Qty:</span>
                      <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-100 font-semibold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-mono font-bold tabular-nums text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-100 font-semibold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-bold font-mono text-stone-900 tabular-nums">
                        ₹{item.unitPrice * item.quantity}
                      </span>
                      <span className="block text-[10px] text-stone-400">
                        (₹{item.unitPrice} each)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom button: Continue Shopping */}
            <div className="pt-2">
              <button
                onClick={() => setActivePage('products')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#9A4C32] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping &amp; Add More Designs</span>
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout CTA */}
          <div className="lg:col-span-4 space-y-4">
            {/* Promo Code Box */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#9A4C32]" />
                <span>Apply Gift Coupon</span>
              </h3>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  <div>
                    <span className="font-bold font-mono">{appliedCoupon.code}</span>
                    <span className="block text-[11px] text-emerald-700">
                      {appliedCoupon.description}
                    </span>
                  </div>
                  <button
                    onClick={removeCouponCode}
                    className="text-stone-400 hover:text-stone-700 p-1 text-xs font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter WELCOME10 or CELEBRATE"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#9A4C32] uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2D1F1D] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#3D2C29] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Calculations Breakdown */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Order Price Breakdown
              </h3>

              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Cart Items Subtotal:</span>
                  <span className="font-mono tabular-nums">₹{cartTotals.subtotal}</span>
                </div>

                {cartTotals.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount:</span>
                    <span className="font-mono tabular-nums">-₹{cartTotals.discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span className="font-mono tabular-nums">
                    {cartTotals.delivery === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `₹${cartTotals.delivery}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST &amp; Studio Tax (5%):</span>
                  <span className="font-mono tabular-nums">₹{cartTotals.tax}</span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-stone-900">Grand Total:</span>
                  <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                    ₹{cartTotals.grandTotal}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                type="button"
                onClick={() => setActivePage('checkout')}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-[#2D1F1D] hover:bg-[#3D2C29] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Secure Checkout · Direct Artisan Crafting</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
