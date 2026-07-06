import { ServiceMainPage } from "@/components/ServiceMainPage";
import { getMainService } from "@/lib/services-v2";
import type { Metadata } from "next";

const SLUG = "product-engineering";

export async function generateMetadata(): Promise<Metadata> {
  const s = getMainService(SLUG);
  return { 
    title: s?.metaTitle ?? SLUG, 
    description: s?.metaDescription ?? "",
    alternates: {
      canonical: "/product-engineering"
    }
  };
}

export default function Page() {
  const service = getMainService(SLUG)!;
  return <ServiceMainPage service={service} />;
}