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
import { Plus, Trash2, Loader2, X, Sparkles, Utensils, Image as ImageIcon, Camera, Info } from "lucide-react";
import Image from "next/image";
import { PortfolioManager } from "./PortfolioManager";

interface CatererModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  caterer?: any;
}

export const CatererModal = ({ isOpen, onClose, onSuccess, caterer }: CatererModalProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [newService, setNewService] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    services: [] as string[],
    categories: [] as string[],
    coverImageId: "",
    coverImageUrl: "",
    mediaCollection: [] as any[],
    isPublished: true,
  });

  useEffect(() => {
    if (caterer) {
      setFormData({
        name: caterer.name,
        description: caterer.description,
        services: caterer.services || [],
        categories: caterer.categories || [],
        coverImageId: caterer.coverImageId?._id || caterer.coverImageId || "",
        coverImageUrl: caterer.coverImageId?.url || "",
        mediaCollection: caterer.mediaCollection?.map((item: any) => ({
          mediaId: item.mediaId?._id || item.mediaId,
          url: item.mediaId?.url || "",
          customText: item.customText || ""
        })) || [],
        isPublished: caterer.isPublished,
      });
    } else {
      setFormData({ name: "", description: "", services: [], categories: [], coverImageId: "", coverImageUrl: "", mediaCollection: [], isPublished: true });
    }
  }, [caterer, isOpen]);

  const addService = () => {
    if (newService.trim()) {
      setFormData({ ...formData, services: [...formData.services, newService.trim()] });
      setNewService("");
    }
  };

  const addCategory = () => {
    if (newCategory.trim()) {
      setFormData({ ...formData, categories: [...formData.categories, newCategory.trim()] });
      setNewCategory("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = caterer ? "PUT" : "POST";
      const url = caterer ? `/api/admin/caterers/${caterer._id}` : "/api/admin/caterers";
      const response = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) { onSuccess(); onClose(); }
    } catch (error) { console.error(error); }
    finally { setSubmitting(false); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl border-none p-0 overflow-hidden rounded-[32px] bg-white">
        <div style={{ padding: '48px' }} className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-[#FF6B4A]" />
              <span className="text-[10px] font-bold tracking-widest text-[#FF6B4A] uppercase">Catering Manager</span>
            </div>
            <DialogTitle className="text-3xl font-premium font-extrabold text-gray-900 tracking-tight">
              {caterer ? "Edit Partner" : "Add Catering Partner"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Main Partner Image</label>
              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="relative w-32 aspect-square bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  {formData.coverImageUrl ? (
                    <Image src={formData.coverImageUrl} alt="Caterer" fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <MediaPicker 
                  onSelect={(media) => setFormData({ ...formData, coverImageId: media._id, coverImageUrl: media.url })}
                  trigger={
                    <button type="button" className="admin-btn admin-btn-outline px-6 py-2.5 bg-white">
                      {formData.coverImageUrl ? "Change Photo" : "Choose Logo/Photo"}
                    </button>
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Partner Name</label>
              <div className="relative">
                <Utensils className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <input 
                  placeholder="e.g. Royal Desi Catering" 
                  className="admin-input admin-input-icon"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Description</label>
              <div className="relative">
                <Info className="absolute left-4 top-4 h-4 w-4 text-gray-400 z-10" />
                <textarea 
                  placeholder="Tell us about their expertise..." 
                  className="admin-input admin-input-icon min-h-[100px] resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Categories (e.g. Veg, Premium)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <input 
                    placeholder="Add category..." 
                    className="admin-input admin-input-icon"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                  />
                </div>
                <button type="button" onClick={addCategory} className="admin-btn admin-btn-outline px-4">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((cat, i) => (
                  <span key={i} className="admin-chip admin-chip-accent pr-2 py-1.5 flex items-center gap-2">
                    {cat}
                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setFormData({...formData, categories: formData.categories.filter((_, idx) => idx !== i)})} />
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Services Offered</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Camera className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <input 
                    placeholder="e.g. Buffet Service" 
                    className="admin-input admin-input-icon"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                  />
                </div>
                <button type="button" onClick={addService} className="admin-btn admin-btn-outline px-4">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.services.map((service, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium text-gray-700">
                    {service}
                    <button type="button" onClick={() => setFormData({...formData, services: formData.services.filter((_, idx) => idx !== i)})} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <PortfolioManager 
              title="Catering Work Showcase"
              items={formData.mediaCollection}
              onChange={(items) => setFormData({ ...formData, mediaCollection: items })}
            />

            <div className="flex gap-4 pt-6">
              <button type="button" onClick={onClose} className="admin-btn admin-btn-outline flex-1 justify-center py-4">Cancel</button>
              <button type="submit" disabled={submitting} className="admin-btn admin-btn-primary flex-1 justify-center py-4 font-extrabold tracking-widest">
                {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : (caterer ? "UPDATE PARTNER" : "SAVE PARTNER")}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
