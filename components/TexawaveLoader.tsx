"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AlertTriangle, WifiOff, RefreshCw } from "lucide-react";

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
  const barFillRef = useRef<HTMLDivElement>(null);

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

  // Animate progress bar fill while loading
  useGSAP(() => {
    if (!barFillRef.current) return;

    if (status === "loading") {
      gsap.to(barFillRef.current, {
        width: isReady ? "100%" : "82%",
        duration: isReady ? 0.4 : 2.6,
        ease: isReady ? "power2.out" : "power1.out",
      });
    }
  }, { dependencies: [status, isReady] });

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
        scale: 1.06,
        opacity: 0,
        duration: 0.6,
        ease: "power3.inOut"
      });

      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: "power3.inOut"
      }, 0.1);
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

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-bg-primary select-none overflow-hidden text-white transition-colors duration-500"
      aria-hidden="true"
    >
      <style>{`
        @keyframes drift-glow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes logo-breathe {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.75; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        .ambient-glow {
          animation: drift-glow 4s ease-in-out infinite;
        }
        .logo-breathe {
          animation: logo-breathe 2.4s ease-in-out infinite;
        }
        .fade-in-up-msg {
          animation: fade-in-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .shimmer-sweep::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent);
          animation: shimmer-sweep 1.6s ease-in-out infinite;
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
        className="ambient-glow absolute w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, #8CC63F 0%, transparent 70%)",
          left: "50%",
          top: "50%",
        }}
      />

      {/* ── Main Loading Content Wrapper ── */}
      <div ref={logoWrapperRef} className="flex flex-col items-center justify-center z-10 px-6 max-w-md w-full text-center">

        {/* ── Logo ── */}
        <div className="logo-breathe relative z-10 w-40 h-24 flex items-center justify-center mb-10">
          <Image
            src="/texawave_logo.webp"
            alt="Texawave"
            width={180}
            height={56}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>

        {/* ── Messages & Controls Container ── */}
        <div className="min-h-36 flex flex-col items-center justify-start w-full">
          {status === "loading" && (
            <div className="w-full flex flex-col items-center">
              {/* Progress bar */}
              <div className="relative w-56 h-[3px] rounded-full bg-white/10 overflow-hidden">
                <div
                  ref={barFillRef}
                  className="shimmer-sweep relative h-full rounded-full bg-[#8CC63F]"
                  style={{ width: "8%", boxShadow: "0 0 8px #8CC63Fa0" }}
                />
              </div>

              <div key={messageIndex} className="fade-in-up-msg mt-5">
                <p className="text-[#999999] text-xs font-medium tracking-[0.15em] uppercase font-sans">
                  {LOADING_MESSAGES[messageIndex]}
                </p>
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
    </div>
  );
}
