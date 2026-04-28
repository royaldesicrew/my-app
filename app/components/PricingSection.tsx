import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const DEFAULT_PACKAGES = [
    {
        name: "Basic",
        description: "Essential coordination for intimate family gatherings.",
        price: "Starts at ₹3,00,000",
        features: ["Up to 50 Guests", "Venue Selection", "Basic Decor Setup", "On-Day Support", "Timeline Planning"],
        isBestValue: false,
        isMostRequested: false,
    },
    {
        name: "Silver",
        description: "The perfect balance of elegance and affordability.",
        price: "Starts at ₹7,00,000",
        features: ["Up to 150 Guests", "Full Decor & Styling", "Sound & Essential Lighting", "Vendor Coordination", "Guest Management"],
        isBestValue: true,
        isMostRequested: false,
    },
    {
        name: "Gold",
        description: "Our signature luxury experience for celebrations.",
        price: "Starts at ₹15,00,000",
        features: ["Up to 400 Guests", "Bespoke Floral Design", "Cinematic Lighting & AV", "Full Weekend Coordination", "Premium Catering Setup"],
        isBestValue: false,
        isMostRequested: true,
    },
    {
        name: "Diamond",
        description: "The pinnacle of royal luxury and bespoke service.",
        price: "Custom",
        features: ["Unlimited Guests", "Global Destination Planning", "Celebrity Entertainment", "Custom Set Construction", "24/7 Dedicated Concierge"],
        isBestValue: false,
        isMostRequested: false,
    }
];

export default function PricingSection() {
    const [packages, setPackages] = useState<any[]>([]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await fetch("/api/admin/packages", { cache: "no-store" });
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setPackages(data);
                } else {
                    setPackages(DEFAULT_PACKAGES);
                }
            } catch (err) {
                console.error("Failed to fetch packages:", err);
                setPackages(DEFAULT_PACKAGES);
            }
        };
        fetchPackages();
    }, []);

    return (
        <section id="pricing" style={{ padding: "140px 32px", background: "#FDFBF7", color: "#0D0D0D", position: "relative" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 80 }}>
                    <p style={{
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        letterSpacing: "0.2em",
                        color: "var(--accent)",
                        textTransform: "uppercase",
                        marginBottom: 20
                    }}>
                        Curated Experiences
                    </p>
                    <h2 style={{
                        fontFamily: "var(--font-playfair)",
                        fontWeight: 500,
                        fontSize: "clamp(40px, 5vw, 64px)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                        color: "#0D0D0D"
                    }}>
                        Our <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Packages</em>
                    </h2>
                </div>

                {/* Pricing Cards Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 32,
                    alignItems: "stretch"
                }}>
                    {packages.map((pkg, index) => {
                        const isPrimary = pkg.isMostRequested;
                        const hasBadge = pkg.isMostRequested || pkg.isBestValue;
                        const badgeText = pkg.isMostRequested ? "Most Requested" : pkg.isBestValue ? "Best Value" : "";

                        return (
                            <motion.div
                                key={pkg.name}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    position: "relative",
                                    background: "#FFFFFF",
                                    border: isPrimary ? "2px solid var(--accent)" : pkg.isBestValue ? "2px solid #0D0D0D" : "1px solid rgba(0,0,0,0.08)",
                                    borderRadius: 24,
                                    padding: "40px 32px",
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "100%",
                                    minHeight: 550,
                                    boxShadow: isPrimary ? "0 40px 80px -20px rgba(0,0,0,0.15)" : "0 8px 32px rgba(0,0,0,0.04)",
                                }}
                            >
                                {hasBadge && (
                                    <div style={{
                                        position: "absolute",
                                        top: -16,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        background: isPrimary ? "var(--accent)" : "#0D0D0D",
                                        color: "#fff",
                                        fontFamily: "var(--font-montserrat)",
                                        fontWeight: 800,
                                        fontSize: "0.65rem",
                                        letterSpacing: "0.15em",
                                        textTransform: "uppercase",
                                        padding: "8px 20px",
                                        borderRadius: 999,
                                        boxShadow: isPrimary ? "0 8px 20px rgba(255, 107, 74, 0.3)" : "0 8px 20px rgba(0, 0, 0, 0.1)"
                                    }}>
                                        {badgeText}
                                    </div>
                                )}

                                <div style={{ marginBottom: 40 }}>
                                    <h3 style={{
                                        fontFamily: "var(--font-playfair)",
                                        fontWeight: 700,
                                        fontSize: "2rem",
                                        marginBottom: 12,
                                        color: "#0D0D0D"
                                    }}>
                                        {pkg.name}
                                    </h3>
                                    <p style={{
                                        fontFamily: "var(--font-montserrat)",
                                        fontSize: "0.9rem",
                                        color: "rgba(0,0,0,0.6)",
                                        lineHeight: 1.6
                                    }}>
                                        {pkg.description}
                                    </p>
                                </div>

                                <div style={{ marginBottom: 48, paddingBottom: 40, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                                    <div style={{
                                        fontFamily: "var(--font-playfair)",
                                        fontSize: "2.5rem",
                                        fontWeight: 700,
                                        color: isPrimary ? "var(--accent)" : "#0D0D0D"
                                    }}>
                                        {pkg.price}
                                    </div>
                                </div>

                                <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
                                    {pkg.features.map((feature: string) => (
                                        <div key={feature} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                                            <div style={{ marginTop: 4, color: isPrimary ? "var(--accent)" : "rgba(0,0,0,0.4)" }}>
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                            <span style={{
                                                fontFamily: "var(--font-montserrat)",
                                                fontSize: "0.9rem",
                                                color: "rgba(0,0,0,0.8)",
                                                fontWeight: 500
                                            }}>
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    style={{
                                        width: "100%",
                                        padding: "18px",
                                        background: isPrimary ? "var(--accent)" : "#FDFBF7",
                                        color: isPrimary ? "#fff" : "#0D0D0D",
                                        border: isPrimary ? "none" : "1px solid rgba(0,0,0,0.1)",
                                        borderRadius: 9999,
                                        fontFamily: "var(--font-montserrat)",
                                        fontWeight: 700,
                                        fontSize: "0.8rem",
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                    }}
                                    onMouseEnter={e => {
                                        if (!isPrimary) {
                                            e.currentTarget.style.background = "#0D0D0D";
                                            e.currentTarget.style.color = "#fff";
                                        } else {
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                            e.currentTarget.style.boxShadow = "0 10px 25px rgba(255, 107, 74, 0.4)";
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isPrimary) {
                                            e.currentTarget.style.background = "#FDFBF7";
                                            e.currentTarget.style.color = "#0D0D0D";
                                        } else {
                                            e.currentTarget.style.transform = "none";
                                            e.currentTarget.style.boxShadow = "none";
                                        }
                                    }}
                                >
                                    Inquire Now
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
