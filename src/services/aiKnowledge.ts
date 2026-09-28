import { db } from './db';
import { CATEGORIES } from '../data/initialData';

export interface CustomQA {
  id: string;
  question: string;
  answer: string;
  category: string;
  updatedAt: string;
}

export interface AISettings {
  botName: string;
  welcomeMessage: string;
  personaTone: 'friendly' | 'elegant' | 'artisan' | 'playful';
  customInstructions: string;
  n8nWebhookUrl: string;
  useN8nWebhook: boolean;
  widgetStyle: 'official-n8n' | 'store-concierge' | 'both';
  instanceId?: string;
}

const DEFAULT_AI_SETTINGS: AISettings = {
  botName: 'Petal & Print Concierge',
  welcomeMessage:
    'Hello! 🌸 Welcome to Petal & Print Handcrafted Studio. I am connected with our live catalog and AI workflow to help you celebrate today! How can I assist you?',
  personaTone: 'artisan',
  customInstructions:
    'You are a warm, knowledgeable craft concierge for Petal & Print Handcrafted Studio. Recommend specific products from the catalog with exact prices in ₹ (INR), mention care tips, custom options, and applicable coupon codes like WELCOME10.',
  n8nWebhookUrl: 'https://blessy24nm1a0565.app.n8n.cloud/webhook/217bdced-7171-4b85-943c-0d519e17e095/chat',
  useN8nWebhook: true,
  widgetStyle: 'official-n8n',
  instanceId: '8b3ecbd397a310edbe190fe4845b3b884acb131420cbb5574c4d9720fcf3b0f5',
};

const DEFAULT_CUSTOM_QAS: CustomQA[] = [
  {
    id: 'qa-1',
    question: 'How long do pipe cleaner flowers last?',
    answer:
      'Our pipe cleaner flowers are hand-sculpted from premium high-density velvet chenille wire. They are everlasting and never wilt, fade, or need water! Just keep them away from moisture and dust gently with a soft dry brush.',
    category: 'Flowers & Craft',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'qa-2',
    question: 'How does the custom birthday magazine work?',
    answer:
      'Our custom Birthday Magazine is a 12-page luxury glossy magazine. You can upload photos, milestone stories, funny friendship memories, and choose themes (Vogue editorial, Retro nostalgia, or Minimalist Chic). We design, print on 300 GSM cardstock, and deliver in a protective presentation box.',
    category: 'Custom Gifts',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'qa-3',
    question: 'What are the delivery times and shipping fees?',
    answer:
      'We offer Free Standard Delivery across India on all orders above ₹999. Standard shipping takes 3 to 5 business days. Express priority courier delivery (1-2 days) is available for ₹149. Custom magazine orders require 1-2 days crafting time before dispatch.',
    category: 'Shipping & Delivery',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'qa-4',
    question: 'Can I request custom flower colors or bouquet sizes?',
    answer:
      'Yes! We love custom creations. You can customize flower types (roses, tulips, sunflowers, daisies, lavender), wrapping paper colors, ribbon finishes, and add a personalized hand-lettered message card at checkout.',
    category: 'Customization',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'qa-5',
    question: 'What is your return and cancellation policy?',
    answer:
      'Because every piece is handcrafted, standard returns are not accepted. However, we offer a 100% Craft Guarantee: if your item arrives damaged during transit, notify us within 48 hours for a free replacement or full refund.',
    category: 'Store Policies',
    updatedAt: new Date().toISOString(),
  },
];

const AI_STORAGE_KEY_SETTINGS = 'pp_ai_settings_v1';
const AI_STORAGE_KEY_QAS = 'pp_ai_custom_qas_v1';

export const aiKnowledgeService = {
  getSettings(): AISettings {
    try {
      const data = localStorage.getItem(AI_STORAGE_KEY_SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_AI_SETTINGS,
          ...parsed,
          n8nWebhookUrl: parsed.n8nWebhookUrl || DEFAULT_AI_SETTINGS.n8nWebhookUrl,
          useN8nWebhook: parsed.useN8nWebhook !== undefined ? parsed.useN8nWebhook : true,
          widgetStyle: parsed.widgetStyle || DEFAULT_AI_SETTINGS.widgetStyle,
          instanceId: parsed.instanceId || DEFAULT_AI_SETTINGS.instanceId,
        };
      }
    } catch {}
    return DEFAULT_AI_SETTINGS;
  },

  async testN8nConnection(url?: string): Promise<{ success: boolean; status: number; message: string; hint?: string }> {
    const settings = this.getSettings();
    const targetUrl = url || settings.n8nWebhookUrl;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'ping',
          n8nWebhookUrl: targetUrl,
          instanceId: settings.instanceId,
          isTestPing: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.source === 'n8n') {
        return {
          success: true,
          status: 200,
          message: 'n8n Webhook is active and responding successfully!',
        };
      } else if (data.n8nStatus === 404 || res.status === 404) {
        return {
          success: false,
          status: 404,
          message: 'Webhook reached, but the n8n workflow is currently not Active.',
          hint: 'Open your n8n editor at blessy24nm1a0565.app.n8n.cloud and click the toggle in the top-right corner to turn your workflow "Active".',
        };
      } else {
        return {
          success: false,
          status: data.n8nStatus || res.status,
          message: data.error || 'Webhook returned an error',
          hint: data.hint,
        };
      }
    } catch (e: any) {
      return {
        success: false,
        status: 0,
        message: e?.message || 'Could not reach server endpoint to test webhook',
      };
    }
  },

  saveSettings(settings: AISettings): void {
    try {
      localStorage.setItem(AI_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {}
  },

  getCustomQAs(): CustomQA[] {
    try {
      const data = localStorage.getItem(AI_STORAGE_KEY_QAS);
      if (data) return JSON.parse(data);
    } catch {}
    return DEFAULT_CUSTOM_QAS;
  },

  saveCustomQAs(qas: CustomQA[]): void {
    try {
      localStorage.setItem(AI_STORAGE_KEY_QAS, JSON.stringify(qas));
    } catch {}
  },

  addCustomQA(qa: Omit<CustomQA, 'id' | 'updatedAt'>): CustomQA {
    const list = this.getCustomQAs();
    const newQA: CustomQA = {
      ...qa,
      id: 'qa-' + Date.now(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newQA);
    this.saveCustomQAs(list);
    return newQA;
  },

  deleteCustomQA(id: string): void {
    const list = this.getCustomQAs().filter((q) => q.id !== id);
    this.saveCustomQAs(list);
  },

  /**
   * Generates a comprehensive grounded knowledge string containing all website data:
   * products, categories, coupons, store policies, and custom trained Q&As.
   */
  getTrainedKnowledgeContext(): string {
    const products = db.getProducts();
    const coupons = db.getCoupons();
    const customQAs = this.getCustomQAs();
    const settings = this.getSettings();

    const productsCatalog = products
      .map(
        (p) =>
          `- [${p.name}] (ID: ${p.id}, Category: ${p.category})\n  Price: ₹${p.basePrice} (Regular: ₹${p.originalPrice}, ${p.discountPercent}% OFF)\n  Rating: ${p.rating}★ (${p.reviewCount} reviews) | Stock: ${p.inStock ? `${p.stock} units` : 'Out of Stock'}\n  Description: ${p.description}\n  Materials: ${p.materials}\n  Dimensions: ${p.dimensions}\n  Care: ${p.careInstructions}`
      )
      .join('\n\n');

    const categoriesList = CATEGORIES.map((c) => `- ${c.name}: ${c.tagline}`).join('\n');

    const couponsList = coupons
      .map(
        (c) =>
          `- Code: ${c.code} (${c.discountPercent ? `${c.discountPercent}% OFF` : `₹${c.discountAmount} OFF`} on orders above ₹${c.minOrderValue}) - ${c.description}`
      )
      .join('\n');

    const faqsList = customQAs
      .map((qa) => `Q: ${qa.question}\nA: ${qa.answer} (Category: ${qa.category})`)
      .join('\n\n');

    return `
=== PETAL & PRINT HANDCRAFTED STUDIO KNOWLEDGE BASE ===
Store Name: Petal & Print Handcrafted Studio
Tagline: Bespoke handcrafted pipe cleaner bouquets, personalized birthday magazines & keepsake celebration gifts
Store Hours: Mon - Sat: 9:00 AM - 8:00 PM IST (Online ordering 24/7)
Shipping: Free standard shipping across India on orders over ₹999. Express delivery (1-2 days) ₹149.
Crafting Guarantee: 100% handcrafted pieces. Free 48-hour transit damage replacement.
Support Contact: hello@petalandprint.com | WhatsApp: +91 98765 43210

--- PRODUCT CATEGORIES ---
${categoriesList}

--- LIVE STORE CATALOG (${products.length} Items) ---
${productsCatalog}

--- ACTIVE STORE COUPONS ---
${couponsList}

--- TRAINED QUESTIONS & POLICIES ---
${faqsList}

--- BOT PERSONA & INSTRUCTIONS ---
Bot Name: ${settings.botName}
Tone: ${settings.personaTone}
Custom Guidance: ${settings.customInstructions}
`.trim();
  },

  /**
   * Smart client-side semantic & keyword matcher trained on the website data.
   * Acts as an instant fallback when offline or if serverless backend is unavailable.
   */
  answerWithLocalKnowledge(userQuery: string): { reply: string; matchedProducts?: string[] } {
    const q = userQuery.toLowerCase().trim();
    const products = db.getProducts();
    const coupons = db.getCoupons();
    const customQAs = this.getCustomQAs();

    // Check custom Q&As first for direct matches
    for (const item of customQAs) {
      const qWords = item.question.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
      const matchScore = qWords.filter((w) => q.includes(w)).length;
      if (matchScore >= 2 || q.includes(item.question.toLowerCase())) {
        return { reply: item.answer };
      }
    }

    // Coupons query
    if (q.includes('coupon') || q.includes('discount') || q.includes('promo') || q.includes('offer') || q.includes('code')) {
      const activeCoupons = coupons
        .map((c) => `• **${c.code}**: Get ${c.discountPercent ? `${c.discountPercent}%` : `₹${c.discountAmount}`} OFF (Min order: ₹${c.minOrderValue}) - ${c.description}`)
        .join('\n');
      return {
        reply: `Here are our currently active promo codes you can apply at checkout:\n\n${activeCoupons}\n\n*Tip: Use **WELCOME10** for 10% off your very first handcrafted order!*`,
      };
    }

    // Shipping / delivery query
    if (q.includes('deliver') || q.includes('ship') || q.includes('track') || q.includes('arrive') || q.includes('when')) {
      return {
        reply:
          `📦 **Shipping & Delivery Timelines:**\n\n` +
          `• **Standard Shipping:** 3-5 business days across India (FREE on all orders above ₹999; otherwise ₹79).\n` +
          `• **Express Delivery:** 1-2 business days (₹149 flat fee).\n` +
          `• **Handcrafting Time:** Custom items like our 12-page Birthday Magazine take 1-2 days to design & print before dispatch.\n\n` +
          `You can view live order status under **My Orders** in the navigation bar!`,
      };
    }

    // Return / refund policy
    if (q.includes('return') || q.includes('refund') || q.includes('damage') || q.includes('cancel')) {
      return {
        reply:
          `🛡️ **Return & Guarantee Policy:**\n\n` +
          `Every creation at Petal & Print is individually hand-sculpted. While we do not accept standard returns for buyer's remorse, we have a **100% Craft Guarantee**:\n\n` +
          `If your bouquet or keepsake arrives damaged or defective in transit, simply contact our support within 48 hours with a photo, and we will dispatch a **free replacement** or issue a **100% refund** immediately!`,
      };
    }

    // Product search / queries
    const matched = products.filter((p) => {
      const nameMatch = q.includes(p.name.toLowerCase());
      const catMatch = q.includes(p.category.toLowerCase().replace(/-/g, ' '));
      const keywordMatch =
        (q.includes('rose') && p.slug.includes('rose')) ||
        (q.includes('tulip') && p.slug.includes('tulip')) ||
        (q.includes('sunflower') && p.slug.includes('sunflower')) ||
        (q.includes('daisy') && p.slug.includes('daisy')) ||
        (q.includes('lavender') && p.slug.includes('lavender')) ||
        (q.includes('magazine') && p.category === 'birthday-magazines') ||
        (q.includes('gift box') && p.category === 'gift-boxes') ||
        (q.includes('resin') && p.description.toLowerCase().includes('resin'));
      return nameMatch || catMatch || keywordMatch;
    });

    if (matched.length > 0) {
      const primary = matched[0];
      const others = matched.slice(1, 3);
      let reply = `🌸 **${primary.name}**\n\n`;
      reply += `• **Price:** ₹${primary.basePrice} *(Original: ₹${primary.originalPrice} - ${primary.discountPercent}% OFF)*\n`;
      reply += `• **Rating:** ${primary.rating}★ (${primary.reviewCount} customer reviews)\n`;
      reply += `• **Status:** ${primary.inStock ? `In Stock (${primary.stock} available)` : 'Out of Stock'}\n`;
      reply += `• **Details:** ${primary.description}\n`;
      reply += `• **Materials:** ${primary.materials}\n\n`;

      if (others.length > 0) {
        reply += `You might also love:\n` + others.map((o) => `• **${o.name}** — ₹${o.basePrice}`).join('\n');
      }

      return {
        reply,
        matchedProducts: matched.map((m) => m.id),
      };
    }

    // General craft / website greeting
    return {
      reply:
        `Welcome to **Petal & Print Handcrafted Studio**! 🌸\n\n` +
        `I am trained on our full catalog of everlasting pipe cleaner bouquets, bespoke 12-page birthday magazines, and curated celebration gift hampers.\n\n` +
        `Here are a few things you can ask me:\n` +
        `• *"How much is the Pipe Cleaner Rose Bouquet?"*\n` +
        `• *"Tell me about the Birthday Magazine options"*\n` +
        `• *"What discount coupons are active?"*\n` +
        `• *"What are your shipping and delivery charges?"*\n` +
        `• *"How do I care for pipe cleaner flowers?"*`,
    };
  },
};
