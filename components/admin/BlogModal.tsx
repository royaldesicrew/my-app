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
import { Image as ImageIcon, Loader2, Sparkles, BookOpen, Save } from "lucide-react";
import Image from "next/image";

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blog?: any;
}

export const BlogModal = ({ isOpen, onClose, onSuccess, blog }: BlogModalProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    coverImageId: "",
    coverImageUrl: "",
    category: "General",
    isPublished: true,
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        excerpt: blog.excerpt || "",
        coverImageId: blog.coverImageId?._id || blog.coverImageId || "",
        coverImageUrl: blog.coverImageId?.url || "",
        category: blog.category || "General",
        isPublished: blog.isPublished,
      });
    } else {
      setFormData({ title: "", content: "", excerpt: "", coverImageId: "", coverImageUrl: "", category: "General", isPublished: true });
    }
  }, [blog, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.coverImageId) return;
    setSubmitting(true);
    try {
      const method = blog ? "PUT" : "POST";
      const url = blog ? `/api/admin/blogs/${blog._id}` : "/api/admin/blogs";
      
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
      console.error("Error saving blog:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl border-none p-0 overflow-hidden rounded-[32px] bg-white">
        <div style={{ padding: '48px' }} className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-[#FF6B4A]" />
              <span className="text-[10px] font-bold tracking-widest text-[#FF6B4A] uppercase">Editorial Team</span>
            </div>
            <DialogTitle className="text-3xl font-premium font-extrabold text-gray-900 tracking-tight">
              {blog ? "Edit Story" : "Write New Story"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Cover Story Image</label>
              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="relative w-48 aspect-[16/9] bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  {formData.coverImageUrl ? (
                    <Image src={formData.coverImageUrl} alt="Cover" fill className="object-cover" />
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
                      {formData.coverImageUrl ? "Change Feature Image" : "Choose Feature Image"}
                    </button>
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Headline</label>
              <input 
                id="title" 
                placeholder="e.g. 5 Tips for the Perfect Summer Wedding" 
                className="admin-input text-lg font-bold"
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
                <option value="General">General</option>
                <option value="Trends">Trends</option>
                <option value="Venues">Venues</option>
                <option value="Planning">Planning</option>
                <option value="Production">Production</option>
                <option value="Inspiration">Inspiration</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="excerpt" className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Short Excerpt (SEO)</label>
              <textarea 
                id="excerpt" 
                placeholder="Write a catchy summary for the list view..." 
                className="admin-input min-h-[80px] resize-none"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Full Content</label>
              <textarea 
                id="content" 
                placeholder="Start writing your story here..." 
                className="admin-input min-h-[300px] resize-none font-serif leading-relaxed"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required 
              />
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
                disabled={submitting || !formData.coverImageId} 
                className="admin-btn admin-btn-primary flex-1 justify-center py-4 font-extrabold tracking-widest"
              >
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>
                    <Save size={16} />
                    <span>{blog ? "UPDATE STORY" : "PUBLISH STORY"}</span>
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
