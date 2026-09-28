import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Sparkles,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';
import { CategoryId } from '../types';

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    cartTotals,
    wishlistIds,
    user,
    setIsAuthModalOpen,
    setAuthModalMode,
    logout,
    searchQuery,
    setSearchQuery,
    setSelectedCategoryFilter,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActivePage('products');
      setIsSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', page: 'home' as const },
    { label: 'Products', page: 'products' as const },
    { label: 'Categories', action: () => { setSelectedCategoryFilter('all'); setActivePage('products'); } },
    { label: 'About Us', page: 'about' as const },
    { label: 'Contact', page: 'contact' as const },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#F0EAE1] shadow-2xs">
      {/* Top Announcement Bar */}
      <div className="bg-[#2D1F1D] text-[#F9F6F0] text-[11px] py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#F5C27E] shrink-0" />
        <span>Handcrafted Pipe Cleaner Blooms &amp; Custom Birthday Magazines · Free Express Delivery on orders above ₹799!</span>
        <span className="hidden md:inline text-[#F5C27E]">Use code WELCOME10 for 10% off</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-18 flex items-center justify-between gap-3">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Business Logo & Name */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage('home')}
              className="text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9A4C32] to-[#D47A60] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                  <span className="font-serif-display font-bold text-sm">P</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-serif-display font-semibold tracking-tight text-[#2D1F1D] block leading-tight">
                    Petal &amp; Print
                  </span>
                  <span className="text-[9px] tracking-widest uppercase font-semibold text-[#9A4C32] block">
                    Celebration &amp; Craft Studio
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            {navLinks.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else if (item.page) {
                    setActivePage(item.page);
                  }
                }}
                className={`py-1 transition-colors relative hover:text-[#9A4C32] cursor-pointer ${
                  item.page && activePage === item.page
                    ? 'text-[#9A4C32] font-semibold'
                    : 'text-stone-600'
                }`}
              >
                {item.label}
                {item.page && activePage === item.page && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9A4C32] rounded-full" />
                )}
              </button>
            ))}

            {/* Quick Admin link */}
            <button
              onClick={() => setActivePage('admin')}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${
                activePage === 'admin'
                  ? 'bg-[#2D1F1D] text-white border-[#2D1F1D]'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-[#D4AF37]" />
              <span>Admin Panel</span>
            </button>
          </nav>

          {/* Action Icons: Search, Wishlist, Cart, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search Toggle Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Search products"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setActivePage('wishlist')}
              className="relative p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="View Wishlist"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute 0 top-1 right-1 bg-[#D44D5C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setActivePage('cart')}
              className="relative flex items-center gap-1.5 p-2 px-3 rounded-xl bg-[#2D1F1D] hover:bg-[#3D2C29] text-white transition-all shadow-xs cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#F5C27E]" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              {cartTotals.count > 0 && (
                <span className="bg-[#9A4C32] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                  {cartTotals.count}
                </span>
              )}
            </button>

            {/* User Profile / Login dropdown */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-white text-stone-800 text-xs transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#FAF3EC] text-[#9A4C32] font-semibold flex items-center justify-center border border-[#E8DCD2]">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:inline font-semibold max-w-[100px] truncate">
                      {user.fullName.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 text-xs">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="font-semibold text-stone-900 truncate">{user.fullName}</p>
                        <p className="text-stone-500 text-[11px] truncate">{user.email}</p>
                        {user.role === 'admin' && (
                          <span className="inline-block mt-1 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                            Admin Account
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setActivePage('profile');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-700 flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-[#9A4C32]" />
                        <span>My Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage('my-orders');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-700 flex items-center gap-2"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#9A4C32]" />
                        <span>My Orders</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage('wishlist');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-700 flex items-center gap-2"
                      >
                        <Heart className="w-3.5 h-3.5 text-[#D44D5C]" />
                        <span>My Wishlist ({wishlistIds.length})</span>
                      </button>

                      <div className="border-t border-stone-100 my-1"></div>

                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-semibold"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#9A4C32] text-[#9A4C32] hover:bg-[#9A4C32] hover:text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown Banner */}
        {isSearchOpen && (
          <div className="py-3 px-2 border-t border-stone-200/80 bg-white">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search pipe cleaner flowers, birthday magazines, gift boxes, roses, bouquets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#9A4C32] focus:ring-1 focus:ring-[#9A4C32]"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#2D1F1D] text-white text-xs font-semibold rounded-xl hover:bg-[#3D2C29] transition-colors whitespace-nowrap cursor-pointer"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="p-2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#FFFDF9] px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 bg-white"
            />
          </form>

          <div className="flex flex-col space-y-2 text-sm font-medium text-stone-700">
            <button
              onClick={() => {
                setActivePage('home');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1.5 px-2 hover:bg-stone-100 rounded"
            >
              Home
            </button>
            <button
              onClick={() => {
                setActivePage('products');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1.5 px-2 hover:bg-stone-100 rounded"
            >
              Products Catalog
            </button>
            <button
              onClick={() => {
                setSelectedCategoryFilter('all');
                setActivePage('products');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1.5 px-2 hover:bg-stone-100 rounded"
            >
              Browse Categories
            </button>
            <button
              onClick={() => {
                setActivePage('wishlist');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1.5 px-2 hover:bg-stone-100 rounded flex justify-between"
            >
              <span>My Wishlist</span>
              <span className="bg-[#D44D5C] text-white text-[10px] px-2 py-0.5 rounded-full">
                {wishlistIds.length}
              </span>
            </button>
            <button
              onClick={() => {
                setActivePage('my-orders');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1.5 px-2 hover:bg-stone-100 rounded"
            >
              My Orders
            </button>
            <button
              onClick={() => {
                setActivePage('about');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1.5 px-2 hover:bg-stone-100 rounded"
            >
              About Us
            </button>
            <button
              onClick={() => {
                setActivePage('contact');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1.5 px-2 hover:bg-stone-100 rounded"
            >
              Contact Us &amp; WhatsApp
            </button>
            <button
              onClick={() => {
                setActivePage('admin');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1.5 px-2 bg-stone-100 text-stone-900 rounded font-semibold flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Admin Management Portal</span>
            </button>
          </div>

          <div className="pt-3 border-t border-stone-200">
            {user ? (
              <div className="space-y-2">
                <p className="text-xs text-stone-500">Signed in as {user.fullName}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setActivePage('profile');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2 text-xs font-semibold bg-stone-100 rounded-lg text-center"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 px-3 text-xs font-semibold text-red-600 bg-red-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-semibold bg-[#2D1F1D] text-white rounded-lg text-center"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('signup');
                    setIsAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-semibold border border-stone-300 rounded-lg text-center text-stone-800"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
