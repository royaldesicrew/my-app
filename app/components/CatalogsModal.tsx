"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, Sparkles, ExternalLink } from "lucide-react";

interface CatalogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const S = {
  accent: "#FF6B4A",
  fg: "#0D0D0D",
  bg: "#FDFBF7",
};

export default function CatalogsModal({ isOpen, onClose }: CatalogsModalProps) {
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getDownloadUrl = (url: string) => {
    if (!url.includes("cloudinary.com")) return url;
    if (url.includes("/raw/upload/")) return url;
    // Inject fl_attachment and force pdf format after /upload/ for image types
    return url.replace("/upload/", "/upload/fl_attachment,f_pdf/");
  };

  useEffect(() => {
    if (isOpen) {
      fetch("/api/admin/catalogs")
        .then(res => res.json())
        .then(data => {
          setCatalogs(Array.isArray(data) ? data.filter((c: any) => c.isPublished) : []);
          setLoading(false);
        })
        .catch(err => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(13,13,13,0.85)", backdropFilter: "blur(12px)" }} 
      />
      
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        style={{ position: "relative", width: "100%", maxWidth: 640, background: S.bg, borderRadius: 48, overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,0.5)" }}
      >
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: 32, right: 32, width: 44, height: 44, borderRadius: "50%", background: "rgba(0,0,0,0.05)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: S.fg, zIndex: 10 }}
        >
          <X size={20} />
        </button>

        <div style={{ padding: "64px 48px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Sparkles size={16} color={S.accent} />
              <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.65rem", letterSpacing: "0.2em", color: S.accent, textTransform: "uppercase" }}>Royal Resources</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontSize: "2.5rem", color: S.fg, letterSpacing: "-0.03em" }}>Our <em style={{ fontStyle: "italic", fontWeight: 400, color: S.accent }}>Catalogs</em></h2>
            <p style={{ fontFamily: "var(--font-montserrat)", color: "rgba(13,13,13,0.5)", fontSize: "0.95rem", marginTop: 12 }}>Explore our curated collections and event portfolios.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: 400, overflowY: "auto", paddingRight: 12 }} className="custom-scrollbar">
            {loading ? (
               Array(3).fill(0).map((_, i) => (
                 <div key={i} style={{ height: 100, background: "rgba(0,0,0,0.03)", borderRadius: 24, animation: "pulse 2s infinite" }} />
               ))
            ) : catalogs.length > 0 ? (
              catalogs.map((catalog) => (
                <div 
                  key={catalog._id}
                  style={{ background: "#fff", borderRadius: 28, padding: "24px 32px", display: "flex", alignItems: "center", gap: 24, border: "1px solid rgba(0,0,0,0.05)", transition: "all 0.3s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = S.accent; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ width: 56, height: 56, background: `${S.accent}10`, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", color: S.accent }}>
                    <FileText size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.1em", color: S.accent, textTransform: "uppercase" }}>{catalog.category}</span>
                    <h3 style={{ fontFamily: "var(--font-playfair)", fontWeight: 800, fontSize: "1.1rem", color: S.fg, marginTop: 2 }}>{catalog.title}</h3>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <a 
                      href={getDownloadUrl(catalog.fileUrl)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ padding: 12, borderRadius: 14, background: "rgba(0,0,0,0.03)", color: S.fg, display: "flex", transition: "all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.08)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.03)"}
                    >
                      <ExternalLink size={18} />
                    </a>
                    <a 
                      href={getDownloadUrl(catalog.fileUrl)} 
                      download 
                      style={{ padding: 12, borderRadius: 14, background: S.fg, color: "#fff", display: "flex", transition: "all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = S.accent}
                      onMouseLeave={e => e.currentTarget.style.background = S.fg}
                    >
                      <Download size={18} />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", color: "rgba(0,0,0,0.4)", fontWeight: 600 }}>No catalogs available at the moment.</p>
              </div>
            )}
          </div>

          <div style={{ marginTop: 48, textAlign: "center" }}>
             <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "rgba(0,0,0,0.4)", fontWeight: 500, letterSpacing: "0.05em" }}>
                Need a custom proposal? <a href="#contact" onClick={onClose} style={{ color: S.accent, fontWeight: 700, textDecoration: "none" }}>Contact us</a>
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
