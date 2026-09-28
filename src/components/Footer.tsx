import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CategoryId } from '../types';
import { Sparkles, Heart, Instagram, MessageCircle, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, setSelectedCategoryFilter, setIsAuthModalOpen, user } = useShop();

  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(null);

  const whatsappNumber = '919845012345';
  const prefilledText = encodeURIComponent(
    "Hi Petal & Print! I'd like to ask a question about your custom bouquets and birthday magazines."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${prefilledText}`;

  const handleCategoryNav = (cat: CategoryId) => {
    setSelectedCategoryFilter(cat);
    setActivePage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#241715] text-[#EDE4DA] border-t border-[#382623] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Brand & Studio Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9A4C32] to-[#D47A60] flex items-center justify-center text-white font-serif-display font-bold">
                P
              </div>
              <span className="text-xl font-serif-display font-semibold text-white tracking-tight">
                Petal &amp; Print
              </span>
            </div>

            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              We handcraft velvety pipe cleaner flower bouquets that will never wilt, and custom design
              glossy 12-page birthday magazines that immortalize memories. Hand-bent, printed, and tied
              with silk ribbons in our boutique studio.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#F5C27E]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Over 1,500+ Everlasting Celebrations Handcrafted</span>
            </div>

            {/* Social & WhatsApp Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 transition-colors flex items-center gap-1.5 text-xs font-semibold border border-emerald-700/50"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-300" />
                <span>WhatsApp</span>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition-colors flex items-center gap-1.5 text-xs font-semibold border border-rose-800/50"
                title="Follow Instagram"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>

              <a
                href="mailto:studio@petalandprint.com"
                className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors flex items-center gap-1.5 text-xs font-semibold border border-stone-700"
                title="Email Us"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Col 3: Popular Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Studio Categories
            </h3>
            <ul className="text-xs space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => handleCategoryNav('pipe-cleaner-flowers')}
                  className="hover:text-white transition-colors"
                >
                  Pipe Cleaner Flowers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('birthday-magazines')}
                  className="hover:text-white transition-colors"
                >
                  Birthday Magazines
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('handmade-bouquets')}
                  className="hover:text-white transition-colors"
                >
                  Handmade Bouquets
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('customized-gifts')}
                  className="hover:text-white transition-colors"
                >
                  Customized Gifts
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('gift-boxes')}
                  className="hover:text-white transition-colors"
                >
                  Curated Gift Boxes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('best-sellers')}
                  className="hover:text-white transition-colors"
                >
                  Top Best Sellers
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Care & Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Customer Care
            </h3>
            <ul className="text-xs space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => setActivePage('my-orders')}
                  className="hover:text-white transition-colors"
                >
                  Track My Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('wishlist')}
                  className="hover:text-white transition-colors"
                >
                  My Saved Wishlist
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('about')}
                  className="hover:text-white transition-colors"
                >
                  About Our Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact Us &amp; WhatsApp
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('admin')}
                  className="hover:text-[#F5C27E] text-stone-400 transition-colors"
                >
                  Admin Management Portal
                </button>
              </li>
              {!user && (
                <li>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="hover:text-white transition-colors text-[#F5C27E]"
                  >
                    Login / Create Account
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 5: Studio Policies (as requested: Privacy, Terms, Shipping, Returns) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Studio Policies
            </h3>
            <ul className="text-xs space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => setActivePolicyModal('Shipping Policy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Shipping &amp; Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('Return & Replacement Policy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Return &amp; Damage Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('Privacy Policy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy &amp; Data Security
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('Terms & Conditions')}
                  className="hover:text-white transition-colors text-left"
                >
                  Terms &amp; Conditions
                </button>
              </li>
            </ul>

            <div className="pt-2 text-[11px] text-stone-400 space-y-1">
              <p className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#F5C27E]" />
                <span>+91 98450 12345</span>
              </p>
              <p className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-[#F5C27E]" />
                <span>studio@petalandprint.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#382623] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Petal &amp; Print Creative Gifting Studio. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Handcrafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for your most magical celebrations</span>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {activePolicyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 text-stone-800 space-y-4 shadow-2xl">
            <h3 className="font-serif-display text-xl font-medium text-stone-900">
              {activePolicyModal}
            </h3>
            <div className="text-xs text-stone-600 space-y-2 max-h-60 overflow-y-auto leading-relaxed pr-1">
              {activePolicyModal === 'Shipping Policy' && (
                <>
                  <p>All pipe cleaner bouquets and customized birthday magazines are securely packaged in rigid crush-proof boxes with custom foam inserts.</p>
                  <p>Standard delivery takes 3–5 business days across India. Express rush shipping is delivered in 1–2 days. Orders above ₹799 qualify for Free Standard Delivery.</p>
                </>
              )}
              {activePolicyModal === 'Return & Replacement Policy' && (
                <>
                  <p>Due to the bespoke, personalized nature of our customized magazines and handcrafted flowers, we do not accept arbitrary change-of-mind returns.</p>
                  <p>However, if any item is damaged during transit, we offer 100% free immediate replacement or refund upon photographic verification within 48 hours of delivery.</p>
                </>
              )}
              {activePolicyModal === 'Privacy Policy' && (
                <>
                  <p>Your privacy is sacred. Photos and personal birthday stories uploaded for magazine layout are permanently purged 14 days after delivery.</p>
                  <p>Passwords are securely hashed using SHA-256 encryption. We never share customer phone numbers or email addresses with third-party advertisers.</p>
                </>
              )}
              {activePolicyModal === 'Terms & Conditions' && (
                <>
                  <p>Digital previews for birthday magazines will be shared via WhatsApp/Email for approval prior to high-gloss printing.</p>
                  <p>By placing an order, customers certify that photos and content provided do not violate intellectual property laws.</p>
                </>
              )}
            </div>
            <button
              onClick={() => setActivePolicyModal(null)}
              className="w-full py-2.5 bg-[#2D1F1D] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Close Policy
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
