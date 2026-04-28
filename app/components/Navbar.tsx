"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#" },
    { name: "Our Work", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Our Venues", href: "#" },
    { name: "About us", href: "#" },
    { name: "Blog", href: "#" },
  ];

  return (
    <div className="fixed top-6 left-0 w-full z-[100] flex justify-center px-4 md:px-8 pointer-events-none">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto flex items-center justify-between gap-8 px-8 py-3 rounded-full border border-border shadow-2xl transition-all duration-700 ${isScrolled
          ? "bg-[#FDFBF7]/80 backdrop-blur-2xl w-full max-w-6xl py-4"
          : "bg-[#FDFBF7]/40 backdrop-blur-md w-full max-w-7xl py-6"
          }`}
      >
        <Link href="/" className="text-xl md:text-2xl font-premium font-black tracking-tighter text-foreground group whitespace-nowrap">
          ROYAL <span className="text-accent group-hover:text-foreground transition-colors duration-500">DESI</span> CREW
        </Link>

        <div className="hidden lg:flex gap-8 items-center">
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[10px] font-bold tracking-[0.2em] uppercase hover:text-accent transition-all duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-accent transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </div>
          <Link
            href="#"
            className="px-6 py-2.5 bg-accent text-white rounded-full text-[10px] font-black tracking-widest hover:bg-foreground transition-all duration-500 shadow-lg shadow-accent/20 whitespace-nowrap"
          >
            BOOK NOW
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button className="p-2 text-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </motion.nav>
    </div>
  );
}
