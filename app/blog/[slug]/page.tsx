"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, User, Clock, Share2, Loader2 } from "lucide-react";
import Navbar1 from "@/components/ui/navbar-1";
import Footer from "@/app/components/Footer";

interface BlogPost {
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
  coverImageId?: {
    url: string;
  };
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`);
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#FDFBF7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="w-10 h-10 animate-spin text-[#FF6B4A]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ minHeight: "100vh", background: "#FDFBF7", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "3rem" }}>Post not found</h1>
        <button onClick={() => router.push("/blog")} style={{ padding: "12px 24px", background: "#0D0D0D", color: "white", borderRadius: 999, border: "none", cursor: "pointer" }}>Back to Blog</button>
      </div>
    );
  }

  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <main style={{ background: "#FDFBF7", minHeight: "100vh" }}>
      <Navbar1 />
      
      {/* Hero Section */}
      <section style={{ position: "relative", height: "70vh", minHeight: 500, width: "100%", overflow: "hidden" }}>
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={post.coverImageId?.url || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop"} 
          alt={post.title} 
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(13,13,13,0.9))" }} />
        
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", padding: "0 32px 80px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                color: "#FF6B4A",
                textTransform: "uppercase",
                background: "rgba(255,107,74,0.1)",
                backdropFilter: "blur(10px)",
                padding: "8px 20px",
                borderRadius: 999,
                border: "1px solid rgba(255,107,74,0.2)",
                marginBottom: 24,
                display: "inline-block"
              }}>
                {post.category || "Inspiration"}
              </span>
              <h1 style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 900,
                fontSize: "clamp(40px, 6vw, 72px)",
                color: "white",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: 32
              }}>
                {post.title}
              </h1>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: 32, color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-montserrat)", fontSize: "0.9rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><User size={16} color="#FF6B4A" /> {post.author || "Royal Desi Crew"}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Calendar size={16} color="#FF6B4A" /> {date}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Clock size={16} color="#FF6B4A" /> 5 min read</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ padding: "80px 32px", position: "relative", zIndex: 10, marginTop: -40 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{ 
              background: "white", 
              padding: "60px 80px", 
              borderRadius: "40px", 
              boxShadow: "0 40px 100px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.03)"
            }}
          >
            {/* Action Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 60, paddingBottom: 32, borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              <button onClick={() => router.push("/blog")} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", color: "#0D0D0D", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", opacity: 0.6 }}>
                <ArrowLeft size={16} /> BACK TO JOURNAL
              </button>
              <div style={{ display: "flex", gap: 16 }}>
                <button style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#0D0D0D" }}><Share2 size={16} /></button>
              </div>
            </div>

            <div 
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "1.1rem",
                lineHeight: 1.9,
                color: "rgba(13,13,13,0.8)",
                whiteSpace: "pre-wrap"
              }}
              className="blog-content"
            >
              {post.content}
            </div>

            {/* Newsletter/CTA */}
            <div style={{ marginTop: 80, padding: "48px", background: "#0D0D0D", borderRadius: 32, color: "white", textAlign: "center" }}>
              <h4 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.8rem", marginBottom: 16 }}>Planning a Royal Celebration?</h4>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", marginBottom: 32 }}>Let us help you bring your vision to life with our expertise.</p>
              <button onClick={() => router.push("/book")} style={{ padding: "16px 40px", background: "#FF6B4A", color: "white", borderRadius: 999, border: "none", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em" }}>Start Planning Now</button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      
      <style jsx>{`
        .blog-content p {
          margin-bottom: 2rem;
        }
        @media (max-width: 768px) {
          .blog-content {
            padding: 40px 24px !important;
          }
        }
      `}</style>
    </main>
  );
}
