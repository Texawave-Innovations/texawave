import { ServiceSubPage } from "@/components/ServiceSubPage";
import { getSubService } from "@/lib/services-v2";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSubService("procurement", "bom-optimization");
  return { 
    title: s?.metaTitle ?? "bom-optimization", 
    description: s?.metaDescription ?? "",
    alternates: {
      canonical: "/procurement/bom-optimization"
    }
  };
}

export default function Page() {
  const sub = getSubService("procurement", "bom-optimization")!;
  return <ServiceSubPage sub={sub} />;
}