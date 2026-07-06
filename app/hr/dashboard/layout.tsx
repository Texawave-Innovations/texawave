import { Metadata } from "next";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "HR Dashboard",
  alternates: {
    canonical: "/hr/dashboard"
  }
};

export default function HRDashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["hr", "admin", "super_admin"]}>
      {children}
    </ProtectedRoute>
  );
}
