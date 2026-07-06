"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ShieldCheck,
  Gauge,
  BadgeCheck,
  Layers3,
  BrainCircuit,
  PenTool,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ─── Feature Data ──────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Transparency in Project",
    desc: "Full visibility into every milestone, design decision, and progress update throughout the engagement.",
    accent: "#14B8A6",
  },
  {
    icon: Gauge,
    title: "Cost Efficient Solutions",
    desc: "Engineering-grade outcomes optimised for budget without compromising reliability or performance.",
    accent: "#8CC63F",
  },
  {
    icon: BadgeCheck,
    title: "Certified Engineers",
    desc: "Experienced specialists across mechanical, electrical, embedded, and IoT disciplines.",
    accent: "#14B8A6",
  },
  {
    icon: Layers3,
    title: "End-to-End Solutions",
    desc: "From concept and CAD through manufacturing, testing, and launch — one team, one roof.",
    accent: "#8CC63F",
  },
  {
    icon: BrainCircuit,
    title: "Subject Matter Experts",
    desc: "Deep domain knowledge applied at every stage so your product is engineered right, first time.",
    accent: "#14B8A6",
  },
  {
    icon: PenTool,
    title: "Custom Build",
    desc: "Purpose-built solutions tailored to your exact specifications, constraints, and market needs.",
    accent: "#8CC63F",
  },
];

/* ─── Belt Track positions (3D perspective layout) ──────────────────────── */
// Each slot is: { x (%), y (%), z (px), scale, opacity }
const SLOTS = [
  { x: -42, y: -24, z: -360, scale: 0.52, opacity: 0 },
  { x: -26, y: -14, z: -240, scale: 0.62, opacity: 0.55 },
  { x: -10, y: -4,  z: -120, scale: 0.76, opacity: 0.78 },
  { x:   8, y:   7, z:    0, scale: 0.95, opacity: 1    },
  { x:  26, y:  18, z: -120, scale: 0.76, opacity: 0.78 },
  { x:  44, y:  29, z: -240, scale: 0.62, opacity: 0.55 },
  { x:  60, y:  38, z: -360, scale: 0.52, opacity: 0    },
];

/* ─── Component ─────────────────────────────────────────────────────────── */

export function ConveyorBelt() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const beltRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animRef = useRef<gsap.core.Tween | null>(null);
  const progressRef = useRef(0);           // 0 – FEATURES.length (wraps)
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeSlot, setActiveSlot] = useState(3); // slot index (centre)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  /* ── Render a single frame at progress p ── */
  function renderFrame(p: number) {
    const total = FEATURES.length;
    cardRefs.current.forEach((el, cardIdx) => {
      if (!el) return;

      // diff is fractional (e.g. 4.27) — that's fine, we'll lerp between slots
      const diff = ((cardIdx - (p % total)) + total) % total;

      // Map 0–5 diff space onto 0–6 slot index space (slot 3 = centre)
      const slotIdx = diff <= 3 ? 3 + diff : 3 - (total - diff);

      // Clamp to valid slot range and split into integer lo/hi for lerp
      const clampedF = Math.max(0, Math.min(SLOTS.length - 1, slotIdx));
      const lo = Math.floor(clampedF);
      const hi = Math.min(lo + 1, SLOTS.length - 1);
      const frac = clampedF - lo;

      const sLo = SLOTS[lo];
      const sHi = SLOTS[hi];
      if (!sLo || !sHi) return; // safety guard

      const x       = sLo.x       + (sHi.x       - sLo.x)       * frac;
      const y       = sLo.y       + (sHi.y       - sLo.y)       * frac;
      const z       = sLo.z       + (sHi.z       - sLo.z)       * frac;
      const scale   = sLo.scale   + (sHi.scale   - sLo.scale)   * frac;
      const opacity = sLo.opacity + (sHi.opacity - sLo.opacity) * frac;

      gsap.set(el, {
        x: `${x}%`,
        y: `${y}%`,
        z,
        scale,
        autoAlpha: opacity,
        zIndex: Math.round(scale * 100),
      });
    });
  }

  /* ── Scoped Auto-Scroll & ScrollTrigger Acceleration ── */
  useGSAP(() => {
    if (isMobile) return;

    const proxy = { p: 0 };
    animRef.current = gsap.to(proxy, {
      p: FEATURES.length,
      duration: FEATURES.length * 2.6, // 2.6s per card
      ease: "none",
      repeat: -1,
      onUpdate() {
        progressRef.current = proxy.p;
        renderFrame(proxy.p);
      },
    });

    // Initial paint
    renderFrame(0);

    if (sectionRef.current) {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onToggle: ({ isActive }) => {
          if (animRef.current) {
            gsap.to(animRef.current, {
              timeScale: isActive ? 1 : 0.3,
              duration: 0.6,
            });
          }
        },
      });
    }
  }, { scope: sectionRef });

  /* ── Hover: slow belt, lift card ── */
  function onCardHover(idx: number, entering: boolean) {
    setHovered(entering ? idx : null);
    if (animRef.current) {
      gsap.to(animRef.current, { timeScale: entering ? 0.08 : 1, duration: 0.5 });
    }
    if (cardRefs.current[idx]) {
      gsap.to(cardRefs.current[idx], {
        y: entering ? "-=18" : "+=18",
        boxShadow: entering
          ? "0 0 60px rgba(20,184,166,0.35), 0 32px 64px rgba(0,0,0,0.6)"
          : "0 16px 48px rgba(0,0,0,0.45)",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }

  /* ── Particle dots (static decorative) ── */
  const particles = Array.from({ length: 28 }, (_, i) => ({
    cx: (i * 37 + 11) % 100,
    cy: (i * 53 + 7)  % 100,
    r:  i % 3 === 0 ? 1.5 : 1,
    opacity: 0.12 + (i % 5) * 0.06,
  }));

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "var(--conveyor-bg)" }}
      aria-label="Why companies choose Texawave"
    >
      {/* ── Blueprint grid ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(var(--blueprint-grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--blueprint-grid) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Corner accent glows ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(140, 198, 63, 0.18) 0%, transparent 70%)" }}
      />

      {/* ── Decorative SVG schematic lines ── */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Diagonal schematic rails */}
        <line x1="0" y1="580" x2="1200" y2="180" stroke="#14B8A6" strokeWidth="1" strokeDasharray="8 16" strokeOpacity="0.35" />
        <line x1="0" y1="620" x2="1200" y2="220" stroke="#14B8A6" strokeWidth="1" strokeDasharray="8 16" strokeOpacity="0.2" />
        <line x1="0" y1="540" x2="1200" y2="140" stroke="var(--primary-green)" strokeWidth="0.5" strokeDasharray="4 20" strokeOpacity="0.2" />

        {/* Corner tech brackets */}
        <polyline points="24,24 24,56 56,56" fill="none" stroke="#14B8A6" strokeWidth="1.5" strokeOpacity="0.5" />
        <polyline points="1176,24 1176,56 1144,56" fill="none" stroke="#14B8A6" strokeWidth="1.5" strokeOpacity="0.5" />
        <polyline points="24,676 24,644 56,644" fill="none" stroke="var(--primary-green)" strokeWidth="1.5" strokeOpacity="0.5" />
        <polyline points="1176,676 1176,644 1144,644" fill="none" stroke="var(--primary-green)" strokeWidth="1.5" strokeOpacity="0.5" />

        {/* Floating particles */}
        {particles.map((p, i) => (
          <circle key={i} cx={`${p.cx}%`} cy={`${p.cy}%`} r={p.r} fill="#14B8A6" opacity={p.opacity} />
        ))}
      </svg>

      {/* ── Heading ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-0 pt-20 text-center lg:px-8">
        <div
          className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em]"
          style={{ border: "1px solid rgba(20,184,166,0.25)", color: "#14B8A6", background: "rgba(20,184,166,0.08)" }}
        >
          Why Texawave
        </div>
        <h2
          className="mx-auto mt-2 max-w-3xl text-4xl font-black leading-tight md:text-5xl text-text-primary"
        >
          Why Companies Choose{" "}
          <span style={{ background: "linear-gradient(90deg,#14B8A6,var(--primary-green))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Texawave
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-text-secondary">
          From concept and design to manufacturing and deployment, we deliver complete engineering solutions under one roof.
        </p>
      </div>

      {/* ════════ DESKTOP: 3D CONVEYOR ════════ */}
      <div
        className="relative hidden md:block"
        style={{ height: "520px", perspective: "1200px", perspectiveOrigin: "50% 45%" }}
      >
        {/* Belt surface rails */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={{ transform: "translate(-50%,-50%) rotateX(55deg) rotateZ(-18deg)", width: "110%", height: "4px" }}
        >
          <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, rgba(20,184,166,0.4), transparent)" }} />
          <div style={{ height: "2px", marginTop: "32px", background: "linear-gradient(90deg, transparent, rgba(20,184,166,0.25), transparent)" }} />
        </div>

        {/* Belt conveyor track line (lower) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[58%]"
          style={{ transform: "translateX(-50%) rotateX(72deg) rotateZ(-18deg)", width: "85%", height: "2px",
            background: "linear-gradient(90deg, transparent 0%, rgba(140, 198, 63, 0.4) 30%, rgba(140, 198, 63, 0.4) 70%, transparent 100%)" }}
        />

        {/* Cards container */}
        <div
          ref={beltRef}
          className="absolute left-1/2 top-1/2"
          style={{ transform: "translate(-50%, -50%)", transformStyle: "preserve-3d", width: "340px", height: "220px" }}
        >
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                ref={(el) => { cardRefs.current[idx] = el; }}
                onMouseEnter={() => onCardHover(idx, true)}
                onMouseLeave={() => onCardHover(idx, false)}
                className="absolute left-0 top-0 w-full cursor-pointer select-none"
                style={{
                  willChange: "transform, opacity",
                  borderRadius: "20px",
                  padding: "28px 28px 24px",
                  background: "var(--conveyor-card-bg)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: hovered === idx
                    ? `1px solid ${feat.accent}`
                    : "1px solid var(--conveyor-card-border)",
                  boxShadow: hovered === idx
                    ? `0 0 60px ${feat.accent}55, var(--conveyor-card-shadow)`
                    : "var(--conveyor-card-shadow)",
                  transition: "border-color 0.3s",
                }}
              >
                {/* Accent corner */}
                <div
                  className="absolute right-5 top-5 h-2 w-2 rounded-full"
                  style={{ background: feat.accent, boxShadow: `0 0 8px ${feat.accent}` }}
                />

                {/* Icon */}
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: `${feat.accent}18`, border: `1px solid ${feat.accent}40` }}
                >
                  <Icon size={22} style={{ color: feat.accent }} />
                </div>

                {/* Title */}
                <h3 className="text-[17px] font-black leading-snug text-text-primary">
                  {feat.title}
                </h3>

                {/* Description */}
                <p
                  className="mt-2 text-[13px] leading-6 text-text-secondary"
                  style={{
                    opacity: hovered === idx ? 1 : 0.75,
                    transition: "opacity 0.3s",
                  }}
                >
                  {feat.desc}
                </p>

                {/* Bottom accent bar */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${feat.accent}60, transparent)` }}
                />
              </div>
            );
          })}
        </div>

        {/* Soft floor shadow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[68%]"
          style={{ transform: "translateX(-50%)", width: "420px", height: "40px",
            background: "radial-gradient(ellipse, rgba(20,184,166,0.12) 0%, transparent 70%)" }}
        />
      </div>

      {/* ════════ MOBILE: flat carousel ════════ */}
      <div className="relative z-10 block overflow-hidden pb-4 pt-6 md:hidden">
        <div className="flex gap-5 overflow-x-auto px-5 pb-4 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none" }}>
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="w-72 flex-shrink-0 snap-start rounded-2xl p-6"
                style={{
                  background: "var(--conveyor-card-bg)",
                  border: "1px solid var(--conveyor-card-border)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${feat.accent}18`, border: `1px solid ${feat.accent}40` }}
                >
                  <Icon size={20} style={{ color: feat.accent }} />
                </div>
                <h3 className="text-[16px] font-black text-text-primary">{feat.title}</h3>
                <p className="mt-2 text-[12.5px] leading-6 text-text-secondary">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{ background: "linear-gradient(to bottom, transparent, var(--bg-primary))" }}
      />

      <div className="relative z-10 pb-16" />
    </section>
  );
}
