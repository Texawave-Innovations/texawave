"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Code2, Cpu, Cog, Package, ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CheckList } from "@/components/CheckList";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ───────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: "software",
    slug: "software-iot",
    title: "Software Engineering",
    shortTitle: "Software",
    icon: Code2,
    color: "#8CC63F",
    angle: -90, // top
    desc: "End-to-end digital product development and connected platform solutions.",
    capabilities: [
      "Custom Enterprise Resource Planning (ERP)",
      "Website Development",
      "Mobile Application Development",
      "Cloud & IoT Platform Management",
    ],
  },
  {
    id: "electrical",
    slug: "electrical-engineering",
    title: "Electrical Engineering",
    shortTitle: "Electrical",
    icon: Cpu,
    color: "#8CC63F",
    angle: 0, // right
    desc: "Power-efficient hardware engineering for connected intelligent products.",
    capabilities: [
      "Multi-layer PCB Design",
      "Embedded Firmware Development",
      "BOM Optimization",
      "Enclosure Design Support",
    ],
  },
  {
    id: "mechanical",
    slug: "mechanical-engineering",
    title: "Mechanical Engineering",
    shortTitle: "Mechanical",
    icon: Cog,
    color: "#8CC63F",
    angle: 90, // bottom
    desc: "Mechanical product design from concept validation to production readiness.",
    capabilities: [
      "New Product Development",
      "3D & 2D CAD Design",
      "Plastic Product Design",
      "Sheet Metal Design",
      "BOM Generation",
    ],
  },
  {
    id: "procurement",
    slug: "procurement",
    title: "Procurement",
    shortTitle: "Procurement",
    icon: Package,
    color: "#8CC63F",
    angle: 180, // left
    desc: "Strategic sourcing and manufacturing support to ensure smooth product realization.",
    capabilities: [
      "Supplier Identification",
      "Vendor Coordination",
      "BOM-Based Purchasing",
      "Supply Chain & Logistics Management",
    ],
  },
];

const LIFECYCLE_STAGES = [
  "Idea",
  "Software",
  "Electrical",
  "Mechanical",
  "Procurement",
  "Manufacturing",
];

// ─── Utility ─────────────────────────────────────────────────────────────────
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// ─── Floating Particle Canvas ─────────────────────────────────────────────
function ParticleCanvas() {
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

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        da: (Math.random() - 0.5) * 0.008,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.da;
        if (p.alpha < 0.05 || p.alpha > 0.6) p.da *= -1;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140, 198, 63, ${p.alpha})`;
        ctx.fill();
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

// ─── Capability Card (Desktop) ─────────────────────────────────────────────
interface CapCardProps {
  service: (typeof SERVICES)[0] | null;
  visible: boolean;
  onClose: () => void;
  style?: React.CSSProperties;
}

function CapabilityCard({ service, visible, onClose, style }: CapCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (visible && service) {
      gsap.fromTo(
        card,
        { opacity: 0, scale: 0.88, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(1.8)" }
      );
    } else {
      gsap.to(card, {
        opacity: 0, scale: 0.88, y: 8, duration: 0.22, ease: "power2.in",
      });
    }
  }, [visible, service]);

  const Icon = service?.icon ?? Code2;

  const combinedStyle: React.CSSProperties = {
    zIndex: 50,
    pointerEvents: visible ? "auto" : "none",
    opacity: 0,
    ...style,
  };

  return (
    <div ref={cardRef} style={combinedStyle} className="w-[280px] sm:w-[320px] text-left">
      <div
        className="rounded-2xl border p-5 relative overflow-hidden"
        style={{
          background: "rgba(5,5,5,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "rgba(140,198,63,0.35)",
          boxShadow: "0 0 40px rgba(140,198,63,0.18), 0 25px 50px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Top glow streak */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(140,198,63,0.6), transparent)" }}
        />

        <div className="flex items-center justify-between mb-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: "rgba(140,198,63,0.12)", border: "1px solid rgba(140,198,63,0.35)", color: "#8CC63F" }}
          >
            <Icon size={18} />
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <h3
          className="font-black text-white mb-1.5"
          style={{ fontFamily: "var(--font-sora), Sora, sans-serif", fontSize: "16px" }}
        >
          {service?.title}
        </h3>
        <p className="text-neutral-400 text-[13px] leading-relaxed mb-4">
          {service?.desc}
        </p>

        <CheckList
          items={service?.capabilities ?? []}
          itemClassName="text-neutral-300"
        />

        <Link
          href={`/${service?.slug}`}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold"
          style={{ color: "#8CC63F" }}
        >
          Learn more <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

// ─── Orbital SVG (Desktop) ─────────────────────────────────────────────────
interface OrbitalProps {
  activeId: string | null;
  onNodeHover: (id: string | null, nodeEl: SVGGElement | null) => void;
  orbitPaused: boolean;
  showLifecycle: boolean;
}

function OrbitalDiagram({ activeId, onNodeHover, orbitPaused, showLifecycle }: OrbitalProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const orbitGroupRef = useRef<SVGGElement>(null);
  const rotationRef = useRef({ angle: 0 });
  const animRef = useRef<number | undefined>(undefined);

  // Orbit params
  const CX = 400, CY = 400, ORBIT_R = 230, NODE_R = 52;

  useEffect(() => {
    let lastTime = 0;
    const speed = orbitPaused ? 0 : 0.012; // degrees per ms

    const animate = (timestamp: number) => {
      const delta = lastTime ? timestamp - lastTime : 0;
      lastTime = timestamp;
      if (!orbitPaused) {
        rotationRef.current.angle = (rotationRef.current.angle + speed * delta) % 360;
      }
      const g = orbitGroupRef.current;
      if (g) {
        g.setAttribute("transform", `rotate(${rotationRef.current.angle}, ${CX}, ${CY})`);
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [orbitPaused]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 800"
      className="w-full h-full"
      style={{ filter: "drop-shadow(0 0 60px rgba(140,198,63,0.08))" }}
    >
      <defs>
        {/* Center sphere gradient */}
        <radialGradient id="sphereGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#1a3a1a" />
          <stop offset="40%" stopColor="#0d1f0d" />
          <stop offset="100%" stopColor="#030803" />
        </radialGradient>
        <radialGradient id="sphereGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(140,198,63,0.25)" />
          <stop offset="100%" stopColor="rgba(140,198,63,0)" />
        </radialGradient>
        {/* Orbit ring gradient */}
        <linearGradient id="orbitRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(140,198,63,0.08)" />
          <stop offset="50%" stopColor="rgba(140,198,63,0.25)" />
          <stop offset="100%" stopColor="rgba(140,198,63,0.08)" />
        </linearGradient>
        {/* Node gradient */}
        <radialGradient id="nodeGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#1e3a1e" />
          <stop offset="100%" stopColor="#060f06" />
        </radialGradient>
        <radialGradient id="nodeGradHover" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#2a5a2a" />
          <stop offset="100%" stopColor="#0e1f0e" />
        </radialGradient>
        {/* Pulse animation */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Blueprint grid dots */}
      {Array.from({ length: 20 }, (_, row) =>
        Array.from({ length: 20 }, (_, col) => {
          const x = col * 42 + 5;
          const y = row * 42 + 5;
          const dist = Math.sqrt((x - CX) ** 2 + (y - CY) ** 2);
          const alpha = Math.max(0, 0.12 - (dist / 700) * 0.12);
          return (
            <circle key={`${row}-${col}`} cx={x} cy={y} r="1"
              fill={`rgba(140,198,63,${alpha.toFixed(2)})`} />
          );
        })
      )}

      {/* Outer ambient glow rings */}
      {[320, 290, 265].map((r, i) => (
        <circle key={i} cx={CX} cy={CY} r={r}
          fill="none"
          stroke={`rgba(140,198,63,${0.04 - i * 0.01})`}
          strokeWidth={i === 0 ? 1 : 0.5}
          strokeDasharray={i === 0 ? "4 8" : "2 6"}
        />
      ))}

      {/* Main Orbit Ring */}
      <circle cx={CX} cy={CY} r={ORBIT_R}
        fill="none"
        stroke="url(#orbitRingGrad)"
        strokeWidth="1.5"
        strokeDasharray="3 5"
      />

      {/* Connection lines from center to nodes (static, rotated with orbitGroup) */}
      <g ref={orbitGroupRef}>
        {SERVICES.map((svc) => {
          const pos = polarToCartesian(CX, CY, ORBIT_R, svc.angle);
          const isActive = activeId === svc.id;
          return (
            <g key={svc.id}>
              {/* Connection line */}
              <line
                x1={CX} y1={CY} x2={pos.x} y2={pos.y}
                stroke={isActive ? "rgba(140,198,63,0.55)" : "rgba(140,198,63,0.12)"}
                strokeWidth={isActive ? 1.5 : 1}
                strokeDasharray="4 6"
                style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
              />
              {/* Animated data pulse dot on the line */}
              {isActive && (
                <circle r="3" fill="#8CC63F" opacity="0.9" filter="url(#glow)">
                  <animateMotion
                    dur="1.5s"
                    repeatCount="indefinite"
                    path={`M${CX},${CY} L${pos.x},${pos.y}`}
                  />
                </circle>
              )}
            </g>
          );
        })}
      </g>

      {/* Static node wrappers (counter-rotate to keep labels upright) */}
      {SERVICES.map((svc) => {
        const isActive = activeId === svc.id;
        const Icon = svc.icon;

        return (
          <g
            key={svc.id}
            style={{ cursor: "pointer" }}
            onMouseEnter={(e) => onNodeHover(svc.id, e.currentTarget as unknown as SVGGElement)}
            onMouseLeave={() => onNodeHover(null, null)}
          >
            {/* This group moves with orbit, then counter-rotates for label */}
            <OrbitalNode
              svc={svc}
              cx={CX}
              cy={CY}
              orbitR={ORBIT_R}
              nodeR={NODE_R}
              isActive={isActive}
              rotationRef={rotationRef}
            />
          </g>
        );
      })}

      {/* Center Sphere */}
      <g
        style={{ cursor: "pointer" }}
        onMouseEnter={() => onNodeHover("center", null)}
        onMouseLeave={() => onNodeHover(null, null)}
      >
        {/* Glow halo */}
        <circle cx={CX} cy={CY} r={92} fill="url(#sphereGlow)" />
        {/* Pulse rings */}
        <circle cx={CX} cy={CY} r={75} fill="none" stroke="rgba(140,198,63,0.15)" strokeWidth="1">
          <animate attributeName="r" values="75;88;75" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0;0.15" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx={CX} cy={CY} r={75} fill="none" stroke="rgba(140,198,63,0.08)" strokeWidth="1">
          <animate attributeName="r" values="75;100;75" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.08;0;0.08" dur="4.5s" repeatCount="indefinite" />
        </circle>

        {/* Sphere body */}
        <circle cx={CX} cy={CY} r={70}
          fill="url(#sphereGrad)"
          stroke="rgba(140,198,63,0.4)"
          strokeWidth="1.5"
        />

        {/* Inner highlight */}
        <ellipse cx={CX - 18} cy={CY - 20} rx={22} ry={14}
          fill="rgba(140,198,63,0.06)"
          style={{ filter: "blur(4px)" }}
        />

        {/* Wireframe equator */}
        <ellipse cx={CX} cy={CY} rx={70} ry={20}
          fill="none"
          stroke="rgba(140,198,63,0.12)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <ellipse cx={CX} cy={CY} rx={20} ry={70}
          fill="none"
          stroke="rgba(140,198,63,0.08)"
          strokeWidth="0.8"
          strokeDasharray="3 6"
        />

        {/* Center label */}
        <text x={CX} y={CY - 10} textAnchor="middle"
          fill="#8CC63F" fontSize="11" fontWeight="700"
          letterSpacing="0.05em"
          style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
        >
          TexaWave
        </text>
        <text x={CX} y={CY + 6} textAnchor="middle"
          fill="rgba(140,198,63,0.7)" fontSize="8.5" fontWeight="500"
          letterSpacing="0.03em"
        >
          Product Engineering
        </text>
        <text x={CX} y={CY + 20} textAnchor="middle"
          fill="rgba(140,198,63,0.5)" fontSize="7.5" fontWeight="400"
          letterSpacing="0.03em"
        >
          Ecosystem
        </text>
      </g>

      {/* Lifecycle stages overlay (center hover) */}
      {showLifecycle && LIFECYCLE_STAGES.map((stage, i) => {
        const angle = (i / LIFECYCLE_STAGES.length) * 360 - 90;
        const r = 125;
        const pos = polarToCartesian(CX, CY, r, angle + 90);
        return (
          <g key={stage}>
            <circle cx={pos.x} cy={pos.y} r="22"
              fill="rgba(5,5,5,0.9)"
              stroke="rgba(140,198,63,0.5)"
              strokeWidth="1"
            >
              <animate
                attributeName="opacity"
                values="0;1"
                dur={`${0.1 + i * 0.12}s`}
                fill="freeze"
              />
            </circle>
            <text x={pos.x} y={pos.y + 4} textAnchor="middle"
              fill="#8CC63F" fontSize="7.5" fontWeight="600"
              letterSpacing="0.04em"
            >
              {stage}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Individual Orbital Node (animates counter-rotation for readability) ────
function OrbitalNode({
  svc, cx, cy, orbitR, nodeR, isActive, rotationRef,
}: {
  svc: (typeof SERVICES)[0];
  cx: number; cy: number; orbitR: number; nodeR: number;
  isActive: boolean;
  rotationRef: React.RefObject<{ angle: number }>;
}) {
  const groupRef = useRef<SVGGElement>(null);
  const animRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = () => {
      const g = groupRef.current;
      if (g && rotationRef.current) {
        const baseAngle = svc.angle;
        const currentRotation = rotationRef.current.angle;
        const totalAngle = baseAngle + currentRotation;
        const rad = ((totalAngle - 90) * Math.PI) / 180;
        const nx = cx + orbitR * Math.cos(rad);
        const ny = cy + orbitR * Math.sin(rad);
        g.setAttribute("transform", `translate(${nx}, ${ny}) rotate(${-currentRotation})`);
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [svc.angle, cx, cy, orbitR, rotationRef]);

  const Icon = svc.icon;

  return (
    <g ref={groupRef}>
      {/* Outer glow when active */}
      {isActive && (
        <circle r={nodeR + 14} fill="rgba(140,198,63,0.08)"
          stroke="rgba(140,198,63,0.2)" strokeWidth="1">
          <animate attributeName="r" values={`${nodeR + 14};${nodeR + 20};${nodeR + 14}`} dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Node circle */}
      <circle r={nodeR}
        fill={isActive ? "rgba(20,50,20,0.95)" : "rgba(10,18,10,0.9)"}
        stroke={isActive ? "rgba(140,198,63,0.75)" : "rgba(140,198,63,0.25)"}
        strokeWidth={isActive ? "1.8" : "1.2"}
        style={{ transition: "all 0.3s ease" }}
      />
      {/* Icon area */}
      <foreignObject x={-18} y={-22} width={36} height={36}>
        <div
          style={{
            width: 36, height: 36,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: isActive ? "#8CC63F" : "rgba(140,198,63,0.6)",
            transition: "color 0.3s",
          }}
        >
          <Icon size={20} />
        </div>
      </foreignObject>
      {/* Label */}
      <text y={nodeR + 16} textAnchor="middle"
        fill={isActive ? "#8CC63F" : "rgba(140,198,63,0.55)"}
        fontSize="10" fontWeight="700"
        letterSpacing="0.04em"
        style={{ fontFamily: "var(--font-sora), Sora, sans-serif", transition: "fill 0.3s" }}
      >
        {svc.shortTitle}
      </text>
    </g>
  );
}

// ─── Mobile Accordion Card ─────────────────────────────────────────────────
function MobileServiceCard({
  service,
  index,
  isLast,
}: {
  service: (typeof SERVICES)[0];
  index: number;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const Icon = service.icon;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(el, { height: 0, opacity: 0 }, {
        height: "auto", opacity: 1, duration: 0.4, ease: "power2.out",
      });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
    }
  }, [open]);

  return (
    <div className="mobile-service-card relative">
      {/* Timeline connector */}
      {!isLast && (
        <div
          className="absolute left-6 top-full z-0"
          style={{
            width: "2px",
            height: "28px",
            background: "linear-gradient(to bottom, rgba(140,198,63,0.6), rgba(140,198,63,0.15))",
          }}
        />
      )}

      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "rgba(10,18,10,0.8)",
          borderColor: open ? "rgba(140,198,63,0.45)" : "rgba(140,198,63,0.12)",
          boxShadow: open ? "0 0 30px rgba(140,198,63,0.12)" : "none",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
      >
        {/* Header button */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-4 p-5 text-left"
          aria-expanded={open}
        >
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: open ? "rgba(140,198,63,0.18)" : "rgba(140,198,63,0.08)",
              border: `1px solid ${open ? "rgba(140,198,63,0.5)" : "rgba(140,198,63,0.2)"}`,
              color: "#8CC63F",
              transition: "all 0.3s",
            }}
          >
            <Icon size={20} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "#8CC63F" }}
              >
                0{index + 1}
              </span>
            </div>
            <h3
              className="font-black text-white mt-0.5"
              style={{ fontFamily: "var(--font-sora), Sora, sans-serif", fontSize: "16px" }}
            >
              {service.title}
            </h3>
          </div>

          <ChevronDown
            size={18}
            className="shrink-0 transition-transform duration-300"
            style={{ color: "#8CC63F", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>

        {/* Expandable content */}
        <div ref={contentRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
          <div className="px-5 pb-5">
            <div className="w-full h-px mb-4" style={{ background: "rgba(140,198,63,0.15)" }} />
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">{service.desc}</p>
            <CheckList
              items={service.capabilities}
              className="mb-5"
              itemClassName="text-neutral-300"
            />
            <Link
              href={`/${service.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-bold"
              style={{ color: "#8CC63F" }}
            >
              Learn more <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────
export function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const orbitWrapRef = useRef<HTMLDivElement>(null);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [orbitPaused, setOrbitPaused] = useState(false);
  const [showLifecycle, setShowLifecycle] = useState(false);
  const [activeLeftService, setActiveLeftService] = useState<(typeof SERVICES)[0] | null>(null);
  const [activeRightService, setActiveRightService] = useState<(typeof SERVICES)[0] | null>(null);
  const [cardVisible, setCardVisible] = useState(false);

  // Mouse parallax on section
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    gsap.to(".orbital-parallax-layer", {
      x: x * 18,
      y: y * 12,
      duration: 0.8,
      ease: "power2.out",
    });
  }, []);

  // Node hover handler
  const handleNodeHover = useCallback(
    (id: string | null, _nodeEl: SVGGElement | null) => {
      if (id === "center") {
        setShowLifecycle(true);
        setOrbitPaused(true);
        setCardVisible(false);
        setActiveId("center");
        return;
      }
      if (!id) {
        setActiveId(null);
        setOrbitPaused(false);
        setShowLifecycle(false);
        setCardVisible(false);
        return;
      }

      setActiveId(id);
      setOrbitPaused(true);
      setShowLifecycle(false);

      const svc = SERVICES.find((s) => s.id === id);
      if (svc) {
        if (id === "software" || id === "electrical") {
          setActiveLeftService(svc);
        } else if (id === "mechanical" || id === "procurement") {
          setActiveRightService(svc);
        }
        setCardVisible(true);
      }
    },
    []
  );

  // GSAP scroll reveals
  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Header reveal
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 82%" },
      }
    );

    // Orbit diagram reveal
    gsap.fromTo(
      orbitWrapRef.current,
      { opacity: 0, scale: 0.88 },
      {
        opacity: 1, scale: 1, duration: 1.1, ease: "back.out(1.5)",
        scrollTrigger: { trigger: section, start: "top 78%" },
      }
    );

    // Mobile cards stagger
    gsap.fromTo(
      ".mobile-service-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: ".mobile-services-stack", start: "top 85%" },
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden"
      style={{
        background: "var(--bg-primary)",
        paddingBlock: "clamp(32px, 5vh, 64px)",
        minHeight: "100vh",
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Particle background */}
      <ParticleCanvas />

      {/* Blueprint grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(140,198,63,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(140,198,63,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          zIndex: 0,
        }}
      />

      {/* Radial center glow */}
      <div
        className="absolute pointer-events-none orbital-parallax-layer"
        style={{
          inset: 0,
          background: "radial-gradient(ellipse 60% 55% at 60% 55%, rgba(140,198,63,0.05) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)]" style={{ zIndex: 1 }}>
        {/* ── Section Header ── */}
        <div ref={headerRef} className="mb-12 lg:mb-16 text-center" style={{ opacity: 0 }}>
          <span
            className="inline-block text-[11px] font-black uppercase tracking-[0.22em] mb-4"
            style={{ color: "#8CC63F" }}
          >
            Engineering Services
          </span>
          <h2
            className="font-black text-white leading-tight"
            style={{
              fontFamily: "var(--font-sora), Sora, sans-serif",
              fontSize: "clamp(2rem, 3.5vw + 1rem, 3.25rem)",
              lineHeight: 1.1,
            }}
          >
            Your End-to-End <br />
            <span style={{ color: "#8CC63F" }}>Product Engineering Partner.</span>
          </h2>
          <p
            className="mt-5 mx-auto max-w-2xl text-neutral-400 leading-relaxed"
            style={{ fontSize: "clamp(15px, 1.2vw + 10px, 18px)" }}
          >
            From concept to production, TexaWave integrates software, electrical, mechanical,
            and procurement expertise to accelerate product development.
          </p>
        </div>

        {/* ── Desktop: Orbital Layout ── */}
        <div className="hidden lg:flex items-start gap-10 xl:gap-16">
          {/* Left legend */}
          <div className="relative flex flex-col gap-5 pt-16 w-[280px] xl:w-[320px] shrink-0 min-h-[480px]">
            {SERVICES.slice(0, 2).map((svc) => {
              const Icon = svc.icon;
              const isActive = activeId === svc.id;
              return (
                <div
                  key={svc.id}
                  className="flex items-center gap-3 cursor-pointer group"
                  onMouseEnter={() => handleNodeHover(svc.id, null)}
                  onMouseLeave={() => handleNodeHover(null, null)}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300"
                    style={{
                      background: isActive ? "rgba(140,198,63,0.2)" : "rgba(140,198,63,0.07)",
                      border: `1px solid ${isActive ? "rgba(140,198,63,0.6)" : "rgba(140,198,63,0.15)"}`,
                      color: "#8CC63F",
                    }}
                  >
                    <Icon size={15} />
                  </div>
                  <span
                    className="text-[13px] font-semibold transition-colors duration-300"
                    style={{ color: isActive ? "#8CC63F" : "rgba(255,255,255,0.45)" }}
                  >
                    {svc.shortTitle}
                  </span>
                </div>
              );
            })}

            {/* Capability card container - positioned absolutely under the legend buttons */}
            <div 
              className="absolute left-0 right-0 text-left" 
              style={{ top: "160px" }}
            >
              <CapabilityCard
                service={activeLeftService}
                visible={cardVisible && (activeId === "software" || activeId === "electrical")}
                onClose={() => {
                  setCardVisible(false);
                  setOrbitPaused(false);
                  setActiveId(null);
                }}
                style={{
                  position: "relative",
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* Center orbit diagram */}
          <div
            ref={orbitWrapRef}
            className="relative flex-1"
            style={{ maxWidth: 620, aspectRatio: "1", opacity: 0 }}
          >
            <OrbitalDiagram
              activeId={activeId}
              onNodeHover={handleNodeHover}
              orbitPaused={orbitPaused}
              showLifecycle={showLifecycle}
            />
          </div>

          {/* Right legend */}
          <div className="relative flex flex-col gap-5 pt-16 w-[280px] xl:w-[320px] shrink-0 items-end text-right min-h-[480px]">
            {SERVICES.slice(2, 4).map((svc) => {
              const Icon = svc.icon;
              const isActive = activeId === svc.id;
              return (
                <div
                  key={svc.id}
                  className="flex items-center gap-3 cursor-pointer group flex-row-reverse"
                  onMouseEnter={() => handleNodeHover(svc.id, null)}
                  onMouseLeave={() => handleNodeHover(null, null)}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300"
                    style={{
                      background: isActive ? "rgba(140,198,63,0.2)" : "rgba(140,198,63,0.07)",
                      border: `1px solid ${isActive ? "rgba(140,198,63,0.6)" : "rgba(140,198,63,0.15)"}`,
                      color: "#8CC63F",
                    }}
                  >
                    <Icon size={15} />
                  </div>
                  <span
                    className="text-[13px] font-semibold transition-colors duration-300"
                    style={{ color: isActive ? "#8CC63F" : "rgba(255,255,255,0.45)" }}
                  >
                    {svc.shortTitle}
                  </span>
                </div>
              );
            })}

            {/* Capability card container - positioned absolutely under the legend buttons */}
            <div 
              className="absolute left-0 right-0 text-left" 
              style={{ top: "160px" }}
            >
              <CapabilityCard
                service={activeRightService}
                visible={cardVisible && (activeId === "mechanical" || activeId === "procurement")}
                onClose={() => {
                  setCardVisible(false);
                  setOrbitPaused(false);
                  setActiveId(null);
                }}
                style={{
                  position: "relative",
                  width: "100%",
                }}
              />
            </div>
          </div>
        </div>

        {/* Hover hint — desktop only */}
        <p
          className="hidden lg:block text-center mt-6 text-[12px] font-medium tracking-widest uppercase"
          style={{ color: "rgba(140,198,63,0.3)" }}
        >
          Hover a node to explore capabilities · Hover center to see lifecycle
        </p>

        {/* ── Tablet intermediate: grid cards ── */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-5 mt-8">
          {SERVICES.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className="rounded-2xl border p-5 transition-all duration-300 cursor-pointer group"
                style={{
                  background: "rgba(10,18,10,0.8)",
                  borderColor: "rgba(140,198,63,0.15)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(140,198,63,0.5)";
                  el.style.boxShadow = "0 0 30px rgba(140,198,63,0.12)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(140,198,63,0.15)";
                  el.style.boxShadow = "none";
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: "rgba(140,198,63,0.1)",
                      border: "1px solid rgba(140,198,63,0.3)",
                      color: "#8CC63F",
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#8CC63F" }}>
                      0{idx + 1}
                    </span>
                    <h3
                      className="font-black text-white text-[15px]"
                      style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
                    >
                      {svc.title}
                    </h3>
                  </div>
                </div>
                <p className="text-neutral-400 text-[13px] leading-relaxed mb-3">{svc.desc}</p>
                <CheckList
                  items={svc.capabilities}
                  itemClassName="text-neutral-300"
                />
                <Link
                  href={`/${svc.slug}`}
                  className="inline-flex items-center gap-1.5 text-[12px] font-bold mt-3"
                  style={{ color: "#8CC63F" }}
                >
                  Learn more <ArrowRight size={12} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* ── Mobile: Accordion Journey ── */}
        <div className="md:hidden mobile-services-stack flex flex-col gap-7 mt-4">
          {/* Journey header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-1" style={{ background: "rgba(140,198,63,0.2)" }} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: "rgba(140,198,63,0.5)" }}>
              Engineering Journey
            </span>
            <div className="h-px flex-1" style={{ background: "rgba(140,198,63,0.2)" }} />
          </div>

          {SERVICES.map((svc, idx) => (
            <MobileServiceCard
              key={svc.id}
              service={svc}
              index={idx}
              isLast={idx === SERVICES.length - 1}
            />
          ))}

          {/* Mobile CTA */}
          <div className="text-center mt-2">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-bold text-sm"
              style={{ color: "#8CC63F" }}
            >
              View all services <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* ── Bottom CTA strip (desktop) ── */}
        <div className="hidden lg:flex items-center justify-center gap-6 mt-12">
          <div className="h-px w-24" style={{ background: "rgba(140,198,63,0.2)" }} />
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300"
            style={{
              background: "rgba(140,198,63,0.08)",
              border: "1px solid rgba(140,198,63,0.3)",
              color: "#8CC63F",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "rgba(140,198,63,0.18)";
              el.style.borderColor = "rgba(140,198,63,0.6)";
              el.style.boxShadow = "0 0 20px rgba(140,198,63,0.2)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "rgba(140,198,63,0.08)";
              el.style.borderColor = "rgba(140,198,63,0.3)";
              el.style.boxShadow = "none";
            }}
          >
            Explore all services <ArrowRight size={15} />
          </Link>
          <div className="h-px w-24" style={{ background: "rgba(140,198,63,0.2)" }} />
        </div>
      </div>
    </section>
  );
}
