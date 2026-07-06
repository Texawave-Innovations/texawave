import { ServiceSubPage } from "@/components/ServiceSubPage";
import { getSubService } from "@/lib/services-v2";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSubService("software-iot", "custom-erp");
  return { 
    title: s?.metaTitle ?? "custom-erp", 
    description: s?.metaDescription ?? "",
    alternates: {
      canonical: "/software-iot/custom-erp"
    }
  };
}

export default function Page() {
  const sub = getSubService("software-iot", "custom-erp")!;
  return <ServiceSubPage sub={sub} />;
}