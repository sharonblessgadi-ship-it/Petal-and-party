import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useShop();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm">
      <div className="bg-[#2D1F1D] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#9A4C32]/40 flex items-center gap-3 text-xs">
        <Sparkles className="w-4 h-4 text-[#F5C27E] shrink-0" />
        <span className="font-medium leading-snug">{toastMessage}</span>
      </div>
    </div>
  );
};
