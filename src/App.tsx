/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryShowcase } from './components/CategoryShowcase';
import { ProductCard } from './components/ProductCard';
import { ProductList } from './components/ProductList';
import { ProductDetails } from './components/ProductDetails';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { MyOrdersPage } from './components/MyOrdersPage';
import { WishlistPage } from './components/WishlistPage';
import { UserProfilePage } from './components/UserProfilePage';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutUs } from './components/AboutUs';
import { ContactUs } from './components/ContactUs';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { Sparkles, ArrowRight, Star, Heart, Gift } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activePage, setActivePage, products, setSelectedCategoryFilter } = useShop();

  const featuredProducts = products.filter((p) => p.featured || p.isBestSeller).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2D1F1D]">
      {/* Top Navbar */}
      <Navbar />

      {/* Dynamic View Routing */}
      <main className="flex-1">
        {activePage === 'home' && (
          <div>
            {/* 1. Large Hero Section ("Make Every Celebration Special") */}
            <Hero />

            {/* 2. Popular Categories Section */}
            <CategoryShowcase />

            {/* 3. Featured Products Grid on Home */}
            <section className="py-14 bg-white border-y border-stone-200/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9A4C32] mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Studio Top Picks</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif-display font-medium text-stone-900 tracking-tight">
                      Featured &amp; Best-Selling Creations
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1">
                      Explore our most loved chenille stem flower bouquets and personalized magazines
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCategoryFilter('all');
                      setActivePage('products');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9A4C32] hover:text-[#833F29] transition-colors cursor-pointer"
                  >
                    <span>View All Catalog ({products.length})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {featuredProducts.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Birthday Magazine & Custom Gifting Spotlight */}
            <section className="py-16 bg-gradient-to-r from-[#2D1F1D] to-[#422C28] text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F5C27E] flex items-center gap-1.5">
                      <Gift className="w-4 h-4" />
                      <span>The Celebrity Birthday Experience</span>
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-serif-display font-medium leading-tight">
                      Turn Any Birthday Into a Glossy 12-Page Magazine Cover Story
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
                      Upload photos and heartfelt milestones to create a genuine Vogue-style keepsake.
                      Featuring customized horoscope pages, funny childhood articles, friend interview quotes,
                      and metallic gold foil covers.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          setSelectedCategoryFilter('birthday-magazines');
                          setActivePage('products');
                        }}
                        className="px-6 py-3 bg-[#9A4C32] hover:bg-[#833F29] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        Explore Birthday Magazines
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex justify-center">
                    <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                      <img
                        src="/src/assets/images/birthday_magazine_1790577985875.jpg"
                        alt="Custom birthday magazine cover"
                        className="w-full h-80 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activePage === 'products' && <ProductList />}
        {activePage === 'product-details' && <ProductDetails />}
        {activePage === 'cart' && <CartPage />}
        {activePage === 'checkout' && <CheckoutPage />}
        {activePage === 'order-confirmation' && <OrderConfirmationPage />}
        {activePage === 'my-orders' && <MyOrdersPage />}
        {activePage === 'wishlist' && <WishlistPage />}
        {activePage === 'profile' && <UserProfilePage />}
        {activePage === 'about' && <AboutUs />}
        {activePage === 'contact' && <ContactUs />}
        {activePage === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Auth Modal */}
      <AuthModal />

      {/* Global Floating Toast */}
      <Toast />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
