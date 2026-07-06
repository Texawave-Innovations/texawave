"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<SVGGElement>(null);
  const ring2Ref = useRef<SVGGElement>(null);
  const ring3Ref = useRef<SVGGElement>(null);
  const [telemetry, setTelemetry] = useState({
    x: 102.45,
    y: 289.10,
    voltage: 3.31,
    temp: 36.4,
    freq: 2.45,
    status: "SYSTEMS NOMINAL",
  });

  // Dynamic telemetry updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        x: Number((100 + Math.random() * 5).toFixed(2)),
        y: Number((280 + Math.random() * 10).toFixed(2)),
        voltage: Number((3.28 + Math.random() * 0.05).toFixed(2)),
        temp: Number((35.0 + Math.random() * 3.0).toFixed(1)),
        freq: Number((2.40 + Math.random() * 0.1).toFixed(2)),
        status: Math.random() > 0.05 ? "SYSTEMS NOMINAL" : "SYNCING BUS...",
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Continuous GSAP rotations for concentric schematic rings
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ring1 = ring1Ref.current;
    const ring2 = ring2Ref.current;
    const ring3 = ring3Ref.current;

    const ctx = gsap.context(() => {
      if (ring1) {
        gsap.to(ring1, {
          rotate: 360,
          transformOrigin: "center center",
          duration: 25,
          ease: "none",
          repeat: -1,
        });
      }

      if (ring2) {
        gsap.to(ring2, {
          rotate: -360,
          transformOrigin: "center center",
          duration: 18,
          ease: "none",
          repeat: -1,
        });
      }

      if (ring3) {
        gsap.to(ring3, {
          rotate: 360,
          transformOrigin: "center center",
          duration: 35,
          ease: "none",
          repeat: -1,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // 3D Parallax Tilt Effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = containerRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / rect.height) * -15; // Max 15 degree tilt
    const rotateY = ((x - rect.width / 2) / rect.width) * 15;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      ease: "power2.out",
      duration: 0.6,
    });
  };

  const handleMouseLeave = () => {
    const card = containerRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      transformPerspective: 1000,
      ease: "power3.out",
      duration: 1.0,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-square max-w-[480px] border border-[#8CC63F]/15 bg-bg-primary/60 backdrop-blur-md rounded-2xl shadow-[0_0_50px_rgba(140,198,63,0.05)] flex justify-center items-center overflow-hidden p-4 select-none cursor-crosshair transition-all duration-500 hover:border-[#8CC63F]/35 hover:shadow-[0_0_60px_rgba(140,198,63,0.12)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-10 rounded-2xl pointer-events-none" />

      {/* Radial sweep light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(140,198,63,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* SVG Blueprint schematic */}
      <svg
        className="w-full h-full relative z-10"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Radar concentric circular guidelines */}
        <g ref={ring1Ref}>
          <circle cx="250" cy="250" r="180" stroke="rgba(140, 198, 63, 0.05)" strokeWidth="1" />
          <circle cx="250" cy="250" r="180" stroke="#8CC63F" strokeWidth="2" strokeDasharray="8 80" strokeOpacity="0.25" />
          <circle cx="250" cy="250" r="160" stroke="rgba(140, 198, 63, 0.03)" strokeWidth="1" strokeDasharray="4 4" />
        </g>

        <g ref={ring2Ref}>
          <circle cx="250" cy="250" r="140" stroke="rgba(140, 198, 63, 0.07)" strokeWidth="1" />
          <circle cx="250" cy="250" r="140" stroke="#8CC63F" strokeWidth="2.5" strokeDasharray="30 150" strokeOpacity="0.35" />
          <circle cx="250" cy="250" r="120" stroke="rgba(140, 198, 63, 0.03)" strokeWidth="1" />
        </g>

        <g ref={ring3Ref}>
          <circle cx="250" cy="250" r="210" stroke="rgba(140, 198, 63, 0.02)" strokeWidth="1" />
          <circle cx="250" cy="250" r="210" stroke="#8CC63F" strokeWidth="2" strokeDasharray="60 380 15 45" strokeOpacity="0.15" />
        </g>

        {/* Blueprint Axes lines */}
        <line x1="250" y1="35" x2="250" y2="465" stroke="rgba(140, 198, 63, 0.05)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="35" y1="250" x2="465" y2="250" stroke="rgba(140, 198, 63, 0.05)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Corner alignment bracket outlines */}
        <path d="M 35 45 L 35 35 L 45 35" stroke="rgba(140, 198, 63, 0.25)" strokeWidth="1.5" />
        <path d="M 465 45 L 465 35 L 455 35" stroke="rgba(140, 198, 63, 0.25)" strokeWidth="1.5" />
        <path d="M 35 455 L 35 465 L 45 465" stroke="rgba(140, 198, 63, 0.25)" strokeWidth="1.5" />
        <path d="M 465 455 L 465 465 L 455 465" stroke="rgba(140, 198, 63, 0.25)" strokeWidth="1.5" />

        {/* Technical circuit traces & nodes */}
        {/* Upper Left Trace */}
        <path d="M 250 250 L 180 180 L 100 180" stroke="#8CC63F" strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" />
        <circle cx="100" cy="180" r="3.5" fill="#8CC63F" fillOpacity="0.75" />
        <circle cx="100" cy="180" r="7" stroke="#8CC63F" strokeWidth="1" strokeOpacity="0.25" className="animate-pulse" />

        {/* Upper Right Trace */}
        <path d="M 250 250 L 320 180 L 400 180" stroke="#8CC63F" strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" />
        <circle cx="400" cy="180" r="3.5" fill="#8CC63F" fillOpacity="0.75" />
        <circle cx="400" cy="180" r="7" stroke="#8CC63F" strokeWidth="1" strokeOpacity="0.25" className="animate-pulse" />

        {/* Lower Left Trace */}
        <path d="M 250 250 L 180 320 L 110 320" stroke="#8CC63F" strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" />
        <circle cx="110" cy="320" r="3.5" fill="#8CC63F" fillOpacity="0.75" />
        <circle cx="110" cy="320" r="7" stroke="#8CC63F" strokeWidth="1" strokeOpacity="0.25" className="animate-pulse" />

        {/* Lower Right Trace */}
        <path d="M 250 250 L 320 320 L 390 320" stroke="#8CC63F" strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" />
        <circle cx="390" cy="320" r="3.5" fill="#8CC63F" fillOpacity="0.75" />
        <circle cx="390" cy="320" r="7" stroke="#8CC63F" strokeWidth="1" strokeOpacity="0.25" className="animate-pulse" />

        {/* Central Core Microprocessor element */}
        <g className="filter drop-shadow-[0_0_8px_rgba(140,198,63,0.2)]">
          <rect x="215" y="215" width="70" height="70" rx="5" stroke="#8CC63F" strokeWidth="2.5" fill="#090909" strokeOpacity="0.9" />
          <rect x="223" y="223" width="54" height="54" rx="2" stroke="#8CC63F" strokeWidth="1" strokeDasharray="2 2" fill="none" strokeOpacity="0.4" />
          
          {/* Pins surrounding the core */}
          {[0, 1, 2, 3].map((i) => {
            const offset = i * 14;
            return (
              <g key={i}>
                <line x1={224 + offset} y1="207" x2={224 + offset} y2="215" stroke="#8CC63F" strokeWidth="1.5" strokeOpacity="0.8" />
                <line x1={224 + offset} y1="285" x2={224 + offset} y2="293" stroke="#8CC63F" strokeWidth="1.5" strokeOpacity="0.8" />
                <line x1="207" y1={224 + offset} x2="215" y2={224 + offset} stroke="#8CC63F" strokeWidth="1.5" strokeOpacity="0.8" />
                <line x1="285" y1={224 + offset} x2="293" y2={224 + offset} stroke="#8CC63F" strokeWidth="1.5" strokeOpacity="0.8" />
              </g>
            );
          })}

          <circle cx="250" cy="250" r="9" stroke="#8CC63F" strokeWidth="1.5" fill="none" />
          <circle cx="250" cy="250" r="3" fill="#8CC63F" />
        </g>

        {/* Real-time Telemetry Data Reads */}
        <g id="telemetry-readouts" className="font-mono text-[9px] fill-[#8CC63F] opacity-75">
          {/* Left panel readings */}
          <text x="45" y="90" letterSpacing="0.5">STATE: {telemetry.status}</text>
          <text x="45" y="108" fillOpacity="0.7">VCC:   {telemetry.voltage} V</text>
          <text x="45" y="126" fillOpacity="0.7">TEMP:  {telemetry.temp} Â°C</text>
          <text x="45" y="144" fillOpacity="0.7">FREQ:  {telemetry.freq} GHz</text>

          {/* Right panel readings */}
          <text x="455" y="90" textAnchor="end" letterSpacing="0.5">DEV_REF: TXW-7200</text>
          <text x="455" y="108" textAnchor="end" fillOpacity="0.7">COORD: X{telemetry.x} / Y{telemetry.y}</text>
          <text x="455" y="126" textAnchor="end" fillOpacity="0.7">ANT_GAIN: +4.2 dBm</text>
          <text x="455" y="144" textAnchor="end" fillOpacity="0.7">POWER: NOMINAL</text>
        </g>

        {/* Mini telemetry graph lines (bottom layout) */}
        <path d="M 45 400 L 90 400 L 105 385 L 120 415 L 135 390 L 150 400 L 195 400" stroke="#8CC63F" strokeWidth="1" strokeOpacity="0.35" strokeLinecap="round" />
        <path d="M 305 400 L 350 400 L 365 415 L 380 385 L 395 405 L 410 400 L 455 400" stroke="#8CC63F" strokeWidth="1" strokeOpacity="0.35" strokeLinecap="round" />
      </svg>

      {/* Floating specs panel at the bottom */}
      <div
        className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-[#070707]/90 border border-[#8CC63F]/20 rounded-lg px-3.5 py-2 backdrop-blur-md text-[9px] font-mono text-[#8CC63F]/80 pointer-events-none"
        style={{ transform: "translateZ(20px)" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F] animate-pulse" />
          <span>ENGINEERING NODE ACTIVE</span>
        </div>
        <div className="flex gap-3 text-[#8CC63F]/60">
          <span>REV: V3.2</span>
          <span>LOT: 0x6A9</span>
        </div>
      </div>
    </div>
  );
}
