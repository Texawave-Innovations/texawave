"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Cpu,
  Cog,
  Package,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CheckList } from "@/components/CheckList";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────
const DISCIPLINES = [
  {
    id: "software",
    slug: "software-iot",
    label: "SOFTWARE & AI",
    title: "Software & AI Solutions",
    icon: Code2,
    shortDesc: "Bridge physical operations and digital scale with intelligent software.",
    capabilities: [
      "Custom ERP Solutions",
      "Web & Mobile Applications",
      "Cloud & Infrastructure Solutions",
      "AI & Data Analytics",
    ],
    cta: "Explore Software & AI",
    bgVisual: "electrical",
    accentGlow: "rgba(140,198,63,0.18)",
  },
  {
    id: "product-engineering",
    slug: "product-engineering",
    label: "PRODUCT ENGINEERING",
    title: "Product Engineering",
    icon: Cpu,
    shortDesc: "Turn complex concepts into market-ready physical products.",
    capabilities: [
      "Industrial & Mechanical Design",
      "Hardware & PCB Design",
      "Embedded & IoT Solutions",
      "Rapid Prototyping & Validation",
    ],
    cta: "Explore Product Engineering",
    bgVisual: "software",
    accentGlow: "rgba(140,198,63,0.18)",
  },
  {
    id: "procurement",
    slug: "procurement",
    label: "PROCUREMENT",
    title: "Procurement Services",
    icon: Package,
    shortDesc: "Strategic component sourcing and resilient supply chain management.",
    capabilities: [
      "Component Sourcing",
      "Supply Chain Management",
      "BOM Optimization",
      "Supplier Quality Control",
    ],
    cta: "Explore Procurement",
    bgVisual: "mechanical",
    accentGlow: "rgba(140,198,63,0.18)",
  },
  {
    id: "manufacturing",
    slug: "manufacturing-support",
    label: "MANUFACTURING",
    title: "Manufacturing Support",
    icon: Cog,
    shortDesc: "Factory-ready support from prototype to high-volume production.",
    capabilities: [
      "DFM/DFA Optimization",
      "Production Transfer",
      "Production Test Solutions",
      "Scale-Up Support",
    ],
    cta: "Explore Manufacturing",
    bgVisual: "procurement",
    accentGlow: "rgba(140,198,63,0.18)",
  },
];

// ─── Background Canvas ────────────────────────────────────────────────────────
function EngineeringCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      r: number; alpha: number; da: number;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.35 + 0.05,
        da: (Math.random() - 0.5) * 0.006,
      });
    }

    let t = 0;
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Energy pulses
      for (let pulse = 0; pulse < 3; pulse++) {
        const px = canvas.width * (0.2 + pulse * 0.3);
        const py = canvas.height * 0.5;
        const pr = ((t * 60 + pulse * 80) % 300) + 30;
        const palpha = Math.max(0, 0.06 - pr / 5000);
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(140,198,63,${palpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Particles + connection lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.da;
        if (p.alpha < 0.03 || p.alpha > 0.4) p.da *= -1;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140,198,63,${p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(140,198,63,${(1 - dist / 120) * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// ─── Tile Visual Backgrounds ─────────────────────────────────────────────────
function SoftwareVisual() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Floating code lines */}
      {[
        { t: "12%", l: "8%", text: "const init = () => {", delay: "0s" },
        { t: "24%", l: "14%", text: "  await deploy(cfg);", delay: "0.3s" },
        { t: "38%", l: "6%", text: "  return status;", delay: "0.6s" },
        { t: "54%", l: "10%", text: "}", delay: "0.9s" },
        { t: "70%", l: "5%", text: "module.exports = api;", delay: "1.2s" },
      ].map((line, i) => (
        <div
          key={i}
          className="absolute font-mono text-[10px] whitespace-nowrap smooth-code-pulse"
          style={{
            top: line.t, left: line.l,
            color: `rgba(140,198,63,${0.12 + i * 0.04})`,
            animationDelay: line.delay,
            animationDuration: `${4 + i * 0.8}s`,
          }}
        >
          {line.text}
        </div>
      ))}
      {/* Network nodes */}
      {[
        { top: "20%", right: "15%", size: 5 },
        { top: "55%", right: "25%", size: 3 },
        { top: "75%", right: "10%", size: 4 },
      ].map((node, i) => (
        <div
          key={i}
          className="absolute rounded-full smooth-network-ping"
          style={{
            top: node.top, right: node.right,
            width: node.size, height: node.size,
            background: "rgba(140,198,63,0.6)",
            animationDuration: `${3.5 + i * 0.5}s`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
      {/* Data flow line */}
      <svg className="absolute inset-0 w-full h-full opacity-10" style={{ zIndex: 0 }}>
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#8CC63F" strokeWidth="1" strokeDasharray="8 12" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#8CC63F" strokeWidth="1" strokeDasharray="8 12" />
      </svg>
    </div>
  );
}

function ElectricalVisual() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {/* PCB trace paths */}
        <path d="M20,150 L80,150 L80,80 L180,80 L180,150 L260,150 L260,220 L360,220" fill="none" stroke="#8CC63F" strokeWidth="2" strokeDasharray="8 16" strokeDashoffset="0">
          <animate attributeName="stroke-dashoffset" from="24" to="0" dur="5s" repeatCount="indefinite" />
        </path>
        <path d="M20,80 L60,80 L60,180 L140,180 L140,100 L220,100 L220,200 L360,200" fill="none" stroke="#8CC63F" strokeWidth="1.5" strokeDasharray="8 16" strokeDashoffset="24">
          <animate attributeName="stroke-dashoffset" from="24" to="0" dur="6s" repeatCount="indefinite" begin="1s" />
        </path>
        {/* Component symbols */}
        <rect x="155" y="65" width="25" height="30" fill="none" stroke="#8CC63F" strokeWidth="1.5" rx="2" />
        <rect x="235" y="205" width="20" height="20" fill="none" stroke="#8CC63F" strokeWidth="1.5" rx="2" />
        {/* Signal dots */}
        {[{x:80,y:150},{x:180,y:80},{x:260,y:220}].map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r="5" fill="#8CC63F" opacity="0.5">
            <animate attributeName="r" values="4;7;4" dur={`${3.5 + i}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.15;0.5" dur={`${3.5 + i}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  );
}

function MechanicalVisual() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-[0.1]" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {/* Wireframe box */}
        <rect x="120" y="60" width="160" height="100" fill="none" stroke="#8CC63F" strokeWidth="1.5" strokeDasharray="4 4" />
        <rect x="140" y="80" width="160" height="100" fill="none" stroke="#8CC63F" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="120" y1="60" x2="140" y2="80" stroke="#8CC63F" strokeWidth="1" />
        <line x1="280" y1="60" x2="300" y2="80" stroke="#8CC63F" strokeWidth="1" />
        <line x1="120" y1="160" x2="140" y2="180" stroke="#8CC63F" strokeWidth="1" />
        <line x1="280" y1="160" x2="300" y2="180" stroke="#8CC63F" strokeWidth="1" />
        {/* Dimension lines */}
        <line x1="100" y1="55" x2="100" y2="165" stroke="#8CC63F" strokeWidth="0.8" markerEnd="url(#arrow)" />
        <line x1="115" y1="175" x2="285" y2="175" stroke="#8CC63F" strokeWidth="0.8" />
        {/* Rotation indicator */}
        <circle cx="200" cy="130" r="30" fill="none" stroke="#8CC63F" strokeWidth="1" strokeDasharray="4 6">
          <animateTransform attributeName="transform" type="rotate" from="0 200 130" to="360 200 130" dur="25s" repeatCount="indefinite" calcMode="linear" />
        </circle>
        {/* Blueprint crosshairs */}
        <line x1="200" y1="95" x2="200" y2="165" stroke="#8CC63F" strokeWidth="0.5" opacity="0.5" />
        <line x1="165" y1="130" x2="235" y2="130" stroke="#8CC63F" strokeWidth="0.5" opacity="0.5" />
      </svg>
    </div>
  );
}

function ProcurementVisual() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {/* Global map dots */}
        {[
          {x:60,y:100},{x:140,y:80},{x:200,y:140},{x:280,y:90},{x:330,y:120},
          {x:90,y:200},{x:180,y:220},{x:260,y:190},{x:310,y:220}
        ].map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r="5" fill="none" stroke="#8CC63F" strokeWidth="1.2">
            <animate attributeName="r" values="4;8;4" dur={`${4 + i * 0.8}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} calcMode="linear" />
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur={`${4 + i * 0.8}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} calcMode="linear" />
          </circle>
        ))}
        {/* Route lines */}
        {[
          {x1:60,y1:100,x2:140,y2:80},{x1:140,y1:80,x2:200,y2:140},
          {x1:200,y1:140,x2:280,y2:90},{x1:280,y1:90,x2:330,y2:120},
          {x1:90,y1:200,x2:180,y2:220},{x1:180,y1:220,x2:260,y2:190},
          {x1:200,y1:140,x2:180,y2:220}
        ].map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="#8CC63F" strokeWidth="1" strokeDasharray="4 6">
            <animate attributeName="stroke-dashoffset" from="10" to="0" dur={`${6 + i * 0.8}s`} repeatCount="indefinite" calcMode="linear" />
          </line>
        ))}
        {/* Animated moving dot */}
        <circle r="3.5" fill="#8CC63F" opacity="0.8">
          <animateMotion dur="10s" repeatCount="indefinite" calcMode="linear"
            path="M60,100 L140,80 L200,140 L280,90 L330,120" />
        </circle>
      </svg>
    </div>
  );
}

const VISUALS: Record<string, React.FC> = {
  software: SoftwareVisual,
  electrical: ElectricalVisual,
  mechanical: MechanicalVisual,
  procurement: ProcurementVisual,
};

// ─── Tile Component ───────────────────────────────────────────────────────────
interface TileProps {
  discipline: (typeof DISCIPLINES)[0];
  isHovered: boolean;
  isAnyHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  index: number;
}

function EngineeringTile({
  discipline,
  isHovered,
  isAnyHovered,
  onMouseEnter,
  onMouseLeave,
  index,
}: TileProps) {
  const Icon = discipline.icon;
  const Visual = VISUALS[discipline.bgVisual];

  const dimmed = isAnyHovered && !isHovered;

  return (
    <Link
      href={`/${discipline.slug}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="eng-tile relative overflow-hidden cursor-pointer group block"
      style={{
        background: isHovered
          ? "rgba(23, 26, 33, 0.95)"
          : "rgba(23, 26, 33, 0.85)",
        border: `1px solid ${isHovered ? "rgba(140,198,63,0.45)" : "rgba(140,198,63,0.1)"}`,
        borderRadius: "2px",
        boxShadow: isHovered
          ? "0 0 60px rgba(140,198,63,0.18), 0 0 120px rgba(140,198,63,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "inset 0 1px 0 rgba(255,255,255,0.02)",
        opacity: dimmed ? 0.45 : 1,
        transition: "opacity 0.5s cubic-bezier(0.77,0,0.175,1), box-shadow 0.5s cubic-bezier(0.77,0,0.175,1), border-color 0.5s cubic-bezier(0.77,0,0.175,1), background 0.5s cubic-bezier(0.77,0,0.175,1)",
        flex: "1 1 0%",
        minWidth: 0,
      }}
    >

      {/* Top glow streak — brightens on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(140,198,63,0.7) 50%, transparent 100%)",
          opacity: isHovered ? 1 : 0.25,
        }}
      />

      {/* Background visual — always visible, intensifies on hover */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: isHovered ? 1 : 0.45 }}
      >
        <Visual />
      </div>

      {/* Glow radial overlay — subtle at rest, stronger on hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-500"
        style={{
          background: isHovered
            ? "radial-gradient(ellipse 70% 60% at 50% 85%, rgba(140,198,63,0.1) 0%, transparent 70%)"
            : "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(140,198,63,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Always-visible content */}
      <div
        className="relative z-10 flex flex-col justify-end h-full p-6 lg:p-8"
      >
        {/* Icon + label row */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex items-center justify-center rounded-xl shrink-0 transition-all duration-500"
            style={{
              width: 44,
              height: 44,
              background: isHovered ? "rgba(140,198,63,0.18)" : "rgba(140,198,63,0.09)",
              border: `1px solid ${isHovered ? "rgba(140,198,63,0.5)" : "rgba(140,198,63,0.22)"}`,
              color: "#8CC63F",
              boxShadow: isHovered ? "0 0 20px rgba(140,198,63,0.2)" : "none",
            }}
          >
            <Icon size={20} />
          </div>
          <div>
            <p
              className="eng-tile-label text-[10px] font-bold uppercase tracking-widest transition-colors duration-300"
              style={{ color: isHovered ? "rgba(140,198,63,0.75)" : "rgba(140,198,63,0.5)" }}
            >
              {discipline.label}
            </p>
            <h3
              className="eng-tile-title font-black text-white dark:text-white leading-tight transition-colors duration-300"
              style={{
                fontFamily: "var(--font-sora), Sora, sans-serif",
                fontSize: "clamp(17px, 1.2vw + 9px, 21px)",
                color: isHovered ? "#ffffff" : "rgba(255,255,255,0.9)",
              }}
            >
              {discipline.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p
          className="eng-tile-desc text-[15px] leading-relaxed mb-4 transition-colors duration-300"
          style={{ color: isHovered ? "rgba(225,225,225,0.95)" : "rgba(180,180,180,0.85)" }}
        >
          {discipline.shortDesc}
        </p>

        {/* Divider */}
        <div
          className="h-px w-full mb-4 transition-opacity duration-300"
          style={{ background: "rgba(140,198,63,0.15)", opacity: isHovered ? 1 : 0.5 }}
        />

        <CheckList
          items={discipline.capabilities}
          className="mb-5"
          itemClassName={isHovered ? "text-[rgba(225,225,225,0.95)]" : "text-[rgba(180,180,180,0.8)]"}
        />

        {/* CTA */}
        <div
          className="inline-flex items-center gap-2 text-[14px] font-bold transition-all duration-300"
          style={{
            color: isHovered ? "#8CC63F" : "rgba(140,198,63,0.65)",
          }}
        >
          {discipline.cta}
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

// ─── Mobile Accordion Card ────────────────────────────────────────────────────
function MobileTile({ discipline, index }: { discipline: (typeof DISCIPLINES)[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const Icon = discipline.icon;

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.28, ease: "power2.in" });
    }
  }, [open]);

  return (
    <div
      className={["eng-mobile-tile rounded-sm overflow-hidden", open ? "is-open" : ""].join(" ")}
      style={{
        background: open ? "rgba(23, 26, 33, 0.95)" : "rgba(23, 26, 33, 0.85)",
        border: `1px solid ${open ? "rgba(140,198,63,0.4)" : "rgba(140,198,63,0.12)"}`,
        boxShadow: open ? "0 0 30px rgba(140,198,63,0.1)" : "none",
        transition: "all 0.35s ease",
      }}
    >
      <button
        className="w-full flex items-center gap-4 p-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div
          className="flex shrink-0 items-center justify-center rounded-xl transition-all duration-300"
          style={{
            width: 44, height: 44,
            background: open ? "rgba(140,198,63,0.18)" : "rgba(140,198,63,0.07)",
            border: `1px solid ${open ? "rgba(140,198,63,0.5)" : "rgba(140,198,63,0.2)"}`,
            color: "#8CC63F",
          }}
        >
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(140,198,63,0.6)" }}>
            {discipline.label}
          </p>
          <h3 className="eng-mobile-tile-title font-black text-[#010101] dark:text-white text-[17px]" style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}>
            {discipline.title}
          </h3>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 16 16"
          className="shrink-0 transition-transform duration-300"
          style={{ color: "#8CC63F", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M2 5l6 6 6-6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div ref={bodyRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
        <div className="px-5 pb-5">
          <div className="h-px mb-4" style={{ background: "rgba(140,198,63,0.12)" }} />
          <p className="eng-mobile-tile-desc text-[#374151] dark:text-neutral-300 text-[15px] leading-relaxed mb-4">{discipline.shortDesc}</p>
            <CheckList
              items={discipline.capabilities}
              className="mb-5"
              itemClassName="text-[rgba(180,180,180,0.8)]"
            />
          <Link
            href={`/${discipline.slug}`}
            className="inline-flex items-center gap-1.5 text-[14px] font-bold"
            style={{ color: "#8CC63F" }}
          >
            {discipline.cta} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function EngineeringExcellence() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleEnter = useCallback((id: string) => setHoveredId(id), []);
  const handleLeave = useCallback(() => setHoveredId(null), []);

  // Scroll-triggered entrance animations
  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 80%" },
      }
    );

    gsap.fromTo(
      gridRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 1.1, ease: "power3.out", delay: 0.2,
        scrollTrigger: { trigger: section, start: "top 75%" },
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="engineering-excellence"
      className="relative overflow-hidden"
      style={{
        background: "var(--bg-primary, #0F1115)",
        minHeight: "100vh",
        paddingTop: "clamp(20px, 3vh, 40px)",
        paddingBottom: "clamp(60px, 8vh, 110px)",
      }}
    >
      {/* Scope-scoped custom keyframes for ultra-smooth animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes softCodePulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.95; }
        }
        @keyframes smoothNetworkPing {
          0% { transform: scale(0.6); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .smooth-code-pulse {
          animation: softCodePulse 5s ease-in-out infinite;
        }
        .smooth-network-ping {
          animation: smoothNetworkPing 4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          transform-origin: center;
        }
      `}} />

      {/* ── Engineering graph paper grid ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(140,198,63,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(140,198,63,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          zIndex: 0,
        }}
      />

      {/* ── Animated particles + connection lines canvas ── */}
      <EngineeringCanvas />

      {/* ── Ambient green glow center ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          background: "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(140,198,63,0.04) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <div
        className="relative mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)]"
        style={{ zIndex: 1 }}
      >
        {/* ── Section Header ── */}
        <div ref={headerRef} className="mb-12 lg:mb-16 text-center" style={{ opacity: 0 }}>
          <span
            className="inline-block text-[11px] font-black uppercase tracking-[0.24em] mb-5"
            style={{ color: "#8CC63F" }}
          >
            Engineering Services
          </span>
          <h2
            className="font-black text-[#010101] dark:text-white leading-tight"
            style={{
              fontFamily: "var(--font-sora), Sora, sans-serif",
              fontSize: "clamp(2rem, 3.2vw + 0.8rem, 3.2rem)",
              lineHeight: 1.08,
            }}
          >
            Your End-to-End{" "} <br />
            <span style={{ color: "#8CC63F" }}>Product Engineering Partner</span>
          </h2>
          <p
            className="mt-5 mx-auto max-w-2xl text-[#4B5563] dark:text-neutral-400 leading-relaxed"
            style={{ fontSize: "clamp(14px, 1.1vw + 9px, 17px)" }}
          >
            From concept to production, Texawave delivers software & AI solutions, product engineering, procurement services, and manufacturing support one partner, zero gaps.
          </p>
        </div>

        {/* ── Desktop 2×2 Expanding Grid ── */}
        <div
          ref={gridRef}
          className="hidden lg:grid lg:grid-rows-2 gap-3"
          style={{ opacity: 0, minHeight: "72vh" }}
        >
          {/* Row 1 */}
          <div className="flex gap-3" style={{ flex: "1" }}>
            {DISCIPLINES.slice(0, 2).map((d, i) => (
              <EngineeringTile
                key={d.id}
                discipline={d}
                index={i}
                isHovered={hoveredId === d.id}
                isAnyHovered={hoveredId !== null}
                onMouseEnter={() => handleEnter(d.id)}
                onMouseLeave={handleLeave}
              />
            ))}
          </div>
          {/* Row 2 */}
          <div className="flex gap-3" style={{ flex: "1" }}>
            {DISCIPLINES.slice(2, 4).map((d, i) => (
              <EngineeringTile
                key={d.id}
                discipline={d}
                index={i + 2}
                isHovered={hoveredId === d.id}
                isAnyHovered={hoveredId !== null}
                onMouseEnter={() => handleEnter(d.id)}
                onMouseLeave={handleLeave}
              />
            ))}
          </div>
        </div>

        {/* ── Tablet: 2-column static grid with reduced expansion ── */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-4 mt-4">
          {DISCIPLINES.map((d, i) => {
            const Icon = d.icon;
            return (
              <Link
                key={d.id}
                href={`/${d.slug}`}
                className="eng-tile relative rounded-sm overflow-hidden p-6 cursor-pointer group block"
                style={{
                  background: "rgba(23, 26, 33, 0.85)",
                  border: "1px solid rgba(140,198,63,0.12)",
                  minHeight: "240px",
                  transition: "all 0.35s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(140,198,63,0.45)";
                  el.style.boxShadow = "0 0 40px rgba(140,198,63,0.15)";
                  el.style.background = "rgba(23, 26, 33, 0.95)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(140,198,63,0.12)";
                  el.style.boxShadow = "none";
                  el.style.background = "rgba(23, 26, 33, 0.85)";
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="flex shrink-0 items-center justify-center rounded-xl"
                    style={{
                      width: 44, height: 44,
                      background: "rgba(140,198,63,0.1)",
                      border: "1px solid rgba(140,198,63,0.3)",
                      color: "#8CC63F",
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="eng-tile-label text-[11px] font-bold uppercase tracking-widest" style={{ color: "rgba(140,198,63,0.6)" }}>{d.label}</p>
                    <h3 className="eng-tile-title font-black text-[17px]" style={{ fontFamily: "var(--font-sora), Sora, sans-serif", color: "rgba(255,255,255,0.9)" }}>{d.title}</h3>
                  </div>
                </div>
                <p className="eng-tile-desc text-[15px] leading-relaxed mb-3" style={{ color: "rgba(180,180,180,0.85)" }}>{d.shortDesc}</p>
                <CheckList
                  items={d.capabilities}
                  className="mb-4"
                  itemClassName="text-[rgba(180,180,180,0.8)]"
                />
                <div
                  className="inline-flex items-center gap-1.5 text-[14px] font-bold"
                  style={{ color: "#8CC63F" }}
                >
                  {d.cta} <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Mobile: Accordion Stack ── */}
        <div className="md:hidden flex flex-col gap-3 mt-4">
          {DISCIPLINES.map((d, i) => (
            <MobileTile key={d.id} discipline={d} index={i} />
          ))}
        </div>

        {/* ── Hover hint (desktop only) ── */}
        <p
          className="engineering-hover-hint hidden lg:block text-center mt-6 text-[11px] font-medium tracking-widest uppercase"
        >
          Hover a discipline to explore capabilities
        </p>

        {/* ── Bottom CTA ── */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <div className="h-px w-20" style={{ background: "rgba(140,198,63,0.18)" }} />
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300"
            style={{
              background: "rgba(140,198,63,0.07)",
              border: "1px solid rgba(140,198,63,0.25)",
              color: "#8CC63F",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "rgba(140,198,63,0.15)";
              el.style.borderColor = "rgba(140,198,63,0.55)";
              el.style.boxShadow = "0 0 24px rgba(140,198,63,0.2)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "rgba(140,198,63,0.07)";
              el.style.borderColor = "rgba(140,198,63,0.25)";
              el.style.boxShadow = "none";
            }}
          >
            Explore All Services <ArrowRight size={15} />
          </Link>
          <div className="h-px w-20" style={{ background: "rgba(140,198,63,0.18)" }} />
        </div>
      </div>
    </section>
  );
}