"use client";

import { useRef, useEffect } from "react";
import { useAnimation } from "@/components/AnimationProvider";

export function AnimatedShell({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hasLoadedSession, isTransitioning } = useAnimation();

  // Force ScrollTrigger to recalculate after all resources (fonts, images) load.
  useEffect(() => {
    const refresh = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
            ScrollTrigger.refresh(true);
          }).catch((err) => console.error("Failed to refresh ScrollTrigger dynamically:", err));
        });
      });
    };

    if (document.readyState === "complete") {
      const timer = setTimeout(refresh, 300);
      return () => clearTimeout(timer);
    } else {
      window.addEventListener("load", refresh, { once: true });
      const timer = setTimeout(refresh, 1000);
      return () => {
        window.removeEventListener("load", refresh);
        clearTimeout(timer);
      };
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let ctx: any;

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("@/lib/gsap-utils")
    ]).then(([{ default: gsap }, { ScrollTrigger }, gsapUtils]) => {
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // 1. Scroll-linked viewport entry/exits with easeReverse
        const reveal = gsap.utils.toArray<HTMLElement>("[data-reveal]", container);
        const revealTimelines: gsap.core.Timeline[] = [];

        reveal.forEach((element) => {
          const tl = gsapUtils.createEaseReverseTimeline({
            reverseTimeScale: 2.5,
            easeReverse: "power3.out"
          });

          tl.fromTo(
            element,
            { autoAlpha: 0, y: 32 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.85,
              ease: "power3.out",
              immediateRender: false,
            }
          );

          revealTimelines.push(tl);

          ScrollTrigger.create({
            trigger: element,
            start: "top 82%",
            toggleActions: "play reverse play reverse",
            onEnter: () => tl.play(),
            onLeave: () => tl.reverse(),
            onEnterBack: () => tl.play(),
            onLeaveBack: () => tl.reverse(),
          });
        });

        // Hero timeline elements entry
        gsap.fromTo(
          gsap.utils.toArray("[data-hero-line]", container),
          { y: 34, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12, ease: "power3.out" }
        );
        
        // Floating animations
        gsap.to(gsap.utils.toArray("[data-hero-visual]", container), {
          y: -16,
          rotate: 1.5,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        
        gsap.to(gsap.utils.toArray("[data-trace]", container), {
          strokeDashoffset: 0,
          duration: 2.2,
          stagger: 0.12,
          ease: "power2.out"
        });

        // Stepper scroll progress
        gsap.utils.toArray<HTMLElement>("[data-step]", container).forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0.35, x: -18 },
            {
              autoAlpha: 1,
              x: 0,
              immediateRender: false,
              scrollTrigger: {
                trigger: element,
                start: "top 78%",
                end: "bottom 45%",
                scrub: 0.6
              }
            }
          );
        });

        // Hover bindings
        const serviceCards = container.querySelectorAll(".service-card-premium");
        const serviceCleanups = Array.from(serviceCards).map((card) =>
          gsapUtils.bindServiceCardHover(card as HTMLElement, {
            glowColor: "rgba(0, 255, 136, 0.18)"
          })
        );

        const projectCards = container.querySelectorAll(".project-card-premium");
        const projectCleanups = Array.from(projectCards).map((card) =>
          gsapUtils.bindProjectCardHover(card as HTMLElement)
        );

        const ctas = container.querySelectorAll(".cta-magnetic");
        const ctaCleanups = Array.from(ctas).map((cta) =>
          gsapUtils.bindPremiumHover(cta as HTMLElement, {
            magnetic: true,
            scale: 1.06,
            ease: "back.out(2)",
            easeReverse: "power2.out"
          })
        );

        const btns = container.querySelectorAll(".btn-premium");
        const btnCleanups = Array.from(btns).map((btn) =>
          gsapUtils.bindPremiumHover(btn as HTMLElement, {
            magnetic: false,
            scale: 1.05,
            y: -2,
            ease: "back.out(2)",
            easeReverse: "power2.out",
            duration: 0.35
          })
        );

        return () => {
          revealTimelines.forEach((tl) => tl.kill());
          serviceCleanups.forEach((cleanup) => cleanup && cleanup());
          projectCleanups.forEach((cleanup) => cleanup && cleanup());
          ctaCleanups.forEach((cleanup) => cleanup && cleanup());
          btnCleanups.forEach((cleanup) => cleanup && cleanup());
        };
      }, container);
    }).catch(err => console.error("Error loading GSAP in AnimatedShell:", err));

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  // Dedicated Effect for Stats Counter Animations
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Do not run animations when the initial loader screen is active or route transitions are in progress
    if (!hasLoadedSession || isTransitioning) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let ctx: any;

    Promise.all([
      import("gsap"),
    ]).then(([{ default: gsap }]) => {
      ctx = gsap.context(() => {
        const counterCleanups: (() => void)[] = [];

        gsap.utils.toArray<HTMLElement>("[data-count]", container).forEach((element) => {
          const end = Number(element.dataset.count || "0");
          const value = { current: 0 };
          element.textContent = "0";

          let activeTween: gsap.core.Tween | null = null;

          const animateCounter = () => {
            if (activeTween) {
              activeTween.kill();
            }
            value.current = 0;
            element.textContent = "0";

            activeTween = gsap.to(value, {
              current: end,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => {
                element.textContent =
                  end % 1 === 0
                    ? Math.round(value.current).toString()
                    : value.current.toFixed(1);
              },
            });
          };

          let hasAnimated = false;
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                if (!hasAnimated) {
                  animateCounter();
                  hasAnimated = true;
                }
              }
            });
          }, {
            threshold: 0.1
          });

          observer.observe(element);

          const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
              const rect = element.getBoundingClientRect();
              const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
              if (inViewport) {
                animateCounter();
              }
            }
          };

          document.addEventListener("visibilitychange", handleVisibilityChange);

          counterCleanups.push(() => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            if (activeTween) {
              activeTween.kill();
            }
          });
        });

        return () => {
          counterCleanups.forEach((cleanup) => cleanup());
        };
      }, container);
    });

    return () => {
      if (ctx) ctx.revert();
    };
  }, [hasLoadedSession, isTransitioning]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}
