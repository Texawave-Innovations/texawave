import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Careers & Engineering Jobs",
  description:
    "Advance your career with Texawave. We are hiring talented developers, hardware engineers, and innovators to build cutting-edge systems and products.",
  alternates: {
    canonical: "/careers"
  }
};

export default function CareersLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
