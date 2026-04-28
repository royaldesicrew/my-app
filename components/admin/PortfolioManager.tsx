"use client";

import { Plus, Trash2, ImageIcon, Type, Sparkles } from "lucide-react";
import Image from "next/image";
import { MediaPicker } from "./MediaPicker";

interface PortfolioItem {
  mediaId: string;
  url: string;
  customText?: string;
}

interface PortfolioManagerProps {
  items: PortfolioItem[];
  onChange: (items: PortfolioItem[]) => void;
  title?: string;
}

export const PortfolioManager = ({ items = [], onChange, title = "Work Portfolio" }: PortfolioManagerProps) => {
  const handleAddMedia = (media: any) => {
    // Check if already exists to avoid duplicates
    if (items.some(item => item.mediaId === media._id)) return;
    
    onChange([...items, { mediaId: media._id, url: media.url, customText: "" }]);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter(item => item.mediaId !== id));
  };

  const handleUpdateText = (id: string, text: string) => {
    onChange(items.map(item => 
      item.mediaId === id ? { ...item, customText: text } : item
    ));
  };

  return (
    <div className="space-y-4 pt-6 border-t border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[#FF6B4A]" />
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900">{title}</h3>
        </div>
        <MediaPicker 
          onSelect={handleAddMedia}
          trigger={
            <button type="button" className="text-[11px] font-bold text-[#FF6B4A] uppercase tracking-widest flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <Plus className="h-3 w-3" /> Add Item
            </button>
          }
        />
      </div>

      {items.length === 0 ? (
        <div className="p-10 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-center bg-gray-50/50">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-gray-300">
            <ImageIcon className="h-6 w-6" />
          </div>
          <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
            No work showcase items added yet. Add photos to show off this partner's finest work.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((item, index) => (
            <div key={item.mediaId} className="group relative flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-2xl hover:border-[#FF6B4A]/20 transition-all hover:shadow-md">
              <div className="relative h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100">
                <Image src={item.url} alt="Portfolio" fill className="object-cover" />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                  <Type className="h-3 w-3" /> Caption (Optional)
                </div>
                <input 
                  placeholder="e.g. Traditional Decor Setup"
                  className="w-full bg-transparent text-sm text-gray-900 focus:outline-none placeholder:text-gray-300"
                  value={item.customText}
                  onChange={(e) => handleUpdateText(item.mediaId, e.target.value)}
                />
              </div>

              <button 
                type="button"
                onClick={() => handleRemove(item.mediaId)}
                className="h-8 w-8 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="absolute -left-1 top-1/2 -translate-y-1/2 h-4 w-1 bg-[#FF6B4A] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
