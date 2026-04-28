"use client";

import React from "react";

const S = {
  maxW: { maxWidth: 1200, margin: "0 auto", width: "100%", padding: "0 32px" },
  accent: "#FF6B4A",
  fg: "#0D0D0D",
};

interface FooterProps {
  variant?: "dark" | "light";
}

export default function Footer({ variant = "dark" }: FooterProps) {
  const isLight = variant === "light";
  const bg = isLight ? "#FDFBF7" : S.fg;
  const textColor = isLight ? "#0D0D0D" : "rgba(255,255,255,0.45)";
  const subTextColor = isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.3)";
  const borderColor = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)";

  return (
    <footer style={{ 
      padding: "120px 32px 40px", 
      background: bg, 
      marginTop: "0", 
      position: "relative", 
      zIndex: 1,
      boxShadow: isLight ? "0 -20px 60px rgba(0,0,0,0.05)" : "none",
      borderRadius: isLight ? "80px 80px 0 0" : "0"
    }}>
      <div style={{ ...S.maxW, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 48, marginBottom: 64 }}>
        <div style={{ maxWidth: 320 }}>
          <div style={{ marginBottom: 20 }}>
            <img
              src="/image.png"
              alt="Royal Desi Crew"
              style={{ height: "75px", width: "auto", objectFit: "contain" }}
            />
          </div>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: textColor, lineHeight: 1.8 }}>
            The premier destination for luxury event management and royal desi experiences.
          </p>
        </div>
        <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
          {[
            { 
              title: "Contact", 
              items: [
                { label: "royaldesicrew@gmail.com", href: "mailto:royaldesicrew@gmail.com" }, 
                { label: "9614028424", href: "tel:9614028424" }
              ] 
            },
            { 
              title: "Follow", 
              items: [
                { label: "Instagram", href: "https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=qsk0zbe", target: "_blank", rel: "noopener noreferrer" }, 
                { label: "Facebook", href: "https://www.facebook.com/share/18Wf7t6mSo/", target: "_blank", rel: "noopener noreferrer" }, 
                { label: "YouTube", href: "https://youtube.com/@royaldesicrewevent2.0?si=U-kKXlX4Vs75ptSL", target: "_blank", rel: "noopener noreferrer" }
              ] 
            },
            { 
              title: "Company", 
              items: [
                { label: "Services", href: "#" }, 
                { label: "Our Work", href: "#" }, 
                { label: "About Us", href: "#" }
              ] 
            },
          ].map(col => (
            <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h4 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: S.accent }}>{col.title}</h4>
              {col.items.map((item: any) => (
                <a key={item.label} href={item.href} target={item.target} rel={item.rel} style={{ textDecoration: "none", fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: textColor, cursor: "pointer", transition: "color 0.2s" }}>
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...S.maxW, paddingTop: 32, borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: subTextColor }}>© 2026 Royal Desi Crew Event & Entertainment. ALL RIGHTS RESERVED.</p>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: subTextColor }}>DESIGNED IN INDIA</p>
      </div>
    </footer>
  );
}
