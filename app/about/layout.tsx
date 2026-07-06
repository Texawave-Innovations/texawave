import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us & Our Engineering Vision",
  description:
    "Learn about Texawave & our engineering vision. We bridge hardware and cloud with automated DevOps, secure IoT networks, and smart product design.",
  alternates: {
    canonical: "/about"
  }
};

export default function AboutLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
