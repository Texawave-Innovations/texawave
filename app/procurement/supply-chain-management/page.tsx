import { ServiceSubPage } from "@/components/ServiceSubPage";
import { getSubService } from "@/lib/services-v2";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSubService("procurement", "supply-chain-management");
  return { 
    title: s?.metaTitle ?? "supply-chain-management", 
    description: s?.metaDescription ?? "",
    alternates: {
      canonical: "/procurement/supply-chain-management"
    }
  };
}

export default function Page() {
  const sub = getSubService("procurement", "supply-chain-management")!;
  return <ServiceSubPage sub={sub} />;
}