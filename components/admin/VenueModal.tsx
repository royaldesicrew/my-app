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
import { MapPin, Plus, Trash2, Loader2, X, Sparkles, Building2, Image as ImageIcon, Camera, Info, User, IndianRupee } from "lucide-react";
import Image from "next/image";
import { PortfolioManager } from "./PortfolioManager";

interface VenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  venue?: any;
}

export const VenueModal = ({ isOpen, onClose, onSuccess, venue }: VenueModalProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    category: "",
    coverImageId: "",
    coverImageUrl: "",
    metadata: {
      capacity: "",
      price: "",
    },
    mediaCollection: [] as any[],
    isPublished: true,
  });

  useEffect(() => {
    if (venue) {
      setFormData({
        name: venue.name,
        location: venue.location,
        description: venue.description,
        category: venue.category || "",
        coverImageId: venue.coverImageId?._id || venue.coverImageId || "",
        coverImageUrl: venue.coverImageId?.url || "",
        metadata: {
          capacity: venue.metadata?.capacity || "",
          price: venue.metadata?.price || "",
        },
        mediaCollection: venue.mediaCollection?.map((item: any) => ({
          mediaId: item.mediaId?._id || item.mediaId,
          url: item.mediaId?.url || "",
          customText: item.customText || ""
        })) || [],
        isPublished: venue.isPublished,
      });
    } else {
      setFormData({
        name: "", location: "", description: "", category: "", coverImageId: "", coverImageUrl: "",
        metadata: { capacity: "", price: "" }, mediaCollection: [], isPublished: true
      });
    }
  }, [venue, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = venue ? "PUT" : "POST";
      const url = venue ? `/api/admin/venues/${venue._id}` : "/api/admin/venues";
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
      <DialogContent className="max-w-2xl border-none p-0 overflow-hidden rounded-[32px] bg-white">
        <div style={{ padding: '48px' }} className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-[#FF6B4A]" />
              <span className="text-[10px] font-bold tracking-widest text-[#FF6B4A] uppercase">Venue Manager</span>
            </div>
            <DialogTitle className="text-3xl font-premium font-extrabold text-gray-900 tracking-tight">
              {venue ? "Edit Venue" : "Create New Venue"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Venue Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <input 
                    placeholder="e.g. Grand Ballroom" 
                    className="admin-input admin-input-icon"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Category / Type</label>
                <div className="relative">
                  <Camera className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <input 
                    placeholder="e.g. Luxury, Traditional" 
                    className="admin-input admin-input-icon"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <input 
                  placeholder="City, State" 
                  className="admin-input admin-input-icon"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Description</label>
              <div className="relative">
                <Info className="absolute left-4 top-4 h-4 w-4 text-gray-400 z-10" />
                <textarea 
                  placeholder="Tell us about this venue..." 
                  className="admin-input admin-input-icon min-h-[100px] resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Featured Image</label>
              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="relative w-32 aspect-square bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  {formData.coverImageUrl ? (
                    <Image src={formData.coverImageUrl} alt="Venue" fill className="object-cover" />
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
                      {formData.coverImageUrl ? "Change Photo" : "Select Photo"}
                    </button>
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Capacity</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <input 
                    placeholder="e.g. 500-1000 guests" 
                    className="admin-input admin-input-icon"
                    value={formData.metadata.capacity}
                    onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, capacity: e.target.value } })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Starting Price</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <input 
                    placeholder="e.g. ₹5,00,000" 
                    className="admin-input admin-input-icon"
                    value={formData.metadata.price}
                    onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, price: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            <PortfolioManager 
              title="Venue Work Portfolio"
              items={formData.mediaCollection}
              onChange={(items) => setFormData({ ...formData, mediaCollection: items })}
            />

            <div className="flex gap-4 pt-6">
              <button type="button" onClick={onClose} className="admin-btn admin-btn-outline flex-1 justify-center py-4">Cancel</button>
              <button type="submit" disabled={submitting} className="admin-btn admin-btn-primary flex-1 justify-center py-4 font-extrabold tracking-widest">
                {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : (venue ? "UPDATE VENUE" : "CREATE VENUE")}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
