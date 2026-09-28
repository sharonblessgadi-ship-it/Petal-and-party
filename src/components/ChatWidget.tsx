import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { aiKnowledgeService } from '../services/aiKnowledge';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ShoppingBag,
  Tag,
  Truck,
  Heart,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  matchedProductIds?: string[];
}

const QUICK_PROMPTS = [
  { label: '💐 Rose Bouquet Price', prompt: 'How much is the Pipe Cleaner Rose Bouquet and what materials are used?' },
  { label: '📖 Custom Birthday Magazine', prompt: 'How does the custom 12-page Birthday Magazine work?' },
  { label: '🏷️ Promo Coupons', prompt: 'What active discount coupon codes are available?' },
  { label: '🚚 Delivery Timelines', prompt: 'What are your delivery times and shipping costs across India?' },
  { label: '🌸 Flower Care Tips', prompt: 'How do I take care of pipe cleaner flowers?' },
];

export const ChatWidget: React.FC = () => {
  const { products, openProductDetails } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const initialSettings = aiKnowledgeService.getSettings();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'model',
      content: initialSettings.welcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setInput('');
    const userMsgId = 'user-' + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      // 1. Try server-side API call with n8n webhook routing
      const currentSettings = aiKnowledgeService.getSettings();
      const customKnowledge = aiKnowledgeService.getTrainedKnowledgeContext();
      const historyPayload = messages.map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          customKnowledge,
          n8nWebhookUrl: currentSettings.useN8nWebhook ? currentSettings.n8nWebhookUrl : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      let botContent = data.reply;

      if (!botContent && data.fallback) {
        const fallbackResult = aiKnowledgeService.answerWithLocalKnowledge(text);
        botContent = fallbackResult.reply;
        if (data.n8nNotice) {
          botContent += `\n\n*(⚡ ${data.n8nNotice})*`;
        }
      }

      if (!botContent) throw new Error('Empty response');

      // Check if any product is referenced in text to suggest product cards
      const matched = products
        .filter((p) => botContent.toLowerCase().includes(p.name.toLowerCase()))
        .map((p) => p.id);

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          role: 'model',
          content: botContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          matchedProductIds: matched.length > 0 ? matched : undefined,
        },
      ]);
    } catch (err) {
      // 2. Intelligent local fallback trained on the website database
      const fallbackResult = aiKnowledgeService.answerWithLocalKnowledge(text);

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          role: 'model',
          content: fallbackResult.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          matchedProductIds: fallbackResult.matchedProducts,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    const settings = aiKnowledgeService.getSettings();
    setMessages([
      {
        id: 'msg-welcome-new',
        role: 'model',
        content: settings.welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleViewProduct = (productId: string) => {
    openProductDetails(productId);
    setIsOpen(false);
  };

  const currentSettings = aiKnowledgeService.getSettings();
  const showCustomLauncher = currentSettings.widgetStyle !== 'official-n8n';
  const isDualMode = currentSettings.widgetStyle === 'both';

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && showCustomLauncher && (
        <div
          className={`fixed bottom-6 ${
            isDualMode ? 'left-6' : 'right-6'
          } z-50 flex items-center gap-3`}
        >
          {hasUnread && (
            <div className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-2xl shadow-xl border border-stone-200/80 text-xs font-medium text-stone-800 animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Ask about custom bouquets &amp; pricing!</span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#9A4C32] to-[#C16D53] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/60 cursor-pointer"
            aria-label="Open AI Store Concierge"
          >
            <MessageCircle className="w-6 h-6 transition-transform group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-white"></span>
            </span>
          </button>
        </div>
      )}

      {/* Chat Window Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2D1F1D] to-[#4A322D] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#9A4C32] to-[#F5C27E] flex items-center justify-center text-white shadow-inner">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#2D1F1D]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-serif-display font-medium text-stone-100">
                    {initialSettings.botName || 'Petal & Print Concierge'}
                  </h3>
                  {initialSettings.useN8nWebhook ? (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <Zap className="w-2.5 h-2.5" />
                      n8n AI
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      AI Trained
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-300 flex items-center gap-1">
                  {initialSettings.useN8nWebhook ? (
                    <span className="truncate max-w-[210px] text-emerald-300/90 font-mono text-[10px]">
                      Connected: n8n Workflow
                    </span>
                  ) : (
                    <span>Trained on website catalog &amp; policies</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-stone-300">
              <button
                onClick={handleResetChat}
                title="Restart conversation"
                className="p-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-[#FAF8F5] border-b border-stone-200/80 px-3 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white text-[11px] font-medium text-stone-700 border border-stone-200/90 hover:border-[#9A4C32] hover:text-[#9A4C32] transition-colors shadow-2xs flex-shrink-0 cursor-pointer disabled:opacity-50"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#FAF8F5]/60 to-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-xl bg-[#9A4C32]/10 text-[#9A4C32] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-2`}>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                      msg.role === 'user'
                        ? 'bg-[#9A4C32] text-white rounded-tr-none'
                        : 'bg-white border border-stone-200/90 text-stone-800 rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Interactive matched product chips */}
                  {msg.matchedProductIds && msg.matchedProductIds.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Mentioned in Studio Catalog:
                      </p>
                      {msg.matchedProductIds.map((pid) => {
                        const prod = products.find((p) => p.id === pid);
                        if (!prod) return null;
                        return (
                          <div
                            key={prod.id}
                            onClick={() => handleViewProduct(prod.id)}
                            className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200/80 hover:border-[#9A4C32] hover:shadow-xs transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={prod.images[0]}
                                alt={prod.name}
                                className="w-8 h-8 rounded-lg object-cover"
                              />
                              <div>
                                <h4 className="text-[11px] font-semibold text-stone-800 group-hover:text-[#9A4C32] transition-colors line-clamp-1">
                                  {prod.name}
                                </h4>
                                <p className="text-[10px] font-bold text-[#9A4C32]">₹{prod.basePrice}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-medium text-stone-500 group-hover:text-[#9A4C32] flex items-center gap-0.5">
                              View <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <span
                    className={`block text-[9px] text-stone-400 ${
                      msg.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-stone-200 text-stone-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-[#9A4C32]/10 text-[#9A4C32] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9A4C32] animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9A4C32] animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9A4C32] animate-bounce"></div>
                    <span className="text-[11px] text-stone-400 font-medium ml-1">
                      Searching website data...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-stone-200/90 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about bouquets, magazines, coupons..."
              disabled={isLoading}
              className="flex-1 bg-stone-100 hover:bg-stone-50 focus:bg-white text-xs text-stone-800 placeholder:text-stone-400 px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#9A4C32] focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-[#9A4C32] hover:bg-[#833F29] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
