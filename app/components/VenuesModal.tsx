"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, MapPin, ArrowUpRight, Building2 } from "lucide-react";
import PortfolioModal from "./PortfolioModal";

interface Venue {
  _id: string;
  name: string;
  location: string;
  description: string;
  category: string;
  metadata?: { capacity: string; price: string };
  coverImageId?: { url: string };
  mediaCollection: any[];
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800",
];

export default function VenuesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchVenues();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/venues");
      const data = await res.json();
      setVenues(Array.isArray(data) ? data : []);
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
            key="venues-modal"
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
                  <Building2 size={16} color="#FF6B4A" />
                </div>
                <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.3em", color: "#FF6B4A", textTransform: "uppercase" }}>
                  Majestic Venues
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
                Discover Your Space
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 80 }}
                style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontSize: "clamp(40px, 8vw, 88px)", color: "#fff", lineHeight: 0.9, letterSpacing: "-0.02em", marginBottom: 32 }}
              >
                Majestic<br /><span style={{ color: "#FF6B4A" }}>Venues</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.95rem", color: "rgba(255,255,255,0.4)", maxWidth: 520, lineHeight: 1.8 }}
              >
                Handpicked spaces across the country — from intimate gardens to grand palace halls — curated for your most unforgettable moments.
              </motion.p>
            </div>

            {/* ── Grid ── */}
            <div style={{ padding: "0 48px 120px", maxWidth: 1400, margin: "0 auto" }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
                  <Loader2 className="animate-spin" size={36} color="#FF6B4A" />
                </div>
              ) : venues.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-montserrat)" }}>
                  No venues added yet. Add them from the Admin Panel.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 28 }}>
                  {venues.map((v, i) => (
                    <motion.div
                      key={v._id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, type: "spring", stiffness: 80 }}
                      onClick={() => v.mediaCollection?.length > 0 && setSelectedVenue(v)}
                      style={{
                        borderRadius: 24,
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        cursor: v.mediaCollection?.length > 0 ? "pointer" : "default",
                        transition: "border-color 0.3s",
                      }}
                      whileHover={{ y: -6, borderColor: "rgba(255,107,74,0.4)" }}
                    >
                      {/* Card Image */}
                      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                        <img
                          src={v.coverImageId?.url || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                          alt={v.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)" }}
                          onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)")}
                          onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 60%)" }} />
                        {/* Category pill */}
                        {v.category && (
                          <div style={{ position: "absolute", top: 16, left: 16, padding: "6px 14px", borderRadius: 100, background: "rgba(10,10,10,0.7)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.15em", color: "#FF6B4A", textTransform: "uppercase" }}>{v.category}</span>
                          </div>
                        )}
                        {v.mediaCollection?.length > 0 && (
                          <div style={{ position: "absolute", bottom: 16, right: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,107,74,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ArrowUpRight size={16} color="#fff" />
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div style={{ padding: "24px 24px 28px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                          <MapPin size={11} color="#FF6B4A" />
                          <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.12em", color: "#FF6B4A", textTransform: "uppercase" }}>{v.location}</span>
                        </div>
                        <h3 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.4rem", color: "#fff", marginBottom: 10, lineHeight: 1.2 }}>{v.name}</h3>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {v.description}
                        </p>
                        <div style={{ display: "flex", gap: 16, marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                          {v.metadata?.capacity && (
                            <div>
                              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Capacity</p>
                              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "#fff", fontWeight: 600 }}>{v.metadata.capacity}</p>
                            </div>
                          )}
                          {v.metadata?.price && (
                            <div>
                              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>From</p>
                              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "#fff", fontWeight: 600 }}>{v.metadata.price}</p>
                            </div>
                          )}
                          {v.mediaCollection?.length > 0 && (
                            <div style={{ marginLeft: "auto", alignSelf: "flex-end" }}>
                              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.2em", color: "#FF6B4A", textTransform: "uppercase" }}>
                                View Gallery →
                              </p>
                            </div>
                          )}
                        </div>
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
        isOpen={!!selectedVenue}
        onClose={() => setSelectedVenue(null)}
        title={selectedVenue?.name || ""}
        subtitle={selectedVenue?.location || "Work Portfolio"}
        items={selectedVenue?.mediaCollection || []}
      />
    </>
  );
}
