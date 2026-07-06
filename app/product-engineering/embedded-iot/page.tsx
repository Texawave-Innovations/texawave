import { ServiceSubPage } from "@/components/ServiceSubPage";
import { getSubService } from "@/lib/services-v2";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSubService("product-engineering", "embedded-iot");
  return { 
    title: s?.metaTitle ?? "embedded-iot", 
    description: s?.metaDescription ?? "",
    alternates: {
      canonical: "/product-engineering/embedded-iot"
    }
  };
}

export default function Page() {
  const sub = getSubService("product-engineering", "embedded-iot")!;
  return <ServiceSubPage sub={sub} />;
}