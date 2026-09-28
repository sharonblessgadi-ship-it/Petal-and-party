import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PaymentMethod } from '../types';
import {
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Banknote,
  QrCode,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    buyNowItem,
    clearBuyNow,
    cart,
    cartTotals,
    user,
    placeOrder,
    setActivePage,
  } = useShop();

  const checkoutItems = buyNowItem ? [buyNowItem] : cart;

  // Recipient Delivery Details state (pre-filled if logged in)
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address.street || '');
  const [city, setCity] = useState(user?.address.city || '');
  const [state, setState] = useState(user?.address.state || '');
  const [pincode, setPincode] = useState(user?.address.pincode || '');
  const [country, setCountry] = useState(user?.address.country || 'India');

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);

  // Card details state (client simulation only, never stored in DB as requested)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Net banking selected bank
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full Name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid Email is required';
    if (!phone.trim() || phone.length < 8) errs.phone = 'Valid 10-digit Phone is required';
    if (!street.trim()) errs.street = 'Street Address is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!state.trim()) errs.state = 'State is required';
    if (!pincode.trim() || pincode.length < 4) errs.pincode = 'Valid Pincode is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDemoFill = () => {
    setFullName('Sharon Bless Gadi');
    setEmail('sharonblessgadi@gmail.com');
    setPhone('+91 98450 12345');
    setStreet('742 Lotus Boulevard, Apt 4B');
    setCity('Bengaluru');
    setState('Karnataka');
    setPincode('560034');
    setCountry('India');
    setErrors({});
  };

  const handleProceedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (paymentMethod === 'razorpay') {
      setRazorpayModalOpen(true);
      return;
    }

    // Execute standard order placement
    finalizeOrder();
  };

  const finalizeOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      placeOrder({
        shippingAddress: {
          fullName,
          phone,
          email,
          street,
          city,
          state,
          pincode,
          country,
        },
        paymentMethod,
      });
      setIsProcessing(false);
      setRazorpayModalOpen(false);
    }, 900);
  };

  const calculatedSubtotal = checkoutItems.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
  const calculatedDelivery = calculatedSubtotal >= 799 ? 0 : 60;
  const calculatedTax = Math.round(calculatedSubtotal * 0.05 * 100) / 100;
  const calculatedTotal = calculatedSubtotal + calculatedDelivery + calculatedTax;

  if (checkoutItems.length === 0) {
    return (
      <div className="py-20 text-center bg-[#FAF8F5]">
        <p className="text-sm text-stone-600">No items ready for checkout.</p>
        <button
          onClick={() => setActivePage('products')}
          className="mt-4 px-5 py-2.5 bg-[#2D1F1D] text-white text-xs font-semibold rounded-xl"
        >
          Return to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9A4C32]">
              <Lock className="w-3.5 h-3.5" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-display font-medium text-stone-900">
              {buyNowItem ? 'Direct Buy Now Checkout' : 'Finalize Your Order'}
            </h1>
          </div>

          <button
            onClick={() => {
              if (buyNowItem) clearBuyNow();
              setActivePage('cart');
            }}
            className="text-xs font-semibold text-stone-600 hover:text-[#9A4C32] flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Bag</span>
          </button>
        </div>

        <form onSubmit={handleProceedPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery Details & Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            {/* DELIVERY DETAILS BOX */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#9A4C32]" />
                  <span>1. Delivery Recipient Information</span>
                </h3>
                <button
                  type="button"
                  onClick={handleDemoFill}
                  className="text-[11px] font-semibold text-[#9A4C32] hover:underline cursor-pointer"
                >
                  Auto-Fill Sharon&apos;s Address
                </button>
              </div>

              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Sharon Bless Gadi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                        errors.fullName ? 'border-red-400 bg-red-50/40' : 'border-stone-300'
                      } focus:outline-none focus:border-[#9A4C32]`}
                    />
                  </div>
                  {errors.fullName && <p className="text-[10px] text-red-600 mt-0.5">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                    Phone Number (for Courier Tracking SMS) *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="+91 98450 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                        errors.phone ? 'border-red-400 bg-red-50/40' : 'border-stone-300'
                      } focus:outline-none focus:border-[#9A4C32]`}
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-red-600 mt-0.5">{errors.phone}</p>}
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Email Address (for Digital Proofs &amp; Invoice) *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="sharonblessgadi@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                      errors.email ? 'border-red-400 bg-red-50/40' : 'border-stone-300'
                    } focus:outline-none focus:border-[#9A4C32]`}
                  />
                </div>
                {errors.email && <p className="text-[10px] text-red-600 mt-0.5">{errors.email}</p>}
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Delivery Street Address *
                </label>
                <input
                  type="text"
                  placeholder="Flat / House No, Apartment Name, Street Area"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    errors.street ? 'border-red-400 bg-red-50/40' : 'border-stone-300'
                  } focus:outline-none focus:border-[#9A4C32]`}
                />
                {errors.street && <p className="text-[10px] text-red-600 mt-0.5">{errors.street}</p>}
              </div>

              {/* City, State, Pincode */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${
                      errors.city ? 'border-red-400 bg-red-50/40' : 'border-stone-300'
                    } focus:outline-none focus:border-[#9A4C32]`}
                  />
                  {errors.city && <p className="text-[10px] text-red-600 mt-0.5">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    placeholder="Karnataka"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${
                      errors.state ? 'border-red-400 bg-red-50/40' : 'border-stone-300'
                    } focus:outline-none focus:border-[#9A4C32]`}
                  />
                  {errors.state && <p className="text-[10px] text-red-600 mt-0.5">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                    Pincode / ZIP *
                  </label>
                  <input
                    type="text"
                    placeholder="560034"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${
                      errors.pincode ? 'border-red-400 bg-red-50/40' : 'border-stone-300'
                    } focus:outline-none focus:border-[#9A4C32]`}
                  />
                  {errors.pincode && <p className="text-[10px] text-red-600 mt-0.5">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* PAYMENT OPTIONS (UPI, Cards, Net Banking, COD, Razorpay Test Mode) */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#9A4C32]" />
                <span>2. Select Payment Option</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* UPI Option */}
                <label
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'upi'
                      ? 'border-[#9A4C32] bg-[#FAF2ED] ring-1 ring-[#9A4C32]'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payOption"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="mt-0.5 text-[#9A4C32]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-[#9A4C32]" />
                      <span className="text-xs font-bold text-stone-900">Instant UPI / QR</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Google Pay, PhonePe, Paytm, BHIM QR
                    </p>
                  </div>
                </label>

                {/* Razorpay Test Mode Option */}
                <label
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#9A4C32] bg-[#FAF2ED] ring-1 ring-[#9A4C32]'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payOption"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="mt-0.5 text-[#9A4C32]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#0C2340]" />
                      <span className="text-xs font-bold text-[#0C2340]">Razorpay (Test Mode)</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Interactive payment gateway sandbox
                    </p>
                  </div>
                </label>

                {/* Credit / Debit Card Option */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'card'
                      ? 'border-[#9A4C32] bg-[#FAF2ED] ring-1 ring-[#9A4C32]'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payOption"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-0.5 text-[#9A4C32]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-stone-700" />
                      <span className="text-xs font-bold text-stone-900">Credit / Debit Card</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Visa, Mastercard, RuPay, Maestro
                    </p>
                  </div>
                </label>

                {/* Net Banking Option */}
                <label
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#9A4C32] bg-[#FAF2ED] ring-1 ring-[#9A4C32]'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payOption"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                    className="mt-0.5 text-[#9A4C32]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-stone-700" />
                      <span className="text-xs font-bold text-stone-900">Net Banking</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      HDFC, ICICI, SBI, Axis &amp; 50+ Banks
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery (COD) */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 sm:col-span-2 ${
                    paymentMethod === 'cod'
                      ? 'border-[#9A4C32] bg-[#FAF2ED] ring-1 ring-[#9A4C32]'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payOption"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 text-[#9A4C32]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      <span className="text-xs font-bold text-stone-900">Cash on Delivery (COD)</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Pay cash or UPI upon package handover at your doorstep
                    </p>
                  </div>
                </label>
              </div>

              {/* Dynamic Sub-Form for Selected Payment */}
              {paymentMethod === 'upi' && (
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-stone-200 text-xs space-y-2">
                  <p className="font-semibold text-stone-800">Scan UPI QR or Enter VPA ID:</p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                    <div className="w-28 h-28 bg-white p-2 border border-stone-300 rounded-lg flex flex-col items-center justify-center text-center">
                      <QrCode className="w-16 h-16 text-stone-800" />
                      <span className="text-[9px] font-mono text-stone-500 mt-1">Scan &amp; Pay</span>
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <input
                        type="text"
                        placeholder="yourname@okhdfcbank or yourname@paytm"
                        defaultValue="sharon@upi"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white"
                      />
                      <p className="text-[11px] text-stone-500">
                        Supports Google Pay, PhonePe, Paytm, CRED &amp; BHIM.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-stone-200 text-xs space-y-3">
                  <p className="font-semibold text-stone-800">Enter Card Details (Encrypted):</p>
                  <div>
                    <input
                      type="text"
                      placeholder="16-Digit Card Number (e.g. 4532 8900 1234 5678)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white"
                    />
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="CVV / CVC"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white"
                    />
                  </div>
                  <p className="text-[10px] text-stone-500 italic">
                    Security notice: Card information is processed securely and is never stored in the database.
                  </p>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-stone-200 text-xs space-y-2">
                  <p className="font-semibold text-stone-800">Select Your Bank:</p>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: ORDER SUMMARY (as requested) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Order Summary ({checkoutItems.length} Products)
              </h3>

              {/* Product, Design, Quantity, Price */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs border-b border-stone-100 pb-3">
                    <img
                      src={item.selectedDesign.image || item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-[#9A4C32] mt-0.5">
                        {item.selectedDesign.name}
                      </p>
                      <p className="text-[10px] text-stone-500">
                        Qty: {item.quantity} · ₹{item.unitPrice} each
                      </p>
                      {item.customization?.recipientName && (
                        <p className="text-[10px] text-stone-600 font-medium truncate">
                          For: {item.customization.recipientName}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-stone-900">
                        ₹{item.unitPrice * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price, Delivery charge, Total */}
              <div className="space-y-2 text-xs text-stone-600 border-t border-stone-200 pt-3">
                <div className="flex justify-between">
                  <span>Product Subtotal:</span>
                  <span className="font-mono tabular-nums">₹{calculatedSubtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span className="font-mono tabular-nums">
                    {calculatedDelivery === 0 ? (
                      <span className="text-emerald-700 font-semibold">FREE</span>
                    ) : (
                      `₹${calculatedDelivery}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST &amp; Studio Tax:</span>
                  <span className="font-mono tabular-nums">₹{calculatedTax}</span>
                </div>

                <div className="pt-2 border-t border-stone-300 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-stone-900">Total Payable:</span>
                  <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                    ₹{calculatedTotal}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-[#2D1F1D] hover:bg-[#3D2C29] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <span>Securing Order Handcrafting...</span>
                ) : (
                  <>
                    <span>Place Order · ₹{calculatedTotal}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Orders crafted &amp; packed in studio with care</span>
              </div>
            </div>
          </div>
        </form>

        {/* Razorpay Test Mode Sandbox Modal */}
        {razorpayModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
              <div className="bg-[#0C2340] text-white p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#528FF0] uppercase font-bold tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>Razorpay Sandbox</span>
                  </div>
                  <h3 className="font-bold text-base mt-0.5">Petal &amp; Print Celebrations</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-300 block">Amount to Pay</span>
                  <span className="text-lg font-bold font-mono text-white">₹{calculatedTotal}</span>
                </div>
              </div>

              <div className="p-5 space-y-4 text-xs text-stone-700">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
                  <strong>Test Mode Notice:</strong> This is a secure Razorpay test mode payment
                  gateway. No real money will be charged.
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-stone-900 block">Customer Information</span>
                  <p>{fullName} ({phone})</p>
                  <p className="text-stone-500">{email}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <span className="font-semibold text-stone-900 block">Test Gateway Methods</span>
                  <div className="space-y-1 text-[11px] text-stone-600">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Razorpay FastUPI &amp; QR Simulator</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Test Cards with instant 3D Secure OTP</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRazorpayModalOpen(false)}
                    className="flex-1 py-2.5 border border-stone-300 text-stone-700 font-semibold rounded-xl text-xs hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={finalizeOrder}
                    disabled={isProcessing}
                    className="flex-1 py-2.5 bg-[#0C2340] hover:bg-[#153A68] text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                  >
                    {isProcessing ? 'Verifying...' : 'Pay ₹' + calculatedTotal}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
