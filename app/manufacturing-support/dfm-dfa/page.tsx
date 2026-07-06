import { ServiceSubPage } from "@/components/ServiceSubPage";
import { getSubService } from "@/lib/services-v2";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSubService("manufacturing-support", "dfm-dfa");
  return { 
    title: s?.metaTitle ?? "dfm-dfa", 
    description: s?.metaDescription ?? "",
    alternates: {
      canonical: "/manufacturing-support/dfm-dfa"
    }
  };
}

export default function Page() {
  const sub = getSubService("manufacturing-support", "dfm-dfa")!;
  return <ServiceSubPage sub={sub} />;
}