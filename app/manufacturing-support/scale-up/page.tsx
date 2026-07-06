import { ServiceSubPage } from "@/components/ServiceSubPage";
import { getSubService } from "@/lib/services-v2";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSubService("manufacturing-support", "scale-up");
  return { 
    title: s?.metaTitle ?? "scale-up", 
    description: s?.metaDescription ?? "",
    alternates: {
      canonical: "/manufacturing-support/scale-up"
    }
  };
}

export default function Page() {
  const sub = getSubService("manufacturing-support", "scale-up")!;
  return <ServiceSubPage sub={sub} />;
}