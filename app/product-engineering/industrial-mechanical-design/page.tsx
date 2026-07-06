import { ServiceSubPage } from "@/components/ServiceSubPage";
import { getSubService } from "@/lib/services-v2";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSubService("product-engineering", "industrial-mechanical-design");
  return { 
    title: s?.metaTitle ?? "industrial-mechanical-design", 
    description: s?.metaDescription ?? "",
    alternates: {
      canonical: "/product-engineering/industrial-mechanical-design"
    }
  };
}

export default function Page() {
  const sub = getSubService("product-engineering", "industrial-mechanical-design")!;
  return <ServiceSubPage sub={sub} />;
}