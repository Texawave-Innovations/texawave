"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageChrome } from "@/components/PageChrome";
import { User, Shield, Mail, Calendar, Key, CheckCircle, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { userProfile, logout } = useAuth();

  return (
    <ProtectedRoute>
      <PageChrome>
        <div className="min-h-[80vh] bg-bg-primary text-text-primary py-20 flex items-center justify-center relative px-4">
          {/* Blueprint Grid pattern */}
          <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
          
          {/* Ambient glowing circles */}
          <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-[#8CC63F]/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-[#14B8A6]/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 w-full max-w-xl bg-bg-card border border-border-primary rounded-3xl p-8 shadow-premium backdrop-blur-md">
            <div className="flex flex-col items-center text-center">
              {/* Profile Icon Avatar */}
              <div className="h-20 w-20 rounded-full bg-[#8CC63F]/10 border border-[#8CC63F]/30 flex items-center justify-center text-[#8CC63F] mb-6">
                <User size={36} />
              </div>

              <h1 className="text-2xl font-bold font-display tracking-tight text-text-primary">
                {userProfile?.name}
              </h1>
              
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono font-semibold text-[#8CC63F]">
                <Shield size={12} />
                <span>{userProfile?.role?.toUpperCase()}</span>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="mt-8 space-y-4 font-sans text-sm">
              <div className="flex justify-between items-center py-3 border-b border-border-primary">
                <span className="text-text-secondary flex items-center gap-2">
                  <Mail size={16} /> Email Address
                </span>
                <span className="font-semibold text-text-primary">{userProfile?.email}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border-primary">
                <span className="text-text-secondary flex items-center gap-2">
                  <Key size={16} /> User UID
                </span>
                <span className="font-mono text-xs text-text-secondary">{userProfile?.uid}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border-primary">
                <span className="text-text-secondary flex items-center gap-2">
                  <Calendar size={16} /> Member Since
                </span>
                <span className="font-semibold text-text-primary">
                  {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border-primary">
                <span className="text-text-secondary flex items-center gap-2">
                  <CheckCircle size={16} /> Account Status
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-500">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Active
                </span>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="w-full mt-8 bg-red-950/40 hover:bg-red-900/30 border border-red-500/20 text-red-400 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={14} /> Log Out Account
            </button>
          </div>
        </div>
      </PageChrome>
    </ProtectedRoute>
  );
}
