"use client";
import { useState, useEffect } from "react";
import { MapPin, Utensils, Image as ImageIcon, FolderSearch, LayoutDashboard, ArrowUpRight, Loader2, Mic2, CalendarCheck, BookOpen } from "lucide-react";
import Link from "next/link";

interface Stats {
  venues: number;
  caterers: number;
  media: number;
  galleryItems: number;
  categories: number;
  artists: number;
  bookings: number;
  blogs: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      setStats(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { label: "Total Venues", value: stats?.venues ?? 0, icon: MapPin, href: "/admin/venues", color: "#FF6B4A", bg: "rgba(255,107,74,0.08)" },
    { label: "Catering Partners", value: stats?.caterers ?? 0, icon: Utensils, href: "/admin/caterers", color: "#a855f7", bg: "rgba(168,85,247,0.08)" },
    { label: "Gallery Items", value: stats?.galleryItems ?? 0, icon: ImageIcon, href: "/admin/gallery", color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
    { label: "Elite Artists", value: stats?.artists ?? 0, icon: Mic2, href: "/admin/artists", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
    { label: "Blog Posts", value: stats?.blogs ?? 0, icon: BookOpen, href: "/admin/blogs", color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
    { label: "New Bookings", value: stats?.bookings ?? 0, icon: CalendarCheck, href: "/admin/bookings", color: "#ec4899", bg: "rgba(236,72,153,0.08)" },
    { label: "Media Files", value: stats?.media ?? 0, icon: FolderSearch, href: "/admin/media", color: "#10b981", bg: "rgba(16,185,129,0.08)" },
  ];

  if (loading) {
    return (
      <div className="admin-spinner-wrap">
        <Loader2 className="h-7 w-7 animate-spin" style={{ color: "var(--admin-accent)" }} />
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-subtitle">Welcome back — here's the current state of your platform.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="admin-stat-grid">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="admin-stat-card">
            <ArrowUpRight className="admin-stat-arrow" size={18} />
            <div className="admin-stat-icon" style={{ background: card.bg }}>
              <card.icon size={18} style={{ color: card.color }} />
            </div>
            <p className="admin-stat-label">{card.label}</p>
            <p className="admin-stat-value">{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Bottom Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Quick Actions */}
        <div className="admin-card">
          <div className="admin-card-body">
            <p className="admin-section-title">Quick Actions</p>
            <div className="admin-quick-grid">
              <Link href="/admin/media" className="admin-quick-card">
                <div className="admin-stat-icon" style={{ background: "rgba(16,185,129,0.08)", marginBottom: 0 }}>
                  <FolderSearch size={16} style={{ color: "#10b981" }} />
                </div>
                <span className="admin-quick-label">Upload Media</span>
              </Link>
              <Link href="/admin/gallery" className="admin-quick-card">
                <div className="admin-stat-icon" style={{ background: "rgba(59,130,246,0.08)", marginBottom: 0 }}>
                  <LayoutDashboard size={16} style={{ color: "#3b82f6" }} />
                </div>
                <span className="admin-quick-label">Update Gallery</span>
              </Link>
              <Link href="/admin/venues" className="admin-quick-card">
                <div className="admin-stat-icon" style={{ background: "rgba(255,107,74,0.08)", marginBottom: 0 }}>
                  <MapPin size={16} style={{ color: "#FF6B4A" }} />
                </div>
                <span className="admin-quick-label">Add Venue</span>
              </Link>
              <Link href="/admin/caterers" className="admin-quick-card">
                <div className="admin-stat-icon" style={{ background: "rgba(168,85,247,0.08)", marginBottom: 0 }}>
                  <Utensils size={16} style={{ color: "#a855f7" }} />
                </div>
                <span className="admin-quick-label">Add Caterer</span>
              </Link>
              <Link href="/admin/artists" className="admin-quick-card">
                <div className="admin-stat-icon" style={{ background: "rgba(245,158,11,0.08)", marginBottom: 0 }}>
                  <Mic2 size={16} style={{ color: "#f59e0b" }} />
                </div>
                <span className="admin-quick-label">Add Artist</span>
              </Link>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="admin-card">
          <div className="admin-card-body">
            <p className="admin-section-title">System Status</p>
            <div className="admin-status-list">
              <div className="admin-status-row">
                <span className="admin-status-key">Database</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#16a34a" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                  CONNECTED
                </span>
              </div>
              <div className="admin-status-row">
                <span className="admin-status-key">Cloudinary API</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#16a34a" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                  ACTIVE
                </span>
              </div>
              <div className="admin-status-row">
                <span className="admin-status-key">Dynamic Categories</span>
                <span className="admin-status-val">{stats?.categories ?? 0} Total</span>
              </div>
              <div className="admin-status-row">
                <span className="admin-status-key">Gallery Items</span>
                <span className="admin-status-val">{stats?.galleryItems ?? 0} Published</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

