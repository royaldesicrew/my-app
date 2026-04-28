"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, BookOpen, Search, Trash2, Edit2, Calendar } from "lucide-react";
import { BlogModal } from "@/components/admin/BlogModal";
import Image from "next/image";

interface Blog {
  _id: string; title: string; excerpt: string; content: string;
  coverImageId?: { _id: string; url: string; };
  isPublished: boolean;
  createdAt: string;
}

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | undefined>(undefined);

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blogs");
      setBlogs(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      if (res.ok) fetchBlogs();
    } catch (e) { console.error(e); }
  };

  const filtered = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Blog & Insights</h1>
          <p className="admin-page-subtitle">Share your event expertise and latest updates.</p>
        </div>
        <div className="admin-page-actions">
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => { setSelectedBlog(undefined); setIsModalOpen(true); }}
          >
            <Plus size={14} /> Write Post
          </button>
        </div>
      </div>

      <BlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBlogs}
        blog={selectedBlog}
      />

      <div className="admin-filter-bar">
        <div className="admin-search-wrap">
          <Search className="admin-search-icon" />
          <input
            className="admin-search"
            placeholder="Search stories..."
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
            <BookOpen size={24} style={{ color: "var(--admin-text-muted)" }} />
          </div>
          <h3>No Stories Yet</h3>
          <p>Start your content journey by writing your first blog post.</p>
          <button className="admin-btn admin-btn-primary" onClick={() => { setSelectedBlog(undefined); setIsModalOpen(true); }}>
            <Plus size={14} /> Write First Post
          </button>
        </div>
      ) : (
        <div className="admin-entity-grid">
          {filtered.map((blog) => (
            <div key={blog._id} className="admin-entity-card">
              <div className="admin-entity-thumb aspect-[16/10]">
                {blog.coverImageId ? (
                  <Image src={blog.coverImageId.url} alt={blog.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-50">
                    <BookOpen size={32} className="text-gray-200" />
                  </div>
                )}
                {!blog.isPublished && <span className="admin-draft-badge">Draft</span>}
              </div>
              <div className="admin-entity-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <h3 className="admin-entity-name text-lg leading-tight">{blog.title}</h3>
                </div>
                <div className="admin-entity-meta-row mb-4">
                  <Calendar size={11} />
                  {new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </div>
                <p className="admin-entity-desc line-clamp-3 mb-6">
                  {blog.excerpt || blog.content.substring(0, 120) + "..."}
                </p>
                <div className="admin-entity-actions">
                  <button
                    className="admin-btn admin-btn-outline"
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={() => { setSelectedBlog(blog); setIsModalOpen(true); }}
                  >
                    <Edit2 size={13} /> Edit Story
                  </button>
                  <button 
                    className="admin-btn admin-btn-outline" 
                    style={{ color: "#f87171", padding: "10px" }}
                    onClick={() => handleDelete(blog._id)}
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
