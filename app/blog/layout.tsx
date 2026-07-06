import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Insights & Tech Blog",
  description:
    "Read the Texawave engineering blog for technical insights, hardware design guides, embedded systems deep-dives, and custom software development trends.",
  alternates: {
    canonical: "/blog"
  }
};

export default function BlogLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
