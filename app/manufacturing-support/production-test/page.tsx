import { ServiceSubPage } from "@/components/ServiceSubPage";
import { getSubService } from "@/lib/services-v2";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSubService("manufacturing-support", "production-test");
  return { 
    title: s?.metaTitle ?? "production-test", 
    description: s?.metaDescription ?? "",
    alternates: {
      canonical: "/manufacturing-support/production-test"
    }
  };
}

export default function Page() {
  const sub = getSubService("manufacturing-support", "production-test")!;
  return <ServiceSubPage sub={sub} />;
}