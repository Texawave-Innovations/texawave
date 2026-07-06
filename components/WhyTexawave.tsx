"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import {
  Layers,
  Cpu,
  Zap,
  CircuitBoard,
  Package,
  Factory,
  FlaskConical,
  Wrench,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, Flip);

/* ─── Card data ──────────────────────────────────────────────── */
const CARDS = [
  {
    id: "end-to-end",
    icon: Layers,
    title: "End-to-End Solutions",
    description:
      "Full lifecycle delivery from concept validation through mass production—one partner, zero gaps.",
    accent: "#8CC63F",
    size: "large", // spans more cells
  },
  {
    id: "industrial-automation",
    icon: Zap,
    title: "Industrial Automation",
    description:
      "Custom PLC, SCADA, and robotic systems engineered to boost throughput and reduce downtime.",
    accent: "#00D9FF",
    size: "normal",
  },
  {
    id: "embedded-systems",
    icon: Cpu,
    title: "Embedded Systems",
    description:
      "Bare-metal to RTOS firmware developed alongside hardware so integration is seamless from day one.",
    accent: "#8CC63F",
    size: "normal",
  },
  {
    id: "pcb-design",
    icon: CircuitBoard,
    title: "PCB Design",
    description:
      "High-speed, multi-layer board design with DFM reviews and prototype-to-production continuity.",
    accent: "#00D9FF",
    size: "normal",
  },
  {
    id: "product-development",
    icon: Package,
    title: "Product Development",
    description:
      "Mechanical, electrical, and software streams unified under a single product manager.",
    accent: "#8CC63F",
    size: "large",
  },
  {
    id: "manufacturing-support",
    icon: Factory,
    title: "Manufacturing Support",
    description:
      "Supply chain optimisation, supplier qualification, and on-floor quality engineering.",
    accent: "#00D9FF",
    size: "normal",
  },
  {
    id: "testing-validation",
    icon: FlaskConical,
    title: "Testing & Validation",
    description:
      "Functional, EMC, environmental, and safety testing aligned to IEC, CE, UL, and FCC standards.",
    accent: "#8CC63F",
    size: "normal",
  },
  {
    id: "deployment-maintenance",
    icon: Wrench,
    title: "Deployment & Maintenance",
    description:
      "Global installation, commissioning, remote monitoring, and long-term service contracts.",
    accent: "#00D9FF",
    size: "normal",
  },
] as const;

/* ─── Particle pool ──────────────────────────────────────────── */
function Particles() {
  return (
    <div className="wtx-particles pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="wtx-particle absolute rounded-full"
          style={{
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            left: `${(i * 4.1 + 3) % 100}%`,
            top: `${(i * 7.3 + 10) % 100}%`,
            background: i % 2 === 0 ? "var(--primary-green)" : "#00D9FF",
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Blueprint grid SVG lines ───────────────────────────────── */
function BlueprintGrid() {
  return (
    <svg
      className="wtx-blueprint pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="wtx-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00D9FF" strokeWidth="0.6" />
        </pattern>
        <pattern id="wtx-grid-lg" width="180" height="180" patternUnits="userSpaceOnUse">
          <path d="M 180 0 L 0 0 0 180" fill="none" stroke="var(--primary-green)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wtx-grid)" />
      <rect width="100%" height="100%" fill="url(#wtx-grid-lg)" />
    </svg>
  );
}

/* ─── Beam lines ─────────────────────────────────────────────── */
function BeamLines() {
  return (
    <div className="wtx-beams pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Diagonal beam 1 */}
      <div
        className="wtx-beam absolute"
        style={{
          top: "20%",
          left: "-10%",
          width: "120%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, #00D9FF 40%, var(--primary-green) 60%, transparent 100%)",
          transform: "rotate(-8deg)",
          opacity: 0.18,
        }}
      />
      {/* Diagonal beam 2 */}
      <div
        className="wtx-beam absolute"
        style={{
          bottom: "30%",
          left: "-10%",
          width: "120%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, var(--primary-green) 30%, #00D9FF 70%, transparent 100%)",
          transform: "rotate(5deg)",
          opacity: 0.13,
        }}
      />
      {/* Radial glow top-right */}
      <div
        className="absolute"
        style={{
          top: "-10%",
          right: "-5%",
          width: "55vw",
          height: "55vw",
          background:
            "radial-gradient(circle, rgba(0,217,255,0.07) 0%, transparent 65%)",
          borderRadius: "50%",
        }}
      />
      {/* Radial glow bottom-left */}
      <div
        className="absolute"
        style={{
          bottom: "-15%",
          left: "-5%",
          width: "50vw",
          height: "50vw",
          background:
            "radial-gradient(circle, rgba(140, 198, 63, 0.15) 0%, transparent 65%)",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}

/* ─── Single card ────────────────────────────────────────────── */
function BentoCard({
  card,
  index,
}: {
  card: (typeof CARDS)[number];
  index: number;
}) {
  const Icon = card.icon;
  return (
    <div
      className="wtx-card group relative overflow-hidden rounded-[28px] border p-6 transition-all duration-300"
      data-card-id={card.id}
      data-card-index={index}
      style={{
        background: "rgba(255,255,255,0.035)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
        willChange: "transform, opacity",
      }}
    >
      {/* Inner glow on hover */}
      <div
        className="wtx-card-glow pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 30% 30%, ${card.accent}18 0%, transparent 65%)`,
        }}
      />

      {/* Neon trail edge */}
      <div
        className="wtx-card-edge pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-300"
        style={{
          boxShadow: `0 0 0 1px ${card.accent}30, 0 0 32px ${card.accent}15`,
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute left-6 top-0 h-[2px] w-12 rounded-b"
        style={{
          background: `linear-gradient(90deg, ${card.accent}, transparent)`,
          opacity: 0.7,
        }}
      />

      {/* Icon */}
      <div
        className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
        style={{
          background: `${card.accent}15`,
          border: `1px solid ${card.accent}25`,
          boxShadow: `0 0 20px ${card.accent}12`,
        }}
      >
        <Icon
          size={22}
          style={{ color: card.accent }}
          strokeWidth={1.8}
        />
      </div>

      {/* Text */}
      <h3
        className="mb-2 text-base font-bold leading-snug text-white"
        style={{ letterSpacing: "-0.01em" }}
      >
        {card.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.52)" }}>
        {card.description}
      </p>

      {/* Corner mark */}
      <div
        className="absolute bottom-5 right-5 h-5 w-5 opacity-20 transition-opacity duration-300 group-hover:opacity-50"
        style={{
          borderRight: `1.5px solid ${card.accent}`,
          borderBottom: `1.5px solid ${card.accent}`,
          borderRadius: "0 0 4px 0",
        }}
      />
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export function WhyTexawave() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const pinWrap = pinWrapRef.current;
    const grid = gridRef.current;
    const heading = headingRef.current;
    if (!section || !pinWrap || !grid || !heading) return;

    // Reduce motion guard
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    /* ── Particle ambient animation (Disabled on Mobile for performance) ── */
    const particles = section.querySelectorAll<HTMLElement>(".wtx-particle");
    if (!isMobile) {
      particles.forEach((p, i) => {
        gsap.to(p, {
          opacity: 0.35 + (i % 4) * 0.12,
          y: -18 - (i % 6) * 8,
          x: (i % 2 === 0 ? 1 : -1) * (5 + (i % 4) * 3),
          duration: 3 + (i % 5) * 0.9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.18,
        });
      });
    }

    /* ── Beam slow drift (Disabled on Mobile for performance) ── */
    const beams = section.querySelectorAll<HTMLElement>(".wtx-beam");
    if (!isMobile) {
      beams.forEach((b, i) => {
        gsap.to(b, {
          x: (i % 2 === 0 ? 1 : -1) * 40,
          duration: 12 + i * 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }

    if (reduceMotion) {
      // Show everything statically
      gsap.set(grid.querySelectorAll(".wtx-card"), { autoAlpha: 1 });
      return;
    }

    /* ── Heading word reveal ────────────────────────────────── */
    const wordEls = heading.querySelectorAll<HTMLElement>(".wtx-word");
    gsap.fromTo(
      wordEls,
      { y: 42, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 82%",
        },
      }
    );

    const badgeEl = heading.querySelector<HTMLElement>(".wtx-badge");
    if (badgeEl) {
      gsap.fromTo(
        badgeEl,
        { y: -10, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: "back.out(2)",
          scrollTrigger: { trigger: badgeEl, start: "top 86%" },
        }
      );
      // Floating badge
      gsap.to(badgeEl, {
        y: -5,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });
    }

    /* ── GSAP Scrubbed Bento Flip animation ─────────────────── */
    const cards = Array.from(grid.querySelectorAll<HTMLElement>(".wtx-card"));

    // Initial compact state: set all cards hidden/tiny
    gsap.set(cards, { autoAlpha: 0, scale: 0.82, y: 28 });

    // On initial enter → fade cards in
    ScrollTrigger.create({
      trigger: grid,
      start: "top 88%",
      onEnter: () => {
        gsap.to(cards, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.06,
          ease: "power3.out",
        });
      },
    });

    /* ── Pinned bento scrub ─────────────────────────────────── */
    const bentoTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=200%",
        pin: pinWrap,
        anticipatePin: 1,
        scrub: 1.4,
      },
    });

    // Phase 1: Cards spread & scale outward
    bentoTl.to(
      cards,
      {
        scale: (i) => 1 + i * 0.004,
        y: (i) => (i % 2 === 0 ? -6 : 6),
        x: (i) => (i % 3 === 0 ? -4 : i % 3 === 1 ? 0 : 4),
        ease: "none",
        stagger: {
          amount: 0.35,
          from: "center",
        },
      },
      0
    );

    // Phase 2: Background blueprint grid scales
    const blueprint = section.querySelector<SVGElement>(".wtx-blueprint");
    if (blueprint) {
      bentoTl.to(
        blueprint,
        {
          scale: 1.08,
          opacity: 0.12,
          ease: "none",
        },
        0
      );
    }

    // Phase 3: Subtle section-level parallax
    bentoTl.to(
      grid,
      {
        y: -20,
        ease: "none",
      },
      0
    );

    /* ── Card hover neon glow ───────────────────────────────── */
    const cardCleanups: (() => void)[] = [];
    cards.forEach((card) => {
      const glow = card.querySelector<HTMLElement>(".wtx-card-glow");
      const edge = card.querySelector<HTMLElement>(".wtx-card-edge");

      const onEnter = () => {
        if (glow) gsap.to(glow, { opacity: 1, duration: 0.4, ease: "power2.out" });
        if (edge) gsap.to(edge, { opacity: 1, duration: 0.3, ease: "power2.out" });
        gsap.to(card, {
          y: "-=6",
          boxShadow:
            "0 8px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.14), inset 0 1px 0 rgba(255,255,255,0.1)",
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const onLeave = () => {
        if (glow) gsap.to(glow, { opacity: 0, duration: 0.35, ease: "power2.out" });
        if (edge) gsap.to(edge, { opacity: 0, duration: 0.25, ease: "power2.out" });
        gsap.to(card, {
          y: "+=6",
          boxShadow:
            "0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);

      cardCleanups.push(() => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      // Remove mouse event listeners
      cardCleanups.forEach((cleanup) => cleanup());
    };
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="why-texawave"
      aria-labelledby="why-texawave-heading"
      style={{ background: "var(--bg-primary)", position: "relative" }}
    >
      {/* Background layers */}
      <BlueprintGrid />
      <BeamLines />
      <Particles />

      {/* Pin wrapper – GSAP pins this div */}
      <div ref={pinWrapRef} style={{ position: "relative", zIndex: 1 }}>
        <div
          className="mx-auto max-w-[1400px] px-5 pb-24 pt-24 lg:px-10"
          style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
          {/* ── Heading ──────────────────────────────────────── */}
          <div ref={headingRef} className="mb-14 text-center">
            {/* Badge */}
            <div
              className="wtx-badge mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]"
              style={{
                background: "rgba(0,217,255,0.06)",
                border: "1px solid rgba(0,217,255,0.3)",
                color: "#00D9FF",
                backdropFilter: "blur(10px)",
                boxShadow: "0 0 20px rgba(0,217,255,0.08)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "#00D9FF", boxShadow: "0 0 6px #00D9FF" }}
              />
              Why Texawave
            </div>

            {/* Main heading – word-split for stagger */}
            <h2
              id="why-texawave-heading"
              className="overflow-hidden text-section text-white"
            >
              {/* Line 1 */}
              <span className="block overflow-hidden">
                {"Why Companies Choose".split(" ").map((word, i) => (
                  <span key={i} className="wtx-word inline-block" style={{ marginRight: "0.3em" }}>
                    {word}
                  </span>
                ))}
              </span>

              {/* Line 2 – "Texawave" with gradient */}
              <span className="block overflow-hidden">
                <span
                  className="wtx-word wtx-texawave-word inline-block"
                  style={{
                    background: "linear-gradient(90deg, var(--primary-green) 0%, #00D9FF 60%, var(--primary-green) 120%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    backgroundSize: "200% 100%",
                    animation: "wtx-shimmer 4s linear infinite",
                    filter: "drop-shadow(0 0 18px rgba(140, 198, 63, 0.55))",
                  }}
                >
                  Texawave
                </span>
              </span>
            </h2>

            {/* Subtitle */}
            <p
              className="wtx-word mx-auto mt-6 max-w-2xl text-body-large"
              style={{ color: "rgba(255,255,255,0.48)" }}
            >
              From concept and design to manufacturing and deployment, we deliver complete engineering
              solutions under one roof.
            </p>
          </div>

          {/* ── Bento Grid ───────────────────────────────────── */}
          <div
            ref={gridRef}
            className="grid flex-1 gap-4 md:gap-5"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "auto",
            }}
          >
            {/* Card 0: End-to-End – spans 2 cols */}
            <div
              className="wtx-card group relative overflow-hidden rounded-[28px] border p-7 md:col-span-2"
              data-card-id="end-to-end"
              data-card-index={0}
              style={{
                background: "rgba(255,255,255,0.035)",
                backdropFilter: "blur(18px) saturate(140%)",
                WebkitBackdropFilter: "blur(18px) saturate(140%)",
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow:
                  "0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
                willChange: "transform, opacity",
              }}
            >
              <div
                className="wtx-card-glow pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500"
                style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(140, 198, 63, 0.25) 0%, transparent 65%)" }}
              />
              <div className="wtx-card-edge pointer-events-none absolute inset-0 rounded-[28px] opacity-0" style={{ boxShadow: "0 0 0 1px rgba(140, 198, 63, 0.45), 0 0 32px rgba(140, 198, 63, 0.2)" }} />
              <div className="absolute left-7 top-0 h-[2px] w-16 rounded-b" style={{ background: "linear-gradient(90deg, var(--primary-green-darker), transparent)", opacity: 0.8 }} />
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110" style={{ background: "rgba(140, 198, 63, 0.25)", border: "1px solid rgba(140, 198, 63, 0.35)", boxShadow: "0 0 24px rgba(140, 198, 63, 0.2)" }}>
                <Layers size={26} style={{ color: "var(--primary-green)" }} strokeWidth={1.7} />
              </div>
              <h3 className="text-card text-white">End-to-End Solutions</h3>
              <p className="mt-3 text-body-normal" style={{ color: "rgba(255,255,255,0.52)" }}>Full lifecycle delivery from concept validation through mass production—one partner, zero gaps in expertise or accountability.</p>
              <div className="absolute bottom-6 right-6 h-6 w-6 opacity-20 transition-opacity duration-300 group-hover:opacity-50" style={{ borderRight: "1.5px solid var(--primary-green-darker)", borderBottom: "1.5px solid var(--primary-green-darker)", borderRadius: "0 0 4px 0" }} />
            </div>

            {/* Card 1: Industrial Automation */}
            <div
              className="wtx-card group relative overflow-hidden rounded-[28px] border p-6"
              data-card-id="industrial-automation"
              data-card-index={1}
              style={{
                background: "rgba(255,255,255,0.035)",
                backdropFilter: "blur(18px) saturate(140%)",
                WebkitBackdropFilter: "blur(18px) saturate(140%)",
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
                willChange: "transform, opacity",
              }}
            >
              <div className="wtx-card-glow pointer-events-none absolute inset-0 rounded-[28px] opacity-0" style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(0,217,255,0.12) 0%, transparent 65%)" }} />
              <div className="wtx-card-edge pointer-events-none absolute inset-0 rounded-[28px] opacity-0" style={{ boxShadow: "0 0 0 1px rgba(0,217,255,0.25), 0 0 32px rgba(0,217,255,0.1)" }} />
              <div className="absolute left-6 top-0 h-[2px] w-12 rounded-b" style={{ background: "linear-gradient(90deg, #00D9FF, transparent)", opacity: 0.7 }} />
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110" style={{ background: "rgba(0,217,255,0.12)", border: "1px solid rgba(0,217,255,0.2)", boxShadow: "0 0 20px rgba(0,217,255,0.1)" }}>
                <Zap size={22} style={{ color: "#00D9FF" }} strokeWidth={1.8} />
              </div>
              <h3 className="text-card text-white">Industrial Automation</h3>
              <p className="mt-3 text-body-normal" style={{ color: "rgba(255,255,255,0.52)" }}>Custom PLC, SCADA, and robotic systems engineered to boost throughput and reduce downtime.</p>
              <div className="absolute bottom-5 right-5 h-5 w-5 opacity-20 group-hover:opacity-50" style={{ borderRight: "1.5px solid #00D9FF", borderBottom: "1.5px solid #00D9FF", borderRadius: "0 0 4px 0" }} />
            </div>

            {/* Card 2: Embedded Systems */}
            <div
              className="wtx-card group relative overflow-hidden rounded-[28px] border p-6"
              data-card-id="embedded-systems"
              data-card-index={2}
              style={{
                background: "rgba(255,255,255,0.035)",
                backdropFilter: "blur(18px) saturate(140%)",
                WebkitBackdropFilter: "blur(18px) saturate(140%)",
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
                willChange: "transform, opacity",
              }}
            >
              <div className="wtx-card-glow pointer-events-none absolute inset-0 rounded-[28px] opacity-0" style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(140, 198, 63, 0.25) 0%, transparent 65%)" }} />
              <div className="wtx-card-edge pointer-events-none absolute inset-0 rounded-[28px] opacity-0" style={{ boxShadow: "0 0 0 1px rgba(140, 198, 63, 0.45), 0 0 32px rgba(140, 198, 63, 0.2)" }} />
              <div className="absolute left-6 top-0 h-[2px] w-12 rounded-b" style={{ background: "linear-gradient(90deg, var(--primary-green-darker), transparent)", opacity: 0.7 }} />
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110" style={{ background: "rgba(140, 198, 63, 0.25)", border: "1px solid rgba(140, 198, 63, 0.35)", boxShadow: "0 0 20px rgba(140, 198, 63, 0.2)" }}>
                <Cpu size={22} style={{ color: "var(--primary-green)" }} strokeWidth={1.8} />
              </div>
              <h3 className="text-card text-white">Embedded Systems</h3>
              <p className="mt-3 text-body-normal" style={{ color: "rgba(255,255,255,0.52)" }}>Bare-metal to RTOS firmware developed alongside hardware so integration is seamless from day one.</p>
              <div className="absolute bottom-5 right-5 h-5 w-5 opacity-20 group-hover:opacity-50" style={{ borderRight: "1.5px solid var(--primary-green-darker)", borderBottom: "1.5px solid var(--primary-green-darker)", borderRadius: "0 0 4px 0" }} />
            </div>

            {/* Row 2: PCB Design, Product Development (large), Manufacturing */}
            {/* Card 3: PCB Design */}
            <div
              className="wtx-card group relative overflow-hidden rounded-[28px] border p-6"
              data-card-id="pcb-design"
              data-card-index={3}
              style={{
                background: "rgba(255,255,255,0.035)",
                backdropFilter: "blur(18px) saturate(140%)",
                WebkitBackdropFilter: "blur(18px) saturate(140%)",
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
                willChange: "transform, opacity",
              }}
            >
              <div className="wtx-card-glow pointer-events-none absolute inset-0 rounded-[28px] opacity-0" style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(0,217,255,0.12) 0%, transparent 65%)" }} />
              <div className="wtx-card-edge pointer-events-none absolute inset-0 rounded-[28px] opacity-0" style={{ boxShadow: "0 0 0 1px rgba(0,217,255,0.25), 0 0 32px rgba(0,217,255,0.1)" }} />
              <div className="absolute left-6 top-0 h-[2px] w-12 rounded-b" style={{ background: "linear-gradient(90deg, #00D9FF, transparent)", opacity: 0.7 }} />
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110" style={{ background: "rgba(0,217,255,0.12)", border: "1px solid rgba(0,217,255,0.2)", boxShadow: "0 0 20px rgba(0,217,255,0.1)" }}>
                <CircuitBoard size={22} style={{ color: "#00D9FF" }} strokeWidth={1.8} />
              </div>
              <h3 className="text-card text-white">PCB Design</h3>
              <p className="mt-3 text-body-normal" style={{ color: "rgba(255,255,255,0.52)" }}>High-speed, multi-layer board design with DFM reviews and prototype-to-production continuity built in.</p>
              <div className="absolute bottom-5 right-5 h-5 w-5 opacity-20 group-hover:opacity-50" style={{ borderRight: "1.5px solid #00D9FF", borderBottom: "1.5px solid #00D9FF", borderRadius: "0 0 4px 0" }} />
            </div>

            {/* Card 4: Product Development – spans 2 cols */}
            <div
              className="wtx-card group relative overflow-hidden rounded-[28px] border p-7 md:col-span-2"
              data-card-id="product-development"
              data-card-index={4}
              style={{
                background: "rgba(140, 198, 63, 0.1)",
                backdropFilter: "blur(18px) saturate(140%)",
                WebkitBackdropFilter: "blur(18px) saturate(140%)",
                borderColor: "rgba(140, 198, 63, 0.25)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(140, 198, 63, 0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
                willChange: "transform, opacity",
              }}
            >
              <div className="wtx-card-glow pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500" style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(140, 198, 63, 0.22) 0%, transparent 65%)" }} />
              <div className="wtx-card-edge pointer-events-none absolute inset-0 rounded-[28px] opacity-0" style={{ boxShadow: "0 0 0 1px rgba(140, 198, 63, 0.45), 0 0 40px rgba(140, 198, 63, 0.25)" }} />
              <div className="absolute left-7 top-0 h-[2px] w-20 rounded-b" style={{ background: "linear-gradient(90deg, var(--primary-green-dark), #00D9FF, transparent)", opacity: 0.9 }} />

              {/* Floating dots decoration */}
              <div className="pointer-events-none absolute right-8 top-8 flex gap-1.5 opacity-20">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--primary-green)" }} />
                ))}
              </div>

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110" style={{ background: "rgba(140, 198, 63, 0.14)", border: "1px solid rgba(140, 198, 63, 0.45)", boxShadow: "0 0 28px rgba(140, 198, 63, 0.14)" }}>
                <Package size={26} style={{ color: "var(--primary-green)" }} strokeWidth={1.7} />
              </div>
              <h3 className="text-card text-white">Product Development</h3>
              <p className="mt-3 text-body-normal" style={{ color: "rgba(255,255,255,0.52)" }}>Mechanical, electrical, and software streams unified under a single product manager. No silos, no handoff friction—just coordinated execution.</p>
              <div className="absolute bottom-6 right-6 h-6 w-6 opacity-20 group-hover:opacity-60" style={{ borderRight: "1.5px solid var(--primary-green-darker)", borderBottom: "1.5px solid var(--primary-green-darker)", borderRadius: "0 0 4px 0" }} />
            </div>

            {/* Card 5: Manufacturing Support */}
            <div
              className="wtx-card group relative overflow-hidden rounded-[28px] border p-6"
              data-card-id="manufacturing-support"
              data-card-index={5}
              style={{
                background: "rgba(255,255,255,0.035)",
                backdropFilter: "blur(18px) saturate(140%)",
                WebkitBackdropFilter: "blur(18px) saturate(140%)",
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
                willChange: "transform, opacity",
              }}
            >
              <div className="wtx-card-glow pointer-events-none absolute inset-0 rounded-[28px] opacity-0" style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(0,217,255,0.12) 0%, transparent 65%)" }} />
              <div className="wtx-card-edge pointer-events-none absolute inset-0 rounded-[28px] opacity-0" style={{ boxShadow: "0 0 0 1px rgba(0,217,255,0.25), 0 0 32px rgba(0,217,255,0.1)" }} />
              <div className="absolute left-6 top-0 h-[2px] w-12 rounded-b" style={{ background: "linear-gradient(90deg, #00D9FF, transparent)", opacity: 0.7 }} />
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110" style={{ background: "rgba(0,217,255,0.12)", border: "1px solid rgba(0,217,255,0.2)", boxShadow: "0 0 20px rgba(0,217,255,0.1)" }}>
                <Factory size={22} style={{ color: "#00D9FF" }} strokeWidth={1.8} />
              </div>
              <h3 className="text-card text-white">Manufacturing Support</h3>
              <p className="mt-3 text-body-normal" style={{ color: "rgba(255,255,255,0.52)" }}>Supply chain optimisation, supplier qualification, and on-floor quality engineering worldwide.</p>
              <div className="absolute bottom-5 right-5 h-5 w-5 opacity-20 group-hover:opacity-50" style={{ borderRight: "1.5px solid #00D9FF", borderBottom: "1.5px solid #00D9FF", borderRadius: "0 0 4px 0" }} />
            </div>

            {/* Row 3: Testing & Validation (spans 2), Deployment */}
            {/* Card 6: Testing & Validation – spans 2 */}
            <div
              className="wtx-card group relative overflow-hidden rounded-[28px] border p-6 md:col-span-2"
              data-card-id="testing-validation"
              data-card-index={6}
              style={{
                background: "rgba(255,255,255,0.035)",
                backdropFilter: "blur(18px) saturate(140%)",
                WebkitBackdropFilter: "blur(18px) saturate(140%)",
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
                willChange: "transform, opacity",
              }}
            >
              <div className="wtx-card-glow pointer-events-none absolute inset-0 rounded-[28px] opacity-0" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(140, 198, 63, 0.25) 0%, transparent 65%)" }} />
              <div className="wtx-card-edge pointer-events-none absolute inset-0 rounded-[28px] opacity-0" style={{ boxShadow: "0 0 0 1px rgba(140, 198, 63, 0.45), 0 0 32px rgba(140, 198, 63, 0.2)" }} />
              <div className="absolute left-6 top-0 h-[2px] w-16 rounded-b" style={{ background: "linear-gradient(90deg, var(--primary-green), #00D9FF, transparent)", opacity: 0.75 }} />
              <div className="flex items-start gap-5">
                <div className="mb-0 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110" style={{ background: "rgba(140, 198, 63, 0.25)", border: "1px solid rgba(140, 198, 63, 0.35)", boxShadow: "0 0 20px rgba(140, 198, 63, 0.2)" }}>
                  <FlaskConical size={22} style={{ color: "var(--primary-green)" }} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-card text-white">Testing & Validation</h3>
                  <p className="mt-3 text-body-normal" style={{ color: "rgba(255,255,255,0.52)" }}>Functional, EMC, environmental, and safety testing aligned to IEC, CE, UL, and FCC standards. Pass first time with our validation framework.</p>
                </div>
              </div>
              <div className="absolute bottom-5 right-5 h-5 w-5 opacity-20 group-hover:opacity-50" style={{ borderRight: "1.5px solid var(--primary-green-darker)", borderBottom: "1.5px solid var(--primary-green-darker)", borderRadius: "0 0 4px 0" }} />
            </div>

            {/* Card 7: Deployment & Maintenance – spans 2 */}
            <div
              className="wtx-card group relative overflow-hidden rounded-[28px] border p-6 md:col-span-2"
              data-card-id="deployment-maintenance"
              data-card-index={7}
              style={{
                background: "rgba(0,217,255,0.04)",
                backdropFilter: "blur(18px) saturate(140%)",
                WebkitBackdropFilter: "blur(18px) saturate(140%)",
                borderColor: "rgba(0,217,255,0.12)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,217,255,0.06), inset 0 1px 0 rgba(255,255,255,0.06)",
                willChange: "transform, opacity",
              }}
            >
              <div className="wtx-card-glow pointer-events-none absolute inset-0 rounded-[28px] opacity-0" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(0,217,255,0.14) 0%, transparent 65%)" }} />
              <div className="wtx-card-edge pointer-events-none absolute inset-0 rounded-[28px] opacity-0" style={{ boxShadow: "0 0 0 1px rgba(0,217,255,0.3), 0 0 40px rgba(0,217,255,0.12)" }} />
              <div className="absolute left-6 top-0 h-[2px] w-16 rounded-b" style={{ background: "linear-gradient(90deg, #00D9FF, transparent)", opacity: 0.8 }} />
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110" style={{ background: "rgba(0,217,255,0.12)", border: "1px solid rgba(0,217,255,0.2)", boxShadow: "0 0 20px rgba(0,217,255,0.1)" }}>
                  <Wrench size={22} style={{ color: "#00D9FF" }} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-card text-white">Deployment & Maintenance</h3>
                  <p className="mt-3 text-body-normal" style={{ color: "rgba(255,255,255,0.52)" }}>Global installation, commissioning, remote monitoring, and long-term service contracts that keep your systems running at peak performance.</p>
                </div>
              </div>
              <div className="absolute bottom-5 right-5 h-5 w-5 opacity-20 group-hover:opacity-50" style={{ borderRight: "1.5px solid #00D9FF", borderBottom: "1.5px solid #00D9FF", borderRadius: "0 0 4px 0" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Global styles scoped to this section */}
      <style jsx>{`
        @keyframes wtx-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        /* Responsive grid – collapse to 1 col on mobile, 2 col on tablet */
        @media (max-width: 767px) {
          #why-texawave .grid {
            grid-template-columns: 1fr !important;
          }
          #why-texawave .md\\:col-span-2 {
            grid-column: span 1 !important;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          #why-texawave .grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          #why-texawave .md\\:col-span-2 {
            grid-column: span 2 !important;
          }
        }
      `}</style>
    </section>
  );
}
