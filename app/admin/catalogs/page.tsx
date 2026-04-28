"use client";

import { useState, useEffect } from "react";
import { Plus, Search, FileText, Trash2, Edit3, ExternalLink, Download } from "lucide-react";
import { CatalogModal } from "@/components/admin/CatalogModal";

export default function AdminCatalogsPage() {
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<any>(null);

  const fetchCatalogs = async () => {
    try {
      const res = await fetch("/api/admin/catalogs");
      const data = await res.json();
      setCatalogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this catalog?")) return;
    try {
      const res = await fetch(`/api/admin/catalogs/${id}`, { method: "DELETE" });
      if (res.ok) fetchCatalogs();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = catalogs.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-premium font-extrabold text-gray-900 tracking-tight">Catalogs</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage your downloadable PDF brochures and catalogs.</p>
        </div>
        <button 
          onClick={() => { setSelectedCatalog(null); setIsModalOpen(true); }}
          className="admin-btn admin-btn-primary px-8 py-4 self-start md:self-center"
        >
          <Plus size={20} />
          <span>ADD CATALOG</span>
        </button>
      </div>

      <div className="flex items-center gap-4 p-4 bg-white rounded-3xl shadow-sm border border-gray-100">
        <Search className="text-gray-400" size={20} />
        <input 
          placeholder="Search catalogs by title or category..." 
          className="flex-1 border-none focus:ring-0 text-sm font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-[200px] bg-gray-100 rounded-[32px] animate-pulse" />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((catalog) => (
            <div 
              key={catalog._id} 
              className="group bg-white rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-[#FF6B4A]/10 rounded-2xl flex items-center justify-center text-[#FF6B4A]">
                  <FileText size={28} />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setSelectedCatalog(catalog); setIsModalOpen(true); }}
                    className="p-2.5 text-gray-400 hover:text-[#FF6B4A] hover:bg-[#FF6B4A]/5 rounded-xl transition-all"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(catalog._id)}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6B4A] bg-[#FF6B4A]/5 px-3 py-1 rounded-full">
                  {catalog.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-3 group-hover:text-[#FF6B4A] transition-colors">{catalog.title}</h3>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <a 
                  href={catalog.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>View PDF</span>
                </a>
                <a 
                  href={catalog.fileUrl} 
                  download 
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF6B4A] hover:opacity-70 transition-opacity"
                >
                  <Download size={14} />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No catalogs found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-2">Start by uploading your first PDF brochure for your clients.</p>
          </div>
        )}
      </div>

      <CatalogModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchCatalogs} 
        catalog={selectedCatalog}
      />
    </div>
  );
}
