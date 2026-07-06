import { ServiceMainPage } from "@/components/ServiceMainPage";
import { getMainService } from "@/lib/services-v2";
import type { Metadata } from "next";

const SLUG = "manufacturing-support";

export async function generateMetadata(): Promise<Metadata> {
  const s = getMainService(SLUG);
  return { 
    title: s?.metaTitle ?? SLUG, 
    description: s?.metaDescription ?? "",
    alternates: {
      canonical: "/manufacturing-support"
    }
  };
}

export default function Page() {
  const service = getMainService(SLUG)!;
  return <ServiceMainPage service={service} />;
}