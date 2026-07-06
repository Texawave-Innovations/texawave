import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageChrome } from "@/components/PageChrome";
import { services } from "@/lib/content";

export const metadata = {
  title: "Services",
  description:
    "Texawave provides mechanical design services, PCB design and prototyping, embedded systems development, procurement services, and IoT product development.",
  alternates: {
    canonical: "/services"
  }
};

export default function ServicesPage() {
  return (
    <PageChrome>
      <section className="bg-bg-secondary border-b border-border-primary py-20">
        <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)]">
          <p className="text-small-text font-bold uppercase tracking-[0.18em] text-signal">Services</p>
          <h1 className="mt-3 max-w-4xl text-hero text-text-primary">End-to-end engineering for market-ready hardware products.</h1>
          <p className="mt-6 max-w-3xl text-body-large text-text-secondary">
            Texawave helps global clients connect software engineering, electrical engineering, mechanical engineering, procurement, prototyping, and production support into one practical product development path.
          </p>
        </div>
      </section>
      <section className="bg-bg-primary py-16">
        <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)] grid gap-6 md:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link data-reveal href={`/${service.slug}`} key={service.slug} className="service-card-premium group rounded-2xl border border-border-primary bg-bg-secondary p-7 transition duration-300">
                <Icon className="text-signal" size={32} />
                <h2 className="mt-5 text-card text-text-primary">{service.title}</h2>
                <p className="mt-3 text-body-normal text-text-secondary">{service.short}</p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {service.deliverables.map((item) => (
                    <span key={item} className="flex gap-2 text-body-normal font-semibold text-text-secondary">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-signal" size={16} />
                      {item}
                    </span>
                  ))}
                </div>
                <span className="mt-7 inline-flex items-center gap-2 font-bold text-signal">
                  Explore service <ArrowRight size={18} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </PageChrome>
  );
}
