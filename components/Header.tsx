"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ChevronDown,
  ArrowUpRight,
  Wrench,
  Layers,
  PenTool,
  RotateCcw,
  Globe,
  Smartphone,
  Palette,
  Cloud,
  Brain,
  Cpu,
  Code2,
  BarChart2,
  Wifi,
  Scissors,
  Zap,
  FlaskConical,
  PackageCheck,
  CircuitBoard,
  RadioTower,
  Settings,
  Factory,
  Check,
  Laptop,
  Sparkles,
  Info,
  FileText,
  BookOpen,
  Mail,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type NavItem =
  | { label: string; href: string; hasDropdown?: false }
  | { label: string; href: string; hasDropdown: true; isMega?: boolean };

type DropdownItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  desc: string;
};

/* ─── Data ──────────────────────────────────────────────────────────────── */

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", hasDropdown: true, isMega: true },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "Resources", href: "#", hasDropdown: true },
  { label: "Careers", href: "/careers" },
];

const RESOURCES_ITEMS = [
  {
    label: "About Us",
    href: "/about",
    icon: Info,
    desc: "Learn about Texawave, our mission, vision, values, and engineering services.",
  },
  {
    label: "Contact Us",
    href: "/contact",
    icon: Mail,
    desc: "Connect with our engineering and business teams.",
  },
];

const MEGA_COLUMNS = [
  {
    title: "Engineering",
    items: [
      { label: "Mechanical Design", href: "/product-engineering/industrial-mechanical-design", icon: Wrench },
      { label: "Product Development", href: "/services", icon: Layers },
      { label: "CAD Services", href: "/product-engineering/industrial-mechanical-design", icon: PenTool },
      { label: "Reverse Engineering", href: "/services", icon: RotateCcw },
    ],
  },
  {
    title: "Digital",
    items: [
      { label: "Web Development", href: "/software-iot", icon: Globe },
      { label: "Mobile Development", href: "/software-iot", icon: Smartphone },
      { label: "UI/UX Design", href: "/services", icon: Palette },
      { label: "Cloud Solutions", href: "/software-iot", icon: Cloud },
    ],
  },
  {
    title: "Emerging Tech",
    items: [
      { label: "AI Solutions", href: "/software-iot", icon: Brain },
      { label: "Machine Learning", href: "/software-iot", icon: Cpu },
      { label: "Data Analytics", href: "/software-iot", icon: BarChart2 },
      { label: "IoT", href: "/software-iot", icon: Wifi },
    ],
  },
] as const;

const SERVICES: DropdownItem[] = [
  {
    label: "Software & AI Solutions",
    href: "/software-iot",
    icon: Code2,
    desc: "ERP, web & mobile apps, cloud, and AI analytics",
  },
  {
    label: "Product Engineering",
    href: "/product-engineering",
    icon: Cpu,
    desc: "Industrial design, PCB, embedded, and rapid prototyping",
  },
  {
    label: "Procurement Services",
    href: "/procurement",
    icon: PackageCheck,
    desc: "Component sourcing, supply chain & BOM optimization",
  },
  {
    label: "Manufacturing Support",
    href: "/manufacturing-support",
    icon: Factory,
    desc: "DFM/DFA, production transfer, testing & scale-up",
  },
];

const MEGA_SERVICES_DATA = [
  {
    id: "software-ai",
    label: "Software & AI Solutions",
    icon: Laptop,
    services: [
      { name: "Custom ERP Solutions", href: "/software-iot/custom-erp", desc: "Tailor-made ERP platforms unifying inventory, HR, and finance with real-time dashboards." },
      { name: "Web & Mobile Applications", href: "/software-iot/web-mobile-apps", desc: "Full-stack web platforms and native iOS/Android apps with enterprise-grade security." },
      { name: "Cloud & Infrastructure Solutions", href: "/software-iot/cloud-infrastructure", desc: "AWS/Azure cloud architecture, CI/CD pipelines, and proactive infrastructure monitoring." },
      { name: "AI & Data Analytics", href: "/software-iot/ai-analytics", desc: "Custom AI models, intelligent data pipelines, and predictive analytics solutions." },
    ]
  },
  {
    id: "product-engineering",
    label: "Product Engineering",
    icon: Settings,
    services: [
      { name: "Industrial & Mechanical Design", href: "/product-engineering/industrial-mechanical-design", desc: "Market analysis, 3D CAD modelling, CMF, and DFM optimization for physical products." },
      { name: "Hardware & PCB Design", href: "/product-engineering/hardware-pcb", desc: "Schematic design, multi-layer PCB layout, and compliance-ready circuit engineering." },
      { name: "Embedded & IoT Solutions", href: "/product-engineering/embedded-iot", desc: "Bare-metal firmware, RTOS development, and multi-protocol IoT connectivity." },
      { name: "Rapid Prototyping & Product Validation Services", href: "/product-engineering/rapid-prototyping", desc: "3D printing, CNC machining, and comprehensive physical and environmental validation testing." },
    ]
  },
  {
    id: "procurement",
    label: "Procurement Services",
    icon: PackageCheck,
    services: [
      { name: "Component Sourcing", href: "/procurement/component-sourcing", desc: "Global distributor network securing premium long-lifecycle components at optimal price points." },
      { name: "Supply Chain Management", href: "/procurement/supply-chain-management", desc: "Resilient logistics pipelines, dual-sourcing strategies, and JIT inventory coordination." },
      { name: "BOM Optimization", href: "/procurement/bom-optimization", desc: "Strategic BOM cost reduction through vendor negotiation and obsolescence profiling." },
    ]
  },
  {
    id: "manufacturing",
    label: "Manufacturing Support",
    icon: Factory,
    services: [
      { name: "DFM/DFA Optimization", href: "/manufacturing-support/dfm-dfa", desc: "Part simplification, tolerance analysis, and assembly process refinement before tooling begins." },
      { name: "Production Transfer", href: "/manufacturing-support/production-transfer", desc: "End-to-end prototype-to-production handoffs with full manufacturing documentation." },
      { name: "Production Test Solutions", href: "/manufacturing-support/production-test", desc: "Custom test fixtures and automated ICT systems for 100% end-of-line quality control." },
      { name: "Scale-Up Support", href: "/manufacturing-support/scale-up", desc: "Yield optimization, factory auditing, and continuous cost engineering as volumes grow." },
    ]
  }
];



/* ─── Hook: scroll threshold ────────────────────────────────────────────── */

function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/* ─── Component ─────────────────────────────────────────────────────────── */

interface HeaderProps {
  delayEntrance?: boolean;
}

export function Header({ delayEntrance = false }: HeaderProps) {
  const pathname = usePathname();
  const scrolled = useScrolled(40);

  /* refs */
  const headerRef = useRef<HTMLElement>(null);
  const navInnerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resourcesTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mobileTl = useRef<gsap.core.Timeline | null>(null);

  const bookMeetingRef = useRef<HTMLAnchorElement>(null);

  /* state */
  const [megaOpen, setMegaOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMegaOpen, setMobileMegaOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("product-engineering");
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState<string | null>(null);

  /* scroll sync states */
  const [activeNavItem, setActiveNavItem] = useState<string>("Home");
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);

  /* scroll progress & interaction refs */
  const progressLineRef = useRef<HTMLDivElement>(null);
  const logoPulseRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);



  const [libsLoaded, setLibsLoaded] = useState(false);
  const gsapRef = useRef<any>(null);
  const scrollTriggerRef = useRef<any>(null);

  // Set initial opacity=0 if JS is enabled so we fade in, otherwise keep visible
  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.opacity = "0";
      headerRef.current.style.transform = "translateY(-20px)";
    }
  }, []);

  // Global GSAP and plugins dynamic import
  useEffect(() => {
    if (typeof window === "undefined") return;

    let ctx: any;
    let activeCleanup: any = null;

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/ScrollToPlugin"),
      import("@/lib/gsap-utils")
    ]).then(([{ default: gsap }, { ScrollTrigger }, { ScrollToPlugin }, gsapUtils]) => {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
      gsapRef.current = gsap;
      scrollTriggerRef.current = ScrollTrigger;

      // Animate header entrance
      if (!delayEntrance && headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.85, ease: "power3.out", delay: 0.12, clearProps: "y" }
        );
      }

      ctx = gsap.context(() => {
        // 1. Horizontal Scroll Progress
        if (progressLineRef.current) {
          gsap.fromTo(
            progressLineRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.1,
              },
            }
          );
        }

        // 3. Homepage Section Triggers
        if (pathname === "/") {
          const sections = [
            { id: "home", label: "Home" },
            { id: "services", label: "Services" },
            { id: "about", label: "Resources" },
            { id: "contact", label: "Talk to an Expert" },
          ];

          sections.forEach((sec) => {
            const el = document.getElementById(sec.id);
            if (!el) return;

            ScrollTrigger.create({
              trigger: el,
              start: "top 45%",
              end: "bottom 45%",
              onToggle: (self) => {
                if (self.isActive) {
                  setActiveNavItem(sec.label);
                }
              },
            });
          });
        }

        // 3. Mobile Menu Timeline
        if (mobileMenuRef.current) {
          const menu = mobileMenuRef.current;
          const items = menu.querySelectorAll(".mobile-nav-item");

          mobileTl.current = gsapUtils.createEaseReverseTimeline({
            reverseTimeScale: 2.8,
            easeReverse: "power4.out",
            onComplete: () => {
              if (mobileMenuRef.current) {
                mobileMenuRef.current.style.pointerEvents = "auto";
              }
            },
            onReverseComplete: () => {
              if (mobileMenuRef.current) {
                mobileMenuRef.current.style.display = "none";
                mobileMenuRef.current.style.pointerEvents = "none";
              }
            }
          });

          mobileTl.current
            .set(menu, { display: "flex", opacity: 0 })
            .to(menu, { opacity: 1, duration: 0.35, ease: "power3.out" })
            .fromTo(items,
              { opacity: 0, y: -18 },
              { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.08 },
              "<0.05"
            );
          
          if (mobileOpen) {
            mobileTl.current.play();
          }
        }

        // Bind premium hover to meet button
        if (bookMeetingRef.current) {
          activeCleanup = gsapUtils.bindPremiumHover(bookMeetingRef.current, {
            magnetic: true,
            scale: 1.07,
            ease: "back.out(2)",
            easeReverse: "power2.out",
          });
        }
      }, headerRef);

      setLibsLoaded(true);
    }).catch((err) => console.error("Failed to load header GSAP:", err));

    return () => {
      if (ctx) ctx.revert();
      if (activeCleanup) activeCleanup();
    };
  }, [pathname, delayEntrance]);

  // shrink height effect on scroll
  useEffect(() => {
    const inner = navInnerRef.current;
    const logo = logoRef.current;
    if (!inner || !logo) return;

    if (gsapRef.current) {
      if (scrolled) {
        gsapRef.current.to(inner, { height: 72, duration: 0.4, ease: "power2.out" });
        gsapRef.current.to(logo, { scale: 0.9, duration: 0.4, ease: "power2.out", transformOrigin: "left center" });
      } else {
        gsapRef.current.to(inner, { height: 88, duration: 0.4, ease: "power2.out" });
        gsapRef.current.to(logo, { scale: 1, duration: 0.4, ease: "power2.out", transformOrigin: "left center" });
      }
    } else {
      inner.style.height = scrolled ? "72px" : "88px";
      logo.style.transform = scrolled ? "scale(0.9)" : "scale(1)";
    }
  }, [scrolled, libsLoaded]);

  // ripple on nav item change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const pulse = logoPulseRef.current;
    if (!pulse) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    if (gsapRef.current) {
      gsapRef.current.killTweensOf(pulse);
      gsapRef.current.fromTo(
        pulse,
        { scale: 0.95, opacity: 0.85 },
        { scale: 1.35, opacity: 0, duration: 0.9, ease: "power2.out" }
      );
    }
  }, [activeNavItem, libsLoaded]);

  // navigate click
  const handleNavClick = (e: React.MouseEvent, href: string, label: string) => {
    if (pathname === "/") {
      let sectionId = href === "/" ? "home" : href.replace("/", "");
      const targetEl = document.getElementById(sectionId);
      if (targetEl) {
        e.preventDefault();
        closeMobile();

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
          window.scrollTo({
            top: targetEl.offsetTop - 80,
            behavior: "auto"
          });
          setActiveNavItem(label);
        } else if (gsapRef.current) {
          gsapRef.current.to(window, {
            scrollTo: { y: targetEl, offsetY: 80, autoKill: false },
            duration: 1.15,
            ease: "power3.out",
          });
        } else {
          window.scrollTo({
            top: targetEl.offsetTop - 80,
            behavior: "smooth"
          });
          setActiveNavItem(label);
        }
      }
    }
  };

  // mobile menu play/reverse trigger
  useEffect(() => {
    if (!mobileTl.current) return;
    if (mobileOpen) {
      mobileTl.current.play();
    } else {
      mobileTl.current.reverse();
    }
  }, [mobileOpen, libsLoaded]);

  /* ── Hover entry/leave with intent delay ─────────────────────────────── */
  const handleServicesEnter = useCallback(() => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    if (resourcesTimerRef.current) clearTimeout(resourcesTimerRef.current);
    setResourcesOpen(false);
    setMegaOpen(true);
  }, []);

  const handleServicesLeave = useCallback(() => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    megaTimerRef.current = setTimeout(() => setMegaOpen(false), 150);
  }, []);

  const handleResourcesEnter = useCallback(() => {
    if (resourcesTimerRef.current) clearTimeout(resourcesTimerRef.current);
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setMegaOpen(false);
    setResourcesOpen(true);
  }, []);

  const handleResourcesLeave = useCallback(() => {
    if (resourcesTimerRef.current) clearTimeout(resourcesTimerRef.current);
    resourcesTimerRef.current = setTimeout(() => setResourcesOpen(false), 150);
  }, []);

  /* ── Keyboard Accessibility: Escape closes menus ── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setResourcesOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* ── Lock body scroll on mobile menu ─────────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* ── Close dropdowns on resize → desktop ─────────────────────────────── */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
        setMegaOpen(false);
        setResourcesOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── Helpers ─────────────────────────────────────────────────────────── */
  const closeMobile = () => {
    setMobileOpen(false);
    setMobileMegaOpen(false);
    setMobileResourcesOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/resources") {
      return (
        pathname === "/about" || pathname.startsWith("/about/") ||
        pathname === "/contact" || pathname.startsWith("/contact/")
      );
    }
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  };

  /* ── Themed Background classes ── */
  const headerBgCls = scrolled
    ? "border-b border-[#005900]/20 dark:bg-[#16191F]/95 bg-white/95 backdrop-blur-md shadow-premium"
    : "border-b border-transparent bg-transparent backdrop-blur-none";

  /* ─────────────────────────────── RENDER ──────────────────────────────── */
  return (
    <>
      {/* ══════════════════════════ HEADER BAR ══════════════════════════ */}
      <header
        ref={headerRef}
        className={[
          "fixed left-0 right-0 top-0 z-[10000] transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500",
          headerBgCls,
        ].join(" ")}
        role="banner"
      >
        {/* Continuous horizontal progress bar */}
        <div className="absolute bottom-0 left-0 h-[2.5px] w-full bg-white/5 overflow-hidden">
          <div
            ref={progressLineRef}
            className="h-full w-full bg-[#005900] origin-left scale-x-0 shadow-[0_0_8px_#005900]"
          />
        </div>

        {/* ── Nav inner (GSAP controls height) ── */}
        <div
          ref={navInnerRef}
          className="mx-auto w-full max-w-[1440px] flex items-center justify-between px-[clamp(1.5rem,4vw,3rem)]"
          style={{ height: 88 }}
        >

          {/* ── Logo ── */}
          <Link
            ref={logoRef}
            href="/"
            className="relative z-10 flex flex-shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:rounded"
            aria-label="Texawave home"
            style={{ transformOrigin: "left center" }}
          >
            {/* Wave pulse ripple element */}
            <div
              ref={logoPulseRef}
              className="absolute inset-0 rounded-lg border border-signal/50 pointer-events-none opacity-0 scale-100"
            />
            <Image
              src="/texawave_logo.webp"
              alt="Texawave"
              width={180}
              height={60}
              className="h-[56px] w-auto object-contain"
              priority
            />
          </Link>

          {/* ── Desktop Navigation ── */}
          <nav
            ref={navRef}
            className="hidden items-center gap-0.5 lg:flex relative"
            aria-label="Primary navigation"
          >

            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);

              /* ── Services → Mega Menu Button ── */
              if (item.label === "Services") {
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={[
                      "group relative desktop-nav-link flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[14.5px] tracking-[-0.01em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:rounded-xl uppercase transition-all duration-300",
                      active || megaOpen
                        ? "navbar-link-active"
                        : "navbar-link",
                    ].join(" ")}
                    data-nav-label="Services"
                    onMouseEnter={() => {
                      handleServicesEnter();
                      setHoveredNavItem("Services");
                    }}
                    onMouseLeave={() => {
                      handleServicesLeave();
                      setHoveredNavItem(null);
                    }}
                    onClick={() => {
                      setMegaOpen((v) => !v);
                    }}
                    aria-haspopup="true"
                    aria-expanded={megaOpen}
                  >
                    {item.label}
                    <ChevronDown
                      size={13}
                      className={[
                        "opacity-70 group-hover:text-signal transition-transform duration-300",
                        megaOpen ? "rotate-180 text-signal" : "",
                      ].join(" ")}
                      aria-hidden="true"
                    />
                  </button>
                );
              }

              /* ── Resources → Dropdown Button ── */
              if (item.label === "Resources") {
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={[
                      "group relative desktop-nav-link flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[14.5px] tracking-[-0.01em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:rounded-xl uppercase transition-all duration-300",
                      active || resourcesOpen
                        ? "navbar-link-active"
                        : "navbar-link",
                    ].join(" ")}
                    data-nav-label="Resources"
                    onMouseEnter={() => {
                      handleResourcesEnter();
                      setHoveredNavItem("Resources");
                    }}
                    onMouseLeave={() => {
                      handleResourcesLeave();
                      setHoveredNavItem(null);
                    }}
                    onClick={() => {
                      setMegaOpen(false);
                      setResourcesOpen((v) => !v);
                    }}
                    aria-haspopup="true"
                    aria-expanded={resourcesOpen}
                  >
                    {item.label}
                    <ChevronDown
                      size={13}
                      className={[
                        "opacity-70 group-hover:text-signal transition-transform duration-300",
                        resourcesOpen ? "rotate-180 text-signal" : "",
                      ].join(" ")}
                      aria-hidden="true"
                    />
                  </button>
                );
              }

              /* ── Regular nav link ── */
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "group relative desktop-nav-link rounded-xl px-4 py-2.5 text-[15px] tracking-[0.02em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:rounded-xl uppercase transition-all duration-300",
                    active ? "navbar-link-active" : "navbar-link",
                  ].join(" ")}
                  data-nav-label={item.label}
                  onMouseEnter={() => setHoveredNavItem(item.label)}
                  onMouseLeave={() => setHoveredNavItem(null)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Right Controls ── */}
          <div className="flex items-center gap-2.5">

            {/* Get In touch CTA (desktop) */}
            <Link
              ref={bookMeetingRef}
              href="/contact"
              id="header-cta-btn"
              className="group relative hidden h-[38px] items-center justify-center overflow-hidden rounded-full border border-[#005900] bg-transparent px-5 text-[12.5px] font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#005900] hover:text-white hover:shadow-[0_0_24px_rgba(0,89,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005900] focus-visible:ring-offset-2 lg:inline-flex"
              aria-label="Get In touch with Texawave"
            >
              <div className="relative flex items-center justify-center overflow-hidden">
                {/* Non-hover state */}
                <div className="flex items-center gap-1.5 transition-all duration-300 ease-out group-hover:-translate-x-[110%] group-hover:opacity-0">
                  <span>Get In touch</span>
                  <ArrowUpRight size={13} className="transition-transform duration-300 text-[#008000]" />
                </div>

                {/* Hover state (slides in from right) */}
                <div className="absolute flex items-center gap-1.5 transition-all duration-300 ease-out translate-x-[110%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 whitespace-nowrap">
                  <span>Get In touch</span>
                  <ArrowUpRight size={13} className="translate-x-0.5 -translate-y-0.5 text-black" />
                </div>
              </div>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle className="shrink-0" />

            {/* Hamburger (mobile) — 3-bar morph to X */}
            <button
              type="button"
              id="mobile-menu-toggle"
              className="flex h-10 w-10 flex-col items-center justify-center rounded-xl border border-white/20 transition-colors duration-200 hover:bg-white/5 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005900]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span className="flex flex-col items-center justify-center gap-[5px]">
                <span
                  className={[
                    "block h-[1.5px] w-5 bg-white origin-center transition-all duration-300 ease-out",
                    mobileOpen ? "translate-y-[6.5px] rotate-45" : "",
                  ].join(" ")}
                />
                <span
                  className={[
                    "block h-[1.5px] w-5 bg-white transition-all duration-300 ease-out",
                    mobileOpen ? "opacity-0 scale-x-0" : "",
                  ].join(" ")}
                />
                <span
                  className={[
                    "block h-[1.5px] w-5 bg-white origin-center transition-all duration-300 ease-out",
                    mobileOpen ? "-translate-y-[6.5px] -rotate-45" : "",
                  ].join(" ")}
                />
              </span>
            </button>
          </div>
        </div>

        {/* ── Desktop Services Mega Menu ── */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-[9999] pointer-events-none">
          <AnimatePresence>
            {megaOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-[1150px] max-w-[95vw] rounded-[20px] border dark:border-white/10 border-[#E5E7EB] dark:bg-bg-primary bg-white shadow-[0_24px_50px_-12px_rgba(0,0,0,0.2),0_0_40px_rgba(140,198,63,0.05)] overflow-hidden pointer-events-auto"
                onMouseEnter={() => {
                  if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
                  setMegaOpen(true);
                }}
                onMouseLeave={handleServicesLeave}
              >
                {/* Split layout */}
                <div className="grid grid-cols-12">

                  {/* Left Side: Category Navigation (vertical) */}
                  <div className="mega-menu-left-panel col-span-4 border-r dark:border-white/5 border-[#E5E7EB] dark:bg-[#0a0a0a] bg-[#F8F9FB] p-6 space-y-2">
                    <p className="mega-section-label text-[11px] font-bold tracking-widest dark:text-white/40 text-[#9CA3AF] uppercase mb-4 px-4">
                      Texawave Offers
                    </p>
                    {MEGA_SERVICES_DATA.map((cat) => {
                      const CategoryIcon = cat.icon;
                      const isActiveCat = activeCategory === cat.id;

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          className={[
                            "mega-cat-btn flex items-center gap-3.5 w-full px-4 py-3.5 rounded-xl border-l-2 transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal",
                            isActiveCat
                              ? "is-active-cat bg-[#8CC63F]/10 border-[#8CC63F] text-[#8CC63F] font-semibold"
                              : "border-transparent dark:text-white/70 dark:hover:text-white dark:hover:bg-white/5"
                          ].join(" ")}
                          onMouseEnter={() => setActiveCategory(cat.id)}
                        >
                          <CategoryIcon size={18} className={["mega-cat-icon", isActiveCat ? "text-[#8CC63F]" : "dark:text-white/40"].join(" ")} />
                          <span className="text-[14px]">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Side: Dynamic Services Card Grid */}
                  <div className="mega-menu-right-panel col-span-8 p-8 dark:bg-[#040404] bg-white">
                    {/* Wrap the service grid in an motion.div to trigger staggered entry transitions on activeCategory changes */}
                    <motion.div
                      key={activeCategory}
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.04
                          }
                        }
                      }}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-2 gap-4"
                    >
                      {MEGA_SERVICES_DATA.find((cat) => cat.id === activeCategory)?.services.map((svc) => (
                        <motion.div
                          key={svc.name}
                          variants={{
                            hidden: { opacity: 0, y: 8 },
                            show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 15 } }
                          }}
                        >
                          <Link
                            href={svc.href}
                            onClick={() => setMegaOpen(false)}
                            className="mega-svc-card group flex flex-col justify-between p-4 rounded-xl border dark:border-white/5 dark:bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal h-full"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className="mega-svc-title font-semibold text-[14px] dark:text-white transition-colors duration-200">
                                {svc.name}
                              </span>
                              <ArrowUpRight
                                size={14}
                                className="text-[#8CC63F] opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0"
                              />
                            </div>
                            <p className="mega-svc-desc mt-1 text-[11.5px] leading-relaxed dark:text-white/50 transition-colors duration-200">
                              {svc.desc}
                            </p>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                </div>

                {/* Bottom CTA Section */}
                <div className="mega-menu-cta-bar border-t dark:border-white/5 border-[#E5E7EB] px-8 py-5 flex flex-col sm:flex-row justify-between items-center dark:bg-[#0a0a0a] bg-[#F8F9FB] gap-4">

                  {/* Left Side: Checkmarks */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] dark:text-white/60">
                    <span className="mega-check-item flex items-center gap-2 font-medium">
                      <Check size={14} className="text-[#8CC63F] flex-shrink-0" /> End-to-End Product Development
                    </span>
                    <span className="mega-check-item flex items-center gap-2 font-medium">
                      <Check size={14} className="text-[#8CC63F] flex-shrink-0" /> Software + Hardware Services
                    </span>
                    <span className="mega-check-item flex items-center gap-2 font-medium">
                      <Check size={14} className="text-[#8CC63F] flex-shrink-0" /> Manufacturing Ready Solutions
                    </span>
                  </div>

                  {/* Right Side: CTA Button */}
                  <Link
                    href="/contact"
                    onClick={() => setMegaOpen(false)}
                    className="flex h-[40px] items-center justify-center rounded-full bg-[#8CC63F] px-6 text-[13px] font-bold text-black hover:scale-105 transition-transform duration-200 hover:shadow-[0_0_20px_rgba(140,198,63,0.4)] whitespace-nowrap"
                  >
                    Book Free Consultation
                  </Link>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>


        {/* ── Desktop Resources Dropdown ── */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-[9999] pointer-events-none">
          <AnimatePresence>
            {resourcesOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-[800px] max-w-[95vw] rounded-[20px] border dark:border-white/10 border-[#E5E7EB] dark:bg-bg-primary bg-white shadow-[0_24px_50px_-12px_rgba(0,0,0,0.15),0_0_40px_rgba(140,198,63,0.05)] overflow-hidden pointer-events-auto"
                onMouseEnter={() => {
                  if (resourcesTimerRef.current) clearTimeout(resourcesTimerRef.current);
                  setResourcesOpen(true);
                }}
                onMouseLeave={handleResourcesLeave}
              >
                <div className="grid grid-cols-12">
                  {/* Left Side: Header Info */}
                  <div className="resources-left-panel col-span-5 dark:bg-[#0a0a0a] border-r dark:border-white/5 border-[#E5E7EB] p-8 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] font-bold tracking-widest text-[#8CC63F] uppercase mb-2">
                        Resources
                      </p>
                      <h3 className="text-[20px] font-extrabold dark:text-white tracking-tight leading-snug">
                        Texawave Insights
                      </h3>
                      <p className="mt-4 text-[12.5px] leading-relaxed dark:text-white/50">
                        Explore Texawave&apos;s company information, career opportunities, technical insights, and customer success stories.
                      </p>
                    </div>
                    {/* Subtle branding or graphic */}
                    <div className="resources-branding-box mt-8 relative overflow-hidden rounded-xl border dark:border-white/5 dark:bg-white/[0.01] p-4">
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#8CC63F]/10 rounded-full blur-xl pointer-events-none" />
                      <p className="resources-eng-label text-[10px] font-bold tracking-wider dark:text-white/40 uppercase">
                        Engineering Center
                      </p>
                      <p className="mt-1 text-[11px] text-[#8CC63F] font-medium">
                        Innovate. Build. Scale.
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Resources Menu Items Grid */}
                  <div className="resources-right-panel col-span-7 p-6 dark:bg-[#040404] flex flex-col gap-2">
                    {RESOURCES_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setResourcesOpen(false)}
                          className={[
                            "resources-item-link group flex items-start gap-4 rounded-xl p-3.5 transition-all duration-300 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal",
                            active
                              ? "is-active-item dark:bg-[#8CC63F]/10 dark:border-[#8CC63F]/20"
                              : "bg-transparent border-transparent dark:hover:bg-white/[0.03] dark:hover:border-white/5 hover:-translate-y-0.5"
                          ].join(" ")}
                        >
                          <span className={[
                            "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                            active
                              ? "bg-[#8CC63F]/20 text-[#8CC63F]"
                              : "bg-[#8CC63F]/10 dark:text-white/70 text-[#8CC63F] group-hover:bg-[#8CC63F]/20 group-hover:text-[#8CC63F]"
                          ].join(" ")}>
                            <Icon size={16} aria-hidden="true" />
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={[
                                "resources-item-title text-[13.5px] font-bold transition-colors duration-200",
                                active ? "text-[#8CC63F]" : "dark:text-white group-hover:text-[#8CC63F]"
                              ].join(" ")}>
                                {item.label}
                              </span>
                              <ArrowUpRight
                                size={13}
                                className={[
                                  "transition-all duration-300",
                                  active
                                    ? "text-[#8CC63F] opacity-100"
                                    : "text-[#8CC63F] opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0"
                                ].join(" ")}
                              />
                            </div>
                            <p className="resources-item-desc mt-1 text-[11.5px] leading-relaxed dark:text-white/50 transition-colors duration-200">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </header>

      {/* ══════════════════════ MOBILE MENU ══════════════════════════════ */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 flex-col dark:bg-bg-primary bg-white lg:hidden"
        style={{ display: "none", opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
      >
        {/* Spacer that matches header height */}
        <div className="mobile-header-spacer h-[88px] flex-none border-b dark:border-white/10 border-[#E5E7EB]" />

        <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-5 pb-16">
          <nav aria-label="Mobile navigation links">
            <ul className="space-y-1" role="list">
              {/* ── HOME mobile link ── */}
              <li className="mobile-nav-item">
                <Link
                  href="/"
                  onClick={closeMobile}
                  className={[
                    "flex items-center rounded-xl px-4 py-3.5 text-[15.5px] font-semibold transition-colors duration-200 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal uppercase",
                    isActive("/") ? "text-signal" : "dark:text-white hover:text-signal",
                  ].join(" ")}
                >
                  Home
                </Link>
              </li>



              {/* ── Services accordion ── */}
              <li className="mobile-nav-item">
                <button
                  type="button"
                  className={[
                    "flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-[15.5px] font-semibold transition-colors duration-200 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal uppercase",
                    mobileMegaOpen ? "text-signal" : "dark:text-white hover:text-signal",
                  ].join(" ")}
                  onClick={() => setMobileMegaOpen((v) => !v)}
                  aria-expanded={mobileMegaOpen}
                >
                  Services
                  <ChevronDown
                    size={16}
                    className={[
                      "text-signal transition-transform duration-300",
                      mobileMegaOpen ? "rotate-180" : "",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={[
                    "overflow-hidden transition-all duration-400 ease-out",
                    mobileMegaOpen ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0",
                  ].join(" ")}
                >
                  <div className="mt-1 space-y-1.5 pl-2">
                    {MEGA_SERVICES_DATA.map((category) => {
                      const CategoryIcon = category.icon;
                      const isCatOpen = mobileCategoryOpen === category.id;

                      return (
                        <div key={category.id} className="rounded-xl overflow-hidden">
                          <button
                            type="button"
                            className={[
                              "mobile-cat-btn flex w-full items-center justify-between px-4 py-3 text-[14px] font-semibold transition-colors duration-200",
                              isCatOpen ? "text-[#8CC63F] bg-[#8CC63F]/5" : "dark:text-white/80"
                            ].join(" ")}
                            onClick={() => setMobileCategoryOpen(isCatOpen ? null : category.id)}
                            aria-expanded={isCatOpen}
                          >
                            <span className="flex items-center gap-2.5">
                              <CategoryIcon size={16} className={isCatOpen ? "text-[#8CC63F]" : "dark:text-white/60"} />
                              {category.label}
                            </span>
                            <ChevronDown
                              size={14}
                              className={[
                                "transition-transform duration-300",
                                isCatOpen ? "rotate-180 text-[#8CC63F]" : "text-white/40",
                              ].join(" ")}
                            />
                          </button>

                          {/* Nested services list */}
                          <div
                            className={[
                              "overflow-hidden transition-all duration-300 ease-out pl-6",
                              isCatOpen ? "max-h-[500px] opacity-100 py-1" : "max-h-0 opacity-0",
                            ].join(" ")}
                          >
                            <div className="space-y-0.5 border-l dark:border-white/10 border-[#E5E7EB] pl-3 py-1">
                              {category.services.map((svc) => (
                                <Link
                                  key={svc.name}
                                  href={svc.href}
                                  onClick={closeMobile}
                                  className="mobile-svc-link block py-2 text-[13px] dark:text-white/70 hover:text-[#8CC63F] transition-colors duration-200 focus-visible:outline-none focus-visible:underline"
                                >
                                  {svc.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <Link
                      href="/services"
                      onClick={closeMobile}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-semibold text-signal hover:opacity-75 focus-visible:outline-none"
                    >
                      All services <ArrowUpRight size={12} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </li>

              {/* ── Case Studies mobile link ── */}
              <li className="mobile-nav-item">
                <Link
                  href="/case-studies"
                  onClick={closeMobile}
                  className={[
                    "flex items-center rounded-xl px-4 py-3.5 text-[15.5px] font-semibold transition-colors duration-200 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal uppercase",
                    isActive("/case-studies") ? "text-signal font-bold" : "dark:text-white hover:text-signal",
                  ].join(" ")}
                >
                  Case Studies
                </Link>
              </li>

              {/* ── Blog mobile link ── */}
              <li className="mobile-nav-item">
                <Link
                  href="/blog"
                  onClick={closeMobile}
                  className={[
                    "flex items-center rounded-xl px-4 py-3.5 text-[15.5px] font-semibold transition-colors duration-200 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal uppercase",
                    isActive("/blog") ? "text-signal font-bold" : "dark:text-white hover:text-signal",
                  ].join(" ")}
                >
                  Blog
                </Link>
              </li>

              {/* ── Resources accordion ── */}
              <li className="mobile-nav-item">
                <button
                  type="button"
                  className={[
                    "flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-[15.5px] font-semibold transition-colors duration-200 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal uppercase",
                    mobileResourcesOpen ? "text-signal" : "dark:text-white hover:text-signal",
                  ].join(" ")}
                  onClick={() => setMobileResourcesOpen((v) => !v)}
                  aria-expanded={mobileResourcesOpen}
                >
                  Resources
                  <ChevronDown
                    size={16}
                    className={[
                      "text-signal transition-transform duration-300",
                      mobileResourcesOpen ? "rotate-180" : "",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={[
                    "overflow-hidden transition-all duration-400 ease-out",
                    mobileResourcesOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
                  ].join(" ")}
                >
                  <div className="mt-1 space-y-0.5 pl-2">
                    {RESOURCES_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobile}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-200 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                        >
                          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-signal/15 text-signal">
                            <Icon size={14} aria-hidden="true" />
                          </span>
                          <div>
                            <p className="mobile-resources-item-title text-[13.5px] font-semibold dark:text-white">
                              {item.label}
                            </p>
                            <p className="mobile-resources-item-desc text-[11.5px] dark:text-white/75">{item.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </li>

              {/* ── Regular mobile links ── */}
              {([
                { label: "Careers", href: "/careers" },
              ] as const).map((item) => (
                <li key={item.href} className="mobile-nav-item">
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className={[
                      "flex items-center rounded-xl px-4 py-3.5 text-[15.5px] font-semibold transition-colors duration-200 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal uppercase",
                      isActive(item.href) ? "text-signal font-bold" : "dark:text-white hover:text-signal",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Divider ── */}
          <div className="mobile-divider my-5 h-px w-full border-b dark:border-white/10 border-[#E5E7EB]" />

          {/* ── CTA button (mobile) ── */}
          <div className="mobile-nav-item">
            <Link
              href="/contact"
              onClick={closeMobile}
              className="group flex items-center justify-center gap-2 rounded-2xl bg-signal px-6 py-4 text-[15px] font-bold text-white shadow-[0_0_20px_rgba(140,198,63,0.35)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(140,198,63,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary uppercase"
            >
              Get In touch
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* ── Theme Toggle (mobile) ── */}
          <div className="mobile-appearance-row mobile-nav-item mt-3 flex items-center justify-between rounded-2xl border dark:border-white/10 border-[#E5E7EB] px-5 py-3">
            <span className="mobile-appearance-label text-[13px] font-medium dark:text-white/60 uppercase tracking-wider">
              Appearance
            </span>
            <ThemeToggle />
          </div>

          {/* ── Brand tagline ── */}
          <p className="mobile-tagline mt-auto pt-8 text-center text-[10.5px] font-medium tracking-[0.2em] dark:text-white/20 uppercase select-none">
            Texawave · Engineering Excellence
          </p>
        </div>
      </div>
    </>
  );
}