"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Lock, LogOut, Plus, Trash2, Edit, Eye, Search, FileText, 
  TrendingUp, Users, Cpu, Calendar, X, Sparkles, PieChart, 
  BarChart2, FileSpreadsheet, CheckCircle2, ShieldAlert, Shield, 
  MessageSquare, UserCheck, Bookmark, Download, Phone, Mail
} from "lucide-react";
import { Job, WalkInDrive, CareerUpdate, Application } from "@/app/careers/types";

import { ref, onValue, set, update, remove, get } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

export default function HRDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [username, setUsername] = useState("");

  // Navigation state
  const [activeTab, setActiveTab] = useState<"dashboard" | "jobs" | "applications" | "interviews" | "internships" | "reports" | "profile">("dashboard");

  // Core Data States
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [walkins, setWalkins] = useState<WalkInDrive[]>([]);
  
  // Modal states
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showResumeViewer, setShowResumeViewer] = useState(false);
  const [resumeApp, setResumeApp] = useState<Application | null>(null);

  // Job Form Inputs
  const [jobTitle, setJobTitle] = useState("");
  const [jobDept, setJobDept] = useState("Software");
  const [jobLoc, setJobLoc] = useState("Chennai / Hybrid");
  const [jobType, setJobType] = useState("Full Time");
  const [jobExp, setJobExp] = useState("2+ Years");
  const [jobSalary, setJobSalary] = useState("₹8,0,000 - ₹12,0,000 PA");
  const [jobDesc, setJobDesc] = useState("");
  const [jobSkills, setJobSkills] = useState("");
  const [jobDeadline, setJobDeadline] = useState("2026-07-31");
  const [jobStatus, setJobStatus] = useState<"Open" | "Closed">("Open");

  // Candidate Filter/Search states
  const [appSearch, setAppSearch] = useState("");
  const [appFilterStatus, setAppFilterStatus] = useState("All");
  const [appFilterJob, setAppFilterJob] = useState("All");

  // Candidate HR Comments & Notes state
  const [newComment, setNewComment] = useState("");
  const [candidateComments, setCandidateComments] = useState<{[key: string]: string[]}>({});

  // Auth Guard check & Realtime Sync
  useEffect(() => {
    const storedName = localStorage.getItem("texawave_username");
    setUsername(storedName || "Recruiter");

    // 1. Sync Jobs
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

    // 2. Sync Applications
    const appsRef = ref(db, "careerApplications");
    const unsubscribeApps = onValue(appsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedApps = Object.keys(data).map(key => ({
          id: key,
          // Support both UI and DB field naming compatibilities
          name: data[key].candidateName || data[key].name || "",
          jobTitle: data[key].jobTitle || data[key].role || "",
          ...data[key]
        }));
        setApplications(loadedApps);
      } else {
        setApplications([]);
      }
    });

    // 3. Sync Walkins
    const walkinsRef = ref(db, "walkins");
    const unsubscribeWalkins = onValue(walkinsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedWalkins = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setWalkins(loadedWalkins);
      }
    });

    // 4. Sync Recruiter Notes / Comments
    const notesRef = ref(db, "applicationComments");
    const unsubscribeNotes = onValue(notesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const commentsMap: {[key: string]: string[]} = {};
        Object.keys(data).forEach(appId => {
          commentsMap[appId] = Object.values(data[appId]);
        });
        setCandidateComments(commentsMap);
      } else {
        setCandidateComments({});
      }
    });

    setIsMounted(true);

    return () => {
      unsubscribeJobs();
      unsubscribeApps();
      unsubscribeWalkins();
      unsubscribeNotes();
    };
  }, []);

  // Handle ESC key press to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showJobModal) {
          setShowJobModal(false);
          resetJobForm();
        }
        if (showResumeViewer) {
          setShowResumeViewer(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showJobModal, showResumeViewer]);

  // Log out handler
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // Job Submission: Add or Edit
  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobDesc) return;

    const skillsArray = jobSkills.split(",").map(s => s.trim()).filter(s => s.length > 0);

    const jobData = {
      title: jobTitle,
      department: jobDept,
      location: jobLoc,
      type: jobType,
      experience: jobExp,
      salary: jobSalary,
      description: jobDesc,
      responsibilities: [
        "Design and develop state-of-the-art engineering systems.",
        "Coordinate with hardware and software prototyping engineers.",
        "Participate in design and sprint reviews."
      ],
      requirements: [
        "Bachelor's degree in engineering or relevant technical experience.",
        "Strong communication and interdisciplinary problem-solving skills."
      ],
      benefits: [
        "Comprehensive medical insurance policy.",
        "Learning budget and travel allowance bonuses."
      ],
      skills: skillsArray.length > 0 ? skillsArray : ["Engineering"],
      deadline: jobDeadline,
      status: jobStatus,
      isFeatured: false,
      isUrgent: false,
      isInternship: jobType.toLowerCase() === "internship",
      postedDate: editingJob ? (editingJob.postedDate || new Date().toISOString().split("T")[0]) : new Date().toISOString().split("T")[0]
    };

    try {
      const jobId = editingJob ? editingJob.id : `job-${Date.now()}`;
      await set(ref(db, `jobs/${jobId}`), jobData);
    } catch (err) {
      console.error("Error submitting job:", err);
    }

    resetJobForm();
    setShowJobModal(false);
  };

  const handleEditJobClick = (job: Job) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobDept(job.department);
    setJobLoc(job.location);
    setJobType(job.type);
    setJobExp(job.experience);
    setJobSalary(job.salary);
    setJobDesc(job.description);
    setJobSkills(job.skills.join(", "));
    setJobDeadline(job.deadline);
    setJobStatus(job.status);
    setShowJobModal(true);
  };

  const handleDeleteJob = async (id: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      try {
        await remove(ref(db, `jobs/${id}`));
      } catch (err) {
        console.error("Error deleting job:", err);
      }
    }
  };

  const resetJobForm = () => {
    setEditingJob(null);
    setJobTitle("");
    setJobDept("Software");
    setJobLoc("Chennai / Hybrid");
    setJobType("Full Time");
    setJobExp("2+ Years");
    setJobSalary("₹8,00,000 - ₹12,0,000 PA");
    setJobDesc("");
    setJobSkills("");
    setJobDeadline("2026-07-31");
    setJobStatus("Open");
  };

  // Pipeline Status & HR Notes updates
  const handleStatusChange = async (appId: string, newStatus: Application["status"]) => {
    try {
      // 1. Update status in careerApplications
      await update(ref(db, `careerApplications/${appId}`), { status: newStatus });
      
      // 2. Locate and update matching resume status in resumes node (lowercase status matches resume schema)
      const appEmail = applications.find(a => a.id === appId)?.email;
      if (appEmail) {
        const resumesSnap = await get(ref(db, "resumes"));
        if (resumesSnap.exists()) {
          const resumesObj = resumesSnap.val();
          const resumeId = Object.keys(resumesObj).find(
            key => resumesObj[key].email?.toLowerCase() === appEmail.toLowerCase()
          );
          if (resumeId) {
            let mappedResumeStatus = "pending";
            if (newStatus.toLowerCase().includes("shortlist") || newStatus.toLowerCase().includes("review")) {
              mappedResumeStatus = "reviewing";
            } else if (newStatus.toLowerCase().includes("interview")) {
              mappedResumeStatus = "interview";
            } else if (newStatus.toLowerCase().includes("offer") || newStatus.toLowerCase().includes("hire") || newStatus.toLowerCase().includes("select")) {
              mappedResumeStatus = "selected";
            } else if (newStatus.toLowerCase().includes("reject")) {
              mappedResumeStatus = "rejected";
            }
            await update(ref(db, `resumes/${resumeId}`), { status: mappedResumeStatus });
          }
        }
      }

      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (err) {
      console.error("Error updating application status:", err);
    }
  };

  const handleAddComment = async (appId: string) => {
    if (!newComment.trim()) return;

    try {
      const commentId = `comment-${Date.now()}`;
      await set(ref(db, `applicationComments/${appId}/${commentId}`), newComment.trim());
      setNewComment("");
    } catch (err) {
      console.error("Error adding recruiter note:", err);
    }
  };

  // Calculations for Overview metrics
  const totalOpenPositions = jobs.filter(j => j.status === "Open").length;
  const totalApplications = applications.length;
  const interviewsScheduled = applications.filter(a => a.status === "Interview Scheduled").length;
  
  // Internships calculation: count applications under internship jobs or selected interns
  const activeInternsCount = applications.filter(
    a => a.status === "Selected" && 
    (a.jobTitle.toLowerCase().includes("intern") || a.deptInterest?.toLowerCase() === "internship")
  ).length;

  // Filter application candidates
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(appSearch.toLowerCase()) || 
                          app.email.toLowerCase().includes(appSearch.toLowerCase());
    const matchesStatus = appFilterStatus === "All" || app.status === appFilterStatus;
    const matchesJob = appFilterJob === "All" || app.jobId === appFilterJob;
    return matchesSearch && matchesStatus && matchesJob;
  });

  // Department distribution for charts
  const deptSummary = {
    Software: applications.filter(a => a.jobTitle.toLowerCase().includes("software") || a.jobTitle.toLowerCase().includes("web") || a.deptInterest?.toLowerCase() === "software").length,
    Electrical: applications.filter(a => a.jobTitle.toLowerCase().includes("embedded") || a.jobTitle.toLowerCase().includes("electrical") || a.deptInterest?.toLowerCase() === "electrical").length,
    Mechanical: applications.filter(a => a.jobTitle.toLowerCase().includes("cad") || a.jobTitle.toLowerCase().includes("mechanical") || a.deptInterest?.toLowerCase() === "mechanical").length,
    Procurement: applications.filter(a => a.jobTitle.toLowerCase().includes("sourcing") || a.jobTitle.toLowerCase().includes("procurement") || a.deptInterest?.toLowerCase() === "procurement").length
  };

  const internshipTracks = [
    { title: "Software Developer Intern", count: applications.filter(a => a.jobTitle.includes("Software Developer Intern") || a.jobTitle.includes("Software Internship")).length },
    { title: "Embedded Systems Intern", count: applications.filter(a => a.jobTitle.includes("Embedded Systems Intern") || a.jobTitle.includes("Embedded Systems Trainee")).length },
    { title: "Mechanical Design Intern", count: applications.filter(a => a.jobTitle.includes("Mechanical Design Intern") || a.jobTitle.includes("Mechanical CAD")).length },
    { title: "Electronics Design Intern", count: applications.filter(a => a.jobTitle.includes("Electronics Design Intern") || a.jobTitle.includes("Electronics Assembly")).length }
  ];

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center text-white">
        <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
        <div className="h-10 w-10 border-4 border-[#8CC63F] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-wider ml-4 text-text-secondary">Verifying access...</p>
      </div>
    );
  }

  return (
    <div className="hr-dashboard min-h-screen bg-bg-primary text-text-primary font-sans text-left relative">
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none z-0" aria-hidden="true" />
      
      {/* Top navbar */}
      <nav className="hr-topbar fixed top-0 left-0 right-0 h-[75px] bg-[#0c0c0c] border-b border-white/10 flex items-center justify-between px-6 lg:px-12 z-40">
        <div className="flex items-center gap-4">
          <Image
            src="/texawave_logo.webp"
            alt="Texawave Logo"
            width={140}
            height={40}
            className="h-8 w-auto object-contain"
          />
          <span className="hidden sm:inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-[#8CC63F] bg-[#8CC63F]/10 border border-[#8CC63F]/20 rounded font-mono">
            HR PORTAL
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-semibold">
          <div className="text-right">
            <span className="text-text-secondary block text-[10px] uppercase font-mono">Logged in as</span>
            <span className="text-white font-bold">{username}</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-red-500/30 text-text-secondary hover:text-red-400 bg-white/5 transition-colors font-bold uppercase text-[10px]"
          >
            <LogOut size={12} /> Logout
          </button>
        </div>
      </nav>

      {/* Main split dashboard panel */}
      <div className="pt-[75px] min-h-screen grid lg:grid-cols-[260px_1fr] relative z-10">
        
        {/* Left Sidebar Menu */}
        <aside className="hr-sidebar bg-[#080808]/90 border-r border-white/10 p-6 flex flex-col justify-between max-h-[calc(100vh-75px)] lg:sticky lg:top-[75px]">
          <div className="space-y-6">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5 mb-3 font-sans">
                <Shield size={12} className="text-[#8CC63F]" /> HR Permissions
              </span>
              <ul className="text-xs space-y-2 font-sans text-text-secondary font-medium">
                <li className="flex items-center gap-2 text-text-primary">
                  <CheckCircle2 size={12} className="text-[#8CC63F] shrink-0" />
                  <span>Create Job Posts</span>
                </li>
                <li className="flex items-center gap-2 text-text-primary">
                  <CheckCircle2 size={12} className="text-[#8CC63F] shrink-0" />
                  <span>Edit Job Posts</span>
                </li>
                <li className="flex items-center gap-2 text-text-primary">
                  <CheckCircle2 size={12} className="text-[#8CC63F] shrink-0" />
                  <span>View Applications</span>
                </li>
                <li className="flex items-center gap-2 text-text-primary">
                  <CheckCircle2 size={12} className="text-[#8CC63F] shrink-0" />
                  <span>Schedule Interviews</span>
                </li>
                <li className="flex items-center gap-2 text-text-primary">
                  <CheckCircle2 size={12} className="text-[#8CC63F] shrink-0" />
                  <span>Download Resumes</span>
                </li>
                <li className="flex items-center gap-2 text-text-secondary/50 line-through decoration-neutral-700">
                  <ShieldAlert size={12} className="text-red-500/60 shrink-0" />
                  <span>User Management</span>
                </li>
                <li className="flex items-center gap-2 text-text-secondary/50 line-through decoration-neutral-700">
                  <ShieldAlert size={12} className="text-red-500/60 shrink-0" />
                  <span>System Settings</span>
                </li>
              </ul>
            </div>

            <nav className="space-y-1">
              {[
                { id: "dashboard", label: "Dashboard", icon: TrendingUp },
                { id: "jobs", label: "Job Posts", icon: Cpu },
                { id: "applications", label: "Applications", icon: FileText },
                { id: "interviews", label: "Interviews", icon: Calendar },
                { id: "internships", label: "Internships", icon: Users },
                { id: "reports", label: "Reports", icon: FileSpreadsheet },
                { id: "profile", label: "Profile", icon: UserCheck }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border ${
                    activeTab === tab.id
                      ? "bg-[#8CC63F]/10 border-[#8CC63F]/30 text-[#8CC63F] shadow-[0_0_12px_rgba(140,198,63,0.08)]"
                      : "bg-transparent border-transparent text-text-secondary hover:text-white"
                  }`}
                >
                  <tab.icon size={14} className={activeTab === tab.id ? "text-[#8CC63F]" : "text-text-secondary"} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-white/5 text-[10px] text-text-secondary font-mono">
            TEXAWAVE RECRUIT V1.2
          </div>
        </aside>

        {/* Right Main Pane Content */}
        <main className="p-6 md:p-8 lg:p-12 overflow-y-auto">
          
          {/* Tab 1: Dashboard / Analytics */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-3xl font-bold font-display text-white">HR Recruitment Overview</h1>
                <p className="text-text-secondary text-sm mt-1">Real-time statistics and pipelines analysis of candidate sourcing.</p>
              </div>

              {/* Overview Cards Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Open Positions", value: totalOpenPositions, desc: "Status: Open & Hiring", color: "text-[#8CC63F]" },
                  { label: "Applications", value: totalApplications, desc: "Total profiles received", color: "text-[#14B8A6]" },
                  { label: "Interviews", value: interviewsScheduled, desc: "Candidates scheduled", color: "text-purple-400" },
                  { label: "Active Interns", value: activeInternsCount, desc: "Onboarded student pool", color: "text-amber-400" }
                ].map((card, idx) => (
                  <div key={idx} className="dashboard-card bg-[#171A21] border border-white/[0.06] rounded-2xl p-6 shadow-crisp transition-all hover:border-[#8CC63F]/20 hover:shadow-[0_4px_20px_rgba(140,198,63,0.05)]">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block font-sans">{card.label}</span>
                    <strong className={`text-4xl block mt-2 font-sans font-extrabold tracking-tight ${card.color}`}>{card.value}</strong>
                    <span className="text-[10.5px] text-text-secondary mt-2 block leading-none font-medium font-sans">{card.desc}</span>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid md:grid-cols-2 gap-8 pt-4">
                
                {/* Chart 1: Applications by Division */}
                <div className="dashboard-card bg-[#171A21] border border-white/[0.06] rounded-2xl p-6 text-left transition-all hover:border-[#8CC63F]/10">
                  <h3 className="text-[11px] font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2 font-sans">
                    <BarChart2 size={16} className="text-[#8CC63F]" />
                    Applications per Division
                  </h3>

                  <div className="space-y-4">
                    {Object.entries(deptSummary).map(([dept, count]) => {
                      const total = totalApplications || 1;
                      const percentage = Math.round((count / total) * 100);
                      return (
                        <div key={dept} className="space-y-1 text-left">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-white">{dept} Division</span>
                            <span className="text-[#8CC63F] font-sans font-semibold">{count} Candidates ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-[#080808] h-3 border border-white/5 rounded-full overflow-hidden">
                            <div 
                              className="bg-[#8CC63F] h-full rounded-full transition-all duration-700" 
                              style={{ width: `${Math.max(percentage, 5)}%` }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Chart 2: Pipeline Funnel */}
                <div className="dashboard-card bg-[#171A21] border border-white/[0.06] rounded-2xl p-6 text-left flex flex-col justify-between transition-all hover:border-[#8CC63F]/10">
                  <div>
                    <h3 className="text-[11px] font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2 font-sans">
                      <PieChart size={16} className="text-[#8CC63F]" />
                      Recruitment Funnel & Conversion
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="flex justify-center">
                      <div className="relative h-32 w-32 rounded-full border-8 border-white/5 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-[#8CC63F] opacity-35 animate-[pulse_2.5s_infinite]" />
                        <div className="flex flex-col items-center">
                          <span className="text-3xl font-extrabold text-white font-sans tracking-tight">
                            {applications.filter(a => a.status === "Selected").length}
                          </span>
                          <span className="text-[8px] font-bold text-text-secondary uppercase tracking-wider">Hired</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      {[
                        { label: "New Profiles", count: applications.filter(a => a.status === "New").length, color: "bg-blue-400" },
                        { label: "Shortlisted", count: applications.filter(a => a.status === "Shortlisted").length, color: "bg-amber-400" },
                        { label: "Interviews", count: applications.filter(a => a.status === "Interview Scheduled").length, color: "bg-purple-400" },
                        { label: "Hired (Selected)", count: applications.filter(a => a.status === "Selected").length, color: "bg-[#8CC63F]" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="flex items-center gap-2 text-text-secondary">
                            <span className={`h-2 w-2 rounded-full ${item.color}`} />
                            {item.label}
                          </span>
                          <span className="font-sans font-bold text-white">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ratios combined */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="dashboard-card bg-[#171A21] border border-white/[0.06] rounded-2xl p-6 text-left transition-all hover:border-[#8CC63F]/10">
                  <h3 className="text-[11px] font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 font-sans">
                    <Cpu size={16} className="text-[#8CC63F]" />
                    Hiring Conversion Ratios
                  </h3>
                  <div className="space-y-3 pt-2">
                    {[
                      { rate: "Screening Success Rate", value: "65%", bar: "w-[65%]", desc: "Resume shortlisted ratio" },
                      { rate: "Interview Turnout Rate", value: "88%", bar: "w-[88%]", desc: "Scheduled vs attended" },
                      { rate: "Offer Acceptance Rate", value: "92%", bar: "w-[92%]", desc: "Hired candidates conversion" }
                    ].map((metric, i) => (
                      <div key={i} className="text-xs space-y-1">
                        <div className="flex justify-between font-bold">
                          <span className="text-white">{metric.rate}</span>
                          <span className="text-[#8CC63F] font-sans font-bold">{metric.value}</span>
                        </div>
                        <div className="w-full bg-[#080808] h-2 rounded border border-white/5 overflow-hidden">
                          <div className={`bg-gradient-to-r from-[#8CC63F] to-[#14B8A6] h-full ${metric.bar}`} />
                        </div>
                        <span className="text-[10px] text-text-secondary font-sans">{metric.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-card bg-[#171A21] border border-white/[0.06] rounded-2xl p-6 text-left transition-all hover:border-[#8CC63F]/10">
                  <h3 className="text-[11px] font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 font-sans">
                    <Users size={16} className="text-[#8CC63F]" />
                    Internship Sourcing Tracks
                  </h3>
                  <div className="space-y-3 pt-1">
                    {internshipTracks.map((track, i) => (
                      <div key={i} className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                        <span className="text-text-secondary">{track.title} Program</span>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 font-sans text-white text-[10px] font-semibold">
                            {track.count} applied
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Job Posts manager */}
          {activeTab === "jobs" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold font-display text-white">Active Job Postings</h1>
                  <p className="text-text-secondary text-sm mt-1">Publish new openings or edit hiring statuses.</p>
                </div>
                <button
                  onClick={() => {
                    resetJobForm();
                    setShowJobModal(true);
                  }}
                  className="inline-flex items-center gap-2 bg-[#8CC63F] text-black px-4 py-2.5 rounded-lg text-xs font-bold shadow-crisp hover:bg-opacity-95"
                >
                  <Plus size={14} /> Publish Job
                </button>
              </div>

              <div className="dashboard-card bg-[#171A21] border border-white/[0.06] rounded-2xl overflow-hidden shadow-crisp">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-text-secondary uppercase font-sans font-semibold text-[10px] tracking-wider bg-white/5">
                      <th className="py-4 px-6">Role Details</th>
                      <th className="py-4 px-6">Division</th>
                      <th className="py-4 px-6">Details</th>
                      <th className="py-4 px-6">Deadline</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-text-primary">
                    {jobs.map((job) => {
                      return (
                        <tr key={job.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-white text-sm">{job.title}</div>
                            <div className="text-[10.5px] text-[#8CC63F] mt-1 font-medium font-sans">{job.salary}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-text-secondary uppercase text-[10px] font-bold">
                              {job.department}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-sans">
                            <div className="text-white font-medium">{job.location}</div>
                            <div className="text-text-secondary mt-0.5 text-[10px]">{job.type} &bull; {job.experience}</div>
                          </td>
                          <td className="py-4 px-6 font-sans text-text-secondary font-medium">{job.deadline}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                              job.status === "Open" ? "bg-[#8CC63F]/20 text-[#8CC63F] border border-[#8CC63F]/30" : "bg-neutral-800 text-text-secondary border border-white/5"
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleEditJobClick(job)}
                              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white transition-colors"
                              title="Edit Posting"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-1.5 rounded bg-red-950/20 hover:bg-red-900/30 text-red-400 transition-colors border border-red-500/10"
                              title="Delete Posting"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Applications Review */}
          {activeTab === "applications" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold font-display text-white">Candidates Applications</h1>
                <p className="text-text-secondary text-sm mt-1">Manage pipeline status updates, read resumes inline, and write HR evaluation notes.</p>
              </div>

              {/* Filtering */}
              <div className="dashboard-filter-row grid sm:grid-cols-3 gap-4 bg-[#171A21] p-4 rounded-2xl border border-white/[0.06]">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 text-text-secondary" size={14} />
                  <input
                    type="text"
                    placeholder="Search candidate name..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="w-full bg-[#0F1115] border border-white/10 focus:border-[#8CC63F] focus:outline-none rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-white/30"
                  />
                </div>
                
                <select
                  value={appFilterStatus}
                  onChange={(e) => setAppFilterStatus(e.target.value)}
                  className="bg-[#0F1115] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-semibold focus:border-[#8CC63F] focus:outline-none font-sans cursor-pointer"
                >
                  <option value="All">All Pipeline Statuses</option>
                  <option value="New">New</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select
                  value={appFilterJob}
                  onChange={(e) => setAppFilterJob(e.target.value)}
                  className="bg-[#0F1115] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-semibold focus:border-[#8CC63F] focus:outline-none font-sans cursor-pointer"
                >
                  <option value="All">All Job Postings</option>
                  {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              </div>

              {/* Candidate Cards Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {filteredApplications.map((app) => (
                  <div key={app.id} className="dashboard-card bg-[#171A21] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between shadow-crisp relative overflow-hidden transition-all hover:border-[#8CC63F]/10">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <strong className="text-white text-base block font-display">{app.name}</strong>
                          <span className="text-text-secondary text-xs mt-1 block font-sans">{app.email}</span>
                          <span className="text-text-secondary text-xs block font-sans">{app.phone}</span>
                        </div>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value as Application["status"])}
                          className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold focus:outline-none bg-[#0F1115] font-sans cursor-pointer ${
                            app.status === "New" ? "border-blue-500/30 text-blue-400" :
                            app.status === "Shortlisted" ? "border-amber-500/30 text-amber-400" :
                            app.status === "Interview Scheduled" ? "border-purple-500/30 text-purple-400" :
                            app.status === "Selected" ? "border-[#8CC63F]/30 text-[#8CC63F]" : "border-red-500/30 text-red-400"
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      <div className="space-y-2 text-xs py-3 border-y border-white/5 my-4">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Applied Role:</span>
                          <span className="text-white font-semibold">{app.jobTitle}</span>
                        </div>
                        <div className="flex justify-between font-sans text-xs">
                          <span className="text-text-secondary">Date Submitted:</span>
                          <span className="text-white font-medium">{app.dateApplied}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-text-secondary">Resume Document:</span>
                          <button
                            onClick={() => {
                              setResumeApp(app);
                              setShowResumeViewer(true);
                            }}
                            className="inline-flex items-center gap-1 text-[#8CC63F] hover:underline font-bold"
                          >
                            <Eye size={12} /> View Resume
                          </button>
                        </div>
                      </div>

                      {/* Internal Notes */}
                      <div className="mt-4">
                        <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5 mb-2 font-sans">
                          <MessageSquare size={12} className="text-[#8CC63F]" /> HR Notes / Comments
                        </span>
                        
                        <div className="space-y-1.5 max-h-24 overflow-y-auto mb-3 bg-[#080808] p-2.5 rounded-xl border border-white/5">
                          {candidateComments[app.id]?.map((note, index) => (
                            <div key={index} className="text-[11px] text-white/90 leading-relaxed pl-2 border-l border-[#8CC63F] font-sans">
                              "{note}"
                            </div>
                          )) || <div className="text-[10px] text-text-secondary font-sans italic">No comments evaluated.</div>}
                        </div>

                        {/* Add Comment Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add evaluation comments..."
                            value={selectedApp?.id === app.id ? newComment : ""}
                            onChange={(e) => {
                              setSelectedApp(app);
                              setNewComment(e.target.value);
                            }}
                            onFocus={() => setSelectedApp(app)}
                            className="flex-1 bg-[#0F1115] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-text-secondary/50 focus:border-[#8CC63F] focus:outline-none"
                          />
                          <button
                            onClick={() => handleAddComment(app.id)}
                            className="bg-[#8CC63F]/10 border border-[#8CC63F]/30 hover:bg-[#8CC63F]/20 text-[#8CC63F] text-[10px] font-bold uppercase px-3 rounded-lg transition-colors font-sans"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredApplications.length === 0 && (
                  <div className="col-span-full text-center py-16 bg-[#111] rounded-2xl border border-dashed border-white/10">
                    <ShieldAlert className="mx-auto text-text-secondary mb-3" size={30} />
                    <p className="text-sm text-text-secondary font-semibold">No candidate profiles match the current filter.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Interviews */}
          {activeTab === "interviews" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold font-display text-white">Interviews Scheduled</h1>
                <p className="text-text-secondary text-sm mt-1">Review schedules and technical evaluation logs for upcoming evaluations.</p>
              </div>

              <div className="dashboard-card bg-[#111] border border-white/10 rounded-2xl p-6">
                <div className="space-y-4">
                  {applications.filter(a => a.status === "Interview Scheduled").map((app) => (
                    <div key={app.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-primary/40 border border-white/5 p-4 rounded-xl">
                      <div className="text-left">
                        <strong className="text-white text-sm block">{app.name}</strong>
                        <span className="text-text-secondary text-xs font-mono">{app.email} &bull; {app.phone}</span>
                        <div className="text-[11px] text-[#8CC63F] mt-1 font-semibold flex items-center gap-1 font-mono">
                          📅 Technical Review: 2 Days From Now (Standard)
                        </div>
                      </div>

                      <div className="flex gap-2.5 items-center">
                        <span className="text-xs text-text-secondary bg-white/5 border border-white/5 px-3 py-1 rounded-lg">
                          Role: <strong className="text-white">{app.jobTitle}</strong>
                        </span>
                        
                        <button
                          onClick={() => {
                            setResumeApp(app);
                            setShowResumeViewer(true);
                          }}
                          className="bg-[#8CC63F]/10 border border-[#8CC63F]/30 hover:bg-[#8CC63F]/20 text-[#8CC63F] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors font-mono"
                        >
                          View CV
                        </button>
                      </div>
                    </div>
                  ))}

                  {applications.filter(a => a.status === "Interview Scheduled").length === 0 && (
                    <div className="text-center py-12 text-text-secondary">
                      No technical interviews scheduled at this time. Change candidate status to "Interview Scheduled" to log schedules.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Internship Management */}
          {activeTab === "internships" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold font-display text-white">Internships Coordination</h1>
                <p className="text-text-secondary text-sm mt-1">Track and manage student applications for targeted hardware & software internship tracks.</p>
              </div>

              <div className="grid gap-6 md:grid-cols-4">
                {[
                  { title: "Mechanical Design Intern", count: applications.filter(a => a.jobTitle.includes("Mechanical Design Intern")).length, desc: "SolidWorks & CAD Enclosures" },
                  { title: "Embedded Systems Intern", count: applications.filter(a => a.jobTitle.includes("Embedded Systems Intern") || a.jobTitle.includes("Embedded Systems Trainee")).length, desc: "PCB design & STM32 Firmware" },
                  { title: "Software Developer Intern", count: applications.filter(a => a.jobTitle.includes("Software Developer Intern")).length, desc: "React, Next.js & IoT APIs" },
                  { title: "Electronics Design Intern", count: applications.filter(a => a.jobTitle.includes("Electronics Design Intern")).length, desc: "Lab testing & wiring schematics" }
                ].map((track, i) => (
                  <div key={i} className="dashboard-card bg-[#111] border border-white/10 rounded-2xl p-5 text-left">
                    <span className="text-[10px] font-bold text-text-secondary block font-mono uppercase">Track 0{i+1}</span>
                    <strong className="text-lg block text-white mt-1 font-display line-clamp-1">{track.title}</strong>
                    <div className="text-2xl font-black text-[#8CC63F] mt-2 font-mono">{track.count} <span className="text-xs text-text-secondary font-medium">Applied</span></div>
                    <p className="text-[10px] text-text-secondary mt-1 font-mono leading-relaxed">{track.desc}</p>
                  </div>
                ))}
              </div>

              <div className="dashboard-card bg-[#111] border border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-mono">Intern Applicants Queue</h3>
                
                <div className="space-y-4">
                  {applications.filter(a => a.jobTitle.toLowerCase().includes("intern") || a.jobTitle.toLowerCase().includes("trainee") || a.deptInterest === "Internship").map((intern) => (
                    <div key={intern.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-primary/40 border border-white/5 p-4 rounded-xl">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-white text-sm">{intern.name}</strong>
                          <span className="px-2 py-0.5 rounded bg-amber-950/20 border border-amber-500/20 text-amber-400 font-mono text-[9px] font-bold uppercase">Intern Applicant</span>
                        </div>
                        <span className="text-text-secondary text-xs font-mono block mt-1">{intern.email} &bull; Track: {intern.jobTitle}</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <select
                          value={intern.status}
                          onChange={(e) => handleStatusChange(intern.id, e.target.value as Application["status"])}
                          className="bg-bg-primary border border-white/10 text-white text-[11px] font-bold font-mono py-1 px-2.5 rounded-lg focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Selected">Select (Hired)</option>
                          <option value="Rejected">Reject</option>
                        </select>

                        <button
                          onClick={() => {
                            setResumeApp(intern);
                            setShowResumeViewer(true);
                          }}
                          className="text-text-secondary hover:text-[#8CC63F] p-1.5"
                          title="View CV"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {applications.filter(a => a.jobTitle.toLowerCase().includes("intern") || a.jobTitle.toLowerCase().includes("trainee") || a.deptInterest === "Internship").length === 0 && (
                    <div className="text-center py-6 text-text-secondary">
                      No internship specific profiles registered at this time.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Reports / Export */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h1 className="text-2xl font-bold font-display text-white">Recruitment Reports</h1>
                <p className="text-text-secondary text-sm mt-1">Export database registries, pipelines audit trials, and applicants reports.</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="dashboard-card bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
                  <h3 className="text-white font-bold text-base">Hiring Pipeline CSV</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Export full database rows containing candidate names, contacts, divisions interest, pipeline status, and internal comments.
                  </p>
                  <button
                    onClick={() => alert("[Reports Server] Compiled candidate pipeline spreadsheet: candidate_registry_2026.csv. Dispatched download.")}
                    className="inline-flex items-center gap-2 bg-[#8CC63F] text-black px-4 py-2.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wide hover:bg-opacity-90 transition-all"
                  >
                    <Download size={13} /> Export Candidates Spreadsheet (CSV)
                  </button>
                </div>

                <div className="dashboard-card bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
                  <h3 className="text-white font-bold text-base">Hiring Metrics Summary</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Download graphic summary analysis of openings, conversion ratios, department openings distribution, and candidate volumes.
                  </p>
                  <button
                    onClick={() => alert("[Reports Server] Compiled graphics analytics summary PDF. Dispatched download.")}
                    className="inline-flex items-center gap-2 border border-white/15 hover:border-[#8CC63F] text-white hover:text-[#8CC63F] bg-bg-primary/40 px-4 py-2.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wide transition-all"
                  >
                    <Download size={13} /> Download Summary Report (PDF)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 7: Profile */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h1 className="text-2xl font-bold font-display text-white">HR User Profile</h1>
                <p className="text-text-secondary text-sm mt-1">Recruiter configuration details and operational role verification.</p>
              </div>

              <div className="dashboard-card bg-[#111] border border-white/10 rounded-2xl p-6 max-w-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 bg-[#8CC63F]/15 border border-[#8CC63F]/30 text-[#8CC63F] rounded-full flex items-center justify-center font-display text-2xl font-bold">
                    {username[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{username}</h3>
                    <span className="text-xs text-text-secondary font-mono">Role: Human Resources Executive</span>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs border-t border-white/5 pt-5">
                  <div className="flex justify-between font-mono">
                    <span className="text-text-secondary">Security Privilege level:</span>
                    <strong className="text-white">HR Practitioner</strong>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-text-secondary">Assigned Division:</span>
                    <strong className="text-[#8CC63F]">Engineering Recruitment</strong>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-text-secondary">System Access Status:</span>
                    <strong className="text-green-400">Authenticated (Secured)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL: Create/Edit Job Post */}
      {showJobModal && (
        <div 
          onClick={() => { setShowJobModal(false); resetJobForm(); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/85 backdrop-blur-md overflow-y-auto"
          data-lenis-prevent
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="dashboard-modal relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-2xl shadow-premium p-6 md:p-8 max-h-[90vh] overflow-y-auto"
          >
            
            <button
              onClick={() => setShowJobModal(false)}
              className="absolute right-4 top-4 text-text-secondary hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-white font-display mb-6">
              {editingJob ? "Modify Job Posting Details" : "Create New Job Posting"}
            </h3>

            <form onSubmit={handleJobSubmit} className="space-y-4 text-left">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 font-mono">Job Title</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#8CC63F] focus:outline-none"
                    placeholder="e.g. Senior Embedded Systems Engineer"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 font-mono">Department</label>
                  <select
                    value={jobDept}
                    onChange={(e) => setJobDept(e.target.value)}
                    className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#8CC63F] focus:outline-none font-semibold"
                  >
                    <option value="Software">Software</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Procurement">Procurement</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 font-mono">Location</label>
                  <input
                    type="text"
                    required
                    value={jobLoc}
                    onChange={(e) => setJobLoc(e.target.value)}
                    className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#8CC63F] focus:outline-none"
                    placeholder="e.g. Chennai / Hybrid"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 font-mono">Employment Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#8CC63F] focus:outline-none font-semibold"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                    <option value="Part Time">Part Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 font-mono">Experience Required</label>
                  <input
                    type="text"
                    required
                    value={jobExp}
                    onChange={(e) => setJobExp(e.target.value)}
                    className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#8CC63F] focus:outline-none"
                    placeholder="e.g. 3+ Years"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 font-mono">Salary Range</label>
                  <input
                    type="text"
                    required
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#8CC63F] focus:outline-none"
                    placeholder="e.g. ₹8,00,000 - ₹12,00,000 PA"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 font-mono">Application Deadline</label>
                  <input
                    type="date"
                    required
                    value={jobDeadline}
                    onChange={(e) => setJobDeadline(e.target.value)}
                    className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#8CC63F] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 font-mono">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  required
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#8CC63F] focus:outline-none"
                  placeholder="e.g. Altium Designer, ESP32, KiCAD, Firmware (C++)"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 font-mono">Job Description</label>
                <textarea
                  required
                  rows={5}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#8CC63F] focus:outline-none resize-none"
                  placeholder="Provide comprehensive job description details..."
                />
              </div>

              {editingJob && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 font-mono">Hiring Status</label>
                  <select
                    value={jobStatus}
                    onChange={(e) => setJobStatus(e.target.value as any)}
                    className="bg-bg-primary border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-semibold focus:border-[#8CC63F] focus:outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#8CC63F] text-black font-bold uppercase text-xs tracking-wider py-3.5 rounded-xl hover:bg-opacity-95 shadow-crisp transition-all mt-4 font-mono"
              >
                {editingJob ? "Save Changes" : "Publish Job Posting"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Inline Resume Viewer */}
      {showResumeViewer && resumeApp && (
        <div 
          onClick={() => { setShowResumeViewer(false); setResumeApp(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/85 backdrop-blur-md overflow-y-auto"
          data-lenis-prevent
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="resume-viewer-modal relative w-full max-w-4xl bg-[#111] border border-white/10 rounded-2xl shadow-premium overflow-hidden flex flex-col md:grid md:grid-cols-[280px_1fr] max-h-[85vh]"
          >
            
            <button
              onClick={() => {
                setShowResumeViewer(false);
                setResumeApp(null);
              }}
              className="absolute right-4 top-4 text-text-secondary hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors z-20"
            >
              <X size={18} />
            </button>

            {/* Resume Viewer Sidebar (Metadata) */}
            <div className="resume-sidebar bg-[#080808] p-6 md:p-8 border-r border-white/10 text-left flex flex-col justify-between overflow-y-auto">
              <div>
                <span className="text-[9px] font-bold text-text-secondary font-mono block uppercase">Candidate CV Info</span>
                <strong className="text-white text-lg block mt-1.5 font-display">{resumeApp.name}</strong>
                <p className="text-text-secondary text-[11px] mt-1 italic">{resumeApp.jobTitle}</p>
                
                <div className="mt-6 space-y-3.5 text-xs text-text-secondary border-t border-white/5 pt-5 font-mono">
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-[#8CC63F]" />
                    <span className="truncate">{resumeApp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-[#8CC63F]" />
                    <span>{resumeApp.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-[#8CC63F]" />
                    <span>Applied: {resumeApp.dateApplied}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <span className="text-[10px] font-bold text-white uppercase font-mono block mb-2">Verification Check</span>
                  <div className="p-3 rounded-xl bg-green-950/20 border border-[#8CC63F]/20 text-[10px] text-[#8CC63F] leading-relaxed">
                    <div className="flex items-center gap-1 font-bold">
                      <CheckCircle2 size={12} />
                      Format OK
                    </div>
                    <p className="mt-1 font-mono">CV checksum parsed and validated.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => alert(`Initiating secure direct download of PDF resume: ${resumeApp.resumeName}`)}
                  className="w-full flex items-center justify-center gap-1.5 border border-white/10 hover:border-[#8CC63F] text-white hover:text-[#8CC63F] bg-bg-primary/40 py-2.5 rounded-xl text-xs font-bold font-mono uppercase transition-all"
                >
                  <Download size={13} /> Download PDF
                </button>
              </div>
            </div>

            {/* Simulated Interactive Document Pane */}
            <div className="p-8 md:p-12 overflow-y-auto text-left bg-bg-primary max-h-[85vh]">
              <div className="resume-document border border-white/10 rounded-2xl bg-[#080808] p-8 max-w-xl mx-auto shadow-crisp relative">
                {/* PDF overlay layout header */}
                <div className="absolute right-6 top-6 text-[9px] text-text-secondary border border-white/10 px-2 py-0.5 rounded font-mono">
                  PDF VIEWER
                </div>
                
                <div className="border-b border-white/10 pb-6 mb-6">
                  <h1 className="text-2xl font-black text-white font-display">{resumeApp.name}</h1>
                  <span className="text-xs text-text-secondary mt-1 block font-mono">{resumeApp.email} | {resumeApp.phone}</span>
                </div>

                <div className="space-y-6 text-xs text-white/90">
                  {/* Summary */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#8CC63F] mb-2 font-mono">Professional Summary</h4>
                    <p className="leading-relaxed text-text-secondary text-[11px]">
                      Detail-oriented and dedicated engineering professional. Experienced with PCB designs,Altium design layout structures, firmware code design in C/C++, and hardware systems bring-up tests. Excited to apply interdisciplinary skills at Texawave to streamline hardware-software integrity.
                    </p>
                  </div>

                  {/* Work Experience */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#8CC63F] mb-2 font-mono">Professional Experience</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between font-bold">
                          <span>Associate Systems Engineer &bull; Automation Corp</span>
                          <span className="text-text-secondary font-mono text-[10px]">2024 - Present</span>
                        </div>
                        <ul className="list-disc list-inside mt-1.5 space-y-1 text-text-secondary text-[11px] leading-relaxed">
                          <li>Developed multi-layer hardware schematics and PCB designs using Altium Designer.</li>
                          <li>Collaborated in diagnostic testing and lab calibrations for smart controllers.</li>
                          <li>Optimized firmware code bases in C/C++ running on STM32 chipsets.</li>
                        </ul>
                      </div>

                      <div>
                        <div className="flex justify-between font-bold">
                          <span>Graduate Trainee &bull; Circuit Lab Systems</span>
                          <span className="text-text-secondary font-mono text-[10px]">2023 - 2024</span>
                        </div>
                        <ul className="list-disc list-inside mt-1.5 space-y-1 text-text-secondary text-[11px] leading-relaxed">
                          <li>Assisted in mechanical CAD packaging design for electronic casing.</li>
                          <li>Prepared assembly blueprints, BOM logs, and supplier verification lists.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#8CC63F] mb-2 font-mono">Key Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {["Altium Designer", "SolidWorks", "PCB Layouts", "C/C++ Programming", "STM32 MCU", "ESP32 Prototyping", "BOM sourcing"].map((skill, index) => (
                        <span key={index} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-text-secondary font-mono text-[10px]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="border-t border-white/5 pt-4 mt-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#8CC63F] mb-2 font-mono">Candidate Cover Message</h4>
                    <p className="leading-relaxed text-text-secondary italic font-sans text-[11px]">
                      "{resumeApp.message}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
