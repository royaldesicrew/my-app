"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageReveal from "@/components/ui/image-tiles";
import { FramerThumbnailCarousel } from "@/components/ui/framer-thumbnail-carousel";

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        // Fetch categories first
        const catRes = await fetch("/api/admin/gallery/categories");
        const categoriesDataRaw = await catRes.json();
        const categoriesData = Array.isArray(categoriesDataRaw) ? categoriesDataRaw : [];
        
        // Fetch all gallery items
        const galleryRes = await fetch("/api/admin/gallery");
        const galleryItemsRaw = await galleryRes.json();
        const galleryItems = Array.isArray(galleryItemsRaw) ? galleryItemsRaw : [];

        // Group items by category
        const dynamicCategories = categoriesData.map((cat: any) => ({
          id: cat._id,
          slug: cat.slug,
          name: cat.name,
          items: galleryItems
            .filter((item: any) => item.categoryId?._id === cat._id)
            .map((item: any) => ({
              id: item._id,
              url: item.mediaId?.url,
              title: item.title
            }))
        })).filter((cat: any) => cat.items.length > 0); 

        setCategories(dynamicCategories);
      } catch (err) {
        console.error("Failed to fetch gallery data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  // Lock scroll and hide navbar when modal is open
  useEffect(() => {
    if (selectedCategory) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedCategory]);

  return (
    <section id="work" style={{ padding: "120px 32px", background: "#FDFBF7", position: "relative", zIndex: 10 }}>
      {/* Hide Navbar globally when modal is open */}
      {selectedCategory && (
        <style>{`
          div[class*="fixed top-0 left-0"] { 
            display: none !important; 
          }
        `}</style>
      )}
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 120 }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.22em",
            color: "#FF6B4A",
            textTransform: "uppercase",
            marginBottom: 20,
          }}>
            A Visual Journey
          </p>
          <h2 style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 900,
            fontSize: "clamp(40px,5vw,68px)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: "#0D0D0D",
            marginBottom: 24,
          }}>
            Our <em style={{ fontStyle: "italic", fontWeight: 400, color: "#FF6B4A" }}>Gallery</em>
          </h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1rem",
            color: "rgba(13,13,13,0.5)",
            lineHeight: 1.8,
            maxWidth: 520,
            margin: "0 auto",
          }}>
            Explore our curated collections of past events. Click on any category to immerse yourself in the magic.
          </p>
        </div>

        {/* Categories Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "80px 40px", placeItems: "center" }}>
          {loading ? (
            <div style={{ gridColumn: "1/-1", padding: "40px", color: "rgba(0,0,0,0.5)", fontFamily: "var(--font-montserrat)" }}>
              Loading curated collections...
            </div>
          ) : categories.length === 0 ? (
            <div style={{ gridColumn: "1/-1", padding: "40px", color: "rgba(0,0,0,0.5)", fontFamily: "var(--font-montserrat)" }}>
              No gallery items found.
            </div>
          ) : (
            categories.map((category) => (
              <ImageReveal 
                key={category.id}
                categoryName={category.name}
                leftImage={category.items[0]?.url}
                middleImage={category.items[1]?.url || category.items[0]?.url}
                rightImage={category.items[2]?.url || category.items[1]?.url || category.items[0]?.url}
                onClick={() => setSelectedCategory(category)}
              />
            ))
          )}
        </div>
      </div>

      {/* Popup Island / Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999999, // Super high z-index
              background: "rgba(13, 13, 13, 0.85)",
              backdropFilter: "blur(16px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{
                background: "#FDFBF7",
                width: "100%",
                maxWidth: 1200,
                maxHeight: "90vh",
                borderRadius: 32,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 40px 100px rgba(0,0,0,0.4)",
              }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              {/* Modal Header */}
              <div style={{ padding: "32px 40px", borderBottom: "1px solid rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontSize: "2rem", color: "#0D0D0D", letterSpacing: "-0.02em" }}>
                    {selectedCategory.name}
                  </h3>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "rgba(0,0,0,0.5)", marginTop: 4 }}>
                    Curated collection of our finest work
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    border: "1px solid rgba(0,0,0,0.1)",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#0D0D0D";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#0D0D0D";
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Modal Carousel Section */}
              <div style={{ flex: 1, padding: "20px 0", overflowY: "auto", background: "#FDFBF7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FramerThumbnailCarousel items={selectedCategory.items} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
