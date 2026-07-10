import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CheckList } from "@/components/CheckList";
import { PageChrome } from "@/components/PageChrome";
import { processSteps, services } from "@/lib/content";

export function ServiceDetail({ slug }: { slug: string }) {
  const service = services.find((item) => item.slug === slug);
  if (!service) return null;

  const Icon = service.icon;
  const subServices = (service as typeof service & { subServices?: { icon: React.ElementType; title: string; desc: string }[] }).subServices ?? [];

  return (
    <PageChrome>

      {/* ── Hero — solid background ── */}
      <section className="relative overflow-hidden bg-bg-secondary border-b border-border-primary pb-16 pt-20 text-text-primary">
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
        {/* Radial accent glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0, 89, 0, 0.3) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0, 89, 0, 0.2) 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)] grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
          {/* Left: title + description + CTA */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3 py-1">
              <Icon size={14} className="text-signal" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-signal">
                Texawave Service
              </span>
            </div>
            <h1 className="mt-2 text-hero">
              {service.title}
            </h1>
            <p className="mt-5 max-w-2xl text-body-large text-text-secondary">{service.short}</p>
            <Link
              href="/contact"
              className="cta-magnetic mt-8 inline-flex items-center gap-2 rounded-xl bg-signal px-6 py-3.5 font-bold text-white border border-transparent"
            >
              Discuss your project <ArrowRight size={18} />
            </Link>
          </div>

          {/* Right: Deliverables card */}
          <div className="w-full rounded-2xl border border-border-primary bg-bg-card p-6 shadow-crisp lg:w-80">
            <p className="mb-4 text-small-text font-bold uppercase tracking-[0.15em] text-signal">
              What we deliver
            </p>
            <CheckList items={service.deliverables} />
          </div>
        </div>
      </section>

      {/* ── Our Services Cards ── */}
      {subServices.length > 0 && (
        <section className="bg-mist py-20">
          <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)]">
            {/* Section heading */}
            <div data-reveal className="mb-12 text-center">
              <p className="text-small-text font-bold uppercase tracking-[0.18em] text-signal">Our Services</p>
              <h2 className="mt-3 text-section text-ink">
                What we offer in {service.title}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-body-large text-graphite">
                A complete suite of{" "}
                {service.title.toLowerCase()} capabilities delivered by experienced engineers — from
                initial design through to production-ready outcomes.
              </p>
            </div>

            {/* Cards grid */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {subServices.map((sub, idx) => {
                const SubIcon = sub.icon;
                return (
                  <div
                    key={idx}
                    data-reveal
                    className="service-card-premium group flex flex-col rounded-2xl border border-border-primary bg-bg-card p-6 shadow-crisp transition duration-300"
                  >
                    {/* Icon */}
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-secondary text-text-primary transition-colors duration-300 group-hover:bg-signal group-hover:text-white">
                      <SubIcon size={22} />
                    </div>

                    {/* Title */}
                    <h3 className="text-card text-ink">{sub.title}</h3>

                    {/* Description */}
                    <p className="mt-3 flex-1 text-body-normal text-graphite">{sub.desc}</p>

                    {/* Hover bottom accent */}
                    <div className="mt-5 h-0.5 w-0 rounded-full bg-signal transition-all duration-300 group-hover:w-full" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Engagement Model ── */}
      <section className="bg-bg-primary py-20">
        <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)] grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-reveal>
            <p className="text-small-text font-bold uppercase tracking-[0.18em] text-signal">
              Engagement model
            </p>
            <h2 className="mt-3 text-section text-ink">
              Focused support from feasibility through production readiness.
            </h2>
            <p className="mt-5 text-body-large text-graphite">
              Texawave can support a single technical workstream or operate as an integrated product
              development partner across requirements, design, procurement, prototype validation, and
              manufacturing documentation.
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
                  <h3 className="text-card text-text-primary">{step.title}</h3>
                  <p className="mt-1.5 text-body-normal text-text-secondary">{step.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-bg-secondary border-t border-border-primary py-16 text-text-primary">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center px-[clamp(1rem,4vw,4rem)]">
          <Icon size={40} className="mb-5 text-signal" />
          <h2 className="text-section text-text-primary">
            Ready to start your {service.title.toLowerCase()} project?
          </h2>
          <p className="mt-4 max-w-xl text-body-large text-text-secondary">
            Book a free feasibility call and our engineering team will assess your requirements
            within 24 hours.
          </p>
          <Link
            href="/contact"
            className="cta-magnetic mt-8 inline-flex items-center gap-2 rounded-xl bg-signal px-7 py-4 font-bold text-white border border-transparent"
          >
            Book Free Feasibility Call <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </PageChrome>
  );
}
