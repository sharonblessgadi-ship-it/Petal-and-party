import React, { useEffect, useRef } from 'react';
import { aiKnowledgeService } from '../services/aiKnowledge';

export const N8nChatWidget: React.FC = () => {
  const initializedRef = useRef(false);

  useEffect(() => {
    const settings = aiKnowledgeService.getSettings();

    // If disabled in settings, do not mount
    if (!settings.useN8nWebhook || settings.widgetStyle === 'store-concierge') {
      const existing = document.getElementById('n8n-chat');
      if (existing) {
        existing.style.display = 'none';
      }
      return;
    }

    const existing = document.getElementById('n8n-chat');
    if (existing) {
      existing.style.display = 'block';
      return;
    }

    if (initializedRef.current) return;
    initializedRef.current = true;

    // Dynamically load @n8n/chat official bundle
    const loadN8nChat = async () => {
      try {
        // Ensure stylesheet is loaded
        if (!document.querySelector('link[href*="@n8n/chat"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
          document.head.appendChild(link);
        }

        // Dynamically import official n8n chat module
        // @ts-ignore
        const { createChat } = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js');

        if (typeof createChat === 'function') {
          createChat({
            webhookUrl: settings.n8nWebhookUrl,
            webhookConfig: {
              headers: {
                'X-Instance-Id':
                  settings.instanceId || '8b3ecbd397a310edbe190fe4845b3b884acb131420cbb5574c4d9720fcf3b0f5',
              },
            },
            target: '#n8n-chat',
            mode: 'window',
            showWelcomeScreen: false,
            loadPreviousSession: true,
            initialMessages: [
              'Hi there! 👋',
              'My name is Nathan. Welcome to Petal & Print Handcrafted Studio! How can I assist you today?',
            ],
            i18n: {
              en: {
                title: 'Petal & Print AI',
                subtitle: '⚡ Powered by n8n Workflow',
                inputPlaceholder: 'Ask about bouquets, custom magazines, pricing...',
                getStarted: 'Start conversation',
              },
            },
          });
        }
      } catch (err) {
        console.error('Failed to initialize official n8n chat widget:', err);
      }
    };

    loadN8nChat();
  }, []);

  return null;
};
