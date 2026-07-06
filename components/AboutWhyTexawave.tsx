"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Lightbulb,
  Palette,
  Zap,
  Microscope,
  Package,
  Factory,
  Rocket,
  BrainCircuit,
  Code2
} from "lucide-react";

// Register ScrollTrigger client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Stage {
  id: string;
  label: string;
  desc: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string }>;
  color: string;
  glowColor: string;
}

const STAGES: Stage[] = [
  { id: "idea", label: "Idea", desc: "Requirements gathering, user story mapping, and concept initialization", icon: Lightbulb, color: "#8CC63F", glowColor: "rgba(140, 198, 63, 0.4)" },
  { id: "design", label: "Design", desc: "Ergonomics, casing styling, 3D modeling, and UX interface layouts", icon: Palette, color: "#14B8A6", glowColor: "rgba(20, 184, 166, 0.4)" },
  { id: "engineer", label: "Engineer", desc: "Schematics, multi-layer PCB layouts, firmware integration, and cloud architecture", icon: Zap, color: "#8CC63F", glowColor: "rgba(140, 198, 63, 0.4)" },
  { id: "prototype", label: "Prototype", desc: "3D prints, functional PCB assembly, and initial lab testing", icon: Microscope, color: "#14B8A6", glowColor: "rgba(20, 184, 166, 0.4)" },
  { id: "source", label: "Source", desc: "BOM optimization, supplier vetting, component sourcing, and supply chain logistics", icon: Package, color: "#8CC63F", glowColor: "rgba(140, 198, 63, 0.4)" },
  { id: "manufacture", label: "Manufacture", desc: "Tooling design, line setup, quality control calibration, and mass production", icon: Factory, color: "#14B8A6", glowColor: "rgba(20, 184, 166, 0.4)" },
  { id: "launch", label: "Launch", desc: "Compliance certifications, packaging design, and worldwide distribution", icon: Rocket, color: "#8CC63F", glowColor: "rgba(140, 198, 63, 0.4)" }
];

const CARDS = [
  {
    title: "Deep Software & IoT Mastery",
    desc: "We don't treat software as an afterthought. Our team builds robust digital platforms, cloud integrations, and mobile interfaces that synchronize flawlessly with physical devices.",
    icon: Code2,
    color: "#8CC63F"
  },
  {
    title: "Zero Vendor Fragmentation",
    desc: "No need to juggle separate vendors for mechanical builds, electrical routing, and software coding. We handle it all under one roof.",
    icon: BrainCircuit,
    color: "#8CC63F"
  },
  {
    title: "Manufacturability First (DFM)",
    desc: "We don't just build designs that look good on screen; we deliver production-ready assets optimized for cost, scalability, and long-term performance.",
    icon: Factory,
    color: "#14B8A6"
  },
  {
    title: "Transparency & Speed",
    desc: "From BOM (Bill of Materials) optimization to rapid prototyping, we minimize production delays and eliminate unexpected costs.",
    icon: Rocket,
    color: "#14B8A6"
  }
];

function PCBBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25 z-0" aria-hidden="true">
      <svg className="w-full h-full text-white/5" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pcb-grid-about" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="glow-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8CC63F" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8CC63F" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#pcb-grid-about)" />
        
        {/* PCB trace lines */}
        <g stroke="currentColor" strokeWidth="1" fill="none" className="opacity-40">
          <path d="M -50,150 L 250,150 L 300,200 L 300,450 L 150,600 M 300,300 L 450,300 L 500,350 L 500,550" />
          <path d="M 1200,250 L 950,250 L 900,300 L 900,600 L 1050,750" />
          <path d="M 100,900 L 100,1100 L 250,1250 L 500,1250" />
          <path d="M 1100,950 L 1100,1150 L 950,1300 L 750,1300" />
        </g>
        
        {/* Flowing dashes on trace paths */}
        <path d="M -50,150 L 250,150 L 300,200 L 300,450 L 150,600" stroke="url(#glow-grad-1)" strokeWidth="1.5" fill="none" className="pcb-flow" />
        <path d="M 1200,250 L 950,250 L 900,300 L 900,600 L 1050,750" stroke="url(#glow-grad-1)" strokeWidth="1.5" fill="none" className="pcb-flow" style={{ animationDelay: "-2s" }} />
        
        {/* Dynamic PCB solder pads */}
        <circle cx="250" cy="150" r="3" fill="#8CC63F" className="animate-pulse" />
        <circle cx="300" cy="200" r="3.5" fill="#14B8A6" />
        <circle cx="300" cy="450" r="3" fill="#8CC63F" />
        <circle cx="450" cy="300" r="3" fill="#14B8A6" />
        <circle cx="950" cy="250" r="3.5" fill="#8CC63F" />
        <circle cx="900" cy="600" r="3" fill="#14B8A6" />
        <circle cx="250" cy="1250" r="3" fill="#8CC63F" />
        <circle cx="950" cy="1300" r="3" fill="#14B8A6" />
      </svg>
      <style jsx>{`
        @keyframes pcb-flow-anim {
          to {
            stroke-dashoffset: -80;
          }
        }
        .pcb-flow {
          stroke-dasharray: 12 40;
          animation: pcb-flow-anim 6s linear infinite;
        }
      `}</style>
    </div>
  );
}

export function AboutWhyTexawave() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gridRowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const line = activeLineRef.current;
    const cardsGrid = cardsGridRef.current;
    const gridRow = gridRowRef.current;
    if (!section || !gridRow) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      // Set all elements to active/visible states instantly if reduced motion is requested
      if (line) gsap.set(line, { scaleY: 1 });
      nodeRefs.current.forEach((node) => {
        if (node) {
          gsap.set(node, {
            borderColor: "var(--primary-green)",
            boxShadow: "0 0 20px rgba(140, 198, 63, 0.4), inset 0 0 0 9999px rgba(140, 198, 63, 0.15)",
            color: "var(--primary-green)"
          });
        }
      });
      itemRefs.current.forEach((item) => {
        if (item) {
          const title = item.querySelector(".stage-title");
          const desc = item.querySelector(".stage-desc");
          if (title) gsap.set(title, { color: "var(--journey-active-title)" });
          if (desc) gsap.set(desc, { color: "var(--journey-active-desc)" });
        }
      });
      cardRefs.current.forEach((card) => {
        if (card) gsap.set(card, { opacity: 1, y: 0 });
      });
      return;
    }

    // Timeline ScrollTrigger for the right column development journey (linked to gridRow)
    const journeyTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: gridRow,
        start: "top 32%",
        end: "bottom 78%",
        scrub: 0.8, // smooth scrub follow-through
      }
    });

    // Animate the vertical timeline connector line scale
    if (line) {
      journeyTimeline.to(line, { scaleY: 1, ease: "none", duration: 1 });
    }

    // Staggered node illumination and text highlighting synchronized with line drawing
    STAGES.forEach((stage, index) => {
      const progressPoint = index / (STAGES.length - 1);
      
      // Node circle activation
      journeyTimeline.to(
        nodeRefs.current[index],
        {
          borderColor: stage.color,
          color: "#ffffff",
          boxShadow: `0 0 20px ${stage.glowColor}, inset 0 0 0 9999px ${
            stage.color === "#8CC63F" ? "rgba(140, 198, 63, 0.18)" : "rgba(20, 184, 166, 0.18)"
          }`,
          scale: 1.15,
          duration: 0.05
        },
        progressPoint * 0.95
      );

      // Light up corresponding title and description elements
      const itemEl = itemRefs.current[index];
      if (itemEl) {
        const titleEl = itemEl.querySelector(".stage-title");
        const descEl = itemEl.querySelector(".stage-desc");

        journeyTimeline.to(
          titleEl,
          {
            color: "var(--journey-active-title)",
            duration: 0.05
          },
          progressPoint * 0.95
        )
        .to(
          descEl,
          {
            color: "var(--journey-active-desc)",
            duration: 0.05
          },
          progressPoint * 0.95
        );
      }
    }, 0);

    // Staggered reveal for capability cards on scroll
    if (cardsGrid) {
      const validCards = cardRefs.current.filter((c): c is HTMLDivElement => c !== null);
      gsap.fromTo(
        validCards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsGrid,
            start: "top 82%"
          }
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="about-why"
      className="relative bg-bg-primary border-b border-border-primary py-24 overflow-hidden z-10"
    >
      <PCBBackground />

      <div className="relative mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)] z-10">
        <div ref={gridRowRef} className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          
          {/* Left Column: About TexaWave Content & Capability Grid */}
          <div className="flex flex-col justify-between">
            {/* About content */}
            <div className="mb-12">
              <p className="text-small-text font-bold uppercase tracking-[0.18em] text-signal">About TexaWave</p>
              <h2 className="mt-3 text-section text-text-primary tracking-tight font-black leading-tight">
                A New Generation <br className="hidden md:inline" />
                Product<span style={{ color: "#8CC63F" }}> Engineering Partner.</span>
              </h2>
              <div className="mt-6 space-y-6 text-body-large text-text-secondary leading-relaxed">
                <p>
                  Texawave is a multidisciplinary product engineering partner helping startups and enterprises transform innovative ideas into market-ready products. Our core focus lies in custom software development, cloud IoT platforms, and advanced electronic hardware development. Integrated with precision mechanical design and manufacturing support, we deliver the complete, connected solutions you need to accelerate innovation and launch faster.
                </p>
              </div>
            </div>

            {/* Why TexaWave content */}
            <div className="mb-12">
              <p className="text-small-text font-bold uppercase tracking-[0.18em] text-signal">WHY TEXAWAVE</p>
            </div>

            {/* 2x2 Glassmorphic capability grid */}
            <div 
              ref={cardsGridRef}
              className="grid gap-5 sm:grid-cols-2"
            >
              {CARDS.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    ref={(el) => { cardRefs.current[index] = el; }}
                    className="about-cap-card group relative overflow-hidden rounded-2xl border border-[#E5E7EB] dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6 shadow-sm dark:shadow-2xl backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:border-[rgba(140,198,63,0.3)] dark:hover:border-white/[0.12] hover:shadow-md dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                  >
                    {/* Hover inner gradient glow */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 10% 10%, ${card.color}10 0%, transparent 60%)`
                      }}
                    />

                    {/* Left edge neon gradient accent */}
                    <div 
                      className="absolute left-0 top-6 bottom-6 w-[2px] rounded-r opacity-0 group-hover:opacity-100 transition-all duration-300"
                      style={{ backgroundColor: card.color }}
                    />

                    {/* Icon container */}
                    <div 
                      className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-105"
                      style={{
                        backgroundColor: `${card.color}12`,
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: `${card.color}25`,
                        boxShadow: `0 0 12px ${card.color}08`
                      }}
                    >
                      <Icon size={20} style={{ color: card.color }} strokeWidth={1.8} />
                    </div>

                    <h3 className="about-cap-card-title text-body-normal font-extrabold text-[#010101] dark:text-white tracking-wide leading-snug">
                      {card.title}
                    </h3>
                    <p className="mt-2.5 text-xs text-text-secondary leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Sticky Timeline Journey */}
          <div className="relative">
            <div className="md:sticky md:top-24 md:max-h-[calc(100vh-120px)]">
              {/* Headline for journey on mobile, standard subtitle on desktop */}
              <div className="mb-8 lg:mb-10">
                <p className="text-small-text lg:text-xs font-bold uppercase tracking-[0.18em] lg:tracking-[0.22em] text-signal mb-2">Our Process</p>
                <h3 className="about-timeline-heading text-card lg:text-3xl font-extrabold text-[#010101] dark:text-[#EEEEEE] tracking-tight">The Product Journey</h3>
              </div>

              {/* Journey timeline container */}
              <div className="relative flex flex-col pl-4">
                {/* Timeline connector track (light gray base line) */}
                <div 
                  className="about-timeline-base-line absolute left-[40px] lg:left-[48px] top-[24px] lg:top-[32px] bottom-[24px] lg:bottom-[32px] w-[2px] lg:w-[3px] bg-[#E5E7EB] dark:bg-neutral-800 z-0 origin-top"
                  aria-hidden="true"
                />
                
                {/* Timeline active/drawn track (GSAP scroll-controlled) */}
                <div 
                  ref={activeLineRef}
                  className="absolute left-[40px] lg:left-[48px] top-[24px] lg:top-[32px] bottom-[24px] lg:bottom-[32px] w-[2px] lg:w-[3px] bg-gradient-to-b from-[#8CC63F] to-[#14B8A6] z-0 origin-top scale-y-0"
                  aria-hidden="true"
                />

                {/* Stages List */}
                <div className="space-y-5 md:space-y-6 lg:space-y-8">
                  {STAGES.map((stage, index) => {
                    const Icon = stage.icon;
                    return (
                      <div 
                        key={stage.id} 
                        className="flex items-center gap-6 lg:gap-8 relative group"
                      >
                        {/* Node Circle */}
                        <div
                          ref={(el) => { nodeRefs.current[index] = el; }}
                          className="about-stage-node flex h-12 w-12 lg:h-16 lg:w-16 shrink-0 items-center justify-center rounded-full border border-[#D1D5DB] dark:border-neutral-800 bg-white dark:bg-bg-card text-[#9CA3AF] dark:text-neutral-500 z-10 relative transition-all duration-300 shadow-sm dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]"
                          style={{ willChange: "transform, border-color, background-color, box-shadow" }}
                        >
                          <Icon className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={1.8} />
                        </div>

                        {/* Stage Content */}
                        <div 
                          ref={(el) => { itemRefs.current[index] = el; }}
                          className="flex flex-col transition-all duration-300"
                        >
                          <span 
                            className="text-sm md:text-base lg:text-lg font-bold tracking-wide transition-colors duration-300 stage-title"
                            style={{ color: "var(--journey-inactive-title)" }}
                          >
                            {stage.label}
                          </span>
                          <span 
                            className="text-[11px] md:text-xs lg:text-sm mt-1 lg:mt-1.5 leading-normal lg:leading-relaxed max-w-xs md:max-w-sm lg:max-w-md transition-colors duration-300 stage-desc"
                            style={{ color: "var(--journey-inactive-desc)" }}
                          >
                            {stage.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>



      </div>
    </section>
  );
}
