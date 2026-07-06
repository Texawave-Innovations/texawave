import Link from "next/link";
import {
  ArrowRight,
  Layers3,
  PenTool,
  CircuitBoard,
  Cpu,
  Box,
  BrainCircuit,
  Settings,
  MonitorSmartphone,
  Cloud,
  PackageCheck,
  Waves,
  FileText,
  Factory,
  Cog,
  Repeat,
  ShieldCheck,
  Gauge,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { PageChrome } from "@/components/PageChrome";
import { processSteps } from "@/lib/content";
import type { MainService } from "@/lib/services-v2";

// ─── Icon map ─────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  layers: Layers3,
  penTool: PenTool,
  circuitBoard: CircuitBoard,
  cpu: Cpu,
  box: Box,
  brainCircuit: BrainCircuit,
  settings: Settings,
  monitorSmartphone: MonitorSmartphone,
  cloud: Cloud,
  packageCheck: PackageCheck,
  waves: Waves,
  fileText: FileText,
  factory: Factory,
  cog: Cog,
  repeat: Repeat,
  shieldCheck: ShieldCheck,
  gauge: Gauge,
};

function getIcon(key: string): React.ElementType {
  return ICON_MAP[key] ?? Layers3;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ServiceMainPage({ service }: { service: MainService }) {
  const MainIcon = getIcon(service.iconKey);

  return (
    <PageChrome>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-bg-secondary border-b border-border-primary pb-20 pt-16 text-text-primary">
        {/* Blueprint grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(var(--blueprint-grid) 1px, transparent 1px), linear-gradient(90deg, var(--blueprint-grid) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(140,198,63,0.12) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(140,198,63,0.07) 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)]">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-[13px] text-text-secondary">
            <Link href="/" className="hover:text-signal transition-colors">Home</Link>
            <ChevronRight size={12} className="text-white/30" />
            <span className="text-signal font-semibold">{service.title}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:items-start">
            {/* Left */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3 py-1">
                <MainIcon size={14} className="text-signal" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-signal">
                  {service.label}
                </span>
              </div>

              <h1
                className="text-hero text-text-primary"
                style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
              >
                {service.title}
              </h1>

              <p className="mt-5 max-w-2xl text-body-large text-text-secondary leading-relaxed">
                {service.description}
              </p>


            </div>

            {/* Right — capabilities card */}
            <div className="w-full rounded-2xl border border-border-primary bg-bg-card p-6 shadow-crisp">
              <p className="mb-4 text-small-text font-bold uppercase tracking-[0.15em] text-signal">
                What we deliver
              </p>
              <ul className="grid gap-3">
                {service.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-body-normal font-semibold text-text-secondary">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-signal" size={15} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-border-primary">
                <p className="text-xs text-text-secondary/60 font-medium uppercase tracking-widest mb-3">
                  Sub-services
                </p>
                <div className="grid gap-2">
                  {service.subServices.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/${service.slug}/${sub.slug}`}
                      className="flex items-center gap-2 text-[13px] font-medium text-text-secondary hover:text-signal transition-colors group"
                    >
                      <ArrowRight size={12} className="text-signal/50 group-hover:text-signal transition-colors" />
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Challenges ───────────────────────────────────────────────── */}
      <section className="bg-bg-primary py-20">
        <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)]">
          <div data-reveal className="mb-12 text-center">
            <p className="text-small-text font-bold uppercase tracking-[0.18em] text-signal">
              Technical Challenges We Solve
            </p>
            <h2
              className="mt-3 text-section text-text-primary"
              style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
            >
              Built for the hard problems
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {service.challenges.map((c, i) => (
              <div
                key={i}
                data-reveal
                className="group rounded-2xl border border-border-primary bg-bg-secondary p-7 transition duration-300 hover:border-signal/40 hover:bg-bg-card hover:shadow-crisp"
              >
                <span
                  className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-black"
                  style={{ background: "rgba(140,198,63,0.12)", color: "#8CC63F" }}
                >
                  0{i + 1}
                </span>
                <h3 className="font-bold text-[17px] text-text-primary mb-2"
                  style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}>
                  {c.title}
                </h3>
                <p className="text-body-normal text-text-secondary leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sub-services grid ─────────────────────────────────────────── */}
      <section className="bg-bg-secondary border-y border-border-primary py-20">
        <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)]">
          <div data-reveal className="mb-12 text-center">
            <p className="text-small-text font-bold uppercase tracking-[0.18em] text-signal">
              Our Capabilities
            </p>
            <h2
              className="mt-3 text-section text-text-primary"
              style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
            >
              Everything under one roof
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-body-large text-text-secondary">
              A complete suite of {service.title.toLowerCase()} capabilities delivered by experienced engineers from initial scope through to production-ready outcomes.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {service.subServices.map((sub) => {
              const SubIcon = getIcon(sub.iconKey);
              return (
                <Link
                  key={sub.slug}
                  href={`/${service.slug}/${sub.slug}`}
                  className="service-card-premium group flex flex-col rounded-2xl border border-border-primary bg-bg-card p-6 shadow-crisp transition duration-300 hover:border-signal/40 hover:shadow-[0_8px_30px_rgba(140,198,63,0.1)] hover:-translate-y-1"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-secondary text-text-primary transition-colors duration-300 group-hover:bg-signal group-hover:text-white">
                    <SubIcon size={22} />
                  </div>
                  <h3
                    className="font-bold text-[16px] text-text-primary mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
                  >
                    {sub.name}
                  </h3>
                  <p className="flex-1 text-body-normal text-text-secondary text-[14px] leading-relaxed">
                    {sub.shortDesc}
                  </p>
                  <div className="mt-5 flex items-center gap-1.5 text-[13px] font-semibold text-signal">
                    Explore <ArrowRight size={13} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How we work ──────────────────────────────────────────────── */}
      <section className="bg-bg-primary py-20">
        <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)] grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-reveal>
            <p className="text-small-text font-bold uppercase tracking-[0.18em] text-signal">
              How we work
            </p>
            <h2
              className="mt-3 text-section text-text-primary"
              style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
            >
              Focused support from feasibility through production readiness.
            </h2>
            <p className="mt-5 text-body-large text-text-secondary">
              Texawave can support a single technical workstream or operate as an integrated product development partner across requirements, design, procurement, prototype validation, and manufacturing documentation.
            </p>
          </div>

          <div className="grid gap-4">
            {processSteps.map((step, index) => (
              <div
                data-reveal
                key={step.title}
                className="group flex gap-5 rounded-2xl border border-border-primary bg-bg-secondary p-5 transition duration-300 hover:border-signal hover:bg-bg-card hover:shadow-crisp"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-signal/10 text-sm font-black text-signal transition group-hover:bg-signal group-hover:text-white">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-[15px] font-bold text-text-primary"
                    style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}>
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-body-normal text-text-secondary">{step.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <section className="bg-bg-secondary border-t border-border-primary py-20 text-text-primary">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center px-[clamp(1rem,4vw,4rem)]">
          <div
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "rgba(140,198,63,0.12)", border: "1px solid rgba(140,198,63,0.25)" }}
          >
            <MainIcon size={32} className="text-signal" />
          </div>
          <h2
            className="text-section text-text-primary"
            style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
          >
            Ready to start your {service.title.toLowerCase()} project?
          </h2>
          <p className="mt-4 max-w-xl text-body-large text-text-secondary">
            Book a free feasibility call and our engineering team will assess your requirements within 24 hours.
          </p>
          <Link
            href="/contact"
            className="cta-magnetic mt-8 inline-flex items-center gap-2 rounded-xl bg-signal px-7 py-4 font-bold text-white border border-transparent hover:opacity-90 transition-opacity"
          >
            Book Free Feasibility Call <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </PageChrome>
  );
}