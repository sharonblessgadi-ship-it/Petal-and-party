import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    message,
    history = [],
    customKnowledge = '',
    n8nWebhookUrl,
    sessionId = 'visitor-session',
    isTestPing = false,
  } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message text is required' });
  }

  // Check if n8n webhook is specified
  const targetWebhook =
    n8nWebhookUrl ||
    'https://blessy24nm1a0565.app.n8n.cloud/webhook/217bdced-7171-4b85-943c-0d519e17e095/chat';

  if (targetWebhook) {
    try {
      const n8nRes = await fetch(targetWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

        return res.json({ reply: replyText, source: 'n8n', n8nStatus: 200 });
      } else {
        const errBody = await n8nRes.text();
        let parsedErr: any = null;
        try {
          parsedErr = JSON.parse(errBody);
        } catch {}

        if (isTestPing) {
          return res.status(n8nRes.status).json({
            error: parsedErr?.message || `n8n returned status ${n8nRes.status}`,
            hint: parsedErr?.hint,
            n8nStatus: n8nRes.status,
          });
        }
      }
    } catch (webhookErr: any) {
      if (isTestPing) {
        return res.status(500).json({ error: webhookErr?.message, n8nStatus: 500 });
      }
    }
  }

  if (!apiKey) {
    return res.status(200).json({
      reply: '',
      fallback: true,
      n8nNotice:
        'n8n Webhook is configured. Note: Remember to toggle your workflow to "Active" in n8n (blessy24nm1a0565.app.n8n.cloud) to receive live responses.',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `
You are the AI Concierge for "Petal & Print Handcrafted Studio".
You are trained on all products, prices, customization options, and policies of this website.

--- CORE STORE DATA ---
- Hand-sculpted everlasting pipe cleaner flower bouquets (never wilt, no water needed).
- Custom 12-page glossy Birthday Magazine (personalized photos, stories, horoscope).
- Pipe Cleaner Rose Bouquet: ₹499
- Birthday Magazine: ₹799
- Pastel Tulip Bouquet: ₹449
- Golden Sunflower Bouquet: ₹549
- Lavender Whispers: ₹399
- Luxury Keepsake Box: ₹899
- Free Shipping on orders over ₹999 across India.
- Coupons: WELCOME10 (10% off), PETAL20 (20% off over ₹1299).
- Guarantee: 100% replacement for any transit damage within 48 hours.

${customKnowledge}
`.trim();

    const contents: any[] = [];
    const recentHistory = (history || []).slice(-6);
    for (const h of recentHistory) {
      if (h.role === 'user' || h.role === 'model') {
        contents.push({
          role: h.role,
          parts: [{ text: h.content || '' }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ reply: response.text });
  } catch (err: any) {
    console.error('Vercel API chat error:', err);
    return res.status(500).json({ error: err.message, fallback: true });
  }
}
