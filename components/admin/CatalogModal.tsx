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
import { FileText, Loader2, Sparkles, Save, Download } from "lucide-react";

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  catalog?: any;
}

export const CatalogModal = ({ isOpen, onClose, onSuccess, catalog }: CatalogModalProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Wedding",
    fileUrl: "",
    thumbnailUrl: "",
    isPublished: true,
    order: 0,
  });

  useEffect(() => {
    if (catalog) {
      setFormData({
        title: catalog.title || "",
        category: catalog.category || "Wedding",
        fileUrl: catalog.fileUrl || "",
        thumbnailUrl: catalog.thumbnailUrl || "",
        isPublished: catalog.isPublished,
        order: catalog.order || 0,
      });
    } else {
      setFormData({ title: "", category: "Wedding", fileUrl: "", thumbnailUrl: "", isPublished: true, order: 0 });
    }
  }, [catalog, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fileUrl) return;
    setSubmitting(true);
    try {
      const method = catalog ? "PUT" : "POST";
      const url = catalog ? `/api/admin/catalogs/${catalog._id}` : "/api/admin/catalogs";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error saving catalog:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl border-none p-0 overflow-hidden rounded-[32px] bg-white">
        <div style={{ padding: '48px' }}>
          <DialogHeader className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-[#FF6B4A]" />
              <span className="text-[10px] font-bold tracking-widest text-[#FF6B4A] uppercase">Resource Center</span>
            </div>
            <DialogTitle className="text-3xl font-premium font-extrabold text-gray-900 tracking-tight">
              {catalog ? "Edit Catalog" : "Add New Catalog"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">PDF Document</label>
              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-gray-200 shadow-sm">
                  <FileText className={`h-8 w-8 ${formData.fileUrl ? 'text-[#FF6B4A]' : 'text-gray-300'}`} />
                </div>
                <div className="flex-1">
                  {formData.fileUrl ? (
                    <div className="text-xs font-medium text-gray-600 truncate mb-2 max-w-[200px]">
                      {formData.fileUrl.split('/').pop()}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 mb-2">No file selected</div>
                  )}
                  <MediaPicker 
                    onSelect={(media) => setFormData({ ...formData, fileUrl: media.url })}
                    trigger={
                      <button type="button" className="text-[11px] font-bold uppercase tracking-widest text-[#FF6B4A] hover:opacity-70 transition-opacity">
                        {formData.fileUrl ? "Change PDF" : "Choose PDF from Media"}
                      </button>
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Catalog Title</label>
              <input 
                id="title" 
                placeholder="e.g. Royal Wedding Collection 2024" 
                className="admin-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Category</label>
              <select 
                id="category" 
                className="admin-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Wedding">Wedding</option>
                <option value="Corporate">Corporate</option>
                <option value="Private">Private</option>
                <option value="Decor">Decor</option>
                <option value="Artist">Artist</option>
              </select>
            </div>

            <div className="flex gap-4 pt-6">
              <button 
                type="button" 
                onClick={onClose}
                className="admin-btn admin-btn-outline flex-1 justify-center py-4"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submitting || !formData.fileUrl} 
                className="admin-btn admin-btn-primary flex-1 justify-center py-4 font-extrabold tracking-widest"
              >
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>
                    <Save size={16} />
                    <span>{catalog ? "UPDATE CATALOG" : "SAVE CATALOG"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
