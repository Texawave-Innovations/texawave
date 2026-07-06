"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AlertTriangle, Wifi, WifiOff, RefreshCw } from "lucide-react";

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
  const [isOnline, setIsOnline] = useState(true);
  const [status, setStatus] = useState<"loading" | "slow" | "offline">("loading");
  const [dismissedSlow, setDismissedSlow] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isReady, setIsReady] = useState(false); // Page ready state
  const [minTimeElapsed, setMinTimeElapsed] = useState(false); // Min time elapsed
  const [isExiting, setIsExiting] = useState(false);

  // Sync isOnline with browser window status
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      
      const handleOnline = () => {
        setIsOnline(true);
        // Transition back to loading when connection is restored
        setStatus("loading");
      };
      
      const handleOffline = () => {
        setIsOnline(false);
        setStatus("offline");
      };
      
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  // Handle message cycling when in loading status
  useEffect(() => {
    if (status !== "loading") return;
    
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);
    
    return () => clearInterval(interval);
  }, [status]);

  // Handle Slow Network Timer (5 seconds)
  useEffect(() => {
    if (isReady || dismissedSlow || status === "offline") return;
    
    const slowTimer = setTimeout(() => {
      if (isOnline && !isReady) {
        setStatus("slow");
      }
    }, 5000);
    
    return () => clearTimeout(slowTimer);
  }, [isReady, dismissedSlow, isOnline, status]);

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
    if (isReady && minTimeElapsed && status !== "offline" && !isExiting) {
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
  }, { dependencies: [isReady, minTimeElapsed, status, isExiting] });

  // Handle reload action
  const handleReload = () => {
    window.location.reload();
  };

  // Handle continue waiting action
  const handleContinueWaiting = () => {
    setDismissedSlow(true);
    setStatus("loading");
  };

  // Visual classes based on network state
  let statusColor = "#8CC63F"; // Online (green accent)
  let statusText = "Online";
  let dotColorClass = "bg-[#8CC63F] shadow-[#8CC63F]/50";
  
  if (status === "slow") {
    statusColor = "#eab308"; // Slow (yellow/amber)
    statusText = "Slow Connection";
    dotColorClass = "bg-yellow-500 shadow-yellow-500/50";
  } else if (status === "offline") {
    statusColor = "#ef4444"; // Offline (red)
    statusText = "Offline";
    dotColorClass = "bg-red-500 shadow-red-500/50";
  }

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
            className={`absolute inset-0 w-full h-full transition-all duration-700 ${
              status === "offline" ? "opacity-30 scale-95" : "rotate-ring"
            }`}
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
              strokeDashoffset={status === "offline" ? "276.4" : "180"}
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
          {status === "loading" && (
            <div key={messageIndex} className="fade-in-up-msg flex flex-col items-center">
              <p className="text-[#EEEEEE] text-base font-semibold tracking-wide font-sans mb-1">
                {LOADING_MESSAGES[messageIndex]}
              </p>
              <div className="flex gap-1 items-center justify-center mt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F]/60 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F]/80 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F] animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}

          {status === "slow" && (
            <div className="fade-in-up-msg w-full flex flex-col items-center premium-glass-card p-5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <AlertTriangle size={18} className="animate-pulse" />
                <span className="font-bold text-sm uppercase tracking-wider">Slow Network Detected</span>
              </div>
              <p className="text-[#999999] text-xs leading-relaxed max-w-xs mb-4">
                Your connection appears to be slow. We&apos;re still preparing the experience.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleReload}
                  className="premium-btn flex-1 py-2 px-3 rounded bg-white text-black font-bold text-xs flex items-center justify-center gap-1.5 border border-white"
                >
                  <RefreshCw size={12} />
                  Retry Connection
                </button>
                <button
                  onClick={handleContinueWaiting}
                  className="premium-btn flex-1 py-2 px-3 rounded bg-transparent text-white font-bold text-xs border border-white/10 hover:border-white/30"
                >
                  Continue Waiting
                </button>
              </div>
            </div>
          )}

          {status === "offline" && (
            <div className="fade-in-up-msg w-full flex flex-col items-center premium-glass-card p-5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <WifiOff size={18} />
                <span className="font-bold text-sm uppercase tracking-wider">No Internet Connection</span>
              </div>
              <p className="text-[#999999] text-xs leading-relaxed max-w-xs mb-4">
                We&apos;re unable to connect to the network. Please check your internet connection.
              </p>
              <button
                onClick={handleReload}
                className="premium-btn w-full py-2 px-3 rounded bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-red-500 shadow-lg shadow-red-500/20"
              >
                <RefreshCw size={12} />
                Retry Connection
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Status Monitoring Panel (Bottom-Right) ── */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-bg-primary/40 border border-white/5 backdrop-blur-md text-[11px] font-bold text-[#999999] uppercase tracking-wider z-20">
        <div className="relative flex h-2 w-2">
          {/* Outer glowing pulsing ring */}
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColorClass}`}></span>
          {/* Inner dot */}
          <span className={`relative inline-flex rounded-full h-2 w-2 dot-glowing ${dotColorClass}`}></span>
        </div>
        <span className="flex items-center gap-1">
          {status === "offline" ? (
            <WifiOff size={11} className="text-red-500" />
          ) : (
            <Wifi size={11} className={status === "slow" ? "text-yellow-500" : "text-[#8CC63F]"} />
          )}
          {statusText}
        </span>
      </div>
    </div>
  );
}
