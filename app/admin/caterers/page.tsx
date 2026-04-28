"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Utensils, Search, Trash2, Edit2, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { CatererModal } from "@/components/admin/CatererModal";
import Image from "next/image";

interface Caterer {
  _id: string; name: string; description: string;
  services: string[]; categories: string[]; isPublished: boolean;
  coverImageId?: { _id: string; url: string; };
}

export default function CaterersAdminPage() {
  const [caterers, setCaterers] = useState<Caterer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCaterer, setSelectedCaterer] = useState<Caterer | undefined>(undefined);

  useEffect(() => { fetchCaterers(); }, []);

  const fetchCaterers = async () => {
    try {
      const res = await fetch("/api/admin/caterers");
      setCaterers(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this caterer?")) return;
    try {
      const res = await fetch(`/api/admin/caterers/${id}`, { method: "DELETE" });
      if (res.ok) fetchCaterers();
    } catch (e) { console.error(e); }
  };

  const filtered = Array.isArray(caterers) ? caterers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const categoryColors: Record<string, string> = {
    veg: "#16a34a",
    "non-veg": "#dc2626",
    premium: "#d97706",
    budget: "#2563eb",
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Caterers</h1>
          <p className="admin-page-subtitle">Manage catering partners, services and menus.</p>
        </div>
        <div className="admin-page-actions">
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => { setSelectedCaterer(undefined); setIsModalOpen(true); }}
          >
            <Plus size={14} /> Add Caterer
          </button>
        </div>
      </div>

      <CatererModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCaterers}
        caterer={selectedCaterer}
      />

      <div className="admin-filter-bar">
        <div className="admin-search-wrap">
          <Search className="admin-search-icon" />
          <input
            className="admin-search"
            placeholder="Search caterers..."
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
            <Utensils size={24} style={{ color: "var(--admin-text-muted)" }} />
          </div>
          <h3>No Caterers Found</h3>
          <p>Add your first catering partner to get started.</p>
          <button className="admin-btn admin-btn-primary" onClick={() => { setSelectedCaterer(undefined); setIsModalOpen(true); }}>
            <Plus size={14} /> Add First Caterer
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {filtered.map((caterer) => (
            <div key={caterer._id} className="admin-card overflow-hidden" style={{ display: "flex", flexDirection: "column" }}>
              {/* Image Header */}
              <div className="relative h-48 w-full bg-gray-100">
                {caterer.coverImageId ? (
                  <Image src={caterer.coverImageId.url} alt={caterer.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-300">
                    <ImageIcon size={32} />
                  </div>
                )}
                {!caterer.isPublished && <span className="admin-draft-badge absolute top-3 right-3">Draft</span>}
              </div>

              <div className="admin-card-body" style={{ flex: 1, padding: '24px' }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <h3 className="font-premium font-extrabold text-xl text-gray-900 tracking-tight">{caterer.name}</h3>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      className="admin-btn admin-btn-ghost"
                      style={{ padding: "6px" }}
                      onClick={() => { setSelectedCaterer(caterer); setIsModalOpen(true); }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="admin-btn admin-btn-ghost" 
                      style={{ padding: "6px", color: "#f87171" }}
                      onClick={() => handleDelete(caterer._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: "var(--admin-text-muted)", lineHeight: 1.6, marginBottom: 16 }}>
                  {caterer.description}
                </p>

                {/* Categories */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {caterer.categories.map((cat) => (
                    <span key={cat} className="admin-chip admin-chip-accent">
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Services List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: 16 }}>
                  {caterer.services.slice(0, 3).map((s) => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--admin-text-primary)" }}>
                      <CheckCircle2 size={14} className="text-green-500" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
