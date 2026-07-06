import { Metadata } from "next";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  alternates: {
    canonical: "/admin/dashboard"
  }
};

export default function AdminDashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      {children}
    </ProtectedRoute>
  );
}
