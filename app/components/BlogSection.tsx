"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2, BookOpen } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  createdAt: string;
  coverImageId?: {
    url: string;
  };
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/admin/blogs");
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch blog posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const getGridClass = (index: number) => {
    const classes = [
      "md:col-span-2 md:row-span-2",
      "md:col-span-2 md:row-span-1",
      "md:col-span-1 md:row-span-1",
      "md:col-span-1 md:row-span-2",
      "md:col-span-3 md:row-span-1",
    ];
    return classes[index % classes.length] || "md:col-span-1 md:row-span-1";
  };

  return (
    <section id="blog" style={{ padding: "120px 32px", background: "#FDFBF7" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 60 }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.22em",
            color: "#FF6B4A",
            textTransform: "uppercase",
            marginBottom: 20,
          }}>
            Royal Insights
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
            <h2 style={{
              fontFamily: "var(--font-playfair)",
              fontWeight: 900,
              fontSize: "clamp(36px,5vw,64px)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "#0D0D0D",
            }}>
              From the <em style={{ fontStyle: "italic", fontWeight: 400, color: "#FF6B4A" }}>Journal</em>
            </h2>
            <motion.button
              whileHover={{ x: 8 }}
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "0.8rem",
                color: "#0D0D0D",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              VIEW ALL POSTS <span>→</span>
            </motion.button>
          </div>
        </div>

        {/* Bento Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#FF6B4A]" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-[40px] border border-dashed border-gray-200">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p style={{ fontFamily: "var(--font-montserrat)", color: "rgba(13,13,13,0.4)", fontWeight: 600 }}>Our journal is currently being written...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6" style={{ height: "auto" }}>
            {posts.map((post, index) => {
              const gridClass = getGridClass(index);
              const isLarge = gridClass.includes("row-span-2");
              const date = new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
              });

              return (
                <Link key={post._id} href={`/blog/${post.slug}`} className={gridClass}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="group relative h-full overflow-hidden rounded-[32px] cursor-pointer"
                    style={{ minHeight: 300 }}
                  >
                    <img 
                      src={post.coverImageId?.url || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop"} 
                      alt={post.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/90 via-[#0D0D0D]/20 to-transparent" />
                    
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="flex gap-4 mb-4">
                        <span style={{
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: 800,
                          fontSize: "0.6rem",
                          letterSpacing: "0.15em",
                          color: "#FF6B4A",
                          textTransform: "uppercase",
                          background: "rgba(255,255,255,0.1)",
                          backdropFilter: "blur(10px)",
                          padding: "4px 12px",
                          borderRadius: 999,
                        }}>
                          {post.category || "General"}
                        </span>
                        <span style={{
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: 500,
                          fontSize: "0.6rem",
                          color: "rgba(255,255,255,0.6)",
                          padding: "4px 0",
                        }}>
                          {date}
                        </span>
                      </div>
                      
                      <h3 style={{
                        fontFamily: "var(--font-playfair)",
                        fontWeight: 700,
                        fontSize: isLarge ? "1.8rem" : "1.2rem",
                        color: "#fff",
                        lineHeight: 1.2,
                        marginBottom: 12,
                      }}>
                        {post.title}
                      </h3>
                      
                      {isLarge && (
                        <p style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.9rem",
                          color: "rgba(255,255,255,0.7)",
                          lineHeight: 1.6,
                          maxHeight: 0,
                          overflow: "hidden",
                          transition: "all 0.5s ease",
                        }} className="group-hover:max-h-40 group-hover:mb-4">
                          {post.excerpt || (post.content.length > 100 ? post.content.substring(0, 100) + "..." : post.content)}
                        </p>
                      )}
                      
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 group-hover:bg-[#FF6B4A]">
                        ↗
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
