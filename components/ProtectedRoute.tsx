"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"super_admin" | "admin" | "hr" | "user" | "guest">;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Check if user is authenticated (and is not an anonymous guest unless guest is explicitly allowed)
      const isAuthenticated = user && !user.isAnonymous;
      const currentRole = userProfile?.role || "guest";

      if (allowedRoles) {
        const hasAccess = allowedRoles.includes(currentRole);
        if (!hasAccess) {
          router.push("/login");
        }
      } else {
        // Logged-in user check only (e.g. for /profile/* or /dashboard/*)
        if (!isAuthenticated) {
          router.push("/login");
        }
      }
    }
  }, [user, userProfile, loading, allowedRoles, router]);

  // Loading indicator matching the theme
  if (loading || (allowedRoles && !allowedRoles.includes(userProfile?.role || "guest"))) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center text-white relative">
        {/* Blueprint Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
        
        {/* Ambient glowing circles */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-[#8CC63F]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#14B8A6]/5 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-[#8CC63F] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs font-bold uppercase tracking-wider text-text-secondary font-mono animate-pulse">
            Verifying secure credentials...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
