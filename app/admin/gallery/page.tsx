"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Image as ImageIcon, GripVertical, Trash2, Search, Edit2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GalleryModal } from "@/components/admin/GalleryModal";
import Image from "next/image";

interface Category { _id: string; name: string; slug: string; }
interface GalleryItem {
  _id: string; title: string; description: string;
  mediaId: { url: string; format: "image" | "video"; };
  categoryId: any;
  order: number;
}

export default function GalleryAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | undefined>(undefined);

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { if (activeTab) fetchItems(activeTab); }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/gallery/categories");
      const data = await res.json();
      const categoriesData = Array.isArray(data) ? data : [];
      setCategories(categoriesData);
      if (categoriesData.length > 0 && !activeTab) setActiveTab(categoriesData[0].slug);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchItems = async (slug: string) => {
    setItemsLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery?category=${slug}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setItemsLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (res.ok) fetchItems(activeTab);
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Gallery</h1>
          <p className="admin-page-subtitle">Manage event photos and videos by category.</p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => { setSelectedItem(undefined); setIsModalOpen(true); }}>
            <Plus size={14} /> Add Item
          </button>
        </div>
      </div>

      <GalleryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchItems(activeTab)}
        categoryId={categories.find(c => c.slug === activeTab)?._id || ""}
        item={selectedItem}
      />

      {loading ? (
        <div className="admin-spinner-wrap">
          <Loader2 className="h-7 w-7 animate-spin" style={{ color: "var(--admin-accent)" }} />
        </div>
      ) : categories.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <ImageIcon size={24} style={{ color: "var(--admin-text-muted)" }} />
          </div>
          <h3>No Categories Found</h3>
          <p>Initialize your categories to start organizing your gallery.</p>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div style={{ display: "flex", gap: 6, marginBottom: 24, borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: 0 }}>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveTab(cat.slug)}
                style={{
                  padding: "9px 18px",
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: "8px 8px 0 0",
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === cat.slug ? "#fff" : "transparent",
                  color: activeTab === cat.slug ? "var(--admin-text-primary)" : "var(--admin-text-muted)",
                  borderBottom: activeTab === cat.slug ? "2px solid var(--admin-accent)" : "2px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {categories.map((cat) => (
            <TabsContent key={cat._id} value={cat.slug} className="m-0">
              {itemsLoading ? (
                <div className="admin-spinner-wrap">
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--admin-accent)" }} />
                </div>
              ) : items.length === 0 ? (
                <div className="admin-empty">
                  <h3>No Items Yet</h3>
                  <button className="admin-btn admin-btn-primary" onClick={() => { setSelectedItem(undefined); setIsModalOpen(true); }}>
                    <Plus size={14} /> Add First Item
                  </button>
                </div>
              ) : (
                <div className="admin-grid">
                  {items.map((item) => (
                    <div key={item._id} className="admin-media-card">
                      <div className="admin-media-thumb">
                        <Image src={item.mediaId.url} alt={item.title} fill className="object-cover" />
                        <div className="admin-media-overlay">
                          <button 
                            className="admin-btn admin-btn-ghost" 
                            style={{ color: "#fff", padding: "6px 8px" }}
                            onClick={() => { setSelectedItem(item); setIsModalOpen(true); }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="admin-btn admin-btn-ghost" 
                            style={{ color: "#f87171", padding: "6px 8px" }}
                            onClick={() => handleDelete(item._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="admin-media-info">
                        <p className="admin-media-title">{item.title || "Untitled"}</p>
                        <p className="admin-media-meta">{item.mediaId.format}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
