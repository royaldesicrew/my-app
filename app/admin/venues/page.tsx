"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, MapPin, Building2, Search, Filter, Edit2, Image as ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { VenueModal } from "@/components/admin/VenueModal";

interface Venue {
  _id: string; name: string; location: string; description: string;
  category: string;
  coverImageId?: { _id: string; url: string; };
  isPublished: boolean;
  metadata?: { capacity?: string; price?: string; };
}

export default function VenuesAdminPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | undefined>(undefined);

  useEffect(() => { fetchVenues(); }, []);

  const fetchVenues = async () => {
    try {
      const res = await fetch("/api/admin/venues");
      setVenues(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this venue?")) return;
    try {
      const res = await fetch(`/api/admin/venues/${id}`, { method: "DELETE" });
      if (res.ok) fetchVenues();
    } catch (e) { console.error(e); }
  };

  const filtered = venues.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Venues</h1>
          <p className="admin-page-subtitle">Manage event locations, media and metadata.</p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => { setSelectedVenue(undefined); setIsModalOpen(true); }}>
            <Plus size={14} /> Add Venue
          </button>
        </div>
      </div>

      <VenueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchVenues}
        venue={selectedVenue}
      />

      <div className="admin-filter-bar">
        <div className="admin-search-wrap">
          <Search className="admin-search-icon" />
          <input
            className="admin-search"
            placeholder="Search venues by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="admin-btn admin-btn-outline">
          <Filter size={13} /> Categories
        </button>
      </div>

      {loading ? (
        <div className="admin-spinner-wrap">
          <Loader2 className="h-7 w-7 animate-spin" style={{ color: "var(--admin-accent)" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <Building2 size={24} style={{ color: "var(--admin-text-muted)" }} />
          </div>
          <h3>No Venues Found</h3>
          <p>Add your first venue or try a different search term.</p>
          <button className="admin-btn admin-btn-primary" onClick={() => { setSelectedVenue(undefined); setIsModalOpen(true); }}>
            <Plus size={14} /> Add First Venue
          </button>
        </div>
      ) : (
        <div className="admin-entity-grid">
          {filtered.map((venue) => (
            <div key={venue._id} className="admin-entity-card">
              <div className="admin-entity-thumb">
                {venue.coverImageId ? (
                  <Image src={venue.coverImageId.url} alt={venue.name} fill className="object-cover" />
                ) : (
                  <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
                    <ImageIcon size={28} style={{ color: "#ccc" }} />
                  </div>
                )}
                {!venue.isPublished && <span className="admin-draft-badge">Draft</span>}
              </div>
              <div className="admin-entity-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p className="admin-entity-name">{venue.name}</p>
                </div>
                <div className="admin-entity-meta-row">
                  <MapPin size={11} />
                  {venue.location}
                </div>
                {venue.category && (
                  <span className="admin-entity-badge" style={{ background: "rgba(255,107,74,0.08)", color: "var(--admin-accent)" }}>
                    {venue.category}
                  </span>
                )}
                {(venue.metadata?.capacity || venue.metadata?.price) && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    {venue.metadata.capacity && (
                      <span className="admin-chip">👥 {venue.metadata.capacity} guests</span>
                    )}
                    {venue.metadata.price && (
                      <span className="admin-chip admin-chip-accent">from {venue.metadata.price}</span>
                    )}
                  </div>
                )}
                <p className="admin-entity-desc">{venue.description}</p>
                <div className="admin-entity-actions">
                  <button
                    className="admin-btn admin-btn-outline"
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={() => { setSelectedVenue(venue); setIsModalOpen(true); }}
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button className="admin-btn admin-btn-outline" style={{ flex: 1, justifyContent: "center" }}>
                    <ImageIcon size={13} /> Gallery
                  </button>
                  <button 
                    className="admin-btn admin-btn-outline" 
                    style={{ color: "#f87171", padding: "10px" }}
                    onClick={() => handleDelete(venue._id)}
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
