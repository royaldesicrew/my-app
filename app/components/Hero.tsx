"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import CatalogsModal from "./CatalogsModal";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const [isCatalogsModalOpen, setIsCatalogsModalOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(badgeRef.current, { y: 24, opacity: 0, duration: 1, delay: 0.2 })
        .from(line1Ref.current, { y: 40, opacity: 0, duration: 1.2 }, "-=0.7")
        .from(line2Ref.current, { y: 40, opacity: 0, duration: 1.2 }, "-=0.9")
        .from(subRef.current, { y: 40, opacity: 0, duration: 1 }, "-=0.8")
        .from(buttonsRef.current, { y: 40, opacity: 0, duration: 0.9 }, "-=0.7")
        .from(scrollHintRef.current, { opacity: 0, duration: 0.8 }, "-=0.4");

      // Subtle parallax blob animation
      gsap.to(".hero-blob-1", {
        y: -40,
        x: 20,
        scale: 1.05,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".hero-blob-2", {
        y: 30,
        x: -15,
        scale: 0.95,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2,
      });
      gsap.to(".hero-blob-3", {
        y: -20,
        x: -25,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 4,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
        background: "#FDFBF7",
        paddingTop: "150px",
        paddingBottom: "32px",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
      {/* ── Background Blobs ── */}
      <div
        className="hero-blob-1"
        style={{
          position: "absolute",
          top: "5%",
          right: "-5%",
          width: "55vw",
          height: "55vw",
          maxWidth: "800px",
          maxHeight: "800px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,153,102,0.18) 0%, rgba(255,107,74,0.06) 60%, transparent 100%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="hero-blob-2"
        style={{
          position: "absolute",
          bottom: "0%",
          left: "-10%",
          width: "45vw",
          height: "45vw",
          maxWidth: "600px",
          maxHeight: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,107,74,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="hero-blob-3"
        style={{
          position: "absolute",
          top: "40%",
          left: "30%",
          width: "30vw",
          height: "30vw",
          maxWidth: "400px",
          maxHeight: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,82,47,0.07) 0%, transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Ghost watermark text ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "var(--font-playfair)",
          fontWeight: 900,
          fontSize: "clamp(120px, 22vw, 340px)",
          color: "rgba(255,107,74,0.055)",
          letterSpacing: "-0.06em",
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          lineHeight: 1,
        }}
      >
        ROYAL
      </div>

      {/* ── Content ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Badge */}
        <div
          ref={badgeRef}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 20px",
            background: "rgba(255,107,74,0.1)",
            border: "1px solid rgba(255,107,74,0.2)",
            borderRadius: "9999px",
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              color: "var(--accent)",
              textTransform: "uppercase",
            }}
          >
            Premium Event Management
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 900,
            lineHeight: "1.0",
            letterSpacing: "-0.04em",
            color: "#0D0D0D",
            marginBottom: "28px",
            overflow: "visible",
          }}
        >
          <span
            ref={line1Ref}
            style={{
              display: "block",
              fontSize: "clamp(52px, 8.5vw, 116px)",
            }}
          >
            Crafting
          </span>
          <span
            ref={line2Ref}
            style={{
              display: "block",
              fontSize: "clamp(52px, 8.5vw, 116px)",
              paddingRight: "0.12em",
            }}
          >
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                background: "linear-gradient(135deg, #FF9966 0%, #FF6B4A 50%, #E8522F 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                paddingRight: "0.1em",
              }}
            >
              Royal
            </em>{" "}
            Moments.
          </span>
        </h1>

        {/* Subtext */}
        <p
          ref={subRef}
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 400,
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "rgba(13,13,13,0.55)",
            maxWidth: "560px",
            lineHeight: 1.75,
            marginBottom: "56px",
          }}
        >
          The premier destination for luxury event management. We don&apos;t
          just plan events — we orchestrate masterpieces of celebration.
        </p>

        {/* Buttons */}
        <div
          ref={buttonsRef}
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "18px 44px",
              background: "#0D0D0D",
              color: "#fff",
              borderRadius: "9999px",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "0.875rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "var(--accent)";
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = "0 12px 40px rgba(255,107,74,0.45)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "#0D0D0D";
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "0 8px 30px rgba(0,0,0,0.2)";
            }}
          >
            Free Consultation
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <button
            onClick={() => setIsCatalogsModalOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "18px 44px",
              background: "transparent",
              color: "#0D0D0D",
              borderRadius: "9999px",
              border: "2px solid rgba(13,13,13,0.15)",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "0.875rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "var(--accent)";
              el.style.color = "var(--accent)";
              el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "rgba(13,13,13,0.15)";
              el.style.color = "#0D0D0D";
              el.style.transform = "translateY(0)";
            }}
          >
            Download Catalogs
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v4m4-10l5 5 5-5m-5 5V3" />
            </svg>
          </button>
        </div>
        
        <CatalogsModal isOpen={isCatalogsModalOpen} onClose={() => setIsCatalogsModalOpen(false)} />

        {/* Stats strip */}
        <div
          style={{
            marginTop: "80px",
            display: "flex",
            gap: "clamp(24px, 5vw, 64px)",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {[
            { num: "500+", label: "Events Crafted" },
            { num: "9yr", label: "Of Excellence" },
            { num: "98%", label: "Client Satisfaction" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                padding: "0 clamp(16px, 3vw, 32px)",
                borderRight: i < 2 ? "1px solid rgba(0,0,0,0.1)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontWeight: 900,
                  fontSize: "clamp(28px, 4vw, 44px)",
                  color: "#0D0D0D",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {stat.num}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  color: "rgba(13,13,13,0.45)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginTop: "6px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          opacity: 0.4,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 600,
            fontSize: "0.65rem",
            letterSpacing: "0.18em",
            color: "#0D0D0D",
            textTransform: "uppercase",
          }}
        >

        </span>
        {/* div
          style={{
            width: 1,
            height: 40,
            background: "linear-gradient(to bottom, #0D0D0D, transparent)",
            an<imation: "scrollLineAnim 1.8s ease-in-out infinite",
          }} */}
        {/* /> */}
        <style>{`
          @keyframes scrollLineAnim {
            0% { opacity: 0; transform: scaleY(0); transform-origin: top; }
            50% { opacity: 1; }
            100% { opacity: 0; transform: scaleY(1); transform-origin: top; }
          }
        `}</style>
      </div>
    </section>
  );
}
