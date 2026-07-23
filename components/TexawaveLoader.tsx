"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface TexawaveLoaderProps {
  onComplete: () => void;
}

const LOADING_MESSAGES = [
  "Initializing...",
  "Loading Experience...",
  "Preparing Engineering Solutions...",
  "Almost Ready..."
];

export function TexawaveLoader({ onComplete }: TexawaveLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  
  // Connection and timing states
  const [messageIndex, setMessageIndex] = useState(0);
  const [isReady, setIsReady] = useState(false); // Page ready state
  const [minTimeElapsed, setMinTimeElapsed] = useState(false); // Min time elapsed
  const [isExiting, setIsExiting] = useState(false);

  // Handle message cycling when in loading status
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  // Handle Minimum Display Time (2 seconds)
  useEffect(() => {
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2000);
    
    return () => clearTimeout(minTimer);
  }, []);

  // Monitor document ready state
  useEffect(() => {
    const checkReadyState = () => {
      if (document.readyState === "complete") {
        setIsReady(true);
      }
    };

    checkReadyState();

    if (document.readyState !== "complete") {
      window.addEventListener("load", checkReadyState);
      return () => window.removeEventListener("load", checkReadyState);
    }
  }, []);

  // Monitor when to trigger exit animation
  useGSAP(() => {
    if (isReady && minTimeElapsed && !isExiting) {
      setIsExiting(true);
      
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        }
      });
      
      // Scale logo slightly upward, fade loader opacity to 0
      tl.to(logoWrapperRef.current, {
        scale: 1.12,
        opacity: 0,
        duration: 0.7,
        ease: "power3.inOut"
      });
      
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.7,
        ease: "power3.inOut"
      }, 0);
    }
  }, { dependencies: [isReady, minTimeElapsed, isExiting] });
  
  const statusColor = "#8CC63F";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-bg-primary select-none overflow-hidden text-white transition-colors duration-500"
      aria-hidden="true"
    >
      <style>{`
        @keyframes spin-ring {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes subtle-pulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.03); opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.6; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .rotate-ring {
          animation: spin-ring 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .pulse-logo {
          animation: subtle-pulse 3s ease-in-out infinite;
        }
        .fade-in-up-msg {
          animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .dot-glowing {
          animation: pulse-dot 2s infinite ease-in-out;
        }
        .premium-glass-card {
          background: rgba(10, 10, 10, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }
        .premium-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .premium-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: white;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .premium-btn:hover::after {
          opacity: 0.05;
        }
        .premium-btn:active {
          transform: scale(0.97);
        }
      `}</style>

      {/* ── Ambient Radial Glow ── */}
      <div
        className="absolute w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${statusColor} 0%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          left: "50%",
          top: "50%",
        }}
      />

      {/* ── Main Loading Content Wrapper ── */}
      <div ref={logoWrapperRef} className="flex flex-col items-center justify-center z-10 px-6 max-w-md w-full text-center">
        
        {/* ── Logo & Progress Ring Area ── */}
        <div className="relative flex items-center justify-center w-52 h-52 mb-8">
          {/* Circular Progress Ring */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full rotate-ring"
          >
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="2.5"
            />
            {/* Active Segment */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke={statusColor}
              strokeWidth="2.5"
              strokeDasharray="276.4"
              strokeDashoffset="180"
              strokeLinecap="round"
              className="transition-all duration-700 ease-in-out"
              style={{
                filter: `drop-shadow(0 0 4px ${statusColor}a0)`
              }}
            />
          </svg>

          {/* Pulsing Texawave Logo inside the ring */}
          <div className="relative z-10 w-36 h-20 flex items-center justify-center pulse-logo">
            <Image
              src="/texawave_logo.webp"
              alt="Texawave"
              width={160}
              height={50}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* ── Messages & Controls Container ── */}
        <div className="h-36 flex flex-col items-center justify-start w-full">
            <div key={messageIndex} className="fade-in-up-msg flex flex-col items-center">
              <p className="text-black dark:text-white text-base font-semibold tracking-wide font-sans mb-1">
                {LOADING_MESSAGES[messageIndex]}
              </p>
              <div className="flex gap-1 items-center justify-center mt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F]/60 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F]/80 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F] animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
