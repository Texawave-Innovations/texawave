"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageChrome } from "@/components/PageChrome";
import dynamic from "next/dynamic";
import { ref, onValue, push, set, update } from "firebase/database";
import { db, auth } from "@/lib/firebase";

const CandidateView = dynamic(() => import("./CandidateView").then(m => m.CandidateView), {
  ssr: false,
  loading: () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-bg-primary">
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
      <div className="h-10 w-10 border-4 border-signal border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-xs text-text-secondary uppercase tracking-[0.2em] font-bold">Initializing Portal...</p>
    </div>
  )
});
import { Job, WalkInDrive, CareerUpdate, Application } from "./types";


export default function CareersPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Core Database States
  const [jobs, setJobs] = useState<Job[]>([]);
  const [walkins, setWalkins] = useState<WalkInDrive[]>([]);
  const [updates, setUpdates] = useState<CareerUpdate[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  // Temporary useEffect to clean up seeded initial data from Realtime Database
  useEffect(() => {
    const cleanUpDb = async () => {
      const { ref: dbRef, remove } = await import("firebase/database");
      const jobIds = ["job-1", "job-2", "job-3", "job-4", "job-5", "job-6"];
      const walkinIds = ["walkin-1", "walkin-2"];
      const updateIds = ["update-1", "update-2", "update-3", "update-4"];
      const appIds = ["app-1", "app-2", "app-3", "app-4", "app-5"];

      for (const id of jobIds) {
        await remove(dbRef(db, `jobs/${id}`));
      }
      for (const id of walkinIds) {
        await remove(dbRef(db, `walkins/${id}`));
      }
      for (const id of updateIds) {
        await remove(dbRef(db, `updates/${id}`));
      }
      for (const id of appIds) {
        await remove(dbRef(db, `careerApplications/${id}`));
        await remove(dbRef(db, `applicationComments/${id}`));
      }
      console.log("Database clean up of initial data complete!");
    };
    cleanUpDb();
  }, []);

  // Real-time synchronization with Firebase RTDB
  useEffect(() => {
    // 1. Listen to Jobs
    const jobsRef = ref(db, "jobs");
    const unsubscribeJobs = onValue(jobsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedJobs = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setJobs(loadedJobs);
      } else {
        setJobs([]);
      }
    });

    // 2. Listen to Walk-in Drives
    const walkinsRef = ref(db, "walkins");
    const unsubscribeWalkins = onValue(walkinsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedWalkins = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setWalkins(loadedWalkins);
      } else {
        setWalkins([]);
      }
    });

    // 3. Listen to Life updates / Feed
    const updatesRef = ref(db, "updates");
    const unsubscribeUpdates = onValue(updatesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedUpdates = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setUpdates(loadedUpdates);
      } else {
        setUpdates([]);
      }
    });

    // 4. Listen to Career Applications
    const appsRef = ref(db, "careerApplications");
    const unsubscribeApps = onValue(appsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedApps = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setApplications(loadedApps);
        // Sync with legacy localStorage for page scripts
        localStorage.setItem("texawave_applications", JSON.stringify(loadedApps));
      } else {
        setApplications([]);
      }
    });

    setIsMounted(true);

    return () => {
      unsubscribeJobs();
      unsubscribeWalkins();
      unsubscribeUpdates();
      unsubscribeApps();
    };
  }, []);

  // Candidate: Job Application Submission
  const handleApply = async (formData: {
    jobId: string;
    jobTitle: string;
    name: string;
    email: string;
    phone: string;
    resumeName: string;
    message: string;
  }) => {
    const appId = `app-${Date.now()}`;
    const resumeId = `resume-${Date.now()}`;
    const userId = auth.currentUser?.uid || "guest";
    const now = new Date().toISOString();

    const newApp = {
      id: appId,
      jobId: formData.jobId,
      jobTitle: formData.jobTitle,
      candidateName: formData.name,
      email: formData.email,
      phone: formData.phone,
      resumeName: formData.resumeName,
      message: formData.message,
      createdAt: now,
      role: formData.jobTitle, // CandidateAppliedPosition
      experience: "Not Specified",
      status: "new"
    };

    const newResume = {
      userId,
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone,
      position: formData.jobTitle,
      experience: "Not Specified",
      coverLetter: formData.message,
      fileName: formData.resumeName,
      fileSize: "Under 5MB", // Mock file metadata size
      status: "pending",
      createdAt: now
    };

    // Save to /careerApplications and /resumes nodes in Realtime Database
    await set(ref(db, `careerApplications/${appId}`), newApp);
    await set(ref(db, `resumes/${resumeId}`), newResume);
  };

  // Candidate: Like a Feed Post
  const handleLikeUpdate = async (id: string) => {
    const updateRef = ref(db, `updates/${id}`);
    const match = updates.find(u => u.id === id);
    if (match) {
      await update(updateRef, { likes: (match.likes || 0) + 1 });
    }
  };

  // Loading state during mount checks
  if (!isMounted) {
    return (
      <PageChrome>
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-bg-primary">
          <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
          <div className="h-10 w-10 border-4 border-signal border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs text-text-secondary uppercase tracking-[0.2em] font-bold">Initializing Portal...</p>
        </div>
      </PageChrome>
    );
  }

  return (
    <PageChrome>
      <CandidateView
        jobs={jobs}
        onApply={handleApply}
      />
    </PageChrome>
  );
}
