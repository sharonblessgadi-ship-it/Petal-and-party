import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Sparkles,
  CheckCircle2,
  Instagram,
  Heart,
} from 'lucide-react';

export const ContactUs: React.FC = () => {
  const { showToast } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Custom Pipe Cleaner Bouquet Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitted(true);
    showToast('Your message has been sent to our craft studio. We will reply within 24 hours!');
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  // WhatsApp click-to-chat with pre-filled message (as explicitly requested in prompt)
  const whatsappNumber = '919845012345';
  const prefilledText = encodeURIComponent(
    "Hi Petal & Print Studio! I'm interested in ordering custom pipe cleaner flower bouquets and a personalized birthday magazine. Could you please share design catalogs and custom options?"
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${prefilledText}`;

  return (
    <div className="bg-[#FAF8F5] py-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9A4C32]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Connect With Our Artisans</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-display font-medium text-stone-900 tracking-tight">
            We&apos;d Love to Handcraft Your Celebration
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Have a custom flower colorway in mind, need bulk birthday magazines, or want to collaborate?
            Get in touch directly or chat with our bench studio on WhatsApp.
          </p>
        </div>

        {/* WhatsApp Banner (Prominent Quick Action) */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-300 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" />
              <span>Instant WhatsApp Concierge</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-serif-display font-medium">
              Need a personalized floral bouquet or urgent birthday rush?
            </h2>
            <p className="text-xs text-emerald-100 max-w-xl">
              Tap below to start a chat with our floral designer. Receive photos of velvet wire shades,
              digital magazine drafts, and customized gift wraps instantly.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl transition-all shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-stone-950" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Grid: Contact Details & Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Business Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-2xs space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 pb-2 border-b border-stone-100">
                Studio Contact Details
              </h3>

              <div className="space-y-4 text-xs">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#9A4C32] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">Phone &amp; Studio Call:</span>
                    <a
                      href="tel:+919845012345"
                      className="text-stone-600 hover:text-[#9A4C32] transition-colors"
                    >
                      +91 98450 12345
                    </a>
                    <span className="text-[10px] text-stone-400 block">Mon–Sat, 9:30 AM to 7:00 PM</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#D44D5C] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">Editorial &amp; Craft Email:</span>
                    <a
                      href="mailto:studio@petalandprint.com"
                      className="text-stone-600 hover:text-[#9A4C32] transition-colors"
                    >
                      studio@petalandprint.com
                    </a>
                    <span className="text-[10px] text-stone-400 block">Response within 12 hours</span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">Artisan Workshop:</span>
                    <p className="text-stone-600">
                      742 Lotus Boulevard, Suite 4B, Koramangala
                      <br />
                      Bengaluru, Karnataka 560034, India
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">Dispatch Operations:</span>
                    <p className="text-stone-600">Monday through Saturday: 9:00 AM – 6:30 PM IST</p>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block">
                  Follow Our Crafting Stories:
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-stone-200 hover:border-stone-400 text-stone-700 hover:text-[#9A4C32] transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Instagram className="w-4 h-4 text-rose-500" />
                    <span>@petalandprintstudio</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Send Us a Message
              </h3>

              {submitted && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Thank you! Your custom inquiry has been received. We will contact you soon.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase text-stone-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sharon Bless"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#9A4C32]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase text-stone-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98450 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#9A4C32]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="sharon@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#9A4C32]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Custom Pipe Cleaner Bouquet Inquiry">Custom Pipe Cleaner Bouquet Inquiry</option>
                    <option value="Personalized Birthday Magazine Order">Personalized Birthday Magazine Order</option>
                    <option value="Bulk Celebration / Wedding Favors">Bulk Celebration / Wedding Favors</option>
                    <option value="Order Status & Express Tracking">Order Status &amp; Express Tracking</option>
                    <option value="Corporate / PR Gifting Suite">Corporate / PR Gifting Suite</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">
                    Your Message / Custom Details *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about the celebration, desired colors, recipient name, or delivery deadline..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#9A4C32]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#2D1F1D] hover:bg-[#3D2C29] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Studio</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
