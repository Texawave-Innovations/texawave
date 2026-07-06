import { ServiceSubPage } from "@/components/ServiceSubPage";
import { getSubService } from "@/lib/services-v2";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSubService("product-engineering", "rapid-prototyping");
  return { 
    title: s?.metaTitle ?? "rapid-prototyping", 
    description: s?.metaDescription ?? "",
    alternates: {
      canonical: "/product-engineering/rapid-prototyping"
    }
  };
}

export default function Page() {
  const sub = getSubService("product-engineering", "rapid-prototyping")!;
  return <ServiceSubPage sub={sub} />;
}