"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Loader2, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  User, 
  Music,
  ExternalLink,
  Image as ImageIcon
} from "lucide-react";
import Image from "next/image";
import { ArtistModal } from "@/components/admin/ArtistModal";

interface Artist {
  _id: string;
  name: string;
  category: string;
  bio?: string;
  coverImageId?: { _id: string; url: string; };
  isPublished: boolean;
  createdAt: string;
}

export default function ArtistsAdminPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const res = await fetch("/api/admin/artists");
      setArtists(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this artist?")) return;
    try {
      const res = await fetch(`/api/admin/artists/${id}`, { method: "DELETE" });
      if (res.ok) fetchArtists();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = Array.isArray(artists) ? artists.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Artists & Talent</h1>
          <p className="admin-page-subtitle">Manage your roster of premium performers.</p>
        </div>
        <div className="admin-page-actions">
          <button 
            className="admin-btn admin-btn-primary" 
            onClick={() => { setSelectedArtist(null); setIsModalOpen(true); }}
          >
            <Plus size={14} /> Add New Artist
          </button>
        </div>
      </div>

      <ArtistModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchArtists}
        artist={selectedArtist}
      />

      <div className="admin-filter-bar">
        <div className="admin-search-wrap">
          <Search className="admin-search-icon" />
          <input 
            className="admin-search" 
            placeholder="Search artists by name or category..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="admin-spinner-wrap">
          <Loader2 className="h-7 w-7 animate-spin" style={{ color: "var(--admin-accent)" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <User size={24} style={{ color: "var(--admin-text-muted)" }} />
          </div>
          <h3>No Artists Found</h3>
          <p>You haven't added any talent yet or your search returned no results.</p>
        </div>
      ) : (
        <div className="admin-entity-grid">
          {filtered.map((artist) => (
            <div key={artist._id} className="admin-entity-card">
              <div className="admin-entity-thumb aspect-[1/1.2]">
                {artist.coverImageId ? (
                  <Image src={artist.coverImageId.url} alt={artist.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-100">
                    <User size={32} style={{ color: "#ccc" }} />
                  </div>
                )}
                {!artist.isPublished && <span className="admin-draft-badge">Private</span>}
              </div>
              <div className="admin-entity-body">
                <p className="admin-entity-name">{artist.name}</p>
                <div className="admin-entity-meta-row">
                  <Music size={11} />
                  {artist.category}
                </div>
                <p className="admin-entity-desc line-clamp-2">
                  {artist.bio || "No biography available."}
                </p>
                <div className="admin-entity-actions">
                  <button 
                    className="admin-btn admin-btn-outline px-3"
                    onClick={() => { setSelectedArtist(artist); setIsModalOpen(true); }}
                  >
                    <Edit2 size={13} />
                  </button>
                  <button 
                    className="admin-btn" 
                    style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", padding: "0 12px" }}
                    onClick={() => handleDelete(artist._id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
