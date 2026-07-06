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
import type { SubService } from "@/lib/services-v2";

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
export function ServiceSubPage({ sub }: { sub: SubService }) {
  const SubIcon = getIcon(sub.iconKey);

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
        {/* Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(140,198,63,0.1) 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)]">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-[13px] text-text-secondary flex-wrap">
            <Link href="/" className="hover:text-signal transition-colors">Home</Link>
            <ChevronRight size={12} className="text-white/30" />
            <Link href={`/${sub.parentSlug}`} className="hover:text-signal transition-colors">
              {sub.parentTitle}
            </Link>
            <ChevronRight size={12} className="text-white/30" />
            <span className="text-signal font-semibold">{sub.title}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:items-start">
            {/* Left */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3 py-1">
                <SubIcon size={14} className="text-signal" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-signal">
                  {sub.parentTitle}
                </span>
              </div>

              <h1
                className="text-hero text-text-primary"
                style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
              >
                {sub.heroTitle}
              </h1>

              <p
                className="mt-3 text-[15px] font-semibold"
                style={{ color: "#8CC63F" }}
              >
                {sub.tagline}
              </p>

              <p className="mt-5 max-w-2xl text-body-large text-text-secondary leading-relaxed">
                {sub.description}
              </p>


            </div>

            {/* Right — highlights card */}
            <div className="w-full rounded-2xl border border-border-primary bg-bg-card p-6 shadow-crisp">
              <p className="mb-4 text-small-text font-bold uppercase tracking-[0.15em] text-signal">
                Key highlights
              </p>
              <ul className="grid gap-3">
                {sub.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-body-normal font-semibold text-text-secondary">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-signal" size={15} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-border-primary">
                <Link
                  href="/contact"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-signal/40 bg-signal/10 px-4 py-3 text-sm font-bold text-signal hover:bg-signal/20 transition-colors"
                >
                  Discuss this service <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Capabilities ────────────────────────────────────────── */}
      <section className="bg-bg-primary py-20">
        <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)]">
          <div data-reveal className="mb-12 text-center">
            <p className="text-small-text font-bold uppercase tracking-[0.18em] text-signal">
              Core Capabilities
            </p>
            <h2
              className="mt-3 text-section text-text-primary"
              style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
            >
              What we do in {sub.title.toString()}
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {sub.capabilities.map((cap, idx) => (
              <div
                key={idx}
                data-reveal
                className="service-card-premium group flex flex-col rounded-2xl border border-border-primary bg-bg-secondary p-6 shadow-crisp transition duration-300 hover:border-signal/40 hover:bg-bg-card hover:shadow-[0_8px_30px_rgba(140,198,63,0.08)]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-bg-card text-signal border border-border-primary">
                  <span className="text-xs font-black">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3
                  className="text-[15px] font-bold text-text-primary mb-2"
                  style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
                >
                  {cap.title}
                </h3>
                <p className="flex-1 text-body-normal text-text-secondary text-[14px] leading-relaxed">
                  {cap.desc}
                </p>
                <div className="mt-5 h-0.5 w-0 rounded-full bg-signal transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <section className="bg-bg-secondary border-t border-border-primary py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center px-[clamp(1rem,4vw,4rem)]">
          <div
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "rgba(140,198,63,0.12)", border: "1px solid rgba(140,198,63,0.25)" }}
          >
            <SubIcon size={32} className="text-signal" />
          </div>

          <h2
            className="text-section text-text-primary"
            style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
          >
            Ready to shape your next {sub.title.toString()} Project?
          </h2>
          <p className="mt-4 max-w-xl text-body-large text-text-secondary">
            Bring us your technical specifications or rough concepts. Our engineers will respond within 24 hours.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="cta-magnetic inline-flex items-center gap-2 rounded-xl bg-signal px-7 py-4 font-bold text-white border border-transparent hover:opacity-90 transition-opacity"
            >
              Get in Touch <ArrowRight size={18} />
            </Link>
            <Link
              href={`/${sub.parentSlug}`}
              className="inline-flex items-center gap-2 rounded-xl border border-border-primary px-6 py-4 text-sm font-semibold text-text-secondary hover:border-signal/40 hover:text-signal transition-all"
            >
              ← All {sub.parentTitle} Services
            </Link>
          </div>
        </div>
      </section>
    </PageChrome>
  );
}