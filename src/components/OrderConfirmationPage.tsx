import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { lastPlacedOrder, setActivePage, orders } = useShop();

  const order = lastPlacedOrder || orders[0];

  if (!order) {
    return (
      <div className="py-20 text-center bg-[#FAF8F5]">
        <p>No recent order found.</p>
        <button
          onClick={() => setActivePage('products')}
          className="mt-4 px-4 py-2 bg-[#2D1F1D] text-white text-xs rounded-xl"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] py-12 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Success Card Header */}
        <div className="bg-[#2D1F1D] text-white rounded-3xl p-8 sm:p-10 text-center shadow-lg relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          </div>

          <h1 className="text-3xl font-serif-display font-medium tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Thank you for celebrating with Petal &amp; Print. Our artisans have received your custom order
            and are preparing your handcrafted creations.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-mono text-[#F5C27E]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Order ID: {order.orderNumber}</span>
          </div>

          <p className="text-[11px] text-stone-400 mt-2">
            An order confirmation with digital proofs has been dispatched to {order.userEmail}.
          </p>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
          {/* Key Facts Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Status
              </span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{order.orderStatus}</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Estimated Delivery Date
              </span>
              <span className="font-semibold text-stone-900 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#9A4C32]" />
                <span>{order.estimatedDeliveryDate}</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Payment Method
              </span>
              <span className="font-semibold text-stone-900 uppercase mt-0.5 block">
                {order.paymentMethod} ({order.paymentStatus})
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#9A4C32]" />
              <span>Delivery Address</span>
            </span>
            <p className="font-semibold text-stone-900 text-sm">{order.shippingAddress.fullName}</p>
            <p className="text-stone-600">
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
            </p>
            <p className="text-stone-500 pt-1">
              Recipient Phone: {order.shippingAddress.phone} · Email: {order.shippingAddress.email}
            </p>
          </div>

          {/* Itemized Products & Quantity */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Handcrafted Items in this Order:
            </h3>

            <div className="space-y-3 border border-stone-200 rounded-2xl p-4 bg-white">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 py-2 border-b border-stone-100 last:border-0 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.selectedDesign.image || item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                    />
                    <div>
                      <p className="font-semibold text-stone-900">{item.product.name}</p>
                      <p className="text-[11px] text-[#9A4C32]">
                        {item.selectedDesign.name}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        Qty: {item.quantity} · ₹{item.unitPrice} each
                      </p>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-stone-900 tabular-nums">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                </div>
              ))}

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-sm font-semibold">
                <span className="text-stone-900">Total Paid Amount:</span>
                <span className="text-xl font-mono font-bold text-stone-900 tabular-nums">
                  ₹{order.grandTotal}
                </span>
              </div>
            </div>
          </div>

          {/* Buttons required: [Track Order] [Continue Shopping] */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setActivePage('my-orders')}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 bg-[#2D1F1D] hover:bg-[#3D2C29] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Package className="w-4 h-4 text-[#F5C27E]" />
              <span>Track Order</span>
            </button>

            <button
              onClick={() => setActivePage('products')}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
