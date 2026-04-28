"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { X, Loader2, Plus, Trash2, Sparkles, Tag, IndianRupee, ListChecks, Hash, Info } from "lucide-react";

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  pkg?: any;
}

export const PackageModal = ({ isOpen, onClose, onSuccess, pkg }: PackageModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    features: [""] as string[],
    isMostRequested: false,
    isBestValue: false,
    order: 0,
  });

  useEffect(() => {
    if (pkg) {
      setFormData({
        name: pkg.name || "",
        description: pkg.description || "",
        price: pkg.price || "",
        features: pkg.features?.length > 0 ? pkg.features : [""],
        isMostRequested: pkg.isMostRequested || false,
        isBestValue: pkg.isBestValue || false,
        order: pkg.order || 0,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        features: [""],
        isMostRequested: false,
        isBestValue: false,
        order: 0,
      });
    }
  }, [pkg, isOpen]);

  const savePackage = async () => {
    if (!formData.name.trim() || !formData.price.trim()) return;
    setLoading(true);
    try {
      const url = pkg ? `/api/admin/packages/${pkg._id}` : "/api/admin/packages";
      const method = pkg ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          features: formData.features.filter(f => f.trim() !== ""),
        }),
      });
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        console.error("Save failed:", await res.text());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePackage();
  };

  const addFeature = () => setFormData(prev => ({ ...prev, features: [...prev.features, ""] }));
  const removeFeature = (idx: number) => setFormData(prev => ({ 
    ...prev, 
    features: prev.features.filter((_, i) => i !== idx) 
  }));
  const updateFeature = (idx: number, val: string) => setFormData(prev => {
    const newFeatures = [...prev.features];
    newFeatures[idx] = val;
    return { ...prev, features: newFeatures };
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-none p-0 overflow-hidden rounded-[32px] bg-white">
        <div style={{ padding: '48px' }} className="max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-[#FF6B4A]" />
              <span className="text-[10px] font-bold tracking-widest text-[#FF6B4A] uppercase">Pricing Packages</span>
            </div>
            <DialogTitle className="text-3xl font-premium font-extrabold text-gray-900 tracking-tight">
              {pkg ? "Edit Package" : "Add New Package"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Package Name</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Gold Package"
                    className="admin-input admin-input-icon"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Starting Price</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <input
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. Starts at ₹3,00,000"
                    className="admin-input admin-input-icon"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Description</label>
              <div className="relative">
                <Info className="absolute left-4 top-4 h-4 w-4 text-gray-400 z-10" />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of what this package offers..."
                  className="admin-input admin-input-icon min-h-[100px] resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Features & Inclusions</label>
                <button type="button" onClick={addFeature} className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF6B4A] flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                  <Plus size={14} strokeWidth={3} /> Add Feature
                </button>
              </div>
              <div className="space-y-3">
                {formData.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="relative flex-1">
                      <ListChecks className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                      <input
                        value={feature}
                        onChange={(e) => updateFeature(idx, e.target.value)}
                        placeholder="e.g. Venue Selection"
                        className="admin-input admin-input-icon"
                      />
                    </div>
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-2xl border border-transparent hover:border-red-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 cursor-pointer hover:bg-white hover:border-[#FF6B4A]/30 transition-all group">
                <input
                  type="checkbox"
                  checked={formData.isMostRequested}
                  onChange={(e) => setFormData({ ...formData, isMostRequested: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-[#FF6B4A] focus:ring-[#FF6B4A]"
                  style={{ accentColor: '#FF6B4A' }}
                />
                <div>
                  <p className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">Most Requested</p>
                  <p className="text-[10px] text-gray-400 uppercase font-medium tracking-wider">Highlight Badge</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 cursor-pointer hover:bg-white hover:border-[#FF6B4A]/30 transition-all group">
                <input
                  type="checkbox"
                  checked={formData.isBestValue}
                  onChange={(e) => setFormData({ ...formData, isBestValue: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-[#FF6B4A] focus:ring-[#FF6B4A]"
                  style={{ accentColor: '#FF6B4A' }}
                />
                <div>
                  <p className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">Best Value</p>
                  <p className="text-[10px] text-gray-400 uppercase font-medium tracking-wider">Highlight Badge</p>
                </div>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Display Order</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="admin-input admin-input-icon"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-8">
              <button type="button" onClick={onClose} className="admin-btn admin-btn-outline flex-1 justify-center py-4">Cancel</button>
              <button type="submit" disabled={loading} className="admin-btn admin-btn-primary flex-1 justify-center py-4 font-extrabold tracking-widest uppercase">
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (pkg ? "Save Changes" : "Create Package")}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
