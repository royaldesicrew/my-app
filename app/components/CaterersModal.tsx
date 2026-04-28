"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ChefHat, ArrowUpRight } from "lucide-react";
import PortfolioModal from "./PortfolioModal";

interface Caterer {
  _id: string;
  name: string;
  description: string;
  categories: string[];
  coverImageId?: { url: string };
  mediaCollection: any[];
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800",
];

export default function CaterersModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [caterers, setCaterers] = useState<Caterer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaterer, setSelectedCaterer] = useState<Caterer | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCaterers();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const fetchCaterers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/caterers");
      const data = await res.json();
      setCaterers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="caterers-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            data-lenis-prevent
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(10,10,10,0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {/* ── Sticky Top Bar ── */}
            <div style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "24px 48px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(10,10,10,0.85)",
              backdropFilter: "blur(20px)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,107,74,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChefHat size={16} color="#FF6B4A" />
                </div>
                <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.3em", color: "#FF6B4A", textTransform: "uppercase" }}>
                  Premium Caterers
                </span>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#fff", transition: "background 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#FF6B4A")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Hero Header ── */}
            <div style={{ padding: "80px 48px 60px", maxWidth: 1400, margin: "0 auto" }}>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.4em", color: "#FF6B4A", textTransform: "uppercase", marginBottom: 20 }}
              >
                Our Full Catalog
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 80 }}
                style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontSize: "clamp(40px, 8vw, 88px)", color: "#fff", lineHeight: 0.9, letterSpacing: "-0.02em", marginBottom: 32 }}
              >
                Culinary<br /><span style={{ color: "#FF6B4A" }}>Excellence</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.95rem", color: "rgba(255,255,255,0.4)", maxWidth: 520, lineHeight: 1.8 }}
              >
                Handpicked culinary partners who bring authentic flavour, elegance, and creativity to every event we craft.
              </motion.p>
            </div>

            {/* ── Grid ── */}
            <div style={{ padding: "0 48px 120px", maxWidth: 1400, margin: "0 auto" }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
                  <Loader2 className="animate-spin" size={36} color="#FF6B4A" />
                </div>
              ) : caterers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-montserrat)" }}>
                  No caterers added yet. Add them from the Admin Panel.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 28 }}>
                  {caterers.map((c, i) => (
                    <motion.div
                      key={c._id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, type: "spring", stiffness: 80 }}
                      onClick={() => c.mediaCollection?.length > 0 && setSelectedCaterer(c)}
                      style={{
                        borderRadius: 24,
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        cursor: c.mediaCollection?.length > 0 ? "pointer" : "default",
                        transition: "border-color 0.3s, transform 0.3s",
                      }}
                      whileHover={{ y: -6, borderColor: "rgba(255,107,74,0.4)" }}
                    >
                      {/* Card Image */}
                      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                        <img
                          src={c.coverImageId?.url || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                          alt={c.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)" }}
                          onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)")}
                          onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 60%)" }} />
                        {/* Category pill */}
                        {c.categories?.[0] && (
                          <div style={{ position: "absolute", top: 16, left: 16, padding: "6px 14px", borderRadius: 100, background: "rgba(10,10,10,0.7)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.15em", color: "#FF6B4A", textTransform: "uppercase" }}>{c.categories[0]}</span>
                          </div>
                        )}
                        {c.mediaCollection?.length > 0 && (
                          <div style={{ position: "absolute", bottom: 16, right: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,107,74,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ArrowUpRight size={16} color="#fff" />
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div style={{ padding: "24px 24px 28px" }}>
                        <h3 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.4rem", color: "#fff", marginBottom: 10, lineHeight: 1.2 }}>{c.name}</h3>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {c.description}
                        </p>
                        {c.mediaCollection?.length > 0 && (
                          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.2em", color: "#FF6B4A", textTransform: "uppercase", marginTop: 18 }}>
                            View {c.mediaCollection.length} work photos →
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PortfolioModal
        isOpen={!!selectedCaterer}
        onClose={() => setSelectedCaterer(null)}
        title={selectedCaterer?.name || ""}
        subtitle="Work Portfolio"
        items={selectedCaterer?.mediaCollection || []}
      />
    </>
  );
}
