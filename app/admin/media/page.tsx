"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Loader2, 
  Image as ImageIcon, 
  Trash2, 
  Search, 
  Upload, 
  Edit2
} from "lucide-react";
import Image from "next/image";
import { MediaInfoModal } from "@/components/admin/MediaInfoModal";
import { MediaUploadModal } from "@/components/admin/MediaUploadModal";

interface MediaItem {
  _id: string;
  url: string;
  format: "image" | "video";
  title?: string;
  caption?: string;
  createdAt: string;
}

export default function MediaAdminPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/admin/media");
      setMedia(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (res.ok) fetchMedia();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredMedia = media.filter(item => 
    item.title?.toLowerCase().includes(search.toLowerCase()) || 
    item.url.includes(search)
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Media Library</h1>
          <p className="admin-page-subtitle">Manage and organize your visual assets.</p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setIsUploadModalOpen(true)}>
            <Upload size={14} /> Upload New
          </button>
        </div>
      </div>

      <MediaInfoModal 
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        onSuccess={fetchMedia}
        media={selectedMedia}
      />

      <MediaUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={fetchMedia}
      />

      <div className="admin-filter-bar">
        <div className="admin-search-wrap">
          <Search className="admin-search-icon" />
          <input 
            className="admin-search" 
            placeholder="Search media by name or url..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="admin-spinner-wrap">
          <Loader2 className="h-7 w-7 animate-spin" style={{ color: "var(--admin-accent)" }} />
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <ImageIcon size={24} style={{ color: "var(--admin-text-muted)" }} />
          </div>
          <h3>No Assets Found</h3>
          <p>Your media library is empty or your search returned no results.</p>
        </div>
      ) : (
        <div className="admin-grid">
          {filteredMedia.map((item) => (
            <div key={item._id} className="admin-media-card">
              <div className="admin-media-thumb">
                {item.format === "image" ? (
                  <Image src={item.url} alt={item.title || "Media"} fill className="object-cover" />
                ) : (
                  <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", background: "#1a1a1a" }}>
                    <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>VIDEO</span>
                  </div>
                )}
                <div className="admin-media-overlay">
                  <div style={{ display: "flex", gap: 6 }}>
                    <button 
                      className="admin-btn" 
                      style={{ background: "rgba(255,255,255,0.9)", color: "#000", padding: "6px 10px", borderRadius: 6, border: "none" }}
                      onClick={() => { setSelectedMedia(item); setIsInfoModalOpen(true); }}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button 
                      className="admin-btn" 
                      style={{ background: "rgba(239,68,68,0.9)", color: "#fff", padding: "6px 10px", borderRadius: 6, border: "none" }}
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="admin-media-info">
                <p className="admin-media-title">{item.title || "Untitled File"}</p>
                <p className="admin-media-meta">{item.format.toUpperCase()} • {new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
