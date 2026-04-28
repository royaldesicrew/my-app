"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Navbar1 from "@/components/ui/navbar-1";
import Footer from "@/app/components/Footer";
import services from "@/data/services.json";
// Removed duplicate and hardcoded JSON imports

const ACCENT = "#FF6B4A";
const BG = "#FDFBF7";
const FG = "#0D0D0D";

const STEPS = [
  { id: 1, label: "You" },
  { id: 2, label: "Event" },
  { id: 3, label: "Package" },
  { id: 4, label: "Venue" },
  { id: 5, label: "Caterers" },
  { id: 6, label: "Artists" },
  { id: 7, label: "Confirm" },
];

type FormData = {
  name: string;
  email: string;
  phone: string;
  service: string;
  package: string;
  venue: string;
  caterer: string;
  artist: string;
  budget: number;
  guests: string;
  notes: string;
};

function Field({
  id, label, type, placeholder, required, value, onChange, isTextArea,
}: {
  id: string; label: string; type: string; placeholder: string;
  required?: boolean; value: string; onChange: (v: string) => void;
  isTextArea?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <label htmlFor={id} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(13,13,13,0.65)" }}>
        {label} {required && <span style={{ color: ACCENT }}>*</span>}
      </label>
      {isTextArea ? (
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={4}
          style={{ padding: "20px 24px", borderRadius: 16, border: "1.5px solid rgba(0,0,0,0.1)", background: "#fff", fontFamily: "var(--font-montserrat)", fontSize: "1rem", color: FG, outline: "none", transition: "all 0.2s", boxShadow: "0 2px 16px rgba(0,0,0,0.04)", width: "100%", boxSizing: "border-box", resize: "none" }}
          onFocus={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.boxShadow = `0 0 0 4px rgba(255,107,74,0.1)`; }}
          onBlur={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)"; }}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ padding: "20px 24px", borderRadius: 16, border: "1.5px solid rgba(0,0,0,0.1)", background: "#fff", fontFamily: "var(--font-montserrat)", fontSize: "1rem", color: FG, outline: "none", transition: "border-color 0.2s, box-shadow 0.2s", boxShadow: "0 2px 16px rgba(0,0,0,0.04)", width: "100%", boxSizing: "border-box" }}
          onFocus={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.boxShadow = `0 0 0 4px rgba(255,107,74,0.1)`; }}
          onBlur={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)"; }}
        />
      )}
    </div>
  );
}

function RevealSection({ children, id }: { children: React.ReactNode; id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  return (
    <motion.div
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ step, total, label, sub }: { step: number; total: number; label: React.ReactNode; sub: string }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.22em", color: ACCENT, textTransform: "uppercase", marginBottom: 14 }}>Step {step} of {total}</p>
      <h2 style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontSize: "clamp(28px,4vw,52px)", color: FG, lineHeight: 1.1 }}>{label}</h2>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.95rem", color: "rgba(0,0,0,0.55)", marginTop: 14, lineHeight: 1.6 }}>{sub}</p>
    </div>
  );
}

export default function BookPage() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", service: "", package: "", venue: "", caterer: "", artist: "", budget: 100000, guests: "", notes: "" });
  
  // Database States
  const [dbPackages, setDbPackages] = useState<any[]>([]);
  const [dbVenues, setDbVenues] = useState<any[]>([]);
  const [dbCaterers, setDbCaterers] = useState<any[]>([]);
  const [dbArtists, setDbArtists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDbData = async () => {
      try {
        const [pRes, vRes, cRes, aRes] = await Promise.all([
          fetch("/api/admin/packages"),
          fetch("/api/admin/venues"),
          fetch("/api/admin/caterers"),
          fetch("/api/admin/artists")
        ]);
        const [pData, vData, cData, aData] = await Promise.all([
          pRes.json(), vRes.json(), cRes.json(), aRes.json()
        ]);
        setDbPackages(Array.isArray(pData) ? pData : []);
        setDbVenues(Array.isArray(vData) ? vData : []);
        setDbCaterers(Array.isArray(cData) ? cData : []);
        setDbArtists(Array.isArray(aData) ? aData : []);
      } catch (err) {
        console.error("Failed to fetch booking options:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDbData();
  }, []);
  
  useEffect(() => {
    const service = searchParams.get("service");
    const pkg = searchParams.get("package");
    const venue = searchParams.get("venue");
    const caterer = searchParams.get("caterer");
    const artist = searchParams.get("artist");

    if (service || pkg || venue || caterer || artist) {
      setForm(prev => ({
        ...prev,
        service: service || prev.service,
        package: pkg || prev.package,
        venue: venue || prev.venue,
        caterer: caterer || prev.caterer,
        artist: artist || prev.artist,
      }));
    }
  }, [searchParams]);

  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useEffect(() => {
    if (isSubmitted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.findIndex(r => r.current === entry.target);
            if (idx !== -1) setActiveStep(idx + 1);
          }
        });
      },
      { threshold: 0.2, rootMargin: "-80px 0px 0px 0px" }
    );
    sectionRefs.forEach(r => { if (r.current) observer.observe(r.current); });
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted]);

  const scrollTo = (stepIdx: number) => {
    if (!sectionRefs[stepIdx]?.current) return;
    const element = sectionRefs[stepIdx].current;
    const offset = 100; // Account for sticky pills
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element!.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  };

  const selectedService = services.find(s => s.id === form.service || s.name.trim().toLowerCase() === form.service.trim().toLowerCase());
  const selectedPackage = dbPackages.find(p => p._id === form.package || p.id === form.package || p.name.trim().toLowerCase() === form.package.trim().toLowerCase());
  const selectedVenue = dbVenues.find(v => v._id === form.venue || v.id === form.venue || v.name.trim().toLowerCase() === form.venue.trim().toLowerCase());
  const selectedCaterer = dbCaterers.find(c => c._id === form.caterer || c.id === form.caterer || c.name.trim().toLowerCase() === form.caterer.trim().toLowerCase());
  const selectedArtist = dbArtists.find(a => a._id === form.artist || a.id === form.artist || a.name.trim().toLowerCase() === form.artist.trim().toLowerCase());

  if (isSubmitted) {
    return (
      <main style={{ background: BG, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar1 />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 32px" }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            style={{ maxWidth: 600, width: "100%", textAlign: "center", background: "white", padding: "80px 40px", borderRadius: 48, boxShadow: "0 30px 100px rgba(0,0,0,0.08)" }}
          >
            <div style={{ width: 100, height: 100, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 40px", boxShadow: `0 20px 40px rgba(255,107,74,0.3)` }}>
              <Check size={48} color="white" strokeWidth={3} />
            </div>
            <h1 style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontSize: "3.5rem", color: FG, marginBottom: 20 }}>Request <em style={{ fontStyle: "italic", color: ACCENT }}>Sent!</em></h1>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "1.1rem", color: "rgba(0,0,0,0.6)", lineHeight: 1.6, marginBottom: 48 }}>
              Thank you, {form.name.split(" ")[0]}. We've received your request for a {selectedService?.name.toLowerCase()}. Our royal planners will reach out to you at {form.phone} within 24 hours.
            </p>
            <button 
              onClick={() => window.location.href = "/"}
              style={{ padding: "20px 48px", borderRadius: 999, background: FG, color: "white", border: "none", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              Back to Home
            </button>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main style={{ background: BG, minHeight: "100vh", position: "relative" }}>
      <Navbar1 />
      <div style={{ height: 100 }} />

      {/* Hero */}
      <div style={{ padding: "60px 32px 60px", textAlign: "center" }}>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.22em", color: ACCENT, textTransform: "uppercase", marginBottom: 16 }}>Start Your Journey</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontSize: "clamp(40px,6vw,72px)", color: FG, lineHeight: 1, marginBottom: 24 }}>
          Book Your <em style={{ fontStyle: "italic", color: ACCENT }}>Royal Event</em>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} style={{ fontFamily: "var(--font-montserrat)", fontSize: "1rem", color: "rgba(13,13,13,0.6)", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
          Tell us about your dream event, and let's make it a royal reality.
        </motion.p>
        
        {/* Sticky step pills */}
        <div style={{ position: "sticky", top: 20, zIndex: 100, marginTop: 40 }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }} 
            style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: 12, 
              flexWrap: "wrap", 
              maxWidth: 700, 
              margin: "0 auto",
              background: "rgba(253, 251, 247, 0.8)",
              backdropFilter: "blur(12px)",
              padding: "12px 24px",
              borderRadius: 999,
              boxShadow: activeStep > 1 ? "0 10px 40px rgba(0,0,0,0.06)" : "none",
              border: activeStep > 1 ? "1px solid rgba(0,0,0,0.05)" : "1px solid transparent",
              transition: "all 0.4s ease"
            }}
          >
            {STEPS.map((s, i) => {
              const isCompleted = (s.id === 1 && form.name && form.phone) ||
                                 (s.id === 2 && form.service) ||
                                 (s.id === 3 && form.package) ||
                                 (s.id === 4 && form.venue) ||
                                 (s.id === 5 && form.caterer) ||
                                 (s.id === 6 && form.artist);
              const isActive = activeStep === s.id;
              
              return (
                <button 
                  key={s.id} 
                  onClick={() => scrollTo(i)} 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 8, 
                    padding: "8px 16px", 
                    borderRadius: 999, 
                    border: isActive ? `2px solid ${ACCENT}` : "2px solid rgba(0,0,0,0.05)", 
                    background: isActive ? ACCENT : isCompleted ? FG : "white", 
                    cursor: "pointer", 
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isActive ? `0 4px 15px rgba(255,107,74,0.3)` : "none"
                  }}
                >
                  <span style={{ 
                    width: 18, 
                    height: 18, 
                    borderRadius: "50%", 
                    background: isCompleted ? ACCENT : "transparent", 
                    border: isCompleted ? "none" : `1.5px solid ${isActive ? "white" : "rgba(0,0,0,0.2)"}`, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    transition: "all 0.3s ease"
                  }}>
                    {isCompleted ? <Check size={11} color="white" strokeWidth={4} /> : null}
                  </span>
                  <span style={{ 
                    fontFamily: "var(--font-montserrat)", 
                    fontWeight: 700, 
                    fontSize: "0.6rem", 
                    letterSpacing: "0.08em", 
                    textTransform: "uppercase", 
                    color: isActive || isCompleted ? "white" : "rgba(0,0,0,0.5)",
                    transition: "color 0.3s ease"
                  }}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(0,0,0,0.05)", margin: "0 32px" }} />

      {/* ── SCROLL SECTIONS ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>

        {/* Step 1 — Personal Info */}
        <div ref={sectionRefs[0]} style={{ paddingTop: 100, paddingBottom: 100 }}>
          <RevealSection id="step-1">
            <StepOne form={form} setForm={setForm} onNext={() => scrollTo(1)} />
          </RevealSection>
        </div>

        <div style={{ height: 1, background: "rgba(0,0,0,0.05)" }} />

        {/* Step 2 — Event Type */}
        <div ref={sectionRefs[1]} style={{ paddingTop: 120, paddingBottom: 120 }}>
          <RevealSection id="step-2">
            <StepTwo form={form} setForm={setForm} onNext={() => scrollTo(2)} />
          </RevealSection>
        </div>

        <div style={{ height: 1, background: "rgba(0,0,0,0.05)" }} />

        {/* Step 3 — Package */}
        <div ref={sectionRefs[2]} style={{ paddingTop: 120, paddingBottom: 120 }}>
          <RevealSection id="step-3">
            <StepThree form={form} setForm={setForm} onNext={() => scrollTo(3)} dbPackages={dbPackages} />
          </RevealSection>
        </div>

        <div style={{ height: 1, background: "rgba(0,0,0,0.05)" }} />

        {/* Step 4 — Venue */}
        <div ref={sectionRefs[3]} style={{ paddingTop: 120, paddingBottom: 120 }}>
          <RevealSection id="step-4">
            <StepFour form={form} setForm={setForm} onNext={() => scrollTo(4)} dbVenues={dbVenues} />
          </RevealSection>
        </div>

        <div style={{ height: 1, background: "rgba(0,0,0,0.05)" }} />

        {/* Step 5 — Caterer */}
        <div ref={sectionRefs[4]} style={{ paddingTop: 120, paddingBottom: 120 }}>
          <RevealSection id="step-5">
            <StepFive form={form} setForm={setForm} onNext={() => scrollTo(5)} dbCaterers={dbCaterers} />
          </RevealSection>
        </div>

        <div style={{ height: 1, background: "rgba(0,0,0,0.05)" }} />

        {/* Step 6 — Artist */}
        <div ref={sectionRefs[5]} style={{ paddingTop: 120, paddingBottom: 120 }}>
          <RevealSection id="step-6">
            <StepSixArtist form={form} setForm={setForm} onNext={() => scrollTo(6)} dbArtists={dbArtists} />
          </RevealSection>
        </div>

        <div style={{ height: 1, background: "rgba(0,0,0,0.05)" }} />

        {/* Step 7 — Confirm */}
        <div ref={sectionRefs[6]} style={{ paddingTop: 120, paddingBottom: 140 }}>
          <RevealSection id="step-7">
            <StepSeven form={form} selectedService={selectedService} selectedPackage={selectedPackage} selectedVenue={selectedVenue} selectedCaterer={selectedCaterer} selectedArtist={selectedArtist} setIsSubmitted={setIsSubmitted} />
          </RevealSection>
        </div>
      </div>

      <div style={{ background: FG }}>
        <Footer />
      </div>
    </main>
  );
}

/* ─── Step 1: Personal Info ─── */
function StepOne({ form, setForm, onNext }: { form: FormData; setForm: (f: FormData) => void; onNext: () => void }) {
  const canNext = form.name.trim() && form.phone.trim();
  return (
    <div>
      <SectionHeading step={1} total={7} label={<>Tell us about <em style={{ color: ACCENT, fontStyle: "italic" }}>yourself</em></>} sub="We'd love to know who we're planning for." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
        <Field id="name" label="Full Name" type="text" placeholder="e.g. Priya Sharma" required value={form.name} onChange={v => setForm({ ...form, name: v })} />
        <Field id="phone" label="Phone Number" type="tel" placeholder="e.g. +91 98765 43210" required value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
        <div style={{ gridColumn: "1/-1" }}>
          <Field id="email" label="Email Address (Optional)" type="email" placeholder="e.g. priya@example.com" value={form.email} onChange={v => setForm({ ...form, email: v })} />
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <Field id="guests" label="Estimated Guests" type="number" placeholder="e.g. 200" required value={form.guests} onChange={v => setForm({ ...form, guests: v })} />
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <Field id="notes" label="Tell us about your event" type="text" placeholder="e.g. A royal Rajasthani theme with live Sufi music for 200 guests..." value={form.notes} onChange={v => setForm({ ...form, notes: v })} isTextArea />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
        <button
          onClick={onNext}
          disabled={!canNext}
          style={{ padding: "18px 48px", borderRadius: 999, background: canNext ? FG : "rgba(0,0,0,0.05)", color: canNext ? "white" : "rgba(0,0,0,0.2)", border: "none", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.85rem", cursor: canNext ? "pointer" : "not-allowed", transition: "all 0.3s ease", letterSpacing: "0.1em", textTransform: "uppercase" }}
        >
          Select Event Type ↓
        </button>
      </div>
    </div>
  );
}

/* ─── Step 2: Event Type ─── */
function StepTwo({ form, setForm, onNext }: { form: FormData; setForm: (f: FormData) => void; onNext: () => void }) {
  const formatPrice = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakhs`;
    return `₹${(val / 1000).toFixed(0)}k`;
  };

  return (
    <div>
      <SectionHeading step={2} total={7} label={<>What are we <em style={{ color: ACCENT, fontStyle: "italic" }}>celebrating?</em></>} sub="Choose the type of event and set your preferred budget." />
      
      {/* Budget Slider */}
      <div style={{ background: "white", padding: "40px", borderRadius: 32, marginBottom: 60, boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <h4 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.2em", color: "rgba(0,0,0,0.4)", textTransform: "uppercase", marginBottom: 12 }}>Estimated Budget</h4>
            <div style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontSize: "2.5rem", color: ACCENT }}>{formatPrice(form.budget)}</div>
          </div>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "rgba(0,0,0,0.5)", maxWidth: 300, textAlign: "right" }}>
            Setting a budget helps our royal planners curate the best options for your celebration.
          </p>
        </div>
        
        <div style={{ position: "relative", height: 60, display: "flex", alignItems: "center" }}>
          <input 
            type="range" 
            min="25000" 
            max="5000000" 
            step="25000"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: parseInt(e.target.value) })}
            style={{
              width: "100%",
              cursor: "pointer",
              height: 6,
              background: `linear-gradient(to right, ${ACCENT} 0%, ${ACCENT} ${(form.budget - 25000) / (5000000 - 25000) * 100}%, rgba(0,0,0,0.1) ${(form.budget - 25000) / (5000000 - 25000) * 100}%, rgba(0,0,0,0.1) 100%)`,
              appearance: "none",
              borderRadius: 999,
              outline: "none"
            }}
          />
          {/* Custom Track Markers */}
          <div style={{ position: "absolute", bottom: -20, left: 0, right: 0, display: "flex", justifyContent: "space-between", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem", color: "rgba(0,0,0,0.3)" }}>
            <span>25k</span>
            <span>10L</span>
            <span>25L</span>
            <span>50L</span>
          </div>
        </div>
        <style jsx>{`
          input[type=range]::-webkit-slider-thumb {
            appearance: none;
            width: 28px;
            height: 28px;
            background: white;
            border: 4px solid ${ACCENT};
            border-radius: 50%;
            box-shadow: 0 4px 15px rgba(255,107,74,0.4);
            cursor: pointer;
            transition: all 0.2s ease;
          }
          input[type=range]::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(255,107,74,0.5);
          }
        `}</style>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 32 }}>
        {services.map((s, idx) => {
          const selected = form.service === s.id;
          const inactive = form.service && !selected;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setForm({ ...form, service: s.id })}
              style={{ position: "relative", borderRadius: 28, overflow: "hidden", cursor: "pointer", border: selected ? `4px solid ${ACCENT}` : "3px solid transparent", boxShadow: selected ? `0 20px 60px rgba(255,107,74,0.4)` : "0 8px 30px rgba(0,0,0,0.08)", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", aspectRatio: "4/3", opacity: inactive ? 0.35 : 1, filter: inactive ? "grayscale(0.4)" : "none" }}
            >
              <img src={s.coverImage} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: selected ? "rgba(255,107,74,0.45)" : "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 70%)" }} />
              {selected && <div style={{ position: "absolute", top: 16, right: 16, background: ACCENT, borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}><Check size={20} color="white" strokeWidth={4} /></div>}
              <div style={{ position: "absolute", bottom: 0, padding: "28px 24px" }}>
                <h3 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.35rem", color: "white", marginBottom: 6 }}>{s.name}</h3>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.tagline}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      {form.service && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
          <motion.button
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={onNext}
            style={{ padding: "18px 52px", borderRadius: 999, background: FG, color: "white", border: "none", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            Choose Package ↓
          </motion.button>
        </div>
      )}
    </div>
  );
}

/* ─── Step 3: Package ─── */
function StepThree({ form, setForm, onNext, dbPackages }: { form: FormData; setForm: (f: FormData) => void; onNext: () => void; dbPackages: any[] }) {
  return (
    <div>
      <SectionHeading step={3} total={7} label={<>Choose your <em style={{ color: ACCENT, fontStyle: "italic" }}>package</em></>} sub="Select the experience that fits your vision." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {dbPackages.map((pkg: any, idx: number) => {
          const id = pkg._id || pkg.id;
          const selected = form.package === id;
          const inactive = form.package && !selected;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -10 }}
              onClick={() => setForm({ ...form, package: id })}
              style={{ background: selected ? FG : "#fff", border: selected ? `4px solid ${FG}` : "2px solid rgba(0,0,0,0.06)", borderRadius: 32, padding: "44px 36px", cursor: "pointer", boxShadow: selected ? "0 25px 70px rgba(0,0,0,0.25)" : "0 10px 40px rgba(0,0,0,0.04)", transition: "all 0.4s ease", position: "relative", opacity: inactive ? 0.4 : 1 }}
            >
              {pkg.isMostRequested && <span style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: ACCENT, color: "white", fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 20px", borderRadius: 999, whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>Most Requested</span>}
              {selected && <div style={{ position: "absolute", top: 24, right: 24, background: ACCENT, borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={18} color="white" strokeWidth={4} /></div>}
              <h4 style={{ fontFamily: "var(--font-playfair)", fontWeight: 800, fontSize: "2rem", color: selected ? "white" : FG, marginBottom: 12 }}>{pkg.name}</h4>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: selected ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)", marginBottom: 28, lineHeight: 1.7 }}>{pkg.description}</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.4rem", color: selected ? ACCENT : FG, marginBottom: 28 }}>{pkg.price}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {pkg.features.slice(0, 5).map((f: any) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Check size={15} color={selected ? ACCENT : "rgba(0,0,0,0.2)"} strokeWidth={4} />
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: selected ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
      {form.package && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
          <motion.button
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={onNext}
            style={{ padding: "18px 52px", borderRadius: 999, background: FG, color: "white", border: "none", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            Select Venue ↓
          </motion.button>
        </div>
      )}
    </div>
  );
}

/* ─── Step 4: Venue ─── */
function StepFour({ form, setForm, onNext, dbVenues }: { form: FormData; setForm: (f: FormData) => void; onNext: () => void; dbVenues: any[] }) {
  return (
    <div>
      <SectionHeading step={4} total={7} label={<>Pick your <em style={{ color: ACCENT, fontStyle: "italic" }}>venue</em></>} sub="Optional — skip if you'd like us to recommend one." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 32 }}>
        {dbVenues.map((v: any, idx: number) => {
          const id = v._id || v.id;
          const selected = form.venue === id;
          const inactive = form.venue && !selected;
          const coverUrl = v.coverImageId?.url || v.coverImageUrl || v.coverImage;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setForm({ ...form, venue: selected ? "" : id })}
              style={{ position: "relative", borderRadius: 32, overflow: "hidden", cursor: "pointer", border: selected ? `4px solid ${ACCENT}` : "3px solid transparent", boxShadow: selected ? `0 20px 60px rgba(255,107,74,0.35)` : "0 8px 30px rgba(0,0,0,0.08)", transition: "all 0.4s ease", aspectRatio: "16/10", opacity: inactive ? 0.4 : 1 }}
            >
              <img src={coverUrl} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: selected ? "rgba(255,107,74,0.4)" : "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 70%)" }} />
              {selected && <div style={{ position: "absolute", top: 16, right: 16, background: ACCENT, borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}><Check size={18} color="white" strokeWidth={4} /></div>}
              <div style={{ position: "absolute", bottom: 0, padding: "28px 32px" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.15em", color: ACCENT, textTransform: "uppercase", marginBottom: 6 }}>{v.location || v.category || "Premium Venue"}</p>
                <h4 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.3rem", color: "white" }}>{v.name}</h4>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
        <button
          onClick={onNext}
          style={{ padding: "18px 52px", borderRadius: 999, background: FG, color: "white", border: "none", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", letterSpacing: "0.1em", textTransform: "uppercase" }}
        >
          Choose Caterers ↓
        </button>
      </div>
    </div>
  );
}

/* ─── Step 5: Caterer ─── */
function StepFive({ form, setForm, onNext, dbCaterers }: { form: FormData; setForm: (f: FormData) => void; onNext: () => void; dbCaterers: any[] }) {
  return (
    <div>
      <SectionHeading step={5} total={7} label={<>Choose Your <em style={{ color: ACCENT, fontStyle: "italic" }}>Caterers</em></>} sub="Optional — skip if you'd like us to recommend one." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 32 }}>
        {dbCaterers.map((c: any, idx: number) => {
          const id = c._id || c.id;
          const selected = form.caterer === id;
          const inactive = form.caterer && !selected;
          const coverUrl = c.coverImageId?.url || c.coverImageUrl || c.coverImage;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setForm({ ...form, caterer: selected ? "" : id })}
              style={{ position: "relative", borderRadius: 32, overflow: "hidden", cursor: "pointer", border: selected ? `4px solid ${ACCENT}` : "3px solid transparent", boxShadow: selected ? `0 20px 60px rgba(255,107,74,0.35)` : "0 8px 30px rgba(0,0,0,0.08)", transition: "all 0.4s ease", aspectRatio: "16/10", opacity: inactive ? 0.4 : 1 }}
            >
              <img src={coverUrl} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: selected ? "rgba(255,107,74,0.4)" : "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 70%)" }} />
              {selected && <div style={{ position: "absolute", top: 16, right: 16, background: ACCENT, borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}><Check size={18} color="white" strokeWidth={4} /></div>}
              <div style={{ position: "absolute", bottom: 0, padding: "28px 32px" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.15em", color: ACCENT, textTransform: "uppercase", marginBottom: 6 }}>{c.categories?.join(", ") || c.tag || "Culinary Experts"}</p>
                <h4 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.3rem", color: "white" }}>{c.name}</h4>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
        <button
          onClick={onNext}
          style={{ padding: "18px 52px", borderRadius: 999, background: FG, color: "white", border: "none", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", letterSpacing: "0.1em", textTransform: "uppercase" }}
        >
          Choose Artists ↓
        </button>
      </div>
    </div>
  );
}

/* ─── Step 6: Artist ─── */
function StepSixArtist({ form, setForm, onNext, dbArtists }: { form: FormData; setForm: (f: FormData) => void; onNext: () => void; dbArtists: any[] }) {
  return (
    <div>
      <SectionHeading step={6} total={7} label={<>Select Your <em style={{ color: ACCENT, fontStyle: "italic" }}>Entertainment</em></>} sub="Optional — skip if you'd like us to recommend an artist." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 32 }}>
        {dbArtists.map((a: any, idx: number) => {
          const id = a._id || a.id;
          const selected = form.artist === id;
          const inactive = form.artist && !selected;
          const coverUrl = a.coverImageId?.url || a.coverImageUrl || a.coverImage;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setForm({ ...form, artist: selected ? "" : id })}
              style={{ position: "relative", borderRadius: 32, overflow: "hidden", cursor: "pointer", border: selected ? `4px solid ${ACCENT}` : "3px solid transparent", boxShadow: selected ? `0 20px 60px rgba(255,107,74,0.35)` : "0 8px 30px rgba(0,0,0,0.08)", transition: "all 0.4s ease", aspectRatio: "16/10", opacity: inactive ? 0.4 : 1 }}
            >
              <img src={coverUrl} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: selected ? "rgba(255,107,74,0.4)" : "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 70%)" }} />
              {selected && <div style={{ position: "absolute", top: 16, right: 16, background: ACCENT, borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}><Check size={18} color="white" strokeWidth={4} /></div>}
              <div style={{ position: "absolute", bottom: 0, padding: "28px 32px" }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.15em", color: ACCENT, textTransform: "uppercase", marginBottom: 6 }}>{a.category || a.tag || "Elite Entertainment"}</p>
                <h4 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.3rem", color: "white" }}>{a.name}</h4>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
        <button
          onClick={onNext}
          style={{ padding: "18px 52px", borderRadius: 999, background: FG, color: "white", border: "none", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", letterSpacing: "0.1em", textTransform: "uppercase" }}
        >
          Review Summary ↓
        </button>
      </div>
    </div>
  );
}

/* ─── Step 7: Confirm (Bento Style) ─── */
function StepSeven({ form, selectedService, selectedPackage, selectedVenue, selectedCaterer, selectedArtist, setIsSubmitted }: { 
  form: FormData; 
  selectedService: any; 
  selectedPackage: any; 
  selectedVenue: any;
  selectedCaterer: any;
  selectedArtist: any;
  setIsSubmitted: (v: boolean) => void;
}) {
  const summaryItems = [
    { type: 'service', data: selectedService, label: "Your Event", span: "md:col-span-1" },
    { type: 'artist', data: selectedArtist, label: "Featured Artist", span: "md:col-span-1" },
    { type: 'venue', data: selectedVenue, label: "Selected Venue", span: "md:col-span-1" },
    { type: 'caterer', data: selectedCaterer, label: "Royal Caterer", span: "md:col-span-1" },
  ].filter(item => item.data);

  return (
    <div>
      <SectionHeading step={7} total={7} label={<>Review your <em style={{ color: ACCENT, fontStyle: "italic" }}>booking</em></>} sub="Everything looking good? Let's make it happen." />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
        {/* Main Details Card — Large Bento Piece */}
        <div className="md:col-span-2 md:row-span-2 bg-white rounded-[40px] p-10 shadow-[0_10px_50px_rgba(0,0,0,0.06)] border border-black/5 flex flex-col justify-between">
          <div>
            <h3 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(0,0,0,0.55)", marginBottom: 32 }}>Your Details</h3>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { label: "Name", value: form.name || "—" },
                { label: "Phone", value: form.phone || "—" },
                ...(form.email ? [{ label: "Email", value: form.email }] : []),
                { label: "Budget", value: form.budget >= 100000 ? `₹${(form.budget / 100000).toFixed(1)} Lakhs` : `₹${(form.budget / 1000).toFixed(0)}k` },
                { label: "Guests", value: form.guests || "—" },
                { label: "Event Type", value: selectedService?.name || "—" },
              ].map((row, i) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.55)" }}>{row.label}</span>
                  <span style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.05rem", color: FG }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {form.notes && (
            <div style={{ marginTop: 32 }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.55)", display: "block", marginBottom: 12 }}>Event Vision</span>
              <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 500, fontSize: "0.95rem", color: FG, lineHeight: 1.6, background: "rgba(0,0,0,0.03)", padding: 20, borderRadius: 20 }}>
                {form.notes}
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Bento Cards */}
        {summaryItems.map((item, idx) => (
          <div key={idx} className={`${item.span} relative rounded-[32px] overflow-hidden shadow-lg group`} style={{ minHeight: 200 }}>
            <img 
              src={item.type === 'service' ? item.data.coverImage : (item.data.coverImageId?.url || item.data.coverImageUrl || item.data.coverImage)} 
              alt={item.data.name} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.55rem", letterSpacing: "0.15em", color: ACCENT, textTransform: "uppercase", marginBottom: 4 }}>{item.label}</p>
              <h4 style={{ fontFamily: "var(--font-playfair)", fontWeight: 800, fontSize: "1.1rem", color: "white" }}>{item.data.name}</h4>
            </div>
          </div>
        ))}

        {/* Package Bento Piece — Wide Bottom */}
        <div className="md:col-span-2 bg-black rounded-[40px] p-8 flex items-center justify-between shadow-2xl">
          <div>
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 8 }}>Selected Package</p>
            <h4 style={{ fontFamily: "var(--font-playfair)", fontWeight: 800, fontSize: "1.8rem", color: "white" }}>{selectedPackage?.name || "None selected"}</h4>
          </div>
          <div className="text-right">
             <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.5rem", color: ACCENT }}>{selectedPackage?.price}</p>
             <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Premium Tier</span>
          </div>
        </div>

        {/* Closing Quote Bento Piece */}
        <div className="md:col-span-2 bg-[#FF6B4A]/5 rounded-[40px] p-8 border border-[#FF6B4A]/10 flex items-center justify-center text-center">
           <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "1.05rem", color: "rgba(0,0,0,0.6)", lineHeight: 1.6, maxWidth: 400 }}>
              "We're excited to help you plan this {selectedService?.name.toLowerCase() || "event"}. Our team will review these details and begin the royal journey."
           </p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 72 }}>
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: `0 25px 70px rgba(255,107,74,0.55)` }}
          whileTap={{ scale: 0.97 }}
          onClick={async () => {
            try {
              const res = await fetch("/api/admin/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...form,
                  service: selectedService?.name || form.service,
                  package: selectedPackage?.name || form.package,
                  venue: selectedVenue?.name || form.venue,
                  caterer: selectedCaterer?.name || form.caterer,
                  artist: selectedArtist?.name || form.artist,
                })
              });
              if (res.ok) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setTimeout(() => setIsSubmitted(true), 500);
              } else {
                alert("Failed to send request. Please try again.");
              }
            } catch (e) {
              console.error(e);
              alert("Something went wrong. Please check your connection.");
            }
          }}
          style={{ display: "flex", alignItems: "center", gap: 12, background: ACCENT, border: "none", borderRadius: 999, padding: "26px 88px", fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.15rem", cursor: "pointer", color: "white", letterSpacing: "0.1em", textTransform: "uppercase", boxShadow: `0 16px 48px rgba(255,107,74,0.45)`, transition: "all 0.3s ease" }}
        >
          CONFIRM BOOKING ✦
        </motion.button>
      </div>
    </div>
  );
}

