import gsap from "gsap";
import { useEffect, RefObject } from "react";

export interface EaseReverseTimelineOptions {
  reverseTimeScale?: number; // Speed scale for exit animations (2x-3x)
  easeReverse?: string | gsap.EaseFunction; // Exit animation easing
  onComplete?: () => void;
  onReverseComplete?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Creates a custom GSAP timeline that automatically manages easeReverse
 * and reverse timeScale scaling for premium exit interactions.
 */
export function createEaseReverseTimeline(options: EaseReverseTimelineOptions = {}) {
  const {
    reverseTimeScale = 2.5,
    easeReverse = "power3.out",
    onComplete,
    onReverseComplete,
    ...gsapVars
  } = options;

  // Initialize paused timeline
  const tl = gsap.timeline({
    ...gsapVars,
    paused: true,
  });

  // Track original eases to restore during play
  const originalEases = new Map<gsap.core.Tween, string | gsap.EaseFunction>();

  // A helper function to scan and dynamically swap tween eases
  // NOTE: We intentionally do NOT call tl.invalidate() here —
  // invalidate() resets the recorded "from" values, which breaks
  // tl.reverse() because it no longer knows the original start state.
  const updateTweenEases = (isReversing: boolean) => {
    const children = tl.getChildren(true, true, false);
    
    children.forEach((child) => {
      if (child instanceof gsap.core.Tween) {
        // Cache original ease on first encounter
        if (!originalEases.has(child)) {
          originalEases.set(child, child.vars.ease || "power1.out");
        }

        // Apply correct ease depending on direction
        const nextEase = isReversing
          ? ((child.vars as gsap.TweenVars & { easeReverse?: string | gsap.EaseFunction }).easeReverse || easeReverse)
          : originalEases.get(child);

        // Swap ease in vars and the compiled ease function
        child.vars.ease = nextEase;
        const parsedEase = typeof nextEase === "string" ? gsap.parseEase(nextEase) : nextEase;
        (child as unknown as { _ease: string | gsap.EaseFunction | undefined })._ease = parsedEase;
      }
    });
    // ⚠️ Do NOT call tl.invalidate() — it resets from-values and breaks reverse.
  };

  // Bind and wrap native controls
  const originalPlay = tl.play.bind(tl);
  const originalReverse = tl.reverse.bind(tl);

  tl.play = (from?: number | string, suppressEvents?: boolean) => {
    tl.timeScale(1.0);
    updateTweenEases(false);
    
    if (onComplete) {
      tl.eventCallback("onComplete", onComplete);
    }
    
    return originalPlay(from, suppressEvents);
  };

  tl.reverse = (from?: number | string, suppressEvents?: boolean) => {
    tl.timeScale(reverseTimeScale);
    updateTweenEases(true);
    
    if (onReverseComplete) {
      tl.eventCallback("onReverseComplete", onReverseComplete);
    }
    
    return originalReverse(from, suppressEvents);
  };

  return tl;
}

/**
 * Optimized hover animation binder supporting magnetic effects and clean exit settling.
 * Automatically handles GPU accelerations and prefers-reduced-motion filters.
 */
export function bindPremiumHover(
  element: HTMLElement,
  options: {
    scale?: number;
    y?: number;
    x?: number;
    duration?: number;
    ease?: string;
    easeReverse?: string;
    reverseTimeScale?: number;
    magnetic?: boolean;
    glowRef?: HTMLElement;
  } = {}
) {
  if (!element) return;

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mediaQuery.matches) return;

  const {
    scale = 1.06,
    y = -4,
    x = 0,
    duration = 0.45,
    ease = "back.out(2)",
    easeReverse = "power2.out",
    reverseTimeScale = 2.5,
    glowRef,
  } = options;

  const hoverTl = createEaseReverseTimeline({
    reverseTimeScale,
    easeReverse,
  });

  // Entry properties: lift, scale, will-change setup
  gsap.set(element, { willChange: "transform, opacity" });
  if (glowRef) {
    gsap.set(glowRef, { willChange: "transform, opacity" });
  }

  hoverTl.to(element, {
    scale,
    y,
    x,
    duration,
    ease,
    force3D: true,
  });

  if (glowRef) {
    hoverTl.to(
      glowRef,
      {
        opacity: 0.8,
        scale: 1.1,
        duration: duration * 0.7,
        ease: "power2.out",
      },
      "<"
    );
  }

  const handleMouseEnter = () => {
    hoverTl.play();
  };

  const handleMouseLeave = () => {
    hoverTl.reverse();
  };

  element.addEventListener("mouseenter", handleMouseEnter);
  element.addEventListener("mouseleave", handleMouseLeave);

  // Return destructor for React cleanup
  return () => {
    element.removeEventListener("mouseenter", handleMouseEnter);
    element.removeEventListener("mouseleave", handleMouseLeave);
    hoverTl.kill();
  };
}

/**
 * Premium Service Card binder.
 * - Hover lift and slight scale.
 * - Dynamic border glow expansion on hover.
 * - Smooth exit using easeReverse with no bounce.
 */
export function bindServiceCardHover(
  element: HTMLElement,
  options: {
    duration?: number;
    scale?: number;
    y?: number;
    glowColor?: string; // e.g. "rgba(0, 255, 136, 0.25)"
    ease?: string;
    easeReverse?: string;
    reverseTimeScale?: number;
  } = {}
) {
  if (!element) return;

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mediaQuery.matches) return;

  const {
    duration = 0.45,
    scale = 1.025,
    y = -8,
    glowColor,
    ease = "power3.out",
    easeReverse = "power2.out",
    reverseTimeScale = 2.2,
  } = options;

  const tl = createEaseReverseTimeline({
    reverseTimeScale,
    easeReverse,
  });

  gsap.set(element, { willChange: "transform, box-shadow, border-color" });

  // Resolve glow shadow and borders dynamically at runtime based on active theme
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const resolvedGlow = isDark ? (glowColor || "rgba(140, 198, 63, 0.25)") : "rgba(17, 17, 17, 0.08)";
  const resolvedBorder = isDark ? "rgba(140, 198, 63, 0.45)" : "rgba(17, 17, 17, 0.35)";

  tl.to(element, {
    scale,
    y,
    boxShadow: `0 20px 40px ${resolvedGlow}, 0 1px 2px rgba(0, 0, 0, 0.05)`,
    borderColor: resolvedBorder,
    duration,
    ease,
    force3D: true,
  });

  const handleMouseEnter = () => tl.play();
  const handleMouseLeave = () => tl.reverse();

  element.addEventListener("mouseenter", handleMouseEnter);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mouseenter", handleMouseEnter);
    element.removeEventListener("mouseleave", handleMouseLeave);
    tl.kill();
  };
}

export function useServiceCardHover(
  ref: RefObject<HTMLElement | null>,
  options: Parameters<typeof bindServiceCardHover>[1] = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return bindServiceCardHover(el, options);
  }, [ref, options]);
}

/**
 * Premium Project Card binder.
 * - Zoom image inside the card (.project-card-image).
 * - Body slides up slightly (.project-card-body).
 * - Overlay fades in (.project-card-overlay).
 * - Reverse exit animation runs 2.5x faster.
 */
export function bindProjectCardHover(
  element: HTMLElement,
  options: {
    duration?: number;
    zoomScale?: number;
    slideY?: number;
    ease?: string;
    easeReverse?: string;
    reverseTimeScale?: number;
  } = {}
) {
  if (!element) return;

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mediaQuery.matches) return;

  const {
    duration = 0.45,
    zoomScale = 1.08,
    slideY = -6,
    ease = "power3.out",
    easeReverse = "power2.out",
    reverseTimeScale = 2.5,
  } = options;

  const img = element.querySelector(".project-card-image");
  const body = element.querySelector(".project-card-body");
  const overlay = element.querySelector(".project-card-overlay");

  if (img) gsap.set(img, { willChange: "transform" });
  if (body) gsap.set(body, { willChange: "transform" });
  if (overlay) gsap.set(overlay, { willChange: "opacity" });

  // Capture the card's default border/shadow from computed styles so
  // the leave animation always returns to the exact original values.
  const computedStyle = window.getComputedStyle(element);
  const defaultBorderColor = computedStyle.borderColor;
  const defaultBoxShadow = computedStyle.boxShadow;

  // Resolve hovered-state values based on active theme.
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const resolvedBorder = isDark ? "rgba(140, 198, 63, 0.4)" : "rgba(17, 17, 17, 0.25)";
  const resolvedShadow = isDark ? "0 20px 48px rgba(0, 0, 0, 0.45)" : "0 20px 48px rgba(17, 17, 17, 0.12)";

  const exitDuration = duration / reverseTimeScale;

  /**
   * Stateless direct-tween approach.
   *
   * WHY: A GSAP timeline stores internal "progress" state. Mixing
   * tl.pause() with standalone gsap.to() resets causes the DOM and
   * timeline to fall out of sync — so the next tl.play() resumes from
   * a stale mid-point while the elements are already at their default
   * values, making the hover appear to "break" after the first leave.
   *
   * Using direct gsap.to() with overwrite:"auto" is completely stateless.
   * Every mouseenter and mouseleave fires a fresh tween that cancels any
   * in-flight animation on the same property. Repeats indefinitely with
   * zero state to get out of sync.
   */
  const handleMouseEnter = () => {
    if (img)     gsap.to(img,     { scale: zoomScale, duration,               ease, overwrite: "auto" });
    if (body)    gsap.to(body,    { y: slideY,        duration,               ease, overwrite: "auto" });
    if (overlay) gsap.to(overlay, { opacity: 0.15,   duration: duration * 0.7, ease, overwrite: "auto" });
    gsap.to(element, {
      y: -4,
      borderColor: resolvedBorder,
      boxShadow: resolvedShadow,
      duration,
      ease,
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    if (img)     gsap.to(img,     { scale: 1,   duration: exitDuration,        ease: easeReverse, overwrite: "auto" });
    if (body)    gsap.to(body,    { y: 0,        duration: exitDuration,        ease: easeReverse, overwrite: "auto" });
    if (overlay) gsap.to(overlay, { opacity: 0, duration: exitDuration * 0.7,  ease: easeReverse, overwrite: "auto" });
    gsap.to(element, {
      y: 0,
      borderColor: defaultBorderColor,
      boxShadow: defaultBoxShadow,
      duration: exitDuration,
      ease: easeReverse,
      overwrite: "auto",
    });
  };

  element.addEventListener("mouseenter", handleMouseEnter);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mouseenter", handleMouseEnter);
    element.removeEventListener("mouseleave", handleMouseLeave);
    gsap.killTweensOf([element, img, body, overlay].filter(Boolean));
  };
}


export function useProjectCardHover(
  ref: RefObject<HTMLElement | null>,
  options: Parameters<typeof bindProjectCardHover>[1] = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return bindProjectCardHover(el, options);
  }, [ref, options]);
}

/* ─── Custom GSAP ScrambleTextPlugin ───────────────────────────────────── */

export interface ScrambleTextVars {
  text: string;
  chars?: string | "upperCase" | "lowerCase" | "upperAndLowerCase";
  revealDelay?: number;
  speed?: number;
  tweenLength?: boolean;
}

interface ScrambleTextInstance {
  _target: HTMLElement;
  _text: string;
  _chars: string;
  _revealDelay: number;
  _tweenLength: boolean;
  _original: string;
}

export const ScrambleTextPlugin = {
  name: "scrambleText",
  init(this: ScrambleTextInstance, target: HTMLElement, value: string | ScrambleTextVars, _tween: gsap.core.Animation) {
    this._target = target;
    
    let text = "";
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let revealDelay = 0;
    let tweenLength = true;

    if (typeof value === "string") {
      text = value;
    } else if (value && typeof value === "object") {
      text = value.text || "";
      if (value.chars === "upperCase") {
        chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      } else if (value.chars === "lowerCase") {
        chars = "abcdefghijklmnopqrstuvwxyz";
      } else if (value.chars === "upperAndLowerCase") {
        chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      } else if (typeof value.chars === "string") {
        chars = value.chars;
      }
      revealDelay = value.revealDelay || 0;
      tweenLength = value.tweenLength !== false;
    }

    this._text = text;
    this._chars = chars;
    this._revealDelay = revealDelay;
    this._tweenLength = tweenLength;
    this._original = target.innerText || target.textContent || "";
  },
  render(ratio: number, data: ScrambleTextInstance) {
    const target = data._target;
    const text = data._text;
    const chars = data._chars;
    const revealDelay = data._revealDelay;
    const tweenLength = data._tweenLength;
    const original = data._original;

    let currentLength = text.length;
    if (tweenLength) {
      currentLength = Math.round(original.length + (text.length - original.length) * ratio);
    }

    let revealRatio = 0;
    if (ratio >= revealDelay) {
      revealRatio = (ratio - revealDelay) / (1 - revealDelay);
    }
    const revealCount = Math.floor(revealRatio * text.length);

    let result = "";
    for (let i = 0; i < currentLength; i++) {
      if (i < revealCount) {
        result += text[i] || "";
      } else if (i < text.length) {
        if (text[i] === " ") {
          result += " ";
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      } else {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    if (target.innerText !== undefined) {
      target.innerText = result;
    } else {
      target.textContent = result;
    }
  }
};

// Register the custom scramble text plugin with GSAP
gsap.registerPlugin(ScrambleTextPlugin as unknown as object);

