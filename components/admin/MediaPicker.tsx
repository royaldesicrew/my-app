"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Loader2, Image as ImageIcon, Search, CheckCircle2, Sparkles, X, FileText } from "lucide-react";
import Image from "next/image";

interface MediaItem {
  _id: string;
  url: string;
  format: "image" | "video" | "pdf";
  title?: string;
}

interface MediaPickerProps {
  onSelect: (media: MediaItem) => void;
  trigger?: React.ReactNode;
}

export const MediaPicker = ({ onSelect, trigger }: MediaPickerProps) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/media");
      const data = await response.json();
      setMedia(data);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = media.filter(item => 
    item.title?.toLowerCase().includes(search.toLowerCase()) || 
    item.url.includes(search)
  );

  const handleConfirm = () => {
    const selected = media.find(m => m._id === selectedId);
    if (selected) {
      onSelect(selected);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <button className="admin-btn admin-btn-outline">Select Media</button>}
      </DialogTrigger>
      <DialogContent className="max-w-5xl border-none p-0 overflow-hidden rounded-[32px] bg-white">
        <div className="flex flex-col h-[85vh]">
          {/* Header */}
          <div style={{ padding: '48px 48px 24px 48px' }} className="border-bottom border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-[#FF6B4A]" />
                  <span className="text-[10px] font-bold tracking-widest text-[#FF6B4A] uppercase">Media Library</span>
                </div>
                <DialogTitle className="text-3xl font-premium font-extrabold text-gray-900 tracking-tight">
                  Choose Asset
                </DialogTitle>
              </div>
            </div>
            
            <div className="admin-search-wrap">
              <Search className="admin-search-icon" />
              <input 
                placeholder="Search assets by name or URL..." 
                className="admin-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Grid Area */}
          <div style={{ padding: '0 48px 24px 48px' }} className="flex-1 overflow-y-auto scrollbar-hide">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#FF6B4A]" />
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                  <ImageIcon className="h-8 w-8 opacity-20" />
                </div>
                <p className="text-sm font-medium">No media found in your library</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredMedia.map((item) => (
                  <div 
                    key={item._id}
                    onClick={() => setSelectedId(item._id)}
                    className={`
                      relative aspect-square rounded-xl overflow-hidden border-2 transition cursor-pointer group
                      ${selectedId === item._id ? 'border-[#FF6B4A] shadow-lg scale-[0.98]' : 'border-gray-100 hover:border-gray-200'}
                    `}
                  >
                    {item.format === "pdf" || item.url.toLowerCase().endsWith(".pdf") ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-4">
                        <FileText size={32} className="mb-2" />
                        <span className="text-[9px] font-bold uppercase truncate w-full text-center">{item.url.split('/').pop()}</span>
                      </div>
                    ) : (
                      <Image
                        src={item.url}
                        alt={item.title || "Media"}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                    )}
                    {selectedId === item._id && (
                      <div className="absolute inset-0 bg-[#FF6B4A]/20 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="h-10 w-10 bg-[#FF6B4A] rounded-full flex items-center justify-center shadow-xl">
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '24px 48px 48px 48px' }} className="border-t border-gray-100 bg-gray-50/50 flex justify-end gap-4">
            <button 
              onClick={() => setIsOpen(false)}
              className="admin-btn admin-btn-outline px-8"
            >
              Cancel
            </button>
            <button 
              disabled={!selectedId} 
              onClick={handleConfirm} 
              className="admin-btn admin-btn-primary px-10"
            >
              Select Asset
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
