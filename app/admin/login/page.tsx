"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (data.success) {
        // Redirect to admin dashboard
        router.push("/admin");
        router.refresh(); // Force refresh to update server components with new cookie
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0D0D0D",
      padding: "20px"
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "#1A1A1A",
          padding: "48px 40px",
          borderRadius: 24,
          width: "100%",
          maxWidth: 440,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255,255,255,0.05)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 64,
            height: 64,
            background: "rgba(255,107,74,0.1)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            border: "1px solid rgba(255,107,74,0.2)"
          }}>
            <Lock color="#FF6B4A" size={28} />
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "2rem", color: "#FFFFFF", marginBottom: 8 }}>
            Admin Portal
          </h1>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
            Enter your secure password to access the CMS.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "16px 20px",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                color: "#FFFFFF",
                fontFamily: "var(--font-montserrat)",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.2s"
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#FF6B4A";
                e.currentTarget.style.boxShadow = "0 0 0 4px rgba(255,107,74,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              autoFocus
            />
          </div>

          {error && (
            <div style={{ padding: "12px 16px", background: "rgba(239, 68, 68, 0.1)", borderLeft: "3px solid #ef4444", borderRadius: 4 }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "#ef4444", margin: 0 }}>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              marginTop: 12,
              padding: "18px",
              background: "#FF6B4A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 12,
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "0.9rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              cursor: loading || !password ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              opacity: loading || !password ? 0.7 : 1,
              transition: "all 0.2s"
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Authenticate"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
