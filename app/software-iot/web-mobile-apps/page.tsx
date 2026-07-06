import { ServiceSubPage } from "@/components/ServiceSubPage";
import { getSubService } from "@/lib/services-v2";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const s = getSubService("software-iot", "web-mobile-apps");
  return { 
    title: s?.metaTitle ?? "web-mobile-apps", 
    description: s?.metaDescription ?? "",
    alternates: {
      canonical: "/software-iot/web-mobile-apps"
    }
  };
}

export default function Page() {
  const sub = getSubService("software-iot", "web-mobile-apps")!;
  return <ServiceSubPage sub={sub} />;
}