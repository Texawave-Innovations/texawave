import { ServiceSubPage } from "@/components/ServiceSubPage";
import { getSubService } from "@/lib/services-v2";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSubService("software-iot", "cloud-infrastructure");
  return { 
    title: s?.metaTitle ?? "cloud-infrastructure", 
    description: s?.metaDescription ?? "",
    alternates: {
      canonical: "/software-iot/cloud-infrastructure"
    }
  };
}

export default function Page() {
  const sub = getSubService("software-iot", "cloud-infrastructure")!;
  return <ServiceSubPage sub={sub} />;
}