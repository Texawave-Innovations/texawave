import { ServiceSubPage } from "@/components/ServiceSubPage";
import { getSubService } from "@/lib/services-v2";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSubService("manufacturing-support", "production-transfer");
  return { 
    title: s?.metaTitle ?? "production-transfer", 
    description: s?.metaDescription ?? "",
    alternates: {
      canonical: "/manufacturing-support/production-transfer"
    }
  };
}

export default function Page() {
  const sub = getSubService("manufacturing-support", "production-transfer")!;
  return <ServiceSubPage sub={sub} />;
}