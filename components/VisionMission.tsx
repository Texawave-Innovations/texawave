"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Target, Rocket } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const MISSION_POINTS = [
  "Provide high-quality engineering, product development, and technology solutions that meet customer requirements and industry standards.",
  "Deliver innovative solutions in mechanical, electronics, embedded systems, software, ERP, and supply chain services with reliability and efficiency.",
  "Build long-term customer relationships through technical excellence, timely delivery, and continuous support.",
  "Continually improve processes, employee competency, and quality management systems in line with ISO 9001:2015 requirements.",
  "Create sustainable and value-driven solutions through innovation, teamwork, and operational excellence."
];

function BlueprintGrid() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="vm-grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="var(--primary-green-darker)" strokeWidth="0.8" />
        </pattern>
        <pattern id="vm-grid-sub" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M 12 0 L 0 0 0 12" fill="none" stroke="var(--primary-green-darker)" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#vm-grid-sub)" />
      <rect width="100%" height="100%" fill="url(#vm-grid)" />
    </svg>
  );
}

const RadarIcon = () => (
  <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-signal/10 border border-signal/30 text-signal shadow-[0_0_20px_rgba(140,198,63,0.15)] group-hover:scale-110 transition-transform duration-300 shrink-0">
    <Target size={24} className="relative z-10 text-signal animate-pulse" />
    <span className="absolute inset-0 rounded-2xl border border-signal/40 animate-ping opacity-25 scale-75" />
    <span className="absolute inset-0 rounded-2xl border border-signal/20 animate-ping opacity-10" style={{ animationDelay: "0.5s" }} />
  </div>
);

const RocketIcon = () => (
  <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-signal/10 border border-signal/30 text-signal shadow-[0_0_20px_rgba(140,198,63,0.15)] group-hover:scale-110 transition-transform duration-300 shrink-0 overflow-hidden">
    <Rocket size={24} className="relative z-10 text-signal group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300" />
    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-signal/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
  </div>
);

export function VisionMission() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      // Staggered fade-in for mission items
      gsap.fromTo(
        ".mission-item",
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".mission-list-container",
            start: "top 85%",
            toggleActions: "play none none none",
          }
        }
      );

      // Fade-in connection line on desktop
      gsap.fromTo(
        ".connection-trace",
        { strokeDashoffset: 48, opacity: 0 },
        {
          opacity: 1,
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".connection-line-container",
            start: "top 80%",
            toggleActions: "play none none none",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-bg-primary py-24 px-5 lg:px-8 border-b border-border-primary overflow-hidden"
    >
      <BlueprintGrid />
      
      {/* Decorative ambient beams */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--primary-green)]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-[var(--primary-green)]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl z-10">
        
        {/* Centered Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16" data-reveal>
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] bg-signal/10 border border-signal/25 text-signal mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
            OUR PURPOSE
          </div>
          <h2 className="text-section text-text-primary">
            Driving Innovation with Purpose
          </h2>
          <p className="mt-5 text-body-large text-text-secondary">
            TEXAWAVE bridges mechanical precision, intelligent electronics, custom firmware, and supply chain logistics to deliver state-of-the-art products built for the global market.
          </p>
        </div>

        {/* Responsive Grid with Cards */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch connection-line-container">
          
          {/* Vision Card */}
          <div className="relative h-full">
            <div className="relative group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02] backdrop-blur-md p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 hover:border-signal/50 hover:shadow-[0_20px_50px_rgba(140,198,63,0.15)] flex flex-col justify-between h-full">
              {/* Inner glow on hover */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(140,198,63,0.08)_0%,transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div>
                {/* Icon and Title */}
                <div className="flex items-center gap-5 mb-8">
                  <RadarIcon />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-signal/80">OUR OUTLOOK</span>
                    <h3 className="text-card text-text-primary">Vision</h3>
                  </div>
                </div>
                
                {/* Content */}
                <p className="text-body-large text-text-secondary group-hover:text-text-primary transition-colors duration-300 font-medium">
                  To become a trusted global engineering and technology solutions company delivering innovative, reliable, and scalable products in mechanical, electronics, software, and supply chain domains through continuous improvement and customer-focused solutions.
                </p>
              </div>

              {/* Engineering details graphic at the bottom */}
              <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between text-[9px] text-white/25 font-mono tracking-widest">
                <span>REF // TXW-VSN-01</span>
                <span>SCALE // 1 : 1</span>
              </div>
            </div>
          </div>

          {/* Connection Line (Desktop only) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-8 hidden lg:flex items-center justify-center pointer-events-none z-20">
            <svg width="64" height="12" viewBox="0 0 64 12" fill="none" className="overflow-visible w-full">
              {/* Background trace */}
              <path d="M 0 6 L 64 6" stroke="rgba(140, 198, 63, 0.15)" strokeWidth="2" />
              {/* Flowing current */}
              <path
                d="M 0 6 L 64 6"
                stroke="var(--primary-green)"
                strokeWidth="2"
                strokeDasharray="8 16"
                className="animate-connection-flow connection-trace"
              />
              {/* Center node */}
              <circle cx="32" cy="6" r="3.5" fill="#000000" stroke="var(--primary-green)" strokeWidth="1.5" />
              <circle cx="32" cy="6" r="3.5" fill="var(--primary-green)" className="animate-ping opacity-35" />
            </svg>
          </div>

          {/* Mission Card */}
          <div className="relative h-full">
            <div className="relative group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02] backdrop-blur-md p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 hover:border-signal/50 hover:shadow-[0_20px_50px_rgba(140,198,63,0.15)] flex flex-col justify-between h-full">
              {/* Inner glow on hover */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(140,198,63,0.08)_0%,transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div>
                {/* Icon and Title */}
                <div className="flex items-center gap-5 mb-8">
                  <RocketIcon />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-signal/80">OUR MISSION</span>
                    <h3 className="text-card text-text-primary">Mission</h3>
                  </div>
                </div>
                
                {/* Mission points list */}
                <div className="mission-list-container space-y-3">
                  {MISSION_POINTS.map((point, index) => (
                    <div
                      key={index}
                      className="mission-item group/item flex items-start gap-4 p-3.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-signal/30 hover:pl-5 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full border border-signal/40 bg-signal/10 flex items-center justify-center text-signal group-hover/item:bg-signal group-hover/item:text-white transition-all duration-300 mt-0.5">
                        <span className="w-1.5 h-1.5 bg-signal rounded-full group-hover/item:bg-white animate-pulse" />
                      </div>
                      <p className="text-body-normal text-text-secondary group-hover/item:text-text-primary transition-colors duration-300">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engineering details graphic at the bottom */}
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[9px] text-white/25 font-mono tracking-widest">
                <span>REF // TXW-MSN-01</span>
                <span>STATUS // OPTIMIZED</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
