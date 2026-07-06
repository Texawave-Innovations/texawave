"use client";

import dynamic from "next/dynamic";

const HRDashboard = dynamic(() => import("@/components/HRDashboard"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center text-white">
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
      <div className="h-10 w-10 border-4 border-[#8CC63F] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Verifying access...</p>
    </div>
  )
});

export default function HRDashboardPage() {
  return <HRDashboard />;
}
