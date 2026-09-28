import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus } from '../types';
import {
  Package,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowRight,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const STATUS_STEPS: OrderStatus[] = [
  'Order Placed',
  'Confirmed',
  'Preparing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

export const MyOrdersPage: React.FC = () => {
  const { orders, setActivePage, openProductDetails } = useShop();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (orders.length === 0) {
    return (
      <div className="py-20 text-center bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Package className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-serif-display font-medium text-stone-900">
            No orders found yet
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            When you purchase handmade bouquets or birthday magazines, you will be able to track
            their handcrafting and delivery status here.
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

  return (
    <div className="bg-[#FAF8F5] py-10 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9A4C32]">
              Customer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif-display font-medium text-stone-900">
              My Orders &amp; Crafting Tracking ({orders.length})
            </h1>
          </div>

          <button
            onClick={() => setActivePage('products')}
            className="text-xs font-semibold text-stone-600 hover:text-[#9A4C32] flex items-center gap-1 cursor-pointer"
          >
            <span>Shop More</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Orders list */}
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const currentStepIdx = STATUS_STEPS.indexOf(order.orderStatus);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all"
              >
                {/* Order Summary Bar */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-900 text-sm">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 flex items-center gap-3">
                      <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>{order.items.length} Product{order.items.length > 1 ? 's' : ''}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <span className="text-xs text-stone-400 block">Total Amount</span>
                      <span className="text-base font-bold font-mono text-stone-900">
                        ₹{order.grandTotal}
                      </span>
                      <span className="text-[10px] text-stone-500 block uppercase">
                        {order.paymentMethod} ({order.paymentStatus})
                      </span>
                    </div>

                    <button
                      type="button"
                      className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-stone-100 bg-[#FAF8F5]/60 space-y-6">
                    {/* Status Progress Tracker */}
                    {order.orderStatus !== 'Cancelled' ? (
                      <div className="bg-white p-4 rounded-xl border border-stone-200/80">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-3">
                          Live Crafting &amp; Delivery Progress
                        </span>
                        <div className="relative flex items-center justify-between">
                          {/* Progress bar line */}
                          <div className="absolute left-2 right-2 top-3 h-0.5 bg-stone-200 -z-0" />
                          <div
                            className="absolute left-2 top-3 h-0.5 bg-[#9A4C32] transition-all -z-0"
                            style={{
                              width: `${Math.max(0, (currentStepIdx / (STATUS_STEPS.length - 1)) * 100)}%`,
                            }}
                          />

                          {STATUS_STEPS.map((step, idx) => {
                            const isDone = idx <= currentStepIdx;
                            const isCurrent = idx === currentStepIdx;
                            return (
                              <div key={step} className="flex flex-col items-center text-center z-10">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                    isDone
                                      ? 'bg-[#9A4C32] text-white shadow-xs'
                                      : 'bg-stone-200 text-stone-500'
                                  } ${isCurrent ? 'ring-4 ring-[#9A4C32]/20' : ''}`}
                                >
                                  {isDone ? '✓' : idx + 1}
                                </div>
                                <span
                                  className={`text-[10px] mt-1.5 font-medium hidden sm:block ${
                                    isCurrent ? 'text-stone-900 font-bold' : 'text-stone-500'
                                  }`}
                                >
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-[11px] text-stone-500 text-center mt-3">
                          Estimated Delivery: <strong className="text-stone-800">{order.estimatedDeliveryDate}</strong> · Tracking: <span className="font-mono text-stone-700">{order.trackingNumber}</span>
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xl border border-red-200">
                        This order has been cancelled.
                      </div>
                    )}

                    {/* Products breakdown */}
                    <div className="space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block">
                        Itemized Creations
                      </span>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-200/80 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.selectedDesign.image || item.product.images[0]}
                                alt={item.product.name}
                                className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200 cursor-pointer"
                                onClick={() => openProductDetails(item.product.id, item.selectedDesign.id)}
                              />
                              <div>
                                <p
                                  onClick={() => openProductDetails(item.product.id, item.selectedDesign.id)}
                                  className="font-semibold text-stone-900 hover:text-[#9A4C32] cursor-pointer"
                                >
                                  {item.product.name}
                                </p>
                                <p className="text-[11px] text-[#9A4C32]">
                                  {item.selectedDesign.name} · Code: {item.selectedDesign.code}
                                </p>
                                <p className="text-[10px] text-stone-400">
                                  Qty: {item.quantity} · ₹{item.unitPrice} each
                                </p>
                                {item.customization?.recipientName && (
                                  <p className="text-[10px] text-stone-600 font-medium">
                                    Personalized for: {item.customization.recipientName}
                                  </p>
                                )}
                              </div>
                            </div>

                            <span className="font-mono font-bold text-stone-900">
                              ₹{item.unitPrice * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address & Pricing Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-stone-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#9A4C32]" />
                          <span>Delivery Address</span>
                        </span>
                        <p className="font-semibold text-stone-900">{order.shippingAddress.fullName}</p>
                        <p className="text-stone-600">
                          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                        </p>
                        <p className="text-stone-500 pt-0.5">{order.shippingAddress.phone}</p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-stone-200/80 space-y-1 text-stone-600">
                        <div className="flex justify-between">
                          <span>Items Subtotal:</span>
                          <span className="font-mono">₹{order.subtotal}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-emerald-700">
                            <span>Discount:</span>
                            <span className="font-mono">-₹{order.discount}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Delivery:</span>
                          <span className="font-mono">{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span className="font-mono">₹{order.tax}</span>
                        </div>
                        <div className="pt-1 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                          <span>Total:</span>
                          <span className="font-mono">₹{order.grandTotal}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
