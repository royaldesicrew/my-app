"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Loader2, Sparkles, Save } from "lucide-react";

interface MediaInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  media: any;
}

export const MediaInfoModal = ({ isOpen, onClose, onSuccess, media }: MediaInfoModalProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
  });

  useEffect(() => {
    if (media) {
      setFormData({
        title: media.title || "",
        caption: media.caption || "",
      });
    }
  }, [media, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/media/${media._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error updating media info:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-none p-12 overflow-hidden rounded-[32px] bg-white">
        <DialogHeader className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-[#FF6B4A]" />
            <span className="text-[10px] font-bold tracking-widest text-[#FF6B4A] uppercase">Media Manager</span>
          </div>
          <DialogTitle className="text-2xl font-premium font-extrabold text-gray-900 tracking-tight">
            Edit File Info
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-[11px] font-bold uppercase tracking-wider text-gray-400">File Title</label>
            <input 
              id="title" 
              placeholder="e.g. Wedding Hall View" 
              className="admin-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="caption" className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Caption / Alt Text</label>
            <textarea 
              id="caption" 
              placeholder="Describe this asset for SEO..." 
              className="admin-input min-h-[100px] resize-none"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
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
              disabled={submitting} 
              className="admin-btn admin-btn-primary flex-1 justify-center"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  <Save size={14} />
                  <span>Update Info</span>
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
