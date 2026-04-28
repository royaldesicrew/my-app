"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Search, Edit2, Trash2, Ticket, CheckCircle2, ArrowUpDown } from "lucide-react";
import { PackageModal } from "@/components/admin/PackageModal";

interface Package {
  _id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  isMostRequested: boolean;
  isBestValue: boolean;
  order: number;
}

export default function PackagesAdminPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | undefined>(undefined);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/admin/packages", { cache: "no-store" });
      const data = await res.json();
      setPackages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { 
        method: "DELETE",
        cache: "no-store"
      });
      if (res.ok) fetchPackages();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = packages.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Packages</h1>
          <p className="admin-page-subtitle">Configure your event pricing plans and features.</p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => { setSelectedPackage(undefined); setIsModalOpen(true); }}>
            <Plus size={14} /> Add Package
          </button>
        </div>
      </div>

      <PackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPackages}
        pkg={selectedPackage}
      />

      <div className="admin-filter-bar">
        <div className="admin-search-wrap">
          <Search className="admin-search-icon" />
          <input
            className="admin-search"
            placeholder="Search packages by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="admin-btn admin-btn-outline">
          <ArrowUpDown size={13} /> Reorder
        </button>
      </div>

      {loading ? (
        <div className="admin-spinner-wrap">
          <Loader2 className="h-7 w-7 animate-spin" style={{ color: "var(--admin-accent)" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <Ticket size={24} style={{ color: "var(--admin-text-muted)" }} />
          </div>
          <h3>No Packages Found</h3>
          <p>Add your first pricing package to get started.</p>
          <button className="admin-btn admin-btn-primary" onClick={() => { setSelectedPackage(undefined); setIsModalOpen(true); }}>
            <Plus size={14} /> Add First Package
          </button>
        </div>
      ) : (
        <div className="admin-entity-grid">
          {filtered.map((pkg) => (
            <div key={pkg._id} className="admin-entity-card">
              <div className="admin-entity-thumb aspect-video flex items-center justify-center">
                <Ticket size={48} className="text-gray-200" />
                {(pkg.isMostRequested || pkg.isBestValue) && (
                   <span className="admin-draft-badge" style={{ background: pkg.isMostRequested ? "var(--admin-accent)" : "#0D0D0D", color: "white" }}>
                      {pkg.isMostRequested ? "Most Requested" : "Best Value"}
                   </span>
                )}
              </div>
              <div className="admin-entity-body">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <p className="admin-entity-name text-lg truncate">{pkg.name}</p>
                  <span className="text-sm font-black text-[#FF6B4A] whitespace-nowrap flex-shrink-0">{pkg.price}</span>
                </div>
                
                <p className="admin-entity-desc line-clamp-2 mb-4">{pkg.description}</p>

                {pkg.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {pkg.features.slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[10px] font-bold bg-gray-50 text-gray-500 px-2 py-1 rounded-md border border-gray-100 flex items-center gap-1">
                        <CheckCircle2 size={10} className="text-green-500" /> {f}
                      </span>
                    ))}
                    {pkg.features.length > 3 && (
                      <span className="text-[10px] font-bold bg-orange-50 text-[#FF6B4A] px-2 py-1 rounded-md border border-orange-100">
                        +{pkg.features.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                <div className="admin-entity-actions mt-auto">
                  <button
                    className="admin-btn admin-btn-outline flex-1 justify-center"
                    onClick={() => { setSelectedPackage(pkg); setIsModalOpen(true); }}
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button 
                    className="admin-btn" 
                    style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", padding: "0 12px" }}
                    onClick={() => handleDelete(pkg._id)}
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
