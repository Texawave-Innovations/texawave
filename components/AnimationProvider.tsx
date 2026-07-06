"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AnimationContextType {
  hasLoadedSession: boolean;
  setHasLoadedSession: (val: boolean) => void;
  isTransitioning: boolean;
  navigateTo: (href: string) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Session-wide loader tracking
  const [hasLoadedSession, setHasLoadedSessionState] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const gsapRef = useRef<any>(null);
  const scrollTriggerRef = useRef<any>(null);

  // Sync state with sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("texawave_has_loaded");
      if (stored === "true") {
        setHasLoadedSessionState(true);
      }
    }
  }, []);

  const setHasLoadedSession = (val: boolean) => {
    setHasLoadedSessionState(val);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("texawave_has_loaded", String(val));
    }
  };

  // Global Lenis Smooth Scrolling & GSAP Loading
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Guard for reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let activeTickHandler: any = null;
    let activeLenis: any = null;

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      prefersReduced ? Promise.resolve(null) : import("lenis")
    ]).then(([{ default: gsap }, { ScrollTrigger }, lenisModule]) => {
      gsap.registerPlugin(ScrollTrigger);
      gsapRef.current = gsap;
      scrollTriggerRef.current = ScrollTrigger;

      if (!prefersReduced && lenisModule) {
        const Lenis = lenisModule.default;
        const lenis = new Lenis({
          duration: 1.05,
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.2,
        });

        // Connect Lenis to ScrollTrigger updates
        lenis.on("scroll", ScrollTrigger.update);

        // Use GSAP's ticker to drive Lenis (instead of custom requestAnimationFrame loops)
        const tickHandler = (time: number) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(tickHandler);
        gsap.ticker.lagSmoothing(0);

        // Save to window for global developer tool checking
        (window as any).lenis = lenis;
        activeLenis = lenis;
        activeTickHandler = tickHandler;
      }
    }).catch((err) => console.error("Failed to load animation modules dynamically:", err));

    return () => {
      if (gsapRef.current && activeTickHandler) {
        gsapRef.current.ticker.remove(activeTickHandler);
      }
      if (activeLenis) {
        activeLenis.destroy();
        delete (window as any).lenis;
      }
    };
  }, []);

  // Graceful page exit navigator
  const navigateTo = (href: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const wrapper = document.getElementById("page-transition-wrapper");
    const gsap = gsapRef.current;
    const ScrollTrigger = scrollTriggerRef.current;

    if (!wrapper || !gsap || !ScrollTrigger) {
      // Fallback if elements/libs don't exist
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((t: any) => t.kill());
      }
      if (gsap) {
        gsap.killTweensOf("*");
      }
      router.push(href);
      return;
    }

    // Fade out current page with slide
    gsap.to(wrapper, {
      opacity: 0,
      y: -15,
      duration: 0.35,
      ease: "power2.inOut",
      onComplete: () => {
        // Complete cleanup of GSAP timelines and ScrollTriggers before mounting next page
        ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
        gsap.killTweensOf("*");

        // Navigate
        router.push(href);
      },
    });
  };

  // Page Entry Animation
  useEffect(() => {
    const wrapper = document.getElementById("page-transition-wrapper");
    if (!wrapper) return;

    const triggerAnimation = (gsap: any) => {
      // Reset styles to make visible and slide up from bottom
      gsap.fromTo(
        wrapper,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
          clearProps: "transform",
          onComplete: () => {
            setIsTransitioning(false);
            // Recalculate ScrollTriggers for elements on new page.
            // Use 200ms to account for Vercel's slower asset hydration,
            // and a second refresh at 600ms for pages with heavy content.
            setTimeout(() => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  if (scrollTriggerRef.current) {
                    scrollTriggerRef.current.refresh(true);
                  }
                });
              });
            }, 200);
            // Safety-net second refresh
            setTimeout(() => {
              if (scrollTriggerRef.current) {
                scrollTriggerRef.current.refresh();
              }
            }, 600);
          },
        }
      );
    };

    if (gsapRef.current) {
      triggerAnimation(gsapRef.current);
    } else {
      // Wait for GSAP load
      const checkInterval = setInterval(() => {
        if (gsapRef.current) {
          clearInterval(checkInterval);
          triggerAnimation(gsapRef.current);
        }
      }, 50);
      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
        setIsTransitioning(false);
      }, 1000);
      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
      };
    }
  }, [pathname]);

  // Intercept all internal anchor clicks globally
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0
      ) {
        return;
      }

      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor && anchor.href) {
        const targetUrl = new URL(anchor.href);
        const isSameOrigin = targetUrl.origin === window.location.origin;
        const isHash = targetUrl.pathname === window.location.pathname && targetUrl.hash;
        const hasDownload = anchor.hasAttribute("download");
        const hasTargetBlank = anchor.target === "_blank";

        if (isSameOrigin && !isHash && !hasDownload && !hasTargetBlank) {
          e.preventDefault();
          const href = anchor.getAttribute("href");
          if (href) {
            navigateTo(href);
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [isTransitioning]);

  return (
    <AnimationContext.Provider
      value={{
        hasLoadedSession,
        setHasLoadedSession,
        isTransitioning,
        navigateTo,
      }}
    >
      <div id="page-transition-wrapper">{children}</div>
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return context;
}
