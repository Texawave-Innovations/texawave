"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageChrome } from "@/components/PageChrome";
import { useRouter } from "next/navigation";
import { Cpu, ShieldAlert, ArrowRight, User, Layout, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GeneralDashboardPage() {
  const { userProfile } = useAuth();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <PageChrome>
        <div className="min-h-[80vh] bg-bg-primary text-text-primary py-20 flex items-center justify-center relative px-4">
          <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
          
          <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-[#8CC63F]/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-[#14B8A6]/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 w-full max-w-2xl bg-bg-card border border-border-primary rounded-3xl p-8 shadow-premium backdrop-blur-md text-center">
            <div className="h-14 w-14 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/30 flex items-center justify-center text-[#14B8A6] mx-auto mb-6">
              <Layout size={28} />
            </div>

            <h1 className="text-3xl font-extrabold font-display tracking-tight text-text-primary">
              Welcome back, {userProfile?.name}!
            </h1>
            <p className="mt-2 text-text-secondary text-sm">
              Logged in successfully as <strong className="text-[#8CC63F]">{userProfile?.role}</strong>.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 text-left font-sans">
              <div className="p-5 border border-border-primary bg-bg-primary/50 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-text-primary flex items-center gap-2">
                    <User size={16} className="text-[#8CC63F]" /> My Profile
                  </h3>
                  <p className="text-xs text-text-secondary mt-1.5">
                    View account status, member details, and security configurations.
                  </p>
                </div>
                <Link href="/profile" className="mt-4 text-xs font-bold text-[#8CC63F] hover:underline inline-flex items-center gap-1">
                  Go to Profile <ArrowRight size={12} />
                </Link>
              </div>

              {(userProfile?.role === "admin" || userProfile?.role === "super_admin" || userProfile?.role === "hr") ? (
                <div className="p-5 border border-border-primary bg-bg-primary/50 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-text-primary flex items-center gap-2">
                      <Cpu size={16} className="text-[#14B8A6]" /> Work Portal
                    </h3>
                    <p className="text-xs text-text-secondary mt-1.5">
                      Access the Administrative and Human Resources operational panels.
                    </p>
                  </div>
                  <Link 
                    href={userProfile.role === "hr" ? "/hr/dashboard" : "/admin/dashboard"} 
                    className="mt-4 text-xs font-bold text-[#14B8A6] hover:underline inline-flex items-center gap-1"
                  >
                    Enter Portal <ArrowRight size={12} />
                  </Link>
                </div>
              ) : (
                <div className="p-5 border border-red-500/10 bg-red-950/5 rounded-2xl flex flex-col justify-between opacity-80">
                  <div>
                    <h3 className="font-bold text-red-400 flex items-center gap-2">
                      <ShieldAlert size={16} /> Restricted Portal
                    </h3>
                    <p className="text-xs text-text-secondary mt-1.5">
                      Administrative & Recruitment sections are protected by secure route guards.
                    </p>
                  </div>
                  <span className="mt-4 text-[10px] uppercase font-bold text-text-secondary block">
                    Access Unavailable
                  </span>
                </div>
              )}
            </div>

            <div className="mt-10 border-t border-border-primary pt-6">
              <Link 
                href="/" 
                className="text-xs text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-1 font-semibold"
              >
                <ArrowLeft size={12} /> Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </PageChrome>
    </ProtectedRoute>
  );
}
