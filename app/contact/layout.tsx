import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Connect With Engineers",
  description:
    "Need technical support or have a new project? Contact Texawave today to speak with our engineering team about custom hardware, software, and AI solutions.",
  alternates: {
    canonical: "/contact"
  }
};

export default function ContactLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
