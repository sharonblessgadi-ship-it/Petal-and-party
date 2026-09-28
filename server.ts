import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Full grounded system instruction with website data & persona
const BASE_WEBSITE_KNOWLEDGE = `
You are the AI Concierge for "Petal & Print Handcrafted Studio" (also known as Petal and Party).
You are an expert on all items sold on this website, custom gifting options, policies, and pricing.

--- STORE OVERVIEW ---
- Name: Petal & Print Handcrafted Studio
- What We Make: Hand-sculpted chenille pipe cleaner flower bouquets that never wilt or fade, custom 12-page glossy Birthday Magazines, curated luxury gift boxes, resin keepsakes, and personalized celebration hampers.
- Location / Shipping: We ship all across India.
- Delivery Times: Standard Delivery takes 3-5 business days. Express Delivery takes 1-2 business days.
- Shipping Fee: FREE delivery on orders above ₹999. Standard shipping is ₹79 for smaller orders. Express priority is ₹149.
- Crafting Time: Custom birthday magazines require 1-2 days design & printing before dispatch.
- Guarantee: 100% Handcrafted Guarantee. If damaged during transit, free replacement or full refund within 48 hours.

--- POPULAR PRODUCTS & PRICING ---
1. Pipe Cleaner Rose Bouquet (Signature Best-Seller): ₹499 (Original ₹699, 28% off) - Hand-sculpted velvety chenille roses that never wilt, wrapped in Korean frosted paper with double-faced satin ribbon.
2. Custom 12-Page Birthday Magazine (Celebrity Cover): ₹799 (Original ₹1,199, 33% off) - High-gloss 12-page editorial magazine featuring recipient's photos, milestone stories, horoscope, and interviews.
3. Pastel Tulip Dream Bouquet: ₹449 (Original ₹599, 25% off) - Soft pink and cream chenille tulips in matte paper.
4. Golden Sunflower & Daisy Bouquet: ₹549 (Original ₹749, 26% off) - Cheerful everlasting sunflowers symbolizing warmth and joy.
5. Lavender Whispers Bouquet: ₹399 (Original ₹499, 20% off) - Calming purple and lilac chenille lavender sprigs.
6. Luxury Keepsake Flower Box: ₹899 (Original ₹1,299, 30% off) - Sturdy gift hamper box with mixed pipe cleaner blooms, fairy lights, and chocolates.

--- ACTIVE COUPONS ---
- WELCOME10: 10% off for first-time buyers (Min order: ₹499)
- PETAL20: 20% off on orders above ₹1,299
- CELEBRATE15: 15% off on Birthday Magazine orders above ₹799

--- INSTRUCTIONS FOR REPLIES ---
1. Provide warm, enthusiastic, helpful advice formatted with clean bullet points and markdown.
2. Always quote exact prices in Indian Rupees (₹).
3. If user asks about custom gifts, explain the customization options (colors, ribbon, custom name cards, photo upload).
4. If user asks for discounts, share the active promo codes.
5. If user asks how to care for pipe cleaner flowers, mention: "Never needs water! Keep away from direct moisture, and gently brush away dust with a dry soft cloth."
6. Keep answers friendly, concise, and focused on Petal & Print handcrafted studio products.
`;

// Chat API endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      message,
      history = [],
      customKnowledge = '',
      n8nWebhookUrl,
      instanceId,
      sessionId = 'visitor-' + (req.ip || 'session'),
      isTestPing = false,
    } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    // Check if n8n webhook is specified
    const targetWebhook =
      n8nWebhookUrl ||
      'https://blessy24nm1a0565.app.n8n.cloud/webhook/217bdced-7171-4b85-943c-0d519e17e095/chat';
    const targetInstanceId =
      instanceId || '8b3ecbd397a310edbe190fe4845b3b884acb131420cbb5574c4d9720fcf3b0f5';

    if (targetWebhook) {
      try {
        const reqHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (targetInstanceId) {
          reqHeaders['X-Instance-Id'] = targetInstanceId;
        }

        const n8nRes = await fetch(targetWebhook, {
          method: 'POST',
          headers: reqHeaders,
          body: JSON.stringify({
            chatInput: message,
            message,
            sessionId,
            action: 'sendMessage',
            history,
            customKnowledge,
          }),
        });

        if (n8nRes.ok) {
          const raw = await n8nRes.text();
          let replyText = raw;
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const item = parsed[0];
              replyText =
                item.output ||
                item.text ||
                item.response ||
                item.reply ||
                item.message ||
                (item.json && (item.json.output || item.json.text)) ||
                JSON.stringify(item);
            } else if (typeof parsed === 'object' && parsed !== null) {
              replyText =
                parsed.output ||
                parsed.text ||
                parsed.response ||
                parsed.reply ||
                parsed.message ||
                (parsed.json && (parsed.json.output || parsed.json.text)) ||
                JSON.stringify(parsed);
            }
          } catch {}

          res.json({ reply: replyText, source: 'n8n', n8nStatus: 200 });
          return;
        } else {
          const errBody = await n8nRes.text();
          let parsedErr: any = null;
          try {
            parsedErr = JSON.parse(errBody);
          } catch {}

          if (isTestPing) {
            res.status(n8nRes.status).json({
              error: parsedErr?.message || `n8n returned status ${n8nRes.status}`,
              hint: parsedErr?.hint,
              n8nStatus: n8nRes.status,
            });
            return;
          }

          console.warn('n8n webhook returned non-200 status:', n8nRes.status, errBody);
        }
      } catch (webhookErr: any) {
        console.warn('Could not contact n8n webhook:', webhookErr?.message);
        if (isTestPing) {
          res.status(500).json({ error: webhookErr?.message, n8nStatus: 500 });
          return;
        }
      }
    }

    if (!aiClient) {
      // In case GEMINI_API_KEY is not set yet in the environment, return a graceful signal with n8n status info
      res.status(200).json({
        reply: '',
        fallback: true,
        n8nNotice:
          'n8n Webhook is configured. Note: Remember to toggle your workflow to "Active" in n8n (blessy24nm1a0565.app.n8n.cloud) to receive live responses.',
      });
      return;
    }

    const systemInstruction = customKnowledge
      ? `${BASE_WEBSITE_KNOWLEDGE}\n\n--- DYNAMICALLY TRAINED STORE UPDATES ---\n${customKnowledge}`
      : BASE_WEBSITE_KNOWLEDGE;

    // Build chat conversation contents
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Append history (limited to last 6 turns to keep context fast and focused)
    const recentHistory = history.slice(-6);
    for (const h of recentHistory) {
      if (h.role === 'user' || h.role === 'model') {
        contents.push({
          role: h.role,
          parts: [{ text: h.content || '' }],
        });
      }
    }

    // Append current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    const replyText = response.text || 'I am delighted to help you explore our handcrafted bouquets and gifts! How else may I assist you today?';

    res.json({ reply: replyText });
  } catch (err: any) {
    console.error('Gemini chat API error:', err);
    res.status(500).json({
      error: err?.message || 'Failed to generate response',
      fallback: true,
    });
  }
});

// Vite Middleware for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
