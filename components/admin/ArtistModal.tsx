"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { MediaPicker } from "./MediaPicker";
import { Plus, Trash2, Loader2, X, Sparkles, User, Image as ImageIcon, Music, Info } from "lucide-react";
import Image from "next/image";

interface ArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  artist?: any;
}

export const ArtistModal = ({ isOpen, onClose, onSuccess, artist }: ArtistModalProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    bio: "",
    coverImageId: "",
    coverImageUrl: "",
    isPublished: true,
  });

  useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name,
        category: artist.category,
        bio: artist.bio || "",
        coverImageId: artist.coverImageId?._id || artist.coverImageId || "",
        coverImageUrl: artist.coverImageId?.url || "",
        isPublished: artist.isPublished,
      });
    } else {
      setFormData({
        name: "", category: "", bio: "", coverImageId: "", coverImageUrl: "", isPublished: true
      });
    }
  }, [artist, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = artist ? "PUT" : "POST";
      const url = artist ? `/api/admin/artists/${artist._id}` : "/api/admin/artists";
      
      // Clean the data: remove empty string for coverImageId to avoid Mongoose CastError
      const submissionData = {
        ...formData,
        coverImageId: formData.coverImageId || undefined
      };
      // We don't need coverImageUrl in the DB
      delete (submissionData as any).coverImageUrl;

      const response = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
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
              <span className="text-[10px] font-bold tracking-widest text-[#FF6B4A] uppercase">Talent Management</span>
            </div>
            <DialogTitle className="text-3xl font-premium font-extrabold text-gray-900 tracking-tight">
              {artist ? "Edit Artist" : "Add New Artist"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Artist Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <input 
                  placeholder="e.g. DJ Arijit" 
                  className="admin-input admin-input-icon"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Category / Specialization</label>
              <div className="relative">
                <Music className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <input 
                  placeholder="e.g. Singer, DJ, Dancer" 
                  className="admin-input admin-input-icon"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Biography / Short Intro</label>
              <div className="relative">
                <Info className="absolute left-4 top-4 h-4 w-4 text-gray-400 z-10" />
                <textarea 
                  placeholder="Tell us about the artist's background and achievements..." 
                  className="admin-input admin-input-icon min-h-[120px] resize-none"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Artist Photo</label>
              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="relative w-32 aspect-square bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  {formData.coverImageUrl ? (
                    <Image src={formData.coverImageUrl} alt="Artist" fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <MediaPicker 
                    onSelect={(media) => setFormData({ ...formData, coverImageId: media._id, coverImageUrl: media.url })}
                    trigger={
                      <button type="button" className="admin-btn admin-btn-outline px-6 py-2.5 bg-white">
                        {formData.coverImageUrl ? "Change Photo" : "Select Photo"}
                      </button>
                    }
                  />
                  {formData.coverImageUrl && (
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, coverImageId: "", coverImageUrl: "" })}
                      className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button type="button" onClick={onClose} className="admin-btn admin-btn-outline flex-1 justify-center py-4">Cancel</button>
              <button type="submit" disabled={submitting} className="admin-btn admin-btn-primary flex-1 justify-center py-4 font-extrabold tracking-widest">
                {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : (artist ? "UPDATE ARTIST" : "SAVE ARTIST")}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
