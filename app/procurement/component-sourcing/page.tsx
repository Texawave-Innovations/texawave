import { ServiceSubPage } from "@/components/ServiceSubPage";
import { getSubService } from "@/lib/services-v2";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSubService("procurement", "component-sourcing");
  return { 
    title: s?.metaTitle ?? "component-sourcing", 
    description: s?.metaDescription ?? "",
    alternates: {
      canonical: "/procurement/component-sourcing"
    }
  };
}

export default function Page() {
  const sub = getSubService("procurement", "component-sourcing")!;
  return <ServiceSubPage sub={sub} />;
}