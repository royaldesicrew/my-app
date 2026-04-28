"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Artist {
  name: string;
  tag: string;
  img: string;
  desc: string;
}

const ALL_ARTISTS: Artist[] = [
  { 
    name: "Symphony Strings", 
    tag: "Classical Fusion", 
    img: "https://images.unsplash.com/photo-1514320298574-2c1287270d7a?q=80&w=2070&auto=format&fit=crop", 
    desc: "A world-class string quartet blending traditional melodies with contemporary beats." 
  },
  { 
    name: "DJ Maverick", 
    tag: "Electronic & Bollywood", 
    img: "https://images.unsplash.com/photo-1571266028243-e4bb33394137?q=80&w=2070&auto=format&fit=crop", 
    desc: "The rhythm master who keeps the dance floor alive until the early hours." 
  },
  { 
    name: "Royal Sufi Troupe", 
    tag: "Sufi & Ghazal", 
    img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop", 
    desc: "Soul-stirring performances that bring a touch of spiritual elegance to your evening." 
  },
  { 
    name: "Neon Rhythm", 
    tag: "Live Percussion", 
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop", 
    desc: "High-energy drumming and percussion that adds a vibrant pulse to any celebration." 
  },
  { 
    name: "The Jazz Collective", 
    tag: "Jazz & Blues", 
    img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2070&auto=format&fit=crop", 
    desc: "Sophisticated jazz arrangements for upscale cocktail hours and receptions." 
  },
  { 
    name: "Magic & Illusions", 
    tag: "Interactive Entertainment", 
    img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop", 
    desc: "Mind-bending magic and close-up illusions to entertain guests of all ages." 
  }
];

export default function ArtistsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [artists, setArtists] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetchArtists();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const fetchArtists = async () => {
    try {
      const res = await fetch("/api/admin/artists");
      const data = await res.json();
      setArtists(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-lenis-prevent
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(13,13,13,0.95)",
            backdropFilter: "blur(20px)",
            padding: "40px 20px",
            overflowY: "auto",
            overflowX: "hidden",
            display: "block",
            WebkitOverflowScrolling: "touch"
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: "fixed",
              top: 40,
              right: 40,
              background: "white",
              border: "none",
              width: 50,
              height: 50,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10000,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            }}
          >
            <X size={24} color="#0D0D0D" />
          </button>

          <div style={{ maxWidth: 1200, width: "100%", paddingBottom: 80, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60, marginTop: 40 }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.25em", color: "#FF6B4A", textTransform: "uppercase", marginBottom: 16 }}>World-Class Talent</p>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontSize: "clamp(40px,6vw,72px)", color: "#fff", lineHeight: 1 }}>Our Artists</h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#FF6B4A] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artists.map((a, i) => (
                  <motion.div
                    key={a._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group"
                    style={{ cursor: "pointer" }}
                  >
                    <div style={{ borderRadius: 24, overflow: "hidden", aspectRatio: "16/10", marginBottom: 20, position: "relative" }}>
                      <img
                        src={a.coverImageId?.url || "https://images.unsplash.com/photo-1514320298574-2c1287270d7a?q=80&w=2070&auto=format&fit=crop"}
                        alt={a.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 1s cubic-bezier(0.16,1,0.3,1)" }}
                        className="group-hover:scale-110"
                      />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.6) 0%, transparent 100%)" }} />
                    </div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.15em", color: "#FF6B4A", textTransform: "uppercase", marginBottom: 8 }}>{a.category}</p>
                    <h3 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.4rem", color: "#fff", marginBottom: 12 }}>{a.name}</h3>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{a.bio || "No biography available."}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
