"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PortfolioItem {
  mediaId: { url: string; type?: string };
  customText?: string;
}

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  items: PortfolioItem[];
}

export default function PortfolioModal({ isOpen, onClose, title, subtitle, items }: PortfolioModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next (slide left), -1 = prev (slide right)

  const nextSlide = () => { setDirection(1); setCurrentIndex((prev) => (prev + 1) % items.length); };
  const prevSlide = () => { setDirection(-1); setCurrentIndex((prev) => (prev - 1 + items.length) % items.length); };

  if (!items || items.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="portfolio-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          data-lenis-prevent
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 11000,
            background: "rgba(0,0,0,0.98)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ── Top Bar ── */}
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "40px 48px 32px",
            flexShrink: 0,
          }}>
            <div>
              <h3 style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 900,
                fontSize: "clamp(28px, 5vw, 56px)",
                color: "#fff",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                marginBottom: 10,
              }}>{title}</h3>
              {subtitle && (
                <p style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  letterSpacing: "0.4em",
                  color: "#FF6B4A",
                  textTransform: "uppercase",
                }}>{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              style={{
                width: 48, height: 48,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#fff", flexShrink: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#FF6B4A")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            >
              <X size={22} />
            </button>
          </div>

          {/* ── Main Image ── */}
          <div style={{ flex: 1, position: "relative", padding: "0 48px", minHeight: 0 }}>
            <div style={{
              width: "100%",
              height: "100%",
              borderRadius: 24,
              overflow: "hidden",
              position: "relative",
              background: "#111",
            }}>
              <AnimatePresence custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ x: d * 100 + "%", opacity: 0 }),
                    center: { x: "0%", opacity: 1 },
                    exit: (d: number) => ({ x: d * -100 + "%", opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
                >
                  {/* Blurred Background Layer */}
                  <img
                    src={items[currentIndex].mediaId?.url}
                    alt=""
                    style={{
                      position: "absolute",
                      inset: -20, // Negative inset to hide edges during blur
                      width: "calc(100% + 40px)",
                      height: "calc(100% + 40px)",
                      objectFit: "cover",
                      filter: "blur(40px) brightness(0.6)",
                      opacity: 0.5,
                      pointerEvents: "none",
                    }}
                  />

                  <img
                    src={items[currentIndex].mediaId?.url}
                    alt={items[currentIndex].customText || title}
                    style={{ position: "relative", width: "100%", height: "100%", objectFit: "contain", display: "block", zIndex: 1 }}
                  />
                  {items[currentIndex].customText && (
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      padding: "80px 40px 32px",
                      background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                      zIndex: 10,
                    }}>
                      <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.5rem", color: "#fff", fontWeight: 700, letterSpacing: "-0.01em", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                        {items[currentIndex].customText}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Prev/Next buttons */}
              {items.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    style={{
                      position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)",
                      width: 52, height: 52, borderRadius: "50%",
                      background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "#fff", zIndex: 5,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#FF6B4A")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.6)")}
                  >
                    <ChevronLeft size={26} />
                  </button>
                  <button
                    onClick={nextSlide}
                    style={{
                      position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)",
                      width: 52, height: 52, borderRadius: "50%",
                      background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "#fff", zIndex: 5,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#FF6B4A")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.6)")}
                  >
                    <ChevronRight size={26} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── Footer: Dots + Counter ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "28px 48px 40px",
            flexShrink: 0,
          }}>
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setDirection(idx > currentIndex ? 1 : -1); setCurrentIndex(idx); }}
                style={{
                  height: 4,
                  width: currentIndex === idx ? 48 : 20,
                  borderRadius: 100,
                  background: currentIndex === idx ? "#FF6B4A" : "rgba(255,255,255,0.2)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.4s ease",
                  padding: 0,
                }}
              />
            ))}
            <span style={{
              marginLeft: 16,
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.1em",
            }}>
              {String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
