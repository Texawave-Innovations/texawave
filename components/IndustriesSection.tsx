"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  HeartPulse,
  CircuitBoard,
  ScanEye,
  Workflow,
  Stethoscope,
  Lightbulb,
  Gauge,
  Navigation,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Industry Data ──────────────────────────────────────────── */
const INDUSTRIES = [
  {
    id: "digital-health",
    icon: HeartPulse,
    title: "Intelligent Health Systems",
    description:
      "Appointment scheduling platforms, patient tracking applications, healthcare mobile solutions, and remote monitoring systems.",
    accent: "#8CC63F",
    tags: ["Health Apps", "Remote Monitoring", "Patient Tracking"],
    bgTheme: "digitalhealth",
  },
  {
    id: "manufacturing",
    icon: CircuitBoard,
    title: "Manufacturing Digitalization",
    description:
      "Custom ERP systems, production monitoring, inventory management, workflow automation, and smart manufacturing solutions.",
    accent: "#8CC63F",
    tags: ["Custom ERP", "Production Monitoring", "Smart Factory"],
    bgTheme: "manufacturing",
  },
  {
    id: "ai",
    icon: ScanEye,
    title: "AI & Computer Vision",
    description:
      "AI-powered product identification, machine vision systems, edge AI devices, intelligent automation, and visual inspection solutions.",
    accent: "#8CC63F",
    tags: ["Machine Vision", "Edge AI", "Visual Inspection"],
    bgTheme: "ai",
  },
  {
    id: "robotics",
    icon: Workflow,
    title: "Robotics & Automation",
    description:
      "Robotic systems, motion control solutions, embedded electronics, and intelligent automation platforms for industrial and commercial applications.",
    accent: "#8CC63F",
    tags: ["Motion Control", "Embedded Systems", "Industrial Robotics"],
    bgTheme: "robotics",
  },
  {
    id: "medical",
    icon: Stethoscope,
    title: "Medical Devices & Healthcare",
    description:
      "Medical kiosks, healthcare electronics, patient monitoring systems, connected medical devices, and digital healthcare solutions.",
    accent: "#00D9FF",
    tags: ["Patient Monitoring", "Medical IoT", "Healthcare Kiosks"],
    bgTheme: "medical",
  },
  {
    id: "smart-home",
    icon: Lightbulb,
    title: "Smart Home Automation",
    description:
      "Smart switches, connected devices, home automation systems, and IoT-enabled products that enhance comfort, control, and energy efficiency.",
    accent: "#00D9FF",
    tags: ["Connected Devices", "IoT Automation", "Energy Efficiency"],
    bgTheme: "smarthome",
  },
  {
    id: "energy",
    icon: Gauge,
    title: "Energy & Fuel Management",
    description:
      "CNG control systems, fuel station electronics, energy monitoring platforms, and power management solutions.",
    accent: "#00D9FF",
    tags: ["CNG Systems", "Energy Monitoring", "Power Management"],
    bgTheme: "energy",
  },
  {
    id: "marine",
    icon: Navigation,
    title: "Marine & Asset Tracking",
    description:
      "IoT tracking devices, ruggedized enclosures, fleet monitoring systems, and asset tracking solutions designed for demanding environments.",
    accent: "#00D9FF",
    tags: ["IoT Tracking", "Fleet Management", "Ruggedized Design"],
    bgTheme: "marine",
  },
] as const;

type BgTheme = (typeof INDUSTRIES)[number]["bgTheme"];

/* ─── Canvas Background Renderer ─────────────────────────────── */
class BgRenderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  theme: BgTheme = "marine";
  targetTheme: BgTheme = "marine";
  transitionProgress = 1;
  particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    alpha: number;
    color: string;
    life: number;
    maxLife: number;
  }> = [];
  animFrame = 0;
  tick = 0;
  width = 0;
  height = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.resize();
  }

  resize() {
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;
    this.canvas.width = this.width * (window.devicePixelRatio || 1);
    this.canvas.height = this.height * (window.devicePixelRatio || 1);
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  setTheme(theme: BgTheme) {
    if (theme !== this.targetTheme) {
      this.targetTheme = theme;
      this.transitionProgress = 0;
      this.particles = [];
    }
  }

  spawnParticles(theme: BgTheme) {
    const colors: Record<BgTheme, string[]> = {
      marine: ["rgba(140,198,63,0.6)", "rgba(0,180,255,0.5)", "rgba(100,220,200,0.4)"],
      smarthome: ["rgba(0,217,255,0.6)", "rgba(140,198,63,0.4)", "rgba(80,180,255,0.5)"],
      robotics: ["rgba(140,198,63,0.7)", "rgba(200,200,200,0.3)", "rgba(100,255,180,0.4)"],
      medical: ["rgba(0,217,255,0.7)", "rgba(200,240,255,0.4)", "rgba(100,200,255,0.5)"],
      ai: ["rgba(140,198,63,0.6)", "rgba(180,100,255,0.3)", "rgba(100,255,200,0.4)"],
      energy: ["rgba(0,217,255,0.5)", "rgba(255,180,0,0.3)", "rgba(100,220,255,0.4)"],
      manufacturing: ["rgba(140,198,63,0.6)", "rgba(200,180,100,0.3)", "rgba(100,200,150,0.4)"],
      digitalhealth: ["rgba(0,217,255,0.6)", "rgba(140,198,63,0.4)", "rgba(180,100,255,0.3)"],
    };
    const palette = colors[theme];
    if (this.particles.length < 60) {
      for (let i = 0; i < 3; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.2 - Math.random() * 0.5,
          r: 1.5 + Math.random() * 3,
          alpha: 0.3 + Math.random() * 0.5,
          color: palette[Math.floor(Math.random() * palette.length)],
          life: 0,
          maxLife: 180 + Math.random() * 120,
        });
      }
    }
  }

  drawMarine(alpha: number) {
    const { ctx, width, height, tick } = this;
    for (let w = 0; w < 5; w++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0,180,255,${(0.03 + w * 0.01) * alpha})`;
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 4) {
        const y = height * (0.3 + w * 0.12) + Math.sin((x / 80) + tick * 0.012 + w) * (12 + w * 4);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    const points = [[0.2, 0.3], [0.5, 0.15], [0.8, 0.4], [0.65, 0.7], [0.35, 0.8]] as [number, number][];
    ctx.strokeStyle = `rgba(140,198,63,${0.12 * alpha})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    points.forEach(([x, y], i) => {
      const px = x * width; const py = y * height;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.setLineDash([]);
    points.forEach(([x, y], i) => {
      const px = x * width; const py = y * height;
      const pulse = Math.sin(tick * 0.04 + i * 1.2) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(px, py, 4 + pulse * 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(140,198,63,${(0.4 + pulse * 0.3) * alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(140,198,63,${0.7 * alpha})`;
      ctx.fill();
    });
  }

  drawSmartHome(alpha: number) {
    const { ctx, width, height, tick } = this;
    const centerX = width * 0.5; const centerY = height * 0.4;
    const devicePos = [[0.2, 0.6], [0.8, 0.3], [0.15, 0.3], [0.85, 0.7], [0.5, 0.8], [0.35, 0.2], [0.65, 0.15]];
    devicePos.forEach(([dx, dy], i) => {
      const px = dx * width; const py = dy * height;
      const t = tick * 0.02 + i;
      const signal = Math.sin(t) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY); ctx.lineTo(px, py);
      ctx.strokeStyle = `rgba(0,217,255,${(0.04 + signal * 0.06) * alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      for (let r = 1; r <= 3; r++) {
        ctx.beginPath();
        ctx.arc(px, py, r * 6 + signal * 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,217,255,${(0.08 - r * 0.02) * signal * alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,217,255,${0.6 * alpha})`;
      ctx.fill();
    });
    const hub = Math.sin(tick * 0.025) * 0.5 + 0.5;
    const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 60);
    grad.addColorStop(0, `rgba(140,198,63,${0.12 * hub * alpha})`);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
    ctx.fill();
  }

  drawRobotics(alpha: number) {
    const { ctx, width, height, tick } = this;
    const joints = [
      [0.5, 0.9], [0.5, 0.65], [0.4, 0.45], [0.55, 0.3], [0.5, 0.15]
    ] as [number, number][];
    const animated = joints.map(([x, y], i) => {
      const a = tick * 0.015 + i * 0.5;
      return [x * width + Math.sin(a) * (i * 6), y * height + Math.cos(a * 0.7) * (i * 3)] as [number, number];
    });
    ctx.strokeStyle = `rgba(140,198,63,${0.15 * alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    animated.forEach(([x, y], i) => { if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.stroke();
    animated.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(140,198,63,${0.4 * alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    for (let p = 0; p < 3; p++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(140,198,63,${0.05 * alpha})`;
      ctx.setLineDash([4, 12]);
      ctx.lineWidth = 1;
      const cx = (0.3 + p * 0.2) * width; const cy = (0.4 + p * 0.15) * height;
      ctx.ellipse(cx, cy, 40 + p * 20, 20 + p * 10, p * 0.3, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  drawMedical(alpha: number) {
    const { ctx, width, tick } = this;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(0,217,255,${0.2 * alpha})`;
    ctx.lineWidth = 1.5;
    let first = true;
    for (let x = 0; x < width; x += 3) {
      const t = (x / width) * Math.PI * 6 + tick * 0.03;
      let y = 0.5;
      const mod = ((x / width * 6) + tick * 0.03 / Math.PI) % 1;
      if (mod > 0.4 && mod < 0.45) y = -0.3;
      else if (mod > 0.45 && mod < 0.5) y = 0.4;
      else if (mod > 0.5 && mod < 0.52) y = -0.15;
      else y = Math.sin(t) * 0.04;
      const px = x; const py = (0.5 + y) * this.height;
      if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
    }
    ctx.stroke();
    const panels = [[0.1, 0.2, 0.2, 0.12], [0.75, 0.6, 0.18, 0.1], [0.6, 0.15, 0.15, 0.08]];
    panels.forEach(([x, y, w, h]) => {
      ctx.strokeStyle = `rgba(0,217,255,${0.08 * alpha})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x * this.width, y * this.height, w * this.width, h * this.height);
      const scanY = y * this.height + ((tick * 0.5) % (h * this.height));
      ctx.strokeStyle = `rgba(0,217,255,${0.12 * alpha})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x * this.width, scanY);
      ctx.lineTo((x + w) * this.width, scanY);
      ctx.stroke();
    });
  }

  drawAI(alpha: number) {
    const { ctx, width, height, tick } = this;
    const layers = [[0.1], [0.3, 0.5, 0.7], [0.5], [0.3, 0.5, 0.7], [0.9]];
    const xPos = [0.15, 0.35, 0.5, 0.65, 0.85];
    const nodeCoords: [number, number][] = [];
    layers.forEach((ys, li) => {
      ys.forEach((y) => {
        nodeCoords.push([xPos[li] * width, y * height]);
      });
    });
    if (nodeCoords.length > 0) {
      [[0, 1], [0, 2], [0, 3], [1, 4], [2, 4], [3, 4], [4, 5], [4, 6], [4, 7], [5, 8], [6, 8], [7, 8]].forEach(([a, b]) => {
        if (nodeCoords[a] && nodeCoords[b]) {
          const pulse = Math.sin(tick * 0.04 + a * 0.5) * 0.5 + 0.5;
          ctx.strokeStyle = `rgba(140,198,63,${(0.04 + pulse * 0.08) * alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodeCoords[a][0], nodeCoords[a][1]);
          ctx.lineTo(nodeCoords[b][0], nodeCoords[b][1]);
          ctx.stroke();
        }
      });
    }
    nodeCoords.forEach(([x, y], i) => {
      const pulse = Math.sin(tick * 0.05 + i * 0.7) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, 4 + pulse * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(140,198,63,${(0.3 + pulse * 0.4) * alpha})`;
      ctx.fill();
    });
    const scanH = 30 + Math.sin(tick * 0.02) * 10;
    const scanY = ((tick * 1.2) % (height + scanH)) - scanH;
    const grad = ctx.createLinearGradient(0, scanY, 0, scanY + scanH);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(0.5, `rgba(140,198,63,${0.06 * alpha})`);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(0, scanY, width, scanH);
  }

  drawEnergy(alpha: number) {
    const { ctx, width, height, tick } = this;
    const gridStep = 80;
    ctx.strokeStyle = `rgba(0,217,255,${0.04 * alpha})`;
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += gridStep) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += gridStep) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }
    for (let s = 0; s < 4; s++) {
      const startX = (s / 4) * width;
      const offset = (tick * 1.5 + s * 40) % (width + 100);
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0,217,255,${0.25 * alpha})`;
      ctx.lineWidth = 1.5;
      ctx.moveTo(startX + offset - 100, s % 2 === 0 ? height * 0.3 : height * 0.7);
      ctx.lineTo(startX + offset, s % 2 === 0 ? height * 0.3 : height * 0.7);
      ctx.stroke();
    }
    for (let xi = 1; xi < width / gridStep; xi++) {
      for (let yi = 1; yi < height / gridStep; yi++) {
        const pulse = Math.sin(tick * 0.04 + xi * 0.4 + yi * 0.6) * 0.5 + 0.5;
        if (pulse > 0.7) {
          ctx.beginPath();
          ctx.arc(xi * gridStep, yi * gridStep, 2 + pulse * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,217,255,${0.3 * alpha})`;
          ctx.fill();
        }
      }
    }
  }

  drawManufacturing(alpha: number) {
    const { ctx, width, height, tick } = this;
    const rows = 4; const cols = 6;
    const cellW = width / cols; const cellH = height / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellW; const y = r * cellH;
        ctx.strokeStyle = `rgba(140,198,63,${0.04 * alpha})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 10, y + 10, cellW - 20, cellH - 20);
      }
    }
    const flowY = [height * 0.25, height * 0.5, height * 0.75];
    flowY.forEach((fy, i) => {
      const offset = (tick * 1.2 + i * 60) % (width + 60);
      ctx.beginPath();
      ctx.strokeStyle = `rgba(140,198,63,${0.2 * alpha})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 12]);
      ctx.moveTo(0, fy);
      ctx.lineTo(width, fy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.fillStyle = `rgba(140,198,63,${0.5 * alpha})`;
      const ax = offset % width;
      ctx.moveTo(ax, fy);
      ctx.lineTo(ax - 8, fy - 5);
      ctx.lineTo(ax - 8, fy + 5);
      ctx.fill();
    });
  }

  drawDigitalHealth(alpha: number) {
    const { ctx, width, height, tick } = this;
    const apps = [[0.15, 0.2, 0.12, 0.22], [0.72, 0.1, 0.14, 0.25], [0.45, 0.6, 0.12, 0.2]];
    apps.forEach(([x, y, w, h], ai) => {
      const px = x * width; const py = y * height;
      const pw = w * width; const ph = h * height;
      ctx.strokeStyle = `rgba(0,217,255,${0.1 * alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(px, py, pw, ph, 6);
      ctx.stroke();
      for (let l = 0; l < 4; l++) {
        const ly = py + ph * 0.2 + l * ph * 0.17;
        const lw = pw * (0.4 + Math.random() * 0.4);
        ctx.strokeStyle = `rgba(0,217,255,${0.07 * alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(px + pw * 0.1, ly);
        ctx.lineTo(px + pw * 0.1 + lw, ly);
        ctx.stroke();
      }
      const burst = Math.sin(tick * 0.03 + ai * 1.5) * 0.5 + 0.5;
      if (burst > 0.6) {
        ctx.beginPath();
        ctx.arc(px + pw * 0.5, py + ph * 0.5, burst * 20, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(140,198,63,${0.1 * burst * alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
    ctx.strokeStyle = `rgba(0,217,255,${0.06 * alpha})`;
    ctx.setLineDash([4, 10]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(apps[0][0] * width + apps[0][2] * width, apps[0][1] * height + apps[0][3] * height * 0.5);
    ctx.lineTo(apps[1][0] * width, apps[1][1] * height + apps[1][3] * height * 0.5);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawTheme(theme: BgTheme, alpha: number) {
    switch (theme) {
      case "marine": this.drawMarine(alpha); break;
      case "smarthome": this.drawSmartHome(alpha); break;
      case "robotics": this.drawRobotics(alpha); break;
      case "medical": this.drawMedical(alpha); break;
      case "ai": this.drawAI(alpha); break;
      case "energy": this.drawEnergy(alpha); break;
      case "manufacturing": this.drawManufacturing(alpha); break;
      case "digitalhealth": this.drawDigitalHealth(alpha); break;
    }
  }

  render() {
    const { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);

    if (this.transitionProgress < 1) {
      this.transitionProgress = Math.min(1, this.transitionProgress + 0.025);
      this.drawTheme(this.theme, 1 - this.transitionProgress);
      this.drawTheme(this.targetTheme, this.transitionProgress);
      if (this.transitionProgress >= 1) this.theme = this.targetTheme;
    } else {
      this.drawTheme(this.theme, 1);
    }

    this.spawnParticles(this.targetTheme);
    this.particles = this.particles.filter((p) => p.life < p.maxLife);
    this.particles.forEach((p) => {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      const lifeRatio = p.life / p.maxLife;
      const a = lifeRatio < 0.2 ? lifeRatio / 0.2 : lifeRatio > 0.8 ? (1 - lifeRatio) / 0.2 : 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${p.alpha * a})`);
      ctx.fill();
    });

    this.tick++;
    this.animFrame = requestAnimationFrame(() => this.render());
  }

  start() { this.render(); }
  stop() { cancelAnimationFrame(this.animFrame); }
}

/* â”€â”€â”€ Industry Card Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function IndustryCard({
  industry,
  onHover,
}: {
  industry: (typeof INDUSTRIES)[number];
  index: number;
  onHover: (theme: BgTheme | null) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<SVGSVGElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;
    onHover(industry.bgTheme);
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, { scale: 1.04, y: -6, duration: 0.4, ease: "power3.out" });
    gsap.to(card.querySelector(".ind-glow"), { opacity: 1, duration: 0.35 });
    gsap.to(card.querySelector(".ind-icon"), { scale: 1.15, duration: 0.4, ease: "back.out(2)" });

    const border = borderRef.current;
    if (border) {
      const rect = border.querySelector("rect");
      if (rect) {
        const len = rect.getTotalLength?.() ?? 0;
        gsap.fromTo(rect, { strokeDashoffset: len, strokeDasharray: len }, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" });
        gsap.to(rect, { opacity: 1, duration: 0.2 });
      }
    }
  }, [industry.bgTheme, onHover]);

  const handleLeave = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;
    onHover(null);
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, { scale: 1, y: 0, duration: 0.5, ease: "power3.out" });
    gsap.to(card.querySelector(".ind-glow"), { opacity: 0, duration: 0.3 });
    gsap.to(card.querySelector(".ind-icon"), { scale: 1, duration: 0.35 });

    const border = borderRef.current;
    if (border) {
      const rect = border.querySelector("rect");
      if (rect) gsap.to(rect, { opacity: 0, duration: 0.2 });
    }
  }, [onHover]);

  useEffect(() => {
    if (!cardRef.current) return;
    const isMobileOrTablet = window.innerWidth < 1024;
    if (isMobileOrTablet) {
      gsap.set(cardRef.current, { opacity: 1, y: 0 });

    } else {
      gsap.set(cardRef.current, { opacity: 0, y: 30 });
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="ind-card group relative rounded-2xl border cursor-pointer overflow-hidden"
      style={{
        background: "var(--bg-card, #FFFFFF)",
        backdropFilter: "blur(16px) saturate(140%)",
        WebkitBackdropFilter: "blur(16px) saturate(140%)",
        borderColor: `${industry.accent}20`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
        willChange: "transform, opacity",
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* SVG animated border */}
      <svg
        ref={borderRef}
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{ borderRadius: "16px" }}
        aria-hidden="true"
      >
        <rect
          x="1" y="1"
          width="calc(100% - 2)" height="calc(100% - 2)"
          rx="15" ry="15"
          fill="none"
          stroke={industry.accent}
          strokeWidth="1.5"
          style={{ opacity: 0 }}
        />
      </svg>

      {/* Inner glow on hover */}
      <div
        className="ind-glow pointer-events-none absolute inset-0 rounded-2xl opacity-0"
        style={{ background: `radial-gradient(ellipse at 30% 20%, ${industry.accent}18 0%, transparent 70%)` }}
      />

      {/* Top accent bar */}
      <div
        className="absolute left-0 top-0 h-[2px] w-full rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${industry.accent}, transparent 70%)`, opacity: 0.5 }}
      />

      {/* Corner glow mark */}
      <div
        className="absolute bottom-4 right-4 h-4 w-4 opacity-20 group-hover:opacity-60 transition-opacity duration-300"
        style={{
          borderRight: `1.5px solid ${industry.accent}`,
          borderBottom: `1.5px solid ${industry.accent}`,
          borderRadius: "0 0 3px 0",
        }}
      />

      <div className="p-6">
        {/* Icon */}
        <div
          className="ind-icon mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl"
          style={{
            background: `${industry.accent}18`,
            border: `2px solid ${industry.accent}55`,
            boxShadow: `0 0 24px ${industry.accent}15`,
          }}
        >
          <industry.icon className="w-8 h-8" strokeWidth={1.5} style={{ color: industry.accent }} />
        </div>

        {/* Title */}
        <h3
          className="text-base font-bold text-[#010101] dark:text-white leading-snug mb-3"
          style={{ letterSpacing: "-0.01em" }}
        >
          {industry.title}
        </h3>

        {/* Description */}
        <p
          ref={descRef}
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-secondary, #4B5563)" }}
        >
          {industry.description}
        </p>

        {/* Tags */}
        <div ref={tagsRef} className="mt-4 flex flex-wrap gap-1.5">
          {industry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{
                background: `${industry.accent}12`,
                border: `1px solid ${industry.accent}30`,
                color: industry.accent,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* â”€â”€â”€ Main Section Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export function IndustriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<BgRenderer | null>(null);
  const mouseGlowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [hoveredTheme, setHoveredTheme] = useState<BgTheme | null>(null);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new BgRenderer(canvas);
    rendererRef.current = renderer;
    renderer.start();
    const onResize = () => renderer.resize();
    window.addEventListener("resize", onResize);
    return () => {
      renderer.stop();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Update canvas theme on hover
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer || !hoveredTheme) return;
    renderer.setTheme(hoveredTheme);
  }, [hoveredTheme]);

  // Mouse glow tracking
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const section = sectionRef.current;
    const glow = mouseGlowRef.current;
    if (!section || !glow) return;
    const rect = section.getBoundingClientRect();
    gsap.to(glow, { left: e.clientX - rect.left, top: e.clientY - rect.top, duration: 0.6, ease: "power2.out" });
  }, []);

  // GSAP scroll animations
  useGSAP(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const grid = gridRef.current;
    const cta = ctaRef.current;
    if (!section || !heading || !grid || !cta) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    if (reduceMotion) {
      gsap.set([heading, cta], { opacity: 1, y: 0 });
      gsap.set(grid.querySelectorAll(".ind-card"), { opacity: 1, y: 0 });
      return;
    }

    // Badge
    const badge = heading.querySelector<HTMLElement>(".ind-badge");
    if (badge) {
      gsap.fromTo(badge, { y: -12, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.6, ease: "back.out(2)",
        scrollTrigger: { trigger: badge, start: "top 88%" },
      });
      gsap.to(badge, { y: -4, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.8 });
    }

    // Heading word reveal
    const words = heading.querySelectorAll<HTMLElement>(".ind-word");
    gsap.fromTo(words, { y: 40, autoAlpha: 0 }, {
      y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.06, ease: "power3.out",
      scrollTrigger: { trigger: heading, start: "top 85%" },
    });

    // Subheading
    const sub = heading.querySelector<HTMLElement>(".ind-sub");
    if (sub) {
      gsap.fromTo(sub, { autoAlpha: 0, y: 15 }, {
        autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: sub, start: "top 88%" },
      });
    }

    // Cards stagger reveal
    const cards = grid.querySelectorAll<HTMLElement>(".ind-card");
    gsap.fromTo(cards, { autoAlpha: 0, y: 30 }, {
      autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07, ease: "power3.out",
      scrollTrigger: { trigger: grid, start: "top 82%" },
    });

    // CTA reveal
    gsap.fromTo(cta, { autoAlpha: 0, y: 30 }, {
      autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: cta, start: "top 88%" },
    });

    // Background grid slow pan (Disabled on Mobile for CPU saving)
    const bgGrid = section.querySelector<HTMLElement>(".ind-bg-grid");
    if (bgGrid && !isMobile) {
      gsap.to(bgGrid, { backgroundPosition: "60px 60px", duration: 20, repeat: -1, ease: "none" });
    }
  }, { scope: sectionRef });

  const handleCardHover = useCallback((theme: BgTheme | null) => {
    setHoveredTheme(theme);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="industries"
      aria-labelledby="industries-heading"
      className="relative overflow-hidden"
      style={{ background: "var(--bg-primary, #F8F9FB)" }}
      onMouseMove={handleMouseMove}
    >
      {/* Animated grid background */}
      <div
        className="ind-bg-grid pointer-events-none absolute inset-0 dark:opacity-[0.035] opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(140,198,63,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(140,198,63,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      {/* Canvas – theme morphing animations */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full dark:opacity-40 opacity-15"
        style={{ mixBlendMode: "multiply" }}
        aria-hidden="true"
      />

      {/* Ambient radial glows */}
      <div
        className="pointer-events-none absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #8CC63F 0%, transparent 65%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-15%] left-[-5%] w-[45vw] h-[45vw] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #00D9FF 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      {/* Mouse-following spotlight */}
      <div
        ref={mouseGlowRef}
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, rgba(140,198,63,1) 0%, transparent 70%)", left: "50%", top: "50%" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)] pt-4 pb-12 z-10">

        {/* â”€â”€ Section Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div ref={headingRef} className="mb-16 text-center">
          <div
            className="ind-badge mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]"
            style={{
              background: "rgba(140,198,63,0.07)",
              border: "1px solid rgba(140,198,63,0.35)",
              color: "#8CC63F",
              backdropFilter: "blur(10px)",
              boxShadow: "0 0 20px rgba(140,198,63,0.1)",
            }}
          >
            Industries We Serve
          </div>

          <h2
            id="industries-heading"
            className="overflow-hidden text-section text-[#010101] dark:text-white font-black tracking-tight"
          >
            <span className="block overflow-hidden">
              {["Next", "- Gen"].map((w, i) => (
                <span key={i} className="ind-word inline-block" style={{ marginRight: "0.3em" }}>{w}</span>
              ))}
            </span>
            <span className="block overflow-hidden">
              {["Industry", "Solutions"].map((w, i) => (
                <span
                  key={i}
                  className="ind-word inline-block"
                  style={{
                    marginRight: i === 0 ? "0.3em" : 0,
                    ...(i === 1 ? {
                      background: "linear-gradient(90deg, #8CC63F 0%, #00D9FF 60%, #8CC63F 120%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      backgroundSize: "200% 100%",
                      animation: "ind-shimmer 4s linear infinite",
                      filter: "drop-shadow(0 0 16px rgba(140,198,63,0.45))",
                    } : {}),
                  }}
                >
                  {w}
                </span>
              ))}
            </span>
          </h2>

          <p
            className="ind-sub mx-auto mt-6 max-w-2xl text-body-large"
            style={{ color: "var(--text-secondary, #4B5563)" }}
          >
            Transforming complex physical and digital ideas into scalable, market-ready realities across multiple domains.
          </p>
        </div>

        {/* â”€â”€ Industry Cards Grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div
          ref={gridRef}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {INDUSTRIES.map((industry, index) => (
            <IndustryCard
              key={industry.id}
              industry={industry}
              index={index}
              onHover={handleCardHover}
            />
          ))}
        </div>

        {/* â”€â”€ Bottom CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div ref={ctaRef} className="mt-20 relative overflow-hidden rounded-3xl text-center" style={{ opacity: 0 }}>
          <div
            className="relative overflow-hidden rounded-3xl border p-10 md:p-16"
            style={{
              background: "var(--bg-card, rgba(255,255,255,0.7))",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              borderColor: "rgba(140,198,63,0.25)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            {/* Top gradient line */}
            <div className="absolute left-0 top-0 w-full h-[1px]" style={{ background: "linear-gradient(90deg, transparent, #8CC63F, #00D9FF, transparent)" }} />

            {/* Radial glow */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full opacity-20 blur-[60px] pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(140,198,63,0.3) 0%, rgba(0,217,255,0.15) 50%, transparent 100%)" }}
            />

            <div className="relative z-10 mx-auto max-w-3xl flex flex-col items-center">
              <span
                className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em]"
                style={{ background: "rgba(140,198,63,0.08)", border: "1px solid rgba(140,198,63,0.25)", color: "#8CC63F" }}
              >
                Custom Engineering
              </span>

              <h3 className="text-section font-black tracking-tight text-[#010101] dark:text-white leading-tight">
                Let's Build Your Next <br />
                <span style={{ background: "linear-gradient(90deg, #8CC63F, #00D9FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Custom Solutions
                </span>
              </h3>

              <p className="mt-5 max-w-2xl text-body-large leading-relaxed" style={{ color: "var(--text-secondary, #4B5563)" }}>
                Partner with Texawave to turn industry challenges into market-ready products,
                leading with robust software and cloud platforms backed by embedded systems and electronics.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link
                  href="/contact"
                  className="cta-magnetic group inline-flex items-center justify-center gap-2 rounded-xl bg-[#8CC63F] px-8 py-4 font-bold text-black border border-transparent shadow-[0_0_20px_rgba(140,198,63,0.25)] transition-all duration-300 hover:bg-[#aff094] hover:shadow-[0_0_35px_rgba(140,198,63,0.5)]"
                >
                  Discuss Your Project
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] dark:border-white/15 bg-white dark:bg-white/[0.04] backdrop-blur-sm px-8 py-4 font-bold text-[#374151] dark:text-[#EEEEEE] transition-all duration-300 hover:border-[#8CC63F]/50 hover:text-[#010101] dark:hover:text-white"
                >
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes ind-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .ind-card { transition: box-shadow 0.4s ease; }
        .ind-card:hover {
          box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(140,198,63,0.08) !important;
        }
      `}</style>
    </section>
  );
}
