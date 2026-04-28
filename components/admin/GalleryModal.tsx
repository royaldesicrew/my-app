"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { MediaPicker } from "./MediaPicker";
import { Image as ImageIcon, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryId: string;
  item?: any; // Added item prop for editing
}

export const GalleryModal = ({ isOpen, onClose, onSuccess, categoryId, item }: GalleryModalProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mediaId: "",
    mediaUrl: "",
    order: 0,
  });

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData({
          title: item.title || "",
          description: item.description || "",
          mediaId: item.mediaId?._id || item.mediaId || "",
          mediaUrl: item.mediaId?.url || "",
          order: item.order || 0,
        });
      } else {
        setFormData({ title: "", description: "", mediaId: "", mediaUrl: "", order: 0 });
      }
    }
  }, [isOpen, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mediaId) return;
    setSubmitting(true);
    try {
      const method = item ? "PUT" : "POST";
      const url = item ? `/api/admin/gallery/${item._id}` : "/api/admin/gallery";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, categoryId: item?.categoryId?._id || categoryId }),
      });
      if (response.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error saving gallery item:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-none p-0 overflow-hidden rounded-[32px] bg-white">
        <div style={{ padding: '48px' }} className="flex flex-col">
          <DialogHeader className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-[#FF6B4A]" />
              <span className="text-[10px] font-bold tracking-widest text-[#FF6B4A] uppercase">CMS Manager</span>
            </div>
            <DialogTitle className="text-2xl font-premium font-extrabold text-gray-900 tracking-tight">
              {item ? "Edit Gallery Item" : "Add Gallery Item"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Select Media</label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="relative h-20 w-20 bg-white rounded-xl overflow-hidden border border-gray-200 shrink-0 shadow-sm">
                  {formData.mediaUrl ? (
                    <Image src={formData.mediaUrl} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-gray-500 mb-2 font-medium">Pick a high-quality asset</p>
                  <MediaPicker 
                    onSelect={(media) => setFormData({ 
                      ...formData, 
                      mediaId: media._id, 
                      mediaUrl: media.url 
                    })}
                    trigger={
                      <button type="button" className="admin-btn admin-btn-outline w-full py-2.5 bg-white">
                        {formData.mediaUrl ? "Change Media" : "Open Library"}
                      </button>
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Title (Overlay text)</label>
              <input 
                id="title" 
                placeholder="e.g. Summer Wedding 2024" 
                className="admin-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Description</label>
              <textarea 
                id="description" 
                placeholder="Add a short story or description..." 
                className="admin-input min-h-[100px] resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={onClose}
                className="admin-btn admin-btn-outline flex-1 justify-center"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submitting || !formData.mediaId} 
                className="admin-btn admin-btn-primary flex-1 justify-center"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (item ? "Save Changes" : "Save to Gallery")}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
