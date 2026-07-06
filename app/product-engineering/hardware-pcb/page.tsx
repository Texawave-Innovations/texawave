import { ServiceSubPage } from "@/components/ServiceSubPage";
import { getSubService } from "@/lib/services-v2";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSubService("product-engineering", "hardware-pcb");
  return { 
    title: s?.metaTitle ?? "hardware-pcb", 
    description: s?.metaDescription ?? "",
    alternates: {
      canonical: "/product-engineering/hardware-pcb"
    }
  };
}

export default function Page() {
  const sub = getSubService("product-engineering", "hardware-pcb")!;
  return <ServiceSubPage sub={sub} />;
}