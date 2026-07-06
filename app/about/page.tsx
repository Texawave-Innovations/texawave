"use client";

import { useEffect, useRef, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Rocket,
  Globe,
  Code2,
  Radio,
  Zap,
  Settings,
  Cloud,
  BrainCircuit,
  ArrowRight,
  Shield,
  CheckCircle2,
  Sparkles,
  Layers,
  Linkedin,
  Lightbulb,
  Target,
  Cpu,
  Eye,
  Users
} from "lucide-react";
import { PageChrome } from "@/components/PageChrome";

// ==========================================
// 1. HERO CANVAS ENGINEERING VISUALIZATION
// ==========================================
function EngineeringCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    // Dynamic resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener("resize", handleResize);

    // Mesh network nodes
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];
    const nodeCount = 35;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
      });
    }

    // Code particles
    const codeParticles: Array<{
      x: number;
      y: number;
      text: string;
      speed: number;
      opacity: number;
      fontSize: number;
    }> = [];
    const snippets = [
      "import { PageChrome } from '@/components/PageChrome';",
      "const nodes = new Float32Array(count * 3);",
      "gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);",
      "const float = Math.sin(time + index) * 15;",
      "sys.iot.connect({ protocol: 'mqtt' });",
      "pcb.layout.routeTraces({ clearance: 0.15 });",
      "thermal.analyze({ ambient: 25, power: 12.5 });",
      "model.predict({ input: rawTelemetry });",
      "transform: translateZ(0); will-change: transform;"
    ];
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
      codeParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        text: snippets[Math.floor(Math.random() * snippets.length)],
        speed: 0.2 + Math.random() * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        fontSize: Math.floor(Math.random() * 3) + 9,
      });
    }

    // Circuit Traces
    const traces: Array<{
      points: Array<{ x: number; y: number }>;
      currentIdx: number;
      progress: number;
      speed: number;
      color: string;
    }> = [];

    const createTrace = () => {
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      const points = [{ x: startX, y: startY }];
      let curX = startX;
      let curY = startY;

      // Create a path with 3-4 right-angle segments
      const segments = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < segments; i++) {
        const length = Math.random() * 80 + 30;
        const dir = Math.random() > 0.5 ? "H" : "V";
        if (dir === "H") {
          curX += Math.random() > 0.5 ? length : -length;
        } else {
          curY += Math.random() > 0.5 ? length : -length;
        }
        points.push({ x: curX, y: curY });
      }

      return {
        points,
        currentIdx: 0,
        progress: 0,
        speed: 0.02 + Math.random() * 0.03,
        color: Math.random() > 0.4 ? "rgba(140, 198, 63, 0.4)" : "rgba(63, 174, 73, 0.4)"
      };
    };

    for (let i = 0; i < 6; i++) {
      traces.push(createTrace());
    }

    // Rotating 3D Wireframe Cube
    const cubeCenter = { x: width * 0.5, y: height * 0.5 };
    const vertices = [
      { x: -100, y: -100, z: -100 },
      { x: 100, y: -100, z: -100 },
      { x: 100, y: 100, z: -100 },
      { x: -100, y: 100, z: -100 },
      { x: -100, y: -100, z: 100 },
      { x: 100, y: -100, z: 100 },
      { x: 100, y: 100, z: 100 },
      { x: -100, y: 100, z: 100 }
    ];
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Back face
      [4, 5], [5, 6], [6, 7], [7, 4], // Front face
      [0, 4], [1, 5], [2, 6], [3, 7]  // Connectors
    ];
    let angleX = 0.003;
    let angleY = 0.005;

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Mesh Nodes & Links
      ctx.strokeStyle = "rgba(140, 198, 63, 0.12)";
      ctx.lineWidth = 1;
      for (let i = 0; i < nodeCount; i++) {
        const n1 = nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;

        // Bounce
        if (n1.x < 0 || n1.x > width) n1.vx *= -1;
        if (n1.y < 0 || n1.y > height) n1.vy *= -1;

        ctx.fillStyle = "rgba(140, 198, 63, 0.25)";
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect close nodes
        for (let j = i + 1; j < nodeCount; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // 2. Draw Code Particles
      ctx.font = "italic monospace 10px";
      for (let i = 0; i < codeParticles.length; i++) {
        const cp = codeParticles[i];
        cp.y -= cp.speed;
        cp.opacity -= 0.001;

        if (cp.y < -20 || cp.opacity <= 0) {
          cp.y = height + 20;
          cp.x = Math.random() * width;
          cp.opacity = Math.random() * 0.5 + 0.15;
          cp.text = snippets[Math.floor(Math.random() * snippets.length)];
        }

        ctx.fillStyle = `rgba(140, 198, 63, ${cp.opacity})`;
        ctx.font = `${cp.fontSize}px monospace`;
        ctx.fillText(cp.text, cp.x, cp.y);
      }

      // 3. Draw 3D Rotating Cube
      cubeCenter.x = width * 0.5;
      cubeCenter.y = height * 0.5;

      // Rotate vertices
      const rotated = vertices.map((v) => {
        // Rotate around Y
        let x1 = v.x * Math.cos(angleY) - v.z * Math.sin(angleY);
        let z1 = v.x * Math.sin(angleY) + v.z * Math.cos(angleY);
        // Rotate around X
        let y2 = v.y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = v.y * Math.sin(angleX) + z1 * Math.cos(angleX);

        // Project
        const d = 500;
        const scaleFactor = d / (z2 + 350);
        return {
          x: x1 * scaleFactor + cubeCenter.x,
          y: y2 * scaleFactor + cubeCenter.y
        };
      });

      // Update angles
      angleX += 0.0015;
      angleY += 0.0025;

      // Draw cube lines
      ctx.strokeStyle = "rgba(140, 198, 63, 0.18)";
      ctx.lineWidth = 1.5;
      edges.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(rotated[start].x, rotated[start].y);
        ctx.lineTo(rotated[end].x, rotated[end].y);
        ctx.stroke();
      });

      // 4. Draw Circuit Traces
      traces.forEach((t, idx) => {
        ctx.strokeStyle = t.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        // Draw completed segments
        for (let i = 0; i < t.currentIdx; i++) {
          ctx.moveTo(t.points[i].x, t.points[i].y);
          ctx.lineTo(t.points[i + 1].x, t.points[i + 1].y);
        }

        // Draw active segment
        const pStart = t.points[t.currentIdx];
        const pEnd = t.points[t.currentIdx + 1];
        if (pStart && pEnd) {
          const dx = pEnd.x - pStart.x;
          const dy = pEnd.y - pStart.y;
          const nextX = pStart.x + dx * t.progress;
          const nextY = pStart.y + dy * t.progress;

          ctx.moveTo(pStart.x, pStart.y);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();

          // Draw a glowing head at the trace tip
          ctx.fillStyle = "rgba(140, 198, 63, 0.9)";
          ctx.beginPath();
          ctx.arc(nextX, nextY, 2.5, 0, Math.PI * 2);
          ctx.fill();

          t.progress += t.speed;
          if (t.progress >= 1) {
            t.progress = 0;
            t.currentIdx++;
            if (t.currentIdx >= t.points.length - 1) {
              traces[idx] = createTrace();
            }
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-65 pointer-events-none" />;
}

// ==========================================
// 2. MISSION & VISION CARD & 3D TILT
// ==========================================
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hasTilt?: boolean;
}

function GlassCard({ children, className = "", hasTilt = false }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const angleX = (yc - y) / 18;
    const angleY = (x - xc) / 18;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!hasTilt || !cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform: "translateZ(0)",
        willChange: "transform",
        backfaceVisibility: "hidden"
      }}
      className={`relative overflow-hidden rounded-2xl border border-[#E5E7EB] dark:border-neutral-800 bg-white/80 dark:bg-[#060606]/40 p-8 backdrop-blur-xl transition-all duration-500 hover:border-[#8CC63F]/80 hover:shadow-[0_0_40px_rgba(140,198,63,0.12)] shadow-sm dark:shadow-none ${className}`}
    >
      {children}
    </div>
  );
}


interface TeamMember {
  id: string;
  name: string;
  department: string;
  role: string;
  description: string;
  skills: string[];
  experience: string;
  linkedinUrl: string;
  profileImage: string;
  displayOrder: number;
}

const DEPT_MAP: Record<string, { icon: string; label: string }> = {
  "Software Engineering": { icon: "💻", label: "Software" },
  "Electrical Engineering": { icon: "⚡", label: "Electrical" },
  "Mechanical Engineering": { icon: "⚙️", label: "Mechanical" },
  "Procurement": { icon: "📦", label: "Procurement" },
  "IoT Engineering": { icon: "📡", label: "IoT" },
  "Product Design": { icon: "🎨", label: "Design" }
};

function TeamCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener("resize", handleResize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
    }> = [];

    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.35 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Cyber green dots grid
      ctx.fillStyle = "rgba(0, 89, 0, 0.03)";
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          ctx.fillRect(x, y, 1, 1);
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = `rgba(140, 198, 63, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" />;
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const angleX = (yc - y) / 14;
    const angleY = (x - xc) / 14;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    setIsHovered(false);
  };

  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const deptInfo = DEPT_MAP[member.department] || { icon: "⚙️", label: "Engineering" };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform: "translateZ(0)",
        willChange: "transform",
        backfaceVisibility: "hidden"
      }}
      className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] dark:border-neutral-900 bg-white dark:bg-neutral-950 p-5 transition-all duration-500 hover:border-[#8CC63F]/40 group shadow-sm dark:shadow-lg"
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(180px circle at ${coords.x}px ${coords.y}px, rgba(140, 198, 63, 0.12), transparent 80%)`
          }}
        />
      )}

      <div className="absolute top-0 right-0 w-24 h-24 bg-[#005900]/10 rounded-bl-full blur-xl group-hover:bg-[#005900]/20 transition-all duration-500" />

      <div className="relative">
        {member.profileImage ? (
          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-neutral-900">
            <Image
              src={member.profileImage}
              alt={member.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-105 transform translate-z-0 will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-[8px] font-mono text-neutral-400">
              <span>SYS // NOMINAL</span>
              <span>EXP // {member.experience}</span>
            </div>
          </div>
        ) : (
          <div className="team-initials-box relative w-full aspect-[4/5] rounded-xl bg-gradient-to-br from-[#060A08] via-[#0D1612] to-[#040605] border border-neutral-900 flex flex-col justify-between p-4 overflow-hidden group-hover:border-[#8CC63F]/20 transition-colors duration-500">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(140,198,63,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(140,198,63,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
            <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,89,0,0.05)_0%,transparent_50%)] animate-pulse" />

            <div className="relative font-mono text-[8px] text-neutral-600 tracking-wider flex justify-between select-none">
              <span>SYSTEM // ENG_DIR</span>
              <span>{member.id}</span>
            </div>

            <div className="relative text-center self-center flex items-center justify-center">
              <span className="team-initials-text text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-[#8CC63F] drop-shadow-[0_0_12px_rgba(140,198,63,0.25)] tracking-tighter">
                {initials}
              </span>
            </div>

            <div className="relative font-mono text-[8px] text-neutral-600 tracking-widest uppercase flex justify-between select-none">
              <span>DEP // {deptInfo.label}</span>
              <span>EXP // {member.experience}</span>
            </div>
          </div>
        )}

        <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider rounded bg-black/75 text-[#8CC63F] border border-[#8CC63F]/30 backdrop-blur-md">
          {member.experience}
        </div>
      </div>

      <div className="mt-4 text-left">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display font-bold text-base text-[#010101] dark:text-white group-hover:text-[#8CC63F] transition-colors duration-300 truncate">
            {member.name}
          </h3>
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#9CA3AF] dark:text-neutral-500 hover:text-[#8CC63F] dark:hover:text-white transition-colors duration-300 relative z-20"
              title={`${member.name} LinkedIn Profile`}
            >
              <Linkedin size={14} />
            </a>
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono text-neutral-500 select-none">
          <span>{deptInfo.icon}</span>
          <span className="truncate">{member.department}</span>
        </div>

        <div className="text-xs font-semibold text-[#8CC63F]/90 mt-1">
          {member.role}
        </div>

        <p className="text-[11px] text-[#4B5563] dark:text-neutral-400 mt-2.5 leading-relaxed line-clamp-3">
          {member.description}
        </p>

        <div className="flex flex-wrap gap-1 mt-4">
          {member.skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-[9px] font-mono rounded bg-[#005900]/15 text-[#8CC63F] border border-[#005900]/30 transition-all duration-300 hover:bg-[#8CC63F]/10"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. MAIN ABOUT PAGE
// ==========================================
export default function AboutPage() {
  const [hoveredOrbitIdx, setHoveredOrbitIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLAnchorElement>(null);

  const principles = [
    {
      title: "Innovation",
      description: "We continuously explore new technologies, methodologies, and ideas to create future-ready solutions.",
      icon: Lightbulb,
    },
    {
      title: "Ownership",
      description: "We take complete responsibility for every project, decision, and outcome we deliver.",
      icon: Target,
    },
    {
      title: "Engineering Excellence",
      description: "We maintain the highest standards of technical quality, performance, and reliability.",
      icon: Cpu,
    },
    {
      title: "Transparency",
      description: "We build trust through clear communication, honest feedback, and complete visibility.",
      icon: Eye,
    },
    {
      title: "Collaboration",
      description: "We believe exceptional products are built when multidisciplinary teams work together seamlessly.",
      icon: Users,
    },
  ];

  // Team Section States
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);

  // Fetch Team Members from Firebase RTDB in real-time
  useEffect(() => {
    const teamRef = ref(db, "team");
    const unsubscribe = onValue(teamRef, (snapshot) => {
      setTeamLoading(true);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedTeam = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name || "",
          department: data[key].department || "",
          role: data[key].designation || "",
          description: data[key].description || "",
          skills: data[key].skills || [],
          experience: data[key].experience || "",
          linkedinUrl: data[key].linkedin || "",
          profileImage: data[key].imageUrl || "",
          displayOrder: data[key].order || 0,
          active: data[key].active !== undefined ? data[key].active : true
        }));

        // Filter out inactive (hidden) members and sort by displayOrder
        const activeMembers = loadedTeam
          .filter(member => member.active !== false)
          .sort((a, b) => a.displayOrder - b.displayOrder);
          
        setTeamMembers(activeMembers);
      } else {
        setTeamMembers([]);
      }
      setTeamLoading(false);
    }, (err) => {
      console.error("Failed to load team data from Firebase:", err);
      setTeamLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredMembers = teamMembers;

  // GSAP Entrance Animations & Magnetic Button Effect
  useEffect(() => {
    let ctx: any;
    let cleanupMagnetic: (() => void) | undefined;

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger")
    ]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Reveal text
        gsap.fromTo(
          ".reveal-hero-text",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".hero-section",
              start: "top 80%"
            }
          }
        );

        // Staggered cards reveal
        gsap.fromTo(
          ".reveal-mission-cards > div",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".mission-section",
              start: "top 75%"
            }
          }
        );

        // Staggered core principles cards reveal
        gsap.fromTo(
          ".reveal-principles-cards > div",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".principles-section",
              start: "top 75%"
            }
          }
        );
      }, containerRef);

      // CTA Magnetic Button Effect
      const btn = ctaButtonRef.current;
      if (btn) {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, {
            x: x * 0.38,
            y: y * 0.38,
            duration: 0.3,
            ease: "power2.out"
          });
        };

        const handleMouseLeave = () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)"
          });
        };

        btn.addEventListener("mousemove", handleMouseMove);
        btn.addEventListener("mouseleave", handleMouseLeave);

        cleanupMagnetic = () => {
          btn.removeEventListener("mousemove", handleMouseMove);
          btn.removeEventListener("mouseleave", handleMouseLeave);
        };
      }
    }).catch(err => console.error("Error loading GSAP in AboutPage:", err));

    return () => {
      if (ctx) ctx.revert();
      if (cleanupMagnetic) cleanupMagnetic();
    };
  }, []);

  // Orbiting Domains Data
  const domains = [
    {
      title: "Software Engineering",
      icon: Code2,
      color: "from-blue-500/20 to-[#1E3A0E]/20",
      details: ["Architecture Design", "Web Applications", "Mobile Applications", "Enterprise Software", "High-performance Systems"]
    },
    {
      title: "IoT & Connected Systems",
      icon: Radio,
      color: "from-purple-500/20 to-[#1E3A0E]/20",
      details: ["Smart Device Connectivity", "Edge Computing", "Real-time Data Systems", "Sensor Networks", "Industrial IoT"]
    },
    {
      title: "Electrical Engineering",
      icon: Zap,
      color: "from-yellow-500/20 to-[#1E3A0E]/20",
      details: ["Circuit Design", "PCB Development", "Power Electronics", "Embedded Systems", "Energy Optimization"]
    },
    {
      title: "Mechanical Engineering",
      icon: Settings,
      color: "from-orange-500/20 to-[#1E3A0E]/20",
      details: ["Product Design", "Structural Analysis", "Thermal Engineering", "Manufacturing Design", "Industrial Components"]
    },
    {
      title: "Cloud & Infrastructure",
      icon: Cloud,
      color: "from-cyan-500/20 to-[#1E3A0E]/20",
      details: ["Cloud Architecture", "DevOps", "CI/CD", "Infrastructure Automation", "Scalability Optimization"]
    },
    {
      title: "Data & AI Integration",
      icon: BrainCircuit,
      color: "from-emerald-500/20 to-[#1E3A0E]/20",
      details: ["Artificial Intelligence", "Machine Learning", "Predictive Analytics", "Industrial Intelligence", "Business Automation"]
    }
  ];

  // Orbiting layout floating coords (slow loop)
  const [orbitOffsets, setOrbitOffsets] = useState(domains.map(() => ({ x: 0, y: 0 })));
  useEffect(() => {
    let animationFrameId: number;
    let start = Date.now();

    const loop = () => {
      const elapsed = (Date.now() - start) * 0.001;
      setOrbitOffsets(
        domains.map((_, i) => {
          // If hovered, hold float still
          if (hoveredOrbitIdx === i) return { x: 0, y: 0 };
          const angle = (i * Math.PI) / 3;
          const driftX = Math.sin(elapsed + i * 1.5) * 8;
          const driftY = Math.cos(elapsed * 1.2 + i * 2.1) * 8;
          return { x: driftX, y: driftY };
        })
      );
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [hoveredOrbitIdx]);

  return (
    <PageChrome>
      {/* Set theme layout matching homepage */}
      <div
        ref={containerRef}
        style={{ contentVisibility: "auto" }}
        className="about-us-page bg-[#F8F9FB] dark:bg-[#0F1115] text-[#010101] dark:text-[#EEEEEE] font-sans antialiased overflow-hidden min-h-screen relative z-10"
      >
        {/* Subtle Cyber Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.025)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        {/* Dynamic Glow Orbs matching homepage */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#8CC63F]/8 dark:bg-[#8CC63F]/12 blur-[130px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#14B8A6]/3 dark:bg-[#14B8A6]/4 blur-[150px] pointer-events-none" />

        {/* ==========================================
            SECTION 1 — HERO INTRODUCTION
            ========================================== */}
        <section className="hero-section relative min-h-[calc(100vh-110px)] flex items-center py-20 px-[clamp(1rem,4vw,4rem)] max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 z-20 flex flex-col justify-center">
            <span className="reveal-hero-text text-[12px] font-black uppercase tracking-[0.25em] text-[#8CC63F] inline-block mb-4">
              About Texawave
            </span>
            <h1 className="reveal-hero-text font-display font-bold text-hero leading-[1.05] tracking-tight text-[#010101] dark:text-white mb-6">
              Shaping the Future <br />
              Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#010101] dark:from-white via-[#8CC63F] to-[#14B8A6]">Engineering</span> <br />
              Excellence
            </h1>
            <p className="reveal-hero-text text-body-large text-[#4B5563] dark:text-[#CCCCCC] leading-relaxed max-w-xl">
              TexaWave was founded with a simple belief: Great products are built when engineering disciplines work together. Businesses often struggle with multiple vendors for software, electronics, mechanical design, procurement, and manufacturing.


TexaWave brings these disciplines together

under one roof, helping organizations

transform ideas into market-ready products.
            </p>
          </div>

          <div className="lg:col-span-6 relative w-full h-[350px] sm:h-[450px] lg:h-[550px] flex items-center justify-center border border-[#E5E7EB] dark:border-neutral-900 rounded-3xl bg-white/60 dark:bg-neutral-950/20 backdrop-blur-sm overflow-hidden group shadow-md dark:shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
            {/* Absolute overlay visual details */}
            <div className="absolute top-4 left-4 font-mono text-[9px] text-neutral-600 tracking-wider uppercase select-none">
              Texawave Engine // Vis_Active
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-[9px] text-neutral-600 select-none">
              [SYSTEM_STATUS: NOMINAL]
            </div>
            {/* Engineering Canvas rendering */}
            <EngineeringCanvas />
          </div>
        </section>

        {/* ==========================================
            SECTION 2 — MISSION & VISION
            ========================================== */}
        <section className="mission-section py-24 px-[clamp(1rem,4vw,4rem)] max-w-[1400px] mx-auto border-t border-[#E5E7EB] dark:border-neutral-900/50">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-bold text-section text-[#010101] dark:text-white mb-4">Mission & Vision</h2>
          </div>
          <div className="reveal-mission-cards grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission Card */}
            <GlassCard hasTilt={true} className="flex flex-col h-full justify-between group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#1E3A0E]/15 rounded-bl-full blur-xl group-hover:bg-[#8CC63F]/10 transition-all duration-500" />
              <div>
                <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F1F5F9] dark:bg-neutral-900 border border-[#E5E7EB] dark:border-neutral-800 text-[#374151] dark:text-white mb-8 group-hover:border-[#8CC63F] group-hover:text-[#8CC63F] transition-colors duration-500 shadow-md">
                  <Rocket size={24} className="group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
                <h3 className="font-display font-bold text-card text-[#010101] dark:text-white mb-4">Our Mission</h3>
                <p className="text-[#4B5563] dark:text-[#EEEEEE] text-[15px] leading-relaxed">
                  To engineer high-performance, scalable technology solutions that drive measurable business impact. We build software and systems that don&apos;t just solve today&apos;s problems but unlock tomorrow&apos;s opportunities.
                </p>
              </div>
            </GlassCard>

            {/* Vision Card */}
            <GlassCard hasTilt={false} className="flex flex-col h-full justify-between group relative">
              {/* Laser border running path */}
              <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <rect
                    x="1"
                    y="1"
                    width="calc(100% - 2px)"
                    height="calc(100% - 2px)"
                    rx="15"
                    fill="none"
                    stroke="#8CC63F"
                    strokeWidth="1.5"
                    strokeDasharray="160 500"
                    className="animate-[marquee_6s_linear_infinite]"
                  />
                </svg>
              </div>
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#1E3A0E]/15 rounded-bl-full blur-xl group-hover:bg-[#8CC63F]/10 transition-all duration-500" />
              <div>
                <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F1F5F9] dark:bg-neutral-900 border border-[#E5E7EB] dark:border-neutral-800 text-[#374151] dark:text-white mb-8 group-hover:border-[#8CC63F] group-hover:text-[#8CC63F] transition-colors duration-500 shadow-md">
                  <Globe size={24} className="group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <h3 className="font-display font-bold text-card text-[#010101] dark:text-white mb-4">Our Vision</h3>
                <p className="text-[#4B5563] dark:text-[#EEEEEE] text-[15px] leading-relaxed">
                  To be the global benchmark for technical innovation and a trusted partner for enterprises looking to redefine their industries through cutting-edge engineering.
                </p>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* ==========================================
            SECTION 2.5 — CORE PRINCIPLES
            ========================================== */}
        <section className="principles-section relative py-24 px-[clamp(1rem,4vw,4rem)] max-w-[1400px] mx-auto border-t border-[#E5E7EB] dark:border-neutral-900/50 overflow-hidden">
          {/* Subtle engineering-style background pattern */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-50">
            <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="principles-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="rgba(140, 198, 63, 0.15)" />
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(140, 198, 63, 0.04)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#principles-grid)" />
            </svg>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#F8F9FB_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_30%,#0F1115_100%)] pointer-events-none" />
          </div>

          <div className="relative z-10">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#8CC63F] inline-block mb-3">
                Values
              </span>
              <h2 className="font-display font-bold text-section text-[#010101] dark:text-white mb-4 uppercase">
                CORE PRINCIPLES
              </h2>
              <p className="text-[#4B5563] dark:text-[#AAAAAA] text-sm md:text-base leading-relaxed">
                The values that define how we engineer, collaborate, and deliver excellence.
              </p>
            </div>

            {/* Principles Cards Grid */}
            <div className="reveal-principles-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {principles.map((principle, index) => {
                const Icon = principle.icon;
                return (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-[#060606]/40 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-[#8CC63F]/80 hover:shadow-[0_0_30px_rgba(140,198,63,0.15)] flex flex-col justify-between"
                  >
                    {/* Glowing effect inside the card */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#1E3A0E]/10 rounded-bl-full blur-xl group-hover:bg-[#8CC63F]/10 transition-all duration-500 pointer-events-none" />

                    <div>
                      {/* Icon container */}
                      <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 text-[#374151] dark:text-white mb-6 group-hover:border-[#8CC63F]/60 group-hover:text-[#8CC63F] transition-colors duration-500 shadow-sm">
                        <Icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-bold text-base text-[#010101] dark:text-white mb-2.5 group-hover:text-[#8CC63F] transition-colors duration-300">
                        {principle.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[#4B5563] dark:text-[#CCCCCC] text-[13px] leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 3 — ENGINEERING SERVICES
            ========================================== */}
        <section className="py-28 px-[clamp(1rem,4vw,4rem)] max-w-[1400px] mx-auto border-t border-[#E5E7EB] dark:border-neutral-900/50">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#8CC63F] inline-block mb-3">Ecosystem</span>
            <h2 className="font-display font-bold text-section text-[#010101] dark:text-white mb-4">Engineering Services</h2>
            <p className="text-[#4B5563] dark:text-[#AAAAAA]">A multi-disciplinary stack designed to build, scale, and secure complex hardware and software systems.</p>
          </div>

          {/* Desktop Orbit Component */}
          <div className="hidden lg:block relative w-full h-[700px] flex items-center justify-center select-none">
            {/* Connector Lines SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E3A0E" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#8CC63F" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#1E3A0E" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {domains.map((_, i) => {
                const angle = (i * Math.PI) / 3;
                const radiusX = 350;
                const radiusY = 240;
                const targetX = 500 + radiusX * Math.cos(angle);
                const targetY = 350 + radiusY * Math.sin(angle);
                const isHovered = hoveredOrbitIdx === i;

                return (
                  <g key={i}>
                    <line
                      x1="50%"
                      y1="50%"
                      x2={`${(targetX / 1000) * 100}%`}
                      y2={`${(targetY / 700) * 100}%`}
                      stroke={isHovered ? "url(#glowGrad)" : "rgba(140, 198, 63, 0.15)"}
                      strokeWidth={isHovered ? 2.5 : 1}
                      className="transition-all duration-300"
                    />
                    {isHovered && (
                      <circle
                        cx={`${(targetX / 1000) * 100}%`}
                        cy={`${(targetY / 700) * 100}%`}
                        r="5"
                        fill="#8CC63F"
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Central pulsator */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full z-10 flex flex-col items-center justify-center text-center">
              <div className={`absolute inset-0 bg-[#1E3A0E]/30 rounded-full blur-2xl transition-transform duration-500 ${hoveredOrbitIdx !== null ? "scale-125 bg-[var(--primary-green)]/15" : "scale-100"}`} />
              <div className="relative w-full h-full flex flex-col items-center justify-center border border-[#8CC63F]/30 rounded-full bg-black/90 backdrop-blur-md shadow-[0_0_30px_rgba(140,198,63,0.25)]">
                <div className="font-display font-black tracking-[0.25em] text-[10px] text-[#8CC63F] mb-1">TEXAWAVE</div>
                <div className="font-display font-black tracking-widest text-[13px] text-white">ENGINEERING</div>
                <div className="absolute inset-2 border border-dashed border-[#8CC63F]/20 rounded-full animate-[spin_40s_linear_infinite]" />
                <div className="absolute -inset-2 border border-dashed border-[#8CC63F]/15 rounded-full animate-[spin_60s_linear_infinite_reverse]" />
              </div>
            </div>

            {/* Orbit cards */}
            {domains.map((domain, i) => {
              const Icon = domain.icon;
              const angle = (i * Math.PI) / 3;
              const radiusX = 35;
              const radiusY = 32;
              const isHovered = hoveredOrbitIdx === i;

              // Left/Top percentage coords
              const leftPercent = 50 + radiusX * Math.cos(angle);
              const topPercent = 50 + radiusY * Math.sin(angle);

              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredOrbitIdx(i)}
                  onMouseLeave={() => setHoveredOrbitIdx(null)}
                  style={{
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    transform: `translate3d(calc(-50% + ${orbitOffsets[i].x}px), calc(-50% + ${orbitOffsets[i].y}px), 0)`,
                    willChange: "transform, opacity",
                    backfaceVisibility: "hidden"
                  }}
                  className={`orbit-card absolute z-20 w-[240px] rounded-xl border p-5 backdrop-blur-md transition-all duration-300 cursor-pointer ${
                    isHovered
                      ? "orbit-card-hovered border-[#8CC63F] bg-neutral-950 shadow-[0_0_30px_rgba(140,198,63,0.25)] scale-[1.05]"
                      : hoveredOrbitIdx !== null
                      ? "border-neutral-900 bg-neutral-950/20 opacity-35 scale-[0.96]"
                      : "border-neutral-800 bg-neutral-950/65"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg border transition-colors duration-300 ${isHovered ? "border-[#8CC63F]/40 bg-[#1E3A0E]/30 text-[#8CC63F]" : "border-neutral-800 bg-neutral-900 text-[#EEEEEE]"}`}>
                      <Icon size={18} />
                    </div>
                    <h4 className="font-display font-bold text-sm text-white">{domain.title}</h4>
                  </div>
                  
                  {/* Expanded lists on hover */}
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isHovered ? "max-h-[160px] opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
                    <ul className="space-y-1.5 border-t border-neutral-900 pt-3">
                      {domain.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-[11px] text-[#BBBBBB]">
                          <span className="w-1.5 h-1.5 bg-[#8CC63F] rounded-full shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Orbit Fallback Accordion */}
          <div className="lg:hidden space-y-4">
            {domains.map((domain, i) => {
              const Icon = domain.icon;
              const isHovered = hoveredOrbitIdx === i;
              return (
                <div
                  key={i}
                  onClick={() => setHoveredOrbitIdx(isHovered ? null : i)}
                  className={`orbit-card rounded-xl border p-5 bg-neutral-950/60 border-neutral-800 transition-all duration-300 ${isHovered ? "orbit-card-hovered border-[#8CC63F] shadow-[0_0_20px_rgba(140,198,63,0.15)]" : ""}`}
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg border ${isHovered ? "border-[#8CC63F] text-[#8CC63F] bg-[#1E3A0E]/20" : "border-neutral-800 text-neutral-400 bg-neutral-900"}`}>
                        <Icon size={20} />
                      </div>
                      <h4 className="font-display font-bold text-base text-white">{domain.title}</h4>
                    </div>
                    <span className={`text-xs text-[#8CC63F] font-mono transition-transform duration-300 ${isHovered ? "rotate-90" : ""}`}>
                      ❯
                    </span>
                  </div>
                  
                  <AnimatePresence initial={false}>
                    {isHovered && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-neutral-900">
                          {domain.details.map((detail, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-[#CCCCCC]">
                              <span className="w-1.5 h-1.5 bg-[#8CC63F] rounded-full shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==========================================
            SECTION: STATS & MEET THE MINDS
            ========================================== */}

        {/* Meet The Minds Section */}
        <section id="our-team" className="about-team-section relative bg-[#000000] py-28 px-[clamp(1rem,4vw,4rem)] border-b border-neutral-900 z-20 overflow-hidden">
          {/* Cyber Canvas Background specifically for Team section */}
          <TeamCanvas />
          
          {/* Subtle Glows */}
          <div className="absolute top-[10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-[#005900]/10 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#8CC63F]/5 blur-[90px] pointer-events-none" />

          <div className="max-w-[1400px] mx-auto relative z-10">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#8CC63F] inline-block mb-3">
                THE PEOPLE BEHIND TEXAWAVE
              </span>
              <h2 className="font-display font-bold text-section text-white mb-4">
                Meet the Minds
              </h2>
              <p className="text-[#AAAAAA] text-sm md:text-base leading-relaxed">
                Our multidisciplinary engineers, designers, and innovators collaborate to transform ideas into world-class products and digital experiences.
              </p>
            </div>


            {/* Team Grid */}
            {teamLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-[#AAAAAA]">
                <div className="h-8 w-8 border-2 border-[#8CC63F] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-xs font-bold uppercase tracking-wider font-mono">Assembling crew dashboard...</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/20">
                <p className="text-xs font-mono text-neutral-500">No team members active in this division.</p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredMembers.map((member) => (
                    <motion.div
                      layout
                      key={member.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    >
                      <TeamMemberCard member={member} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </section>


        {/* ==========================================
            SECTION 6 — FINAL CTA SECTION
            ========================================== */}
        <section className="relative py-32 px-[clamp(1rem,4vw,4rem)] border-t border-neutral-900/50 bg-[radial-gradient(ellipse_at_center,rgba(140,198,63,0.08)_0%,transparent_70%)] overflow-hidden">
          <div className="max-w-[1400px] mx-auto text-center relative z-20">
            <h2 className="font-display font-bold text-section text-[#010101] dark:text-white mb-6 leading-tight max-w-2xl mx-auto">
              One Partner. <span className="text-[#8CC63F]">Infinite</span>
              <br />
              <span className="text-[#8CC63F]">Innovation.</span>
            </h2>
            <p className="text-body-large text-[#4B5563] dark:text-[#CCCCCC] max-w-xl mx-auto mb-10 leading-relaxed">
              Whether you are looking to modernize legacy systems, build a groundbreaking new product, or scale your infrastructure, Texawave has the engineering services to get you there.
            </p>

            <a
              ref={ctaButtonRef}
              href="/contact"
              style={{
                willChange: "transform",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden"
              }}
              className="inline-flex items-center justify-center gap-2 rounded bg-[#8CC63F] px-8 py-5 font-bold text-black border border-transparent shadow-[0_0_15px_rgba(140,198,63,0.2)] hover:bg-[#a8eb90] hover:shadow-[0_0_25px_rgba(140,198,63,0.45)] transition-all duration-300"
            >
              Partner With Us Today <ArrowRight size={18} />
            </a>
          </div>
        </section>
      </div>
    </PageChrome>
  );
}
