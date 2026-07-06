import { ServiceSubPage } from "@/components/ServiceSubPage";
import { getSubService } from "@/lib/services-v2";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSubService("software-iot", "ai-analytics");
  return { 
    title: s?.metaTitle ?? "ai-analytics", 
    description: s?.metaDescription ?? "",
    alternates: {
      canonical: "/software-iot/ai-analytics"
    }
  };
}

export default function Page() {
  const sub = getSubService("software-iot", "ai-analytics")!;
  return <ServiceSubPage sub={sub} />;
}