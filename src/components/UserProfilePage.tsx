import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Heart,
  LogOut,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { user, updateProfile, logout, setActivePage, orders, wishlistIds } = useShop();

  if (!user) {
    return (
      <div className="py-20 text-center bg-[#FAF8F5]">
        <p className="text-sm text-stone-600">Please sign in to view your profile.</p>
        <button
          onClick={() => setActivePage('home')}
          className="mt-4 px-4 py-2 bg-[#2D1F1D] text-white text-xs rounded-xl"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const [fullName, setFullName] = useState(user.fullName);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [street, setStreet] = useState(user.address.street);
  const [city, setCity] = useState(user.address.city);
  const [state, setState] = useState(user.address.state);
  const [pincode, setPincode] = useState(user.address.pincode);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      username,
      email,
      phone,
      address: {
        street,
        city,
        state,
        pincode,
        country: user.address.country || 'India',
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="bg-[#FAF8F5] py-10 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#9A4C32] to-[#D47A60] text-white font-serif-display text-2xl font-bold flex items-center justify-center shadow-md">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif-display font-medium text-stone-900">
                  {user.fullName}
                </h1>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">@{user.username} · {user.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition-colors cursor-pointer w-fit"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Quick Nav Cards: My Orders, Wishlist, Cart */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setActivePage('my-orders')}
            className="p-4 bg-white rounded-2xl border border-stone-200/90 hover:border-[#9A4C32] text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#9A4C32]" />
              </span>
              <span className="font-mono text-lg font-bold text-stone-900">
                {orders.length}
              </span>
            </div>
            <h3 className="text-xs font-bold text-stone-900 mt-3 group-hover:text-[#9A4C32]">
              My Orders &amp; History
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">Track live crafting &amp; packages</p>
          </button>

          <button
            onClick={() => setActivePage('wishlist')}
            className="p-4 bg-white rounded-2xl border border-stone-200/90 hover:border-[#9A4C32] text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl bg-rose-50 text-rose-900 flex items-center justify-center">
                <Heart className="w-4 h-4 text-[#D44D5C]" />
              </span>
              <span className="font-mono text-lg font-bold text-stone-900">
                {wishlistIds.length}
              </span>
            </div>
            <h3 className="text-xs font-bold text-stone-900 mt-3 group-hover:text-[#9A4C32]">
              Saved Wishlist
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">Bouquets &amp; journals for later</p>
          </button>

          <button
            onClick={() => setActivePage('cart')}
            className="p-4 bg-white rounded-2xl border border-stone-200/90 hover:border-[#9A4C32] text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-stone-800" />
              </span>
              <span className="font-mono text-lg font-bold text-stone-900">
                Bag
              </span>
            </div>
            <h3 className="text-xs font-bold text-stone-900 mt-3 group-hover:text-[#9A4C32]">
              Shopping Cart
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">Review items &amp; proceed to buy</p>
          </button>
        </div>

        {/* Profile Edit Form */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <h2 className="text-lg font-serif-display font-medium text-stone-900">
                Personal Information &amp; Default Shipping Address
              </h2>
              <p className="text-xs text-stone-500">
                Update your details to automatically fill delivery forms during checkout
              </p>
            </div>
            {savedSuccess && (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Changes saved!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#9A4C32]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#9A4C32]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#9A4C32]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#9A4C32]"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                Street Address
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#9A4C32]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#9A4C32]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#9A4C32]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#9A4C32]"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#2D1F1D] hover:bg-[#3D2C29] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
