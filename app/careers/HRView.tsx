import React, { useState } from "react";
import { 
  Lock, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Search, 
  FileText, 
  TrendingUp, 
  Users, 
  Cpu, 
  Calendar, 
  X,
  Sparkles,
  PieChart,
  BarChart2,
  FileSpreadsheet
} from "lucide-react";
import { Job, WalkInDrive, CareerUpdate, Application } from "./types";

interface HRViewProps {
  jobs: Job[];
  walkins: WalkInDrive[];
  updates: CareerUpdate[];
  applications: Application[];
  onAddJob: (job: Omit<Job, "id" | "postedDate">) => void;
  onEditJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
  onUpdateAppStatus: (id: string, status: Application["status"]) => void;
  onAddWalkin: (walkin: Omit<WalkInDrive, "id">) => void;
  onDeleteWalkin: (id: string) => void;
  onAddUpdate: (update: Omit<CareerUpdate, "id" | "likes" | "commentsCount" | "date">) => void;
  onDeleteUpdate: (id: string) => void;
  onLogout: () => void;
}

export function HRView({
  jobs,
  walkins,
  updates,
  applications,
  onAddJob,
  onEditJob,
  onDeleteJob,
  onUpdateAppStatus,
  onAddWalkin,
  onDeleteWalkin,
  onAddUpdate,
  onDeleteUpdate,
  onLogout
}: HRViewProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Navigation
  const [activeTab, setActiveTab] = useState<"analytics" | "jobs" | "walkins" | "applications" | "updates">("analytics");

  // Filter States
  const [appSearch, setAppSearch] = useState("");
  const [appFilterStatus, setAppFilterStatus] = useState("All");
  const [appFilterJob, setAppFilterJob] = useState("All");

  // Job Modal/Form State
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  
  // Job Form Inputs
  const [jobTitle, setJobTitle] = useState("");
  const [jobDept, setJobDept] = useState("Software");
  const [jobLoc, setJobLoc] = useState("Chennai / Hybrid");
  const [jobType, setJobType] = useState("Full Time");
  const [jobExp, setJobExp] = useState("2+ Years");
  const [jobSalary, setJobSalary] = useState("₹8,00,000 - ₹12,00,000 PA");
  const [jobDesc, setJobDesc] = useState("");
  const [jobSkills, setJobSkills] = useState("");
  const [jobDeadline, setJobDeadline] = useState("2026-07-31");
  const [jobStatus, setJobStatus] = useState<"Open" | "Closed">("Open");
  const [jobFeatured, setJobFeatured] = useState(false);
  const [jobUrgent, setJobUrgent] = useState(false);
  const [jobInternship, setJobInternship] = useState(false);

  // Walk-in Form State
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [walkinTitle, setWalkinTitle] = useState("");
  const [walkinDate, setWalkinDate] = useState("");
  const [walkinLoc, setWalkinLoc] = useState("");
  const [walkinPositions, setWalkinPositions] = useState("");
  const [walkinDesc, setWalkinDesc] = useState("");

  // Life Update Form State
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateType, setUpdateType] = useState<"update" | "life">("life");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [updateImage, setUpdateImage] = useState("");

  // Selected Application Details Modal State
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password. (Use admin / admin123)");
    }
  };

  // Job Submission (Add or Edit)
  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobDesc) return;

    const skillsArray = jobSkills.split(",").map(s => s.trim()).filter(s => s.length > 0);
    
    // Parse bullet lines
    const responsibilities = [
      "Participate in design and sprint reviews.",
      "Work closely with interdisciplinary project heads.",
      "Maintain standards and document testing specs."
    ];
    const requirements = [
      "Good communication skills.",
      "Willingness to learn and build complex products."
    ];
    const benefits = [
      "Competitive compensation package.",
      "Comprehensive medical insurance."
    ];

    if (editingJob) {
      onEditJob({
        ...editingJob,
        title: jobTitle,
        department: jobDept,
        location: jobLoc,
        type: jobType,
        experience: jobExp,
        salary: jobSalary,
        description: jobDesc,
        skills: skillsArray.length > 0 ? skillsArray : ["Hardware"],
        deadline: jobDeadline,
        status: jobStatus,
        isFeatured: jobFeatured,
        isUrgent: jobUrgent,
        isInternship: jobInternship,
        responsibilities: editingJob.responsibilities.length > 0 ? editingJob.responsibilities : responsibilities,
        requirements: editingJob.requirements.length > 0 ? editingJob.requirements : requirements,
        benefits: editingJob.benefits.length > 0 ? editingJob.benefits : benefits
      });
    } else {
      onAddJob({
        title: jobTitle,
        department: jobDept,
        location: jobLoc,
        type: jobType,
        experience: jobExp,
        salary: jobSalary,
        description: jobDesc,
        skills: skillsArray.length > 0 ? skillsArray : ["Hardware"],
        deadline: jobDeadline,
        status: jobStatus,
        isFeatured: jobFeatured,
        isUrgent: jobUrgent,
        isInternship: jobInternship,
        responsibilities,
        requirements,
        benefits
      });
    }

    // Reset Job form
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
    setJobFeatured(job.isFeatured);
    setJobUrgent(job.isUrgent);
    setJobInternship(job.isInternship);
    setShowJobModal(true);
  };

  const resetJobForm = () => {
    setEditingJob(null);
    setJobTitle("");
    setJobDept("Software");
    setJobLoc("Chennai / Hybrid");
    setJobType("Full Time");
    setJobExp("2+ Years");
    setJobSalary("₹8,00,000 - ₹12,00,000 PA");
    setJobDesc("");
    setJobSkills("");
    setJobDeadline("2026-07-31");
    setJobStatus("Open");
    setJobFeatured(false);
    setJobUrgent(false);
    setJobInternship(false);
  };

  // Walkin Submission
  const handleWalkinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinTitle || !walkinDate) return;
    
    const posArray = walkinPositions.split(",").map(p => p.trim()).filter(p => p.length > 0);
    onAddWalkin({
      title: walkinTitle,
      date: walkinDate,
      location: walkinLoc || "TEXAWAVE Chennai Lab & R&D Hub",
      positions: posArray.length > 0 ? posArray : ["Hardware Engineer"],
      description: walkinDesc,
      contactEmail: "hr@texawave.com"
    });

    setWalkinTitle("");
    setWalkinDate("");
    setWalkinLoc("");
    setWalkinPositions("");
    setWalkinDesc("");
    setShowWalkinModal(false);
  };

  // Update Submission
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle || !updateContent) return;

    onAddUpdate({
      type: updateType,
      title: updateTitle,
      content: updateContent,
      image: updateImage || undefined
    });

    setUpdateTitle("");
    setUpdateContent("");
    setUpdateImage("");
    setShowUpdateModal(false);
  };

  // Analytics helper calculations
  const totalJobsCount = jobs.length;
  const activeJobsCount = jobs.filter(j => j.status === "Open").length;
  const closedJobsCount = jobs.filter(j => j.status === "Closed").length;
  const totalAppsCount = applications.length;
  const internAppsCount = applications.filter(app => (app.jobTitle || "").toLowerCase().includes("intern") || app.deptInterest === "Internship").length;

  // Department distribution logic for charts
  const deptAppDistribution = {
    Software: applications.filter(a => (a.jobTitle || "").toLowerCase().includes("software") || (a.jobTitle || "").toLowerCase().includes("cloud") || (a.jobTitle || "").toLowerCase().includes("web") || a.deptInterest?.toLowerCase() === "software").length,
    Electrical: applications.filter(a => (a.jobTitle || "").toLowerCase().includes("embedded") || (a.jobTitle || "").toLowerCase().includes("pcb") || (a.jobTitle || "").toLowerCase().includes("electrical") || a.deptInterest?.toLowerCase() === "electrical").length,
    Mechanical: applications.filter(a => (a.jobTitle || "").toLowerCase().includes("cad") || (a.jobTitle || "").toLowerCase().includes("enclosure") || (a.jobTitle || "").toLowerCase().includes("mechanical") || a.deptInterest?.toLowerCase() === "mechanical").length,
    Procurement: applications.filter(a => (a.jobTitle || "").toLowerCase().includes("sourcing") || (a.jobTitle || "").toLowerCase().includes("supply") || (a.jobTitle || "").toLowerCase().includes("procurement") || a.deptInterest?.toLowerCase() === "procurement").length
  };

  const statusAppDistribution = {
    New: applications.filter(a => a.status === "New").length,
    Shortlisted: applications.filter(a => a.status === "Shortlisted").length,
    Interview: applications.filter(a => a.status === "Interview Scheduled").length,
    Selected: applications.filter(a => a.status === "Selected").length,
    Rejected: applications.filter(a => a.status === "Rejected").length,
  };

  // Filter lists
  const filteredApps = applications.filter(app => {
    const matchesSearch = (app.name || "").toLowerCase().includes(appSearch.toLowerCase()) || 
                          (app.email || "").toLowerCase().includes(appSearch.toLowerCase()) ||
                          (app.jobTitle || "").toLowerCase().includes(appSearch.toLowerCase());
    const matchesStatus = appFilterStatus === "All" || app.status === appFilterStatus;
    const matchesJob = appFilterJob === "All" || app.jobId === appFilterJob;
    return matchesSearch && matchesStatus && matchesJob;
  });



  // Simulated CV Download
  const triggerMockDownload = (app: Application) => {
    alert(`[Simulated File Server] Downloading resume: ${app.resumeName} for candidate: ${app.name}`);
  };

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-bg-primary font-sans text-left">
        <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
        
        <div className="relative w-full max-w-md bg-bg-card border border-border-primary rounded-2xl p-6 sm:p-8 shadow-premium z-10">
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-signal/15 text-signal mb-4 border border-signal/25">
              <Lock size={22} />
            </div>
            <h2 className="text-subtitle text-white">HR Admin Login</h2>
            <p className="text-body-normal text-text-secondary mt-1">Unlock job posting, applicant lists, and resume archives.</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/45 border border-red-500/30 rounded-xl text-xs text-red-400 mb-6 text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-small-text font-bold uppercase tracking-wider text-text-secondary mb-1 font-display">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-xl px-4 py-3 text-body-normal text-white"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-small-text font-bold uppercase tracking-wider text-text-secondary mb-1 font-display">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-xl px-4 py-3 text-body-normal text-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-signal text-black py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase hover:bg-opacity-90 transition-all mt-6 shadow-crisp"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button
              onClick={onLogout}
              className="text-xs text-text-secondary hover:text-white transition-colors"
            >
              &larr; Back to Candidate View
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Interface
  return (
    <div className="bg-bg-primary text-text-primary min-h-screen font-sans text-left">
      <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)] py-10">
        
        {/* Admin Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-primary pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-signal uppercase">System Secured</span>
            </div>
            <h1 className="text-section text-white mt-1">HR Administrative Panel</h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                resetJobForm();
                setShowJobModal(true);
              }}
              className="inline-flex items-center gap-1.5 bg-signal text-black px-4 py-2 rounded-lg text-xs font-bold shadow-crisp hover:bg-opacity-95"
            >
              <Plus size={14} /> Create Job
            </button>
            
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 border border-border-primary bg-bg-card hover:border-red-500/40 text-text-secondary hover:text-red-400 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </header>

        {/* Dashboard Tabs Grid Layout */}
        <div className="grid lg:grid-cols-[200px_1fr] gap-8 items-start">
          
          {/* Side Navbar */}
          <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none border-b lg:border-b-0 border-white/5">
            {[
              { id: "analytics", label: "📊 Analytics", icon: TrendingUp },
              { id: "jobs", label: "💼 Job Postings", icon: Cpu },
              { id: "walkins", label: "🚶 Walk-ins", icon: Calendar },
              { id: "applications", label: "📝 Applications", icon: FileText },
              { id: "updates", label: "📷 Life Feed", icon: Sparkles }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "analytics" | "jobs" | "walkins" | "applications" | "updates")}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap lg:w-full text-left border ${
                  activeTab === tab.id
                    ? "bg-signal/15 border-signal/30 text-signal shadow-[0_0_12px_rgba(140,198,63,0.1)]"
                    : "bg-transparent border-transparent text-text-secondary hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Main Display Pane */}
          <div className="bg-bg-card/40 border border-border-primary rounded-2xl p-6 backdrop-blur-sm min-h-[60vh]">
            
            {/* Tab CONTENT: Analytics */}
            {activeTab === "analytics" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-card text-white">System Analytics</h2>
                  <p className="text-body-normal text-text-secondary mt-1">Overview metrics of current jobs postings, applicants, and divisions distribution.</p>
                </div>

                {/* Counters Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: "Total Jobs", val: totalJobsCount, desc: "Listed vacancies" },
                    { label: "Active Jobs", val: activeJobsCount, desc: "Status: Open" },
                    { label: "Closed Jobs", val: closedJobsCount, desc: "Status: Closed" },
                    { label: "Total Applications", val: totalAppsCount, desc: "Submitted profiles" },
                    { label: "Intern Candidates", val: internAppsCount, desc: "Students/Trainees" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-bg-primary/40 border border-white/5 rounded-xl p-4 text-center">
                      <span className="text-small-text font-bold text-text-secondary uppercase block font-display">{stat.label}</span>
                      <strong className="text-subtitle text-signal block mt-1.5 font-mono">{stat.val}</strong>
                      <span className="text-small-text text-text-secondary mt-1 block">{stat.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Dynamic SVG Charts */}
                <div className="grid md:grid-cols-2 gap-8 pt-4">
                  
                  {/* SVG Bar Chart: Applications by Division */}
                  <div className="bg-black/30 border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <BarChart2 size={16} className="text-signal" />
                        Applications by Division
                      </h3>
                    </div>

                    <div className="h-64 flex flex-col justify-between">
                      {Object.entries(deptAppDistribution).map(([dept, count]) => {
                        const total = totalAppsCount || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={dept} className="space-y-1.5 text-left">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-white">{dept}</span>
                              <span className="text-signal font-mono">{count} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-bg-primary h-2.5 rounded-full overflow-hidden border border-white/5">
                              <div 
                                className="bg-gradient-to-r from-[var(--primary-green)] to-[#14B8A6] h-full rounded-full transition-all duration-500" 
                                style={{ width: `${Math.max(pct, 4)}%` }} 
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SVG Status Pie Chart representation */}
                  <div className="bg-black/30 border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <PieChart size={16} className="text-signal" />
                        Applicant Pipelines Status
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-center text-left">
                      {/* Simple CSS radial ring representing percentages */}
                      <div className="flex justify-center">
                        <div className="relative h-36 w-36 rounded-full border-4 border-signal/20 flex items-center justify-center">
                          <div className="absolute inset-4 rounded-full border border-dashed border-white/10 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-white font-mono">{applications.filter(a => a.status !== "Rejected").length}</span>
                            <span className="text-[8px] text-text-secondary uppercase font-bold tracking-widest mt-0.5">Active</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Legends */}
                      <div className="space-y-2">
                        {Object.entries(statusAppDistribution).map(([status, count]) => {
                          const pct = totalAppsCount ? Math.round((count / totalAppsCount) * 100) : 0;
                          return (
                            <div key={status} className="flex justify-between items-center text-xs">
                              <div className="flex items-center gap-2">
                                <span className={`h-1.5 w-1.5 rounded-full ${
                                  status === "New" ? "bg-blue-400" :
                                  status === "Shortlisted" ? "bg-amber-400" :
                                  status === "Selected" ? "bg-[var(--primary-green)]" :
                                  status === "Rejected" ? "bg-red-400" : "bg-purple-400"
                                }`} />
                                <span className="text-text-secondary">{status}</span>
                              </div>
                              <span className="font-mono text-white font-semibold">{count} ({pct}%)</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Tab CONTENT: Jobs Postings Manager */}
            {activeTab === "jobs" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-card text-white">Listed Job Postings</h2>
                    <p className="text-body-normal text-text-secondary mt-1">Add, update details, or toggle active hiring status.</p>
                  </div>
                  <button
                    onClick={() => {
                      resetJobForm();
                      setShowJobModal(true);
                    }}
                    className="bg-signal text-black px-3 py-1.5 rounded-lg text-xs font-bold shadow-crisp hover:bg-opacity-95 inline-flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Posting
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-text-secondary uppercase font-bold tracking-wider">
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Applicants</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {jobs.map((job) => {
                        const appCount = applications.filter(a => a.jobId === job.id).length;
                        return (
                          <tr key={job.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3.5 px-4 font-black text-white flex flex-col">
                              <span className="flex items-center gap-1.5 text-sm">
                                {job.title}
                                {job.isFeatured && <span className="text-[8px] bg-signal/25 text-signal border border-signal/30 px-1 py-0.5 rounded uppercase">Featured</span>}
                              </span>
                              <span className="text-[10px] text-text-secondary font-mono mt-0.5">{job.salary}</span>
                            </td>
                            <td className="py-3.5 px-4 text-text-secondary">{job.department}</td>
                            <td className="py-3.5 px-4 text-text-secondary">{job.location}</td>
                            <td className="py-3.5 px-4 text-text-secondary">{job.type}</td>
                            <td className="py-3.5 px-4 text-signal font-mono font-bold">{appCount} Candidates</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                job.status === "Open" ? "bg-signal/20 text-signal" : "bg-neutral-800 text-text-secondary"
                              }`}>
                                {job.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => handleEditJobClick(job)}
                                className="p-1.5 rounded hover:bg-white/10 text-white transition-colors"
                                title="Edit Job Details"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => onDeleteJob(job.id)}
                                className="p-1.5 rounded hover:bg-red-950/40 text-red-400 transition-colors"
                                title="Delete Job Posting"
                              >
                                <Trash2 size={14} />
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

            {/* Tab CONTENT: Walkin Drives */}
            {activeTab === "walkins" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-card text-white">Walk-in Drive Announcements</h2>
                    <p className="text-body-normal text-text-secondary mt-1">Post public schedules for onsite interviews.</p>
                  </div>
                  <button
                    onClick={() => setShowWalkinModal(true)}
                    className="bg-signal text-black px-3 py-1.5 rounded-lg text-xs font-bold shadow-crisp hover:bg-opacity-95 inline-flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Announcement
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {walkins.map((drive) => (
                    <div key={drive.id} className="border border-white/5 bg-bg-primary/40 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono text-signal tracking-widest uppercase font-bold">{drive.date}</span>
                          <button
                            onClick={() => onDeleteWalkin(drive.id)}
                            className="text-text-secondary hover:text-red-400 p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <h3 className="text-body-normal font-bold text-white">{drive.title}</h3>
                        <p className="text-body-normal text-text-secondary mt-2 line-clamp-2">{drive.description}</p>
                        
                        <div className="mt-3">
                          <span className="text-[10px] font-bold text-white uppercase block">Target Roles:</span>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {drive.positions.map((p) => (
                              <span key={p} className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-white/5 text-text-secondary">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {walkins.length === 0 && (
                    <div className="col-span-full text-center py-10 bg-black/10 rounded-xl border border-dashed border-white/5">
                      <p className="text-xs text-text-secondary">No walk-in drive events scheduled.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab CONTENT: Applications dashboard */}
            {activeTab === "applications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-card text-white">Review Active Applications</h2>
                  <p className="text-body-normal text-text-secondary mt-1">Evaluate resumes, message candidates, and update statuses.</p>
                </div>

                {/* Filtering controls */}
                <div className="grid sm:grid-cols-3 gap-3 bg-bg-primary/40 p-3 rounded-xl border border-white/5">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 text-text-secondary" size={14} />
                    <input
                      type="text"
                      placeholder="Search name, role..."
                      value={appSearch}
                      onChange={(e) => setAppSearch(e.target.value)}
                      className="w-full bg-bg-primary border border-white/5 rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-signal text-white"
                    />
                  </div>
                  
                  <select
                    value={appFilterStatus}
                    onChange={(e) => setAppFilterStatus(e.target.value)}
                    className="bg-bg-primary border border-white/5 rounded-lg px-3 py-2 text-xs text-white font-semibold"
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <select
                    value={appFilterJob}
                    onChange={(e) => setAppFilterJob(e.target.value)}
                    className="bg-bg-primary border border-white/5 rounded-lg px-3 py-2 text-xs text-white font-semibold"
                  >
                    <option value="All">All Jobs</option>
                    {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                    <option value="general">General Talent Pool</option>
                  </select>
                </div>

                {/* Candidates Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-text-secondary uppercase font-bold tracking-wider">
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Applied Position</th>
                        <th className="py-3 px-4">Applied Date</th>
                        <th className="py-3 px-4">Resume</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredApps.map((app) => (
                        <tr key={app.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-bold text-white block">{app.name}</span>
                            <span className="text-[10px] text-text-secondary mt-0.5 block">{app.email} | {app.phone}</span>
                          </td>
                          <td className="py-3 px-4 text-white font-medium">{app.jobTitle}</td>
                          <td className="py-3 px-4 text-text-secondary font-mono">{app.dateApplied}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => triggerMockDownload(app)}
                              className="inline-flex items-center gap-1 hover:text-signal text-text-secondary font-medium transition-colors"
                            >
                              <FileSpreadsheet size={13} />
                              <span className="truncate max-w-[120px] underline">{app.resumeName}</span>
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={app.status}
                              onChange={(e) => onUpdateAppStatus(app.id, e.target.value as Application["status"])}
                              className={`px-2 py-1.5 rounded border text-[10px] font-bold focus:outline-none bg-bg-primary ${
                                app.status === "New" ? "border-blue-500/30 text-blue-400" :
                                app.status === "Shortlisted" ? "border-amber-500/30 text-amber-400" :
                                app.status === "Interview Scheduled" ? "border-purple-500/30 text-purple-400" :
                                app.status === "Selected" ? "border-signal/30 text-signal" : "border-red-500/30 text-red-400"
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Interview Scheduled">Interview Scheduled</option>
                              <option value="Selected">Selected</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="p-1 rounded hover:bg-white/10 text-white"
                              title="View message & info"
                            >
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredApps.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-text-secondary">
                            No applications matching current search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}



            {/* Tab CONTENT: Life Updates Feed Manager */}
            {activeTab === "updates" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-card text-white">Manage Life & updates Stream</h2>
                    <p className="text-body-normal text-text-secondary mt-1">Post photo feeds, employee spotlights, or office notifications.</p>
                  </div>
                  <button
                    onClick={() => setShowUpdateModal(true)}
                    className="bg-signal text-black px-3 py-1.5 rounded-lg text-xs font-bold shadow-crisp hover:bg-opacity-95 inline-flex items-center gap-1"
                  >
                    <Plus size={12} /> Post Update
                  </button>
                </div>

                <div className="space-y-4">
                  {updates.map((update) => (
                    <div key={update.id} className="bg-black/30 border border-white/5 rounded-xl p-4 flex gap-4">
                      {update.image && (
                        <div className="relative h-20 w-28 bg-bg-primary rounded overflow-hidden shrink-0 border border-white/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={update.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-signal">{update.type}</span>
                            <button
                              onClick={() => onDeleteUpdate(update.id)}
                              className="text-text-secondary hover:text-red-400 p-0.5"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <h3 className="text-body-normal font-bold text-white mt-1 leading-snug">{update.title}</h3>
                          <p className="text-body-normal text-text-secondary line-clamp-1 mt-1">{update.content}</p>
                        </div>
                        <span className="text-[9px] text-text-secondary font-mono mt-2 block">{update.date} | ❤️ {update.likes} Likes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* MODAL: Create / Edit Job Posting */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-bg-card border border-border-primary rounded-2xl p-6 sm:p-8 shadow-premium max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                resetJobForm();
                setShowJobModal(false);
              }}
              className="absolute right-4 top-4 text-text-secondary hover:text-white p-1 rounded-full hover:bg-white/5"
            >
              <X size={18} />
            </button>

            <h3 className="text-subtitle text-white mb-6">
              {editingJob ? "Edit Job Posting details" : "Create New Job Posting"}
            </h3>

            <form onSubmit={jobSubmitHandler} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                    placeholder="e.g., Senior Embedded Engineer"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Department *</label>
                  <select
                    value={jobDept}
                    onChange={(e) => setJobDept(e.target.value)}
                    className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Software">Software</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Procurement">Procurement</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={jobLoc}
                    onChange={(e) => setJobLoc(e.target.value)}
                    className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                    placeholder="Chennai / Hybrid"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Employment Type *</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Experience *</label>
                  <input
                    type="text"
                    required
                    value={jobExp}
                    onChange={(e) => setJobExp(e.target.value)}
                    className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                    placeholder="2+ Years Experience"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Salary Range *</label>
                  <input
                    type="text"
                    required
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                    placeholder="e.g., ₹8,00,000 - ₹12,00,000 PA"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Application Closing Date *</label>
                  <input
                    type="date"
                    required
                    value={jobDeadline}
                    onChange={(e) => setJobDeadline(e.target.value)}
                    className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Status and Banner checks */}
              <div className="bg-bg-primary/40 border border-white/5 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={jobStatus === "Open"}
                    onChange={(e) => setJobStatus(e.target.checked ? "Open" : "Closed")}
                    className="rounded bg-bg-primary border-white/10 text-signal focus:ring-0"
                  />
                  <span>Hiring Open</span>
                </label>
                
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={jobFeatured}
                    onChange={(e) => setJobFeatured(e.target.checked)}
                    className="rounded bg-bg-primary border-white/10 text-signal focus:ring-0"
                  />
                  <span>⭐ Featured Job</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={jobUrgent}
                    onChange={(e) => setJobUrgent(e.target.checked)}
                    className="rounded bg-bg-primary border-white/10 text-signal focus:ring-0"
                  />
                  <span>Urgent Hiring</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={jobInternship}
                    onChange={(e) => setJobInternship(e.target.checked)}
                    className="rounded bg-bg-primary border-white/10 text-signal focus:ring-0"
                  />
                  <span>Internship role</span>
                </label>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="React, TypeScript, Embedded, ESP32"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Job Description *</label>
                <textarea
                  required
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  rows={4}
                  className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white resize-none"
                  placeholder="Summarize the core expectations and role scope..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-signal text-black py-3 rounded-lg font-bold text-xs tracking-wider uppercase hover:bg-opacity-95 shadow-crisp"
              >
                {editingJob ? "Save Changes" : "Create Posting"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Create Walkin Announcement */}
      {showWalkinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-bg-card border border-border-primary rounded-2xl p-6 sm:p-8 shadow-premium">
            <button
              onClick={() => setShowWalkinModal(false)}
              className="absolute right-4 top-4 text-text-secondary hover:text-white p-1 rounded-full hover:bg-white/5"
            >
              <X size={18} />
            </button>

            <h3 className="text-subtitle text-white mb-6">Schedule Walk-in Interview</h3>

            <form onSubmit={handleWalkinSubmit} className="space-y-4 font-sans text-left">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Drive Title *</label>
                <input
                  type="text"
                  required
                  value={walkinTitle}
                  onChange={(e) => setWalkinTitle(e.target.value)}
                  className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="e.g., Mechanical Design Walk-In Interview"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={walkinDate}
                    onChange={(e) => setWalkinDate(e.target.value)}
                    className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Target Roles (comma split)</label>
                  <input
                    type="text"
                    required
                    value={walkinPositions}
                    onChange={(e) => setWalkinPositions(e.target.value)}
                    className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                    placeholder="Mechanical Engineer, CAD"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Lab / Location Address</label>
                <input
                  type="text"
                  value={walkinLoc}
                  onChange={(e) => setWalkinLoc(e.target.value)}
                  className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="Guindy Industrial Estate, Chennai"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Brief details / requirements</label>
                <textarea
                  value={walkinDesc}
                  onChange={(e) => setWalkinDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white resize-none"
                  placeholder="Candidates must bring portfolio files and graduation details..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-signal text-black py-3 rounded-lg font-bold text-xs tracking-wider uppercase hover:bg-opacity-95 shadow-crisp"
              >
                Schedule Drive
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Post Life Update */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-bg-card border border-border-primary rounded-2xl p-6 sm:p-8 shadow-premium">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="absolute right-4 top-4 text-text-secondary hover:text-white p-1 rounded-full hover:bg-white/5"
            >
              <X size={18} />
            </button>

            <h3 className="text-subtitle text-white mb-6">Create Social Stream Update</h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 font-sans text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Post Type</label>
                  <select
                    value={updateType}
                    onChange={(e) => setUpdateType(e.target.value as "update" | "life")}
                    className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="life">📷 Culture & Team</option>
                    <option value="update">📢 Company Announcement</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Photo URL (Unsplash/Web)</label>
                  <input
                    type="text"
                    value={updateImage}
                    onChange={(e) => setUpdateImage(e.target.value)}
                    className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Post Title *</label>
                <input
                  type="text"
                  required
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="e.g., TEXAWAVE Welcomes 12 New Interns"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">Post Content *</label>
                <textarea
                  required
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  rows={4}
                  className="w-full bg-bg-primary border border-border-primary focus:border-signal focus:outline-none rounded-lg px-3 py-2 text-xs text-white resize-none"
                  placeholder="Share a story, employee milestone, or hackathon outcomes..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-signal text-black py-3 rounded-lg font-bold text-xs tracking-wider uppercase hover:bg-opacity-95 shadow-crisp"
              >
                Publish Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Application / Candidate Message details review */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-bg-card border border-border-primary rounded-2xl p-6 sm:p-8 shadow-premium">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute right-4 top-4 text-text-secondary hover:text-white p-1 rounded-full hover:bg-white/5"
            >
              <X size={18} />
            </button>

            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-signal block">
              Applicant profile
            </span>
            <h3 className="text-subtitle text-white mt-1">{selectedApp.name}</h3>
            <p className="text-body-normal text-text-secondary mt-0.5">{selectedApp.email} | {selectedApp.phone}</p>
            
            <div className="border-t border-white/5 pt-4 mt-6">
              <span className="text-[10px] font-bold text-white uppercase block">Target Position</span>
              <p className="text-sm font-semibold text-signal mt-1">{selectedApp.jobTitle}</p>
            </div>

            <div className="mt-4">
              <span className="text-[10px] font-bold text-white uppercase block">Application Date</span>
              <p className="text-xs text-text-secondary mt-1">{selectedApp.dateApplied}</p>
            </div>

            {selectedApp.skills && selectedApp.skills.length > 0 && (
              <div className="mt-4">
                <span className="text-[10px] font-bold text-white uppercase block">Interests & Skills</span>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {selectedApp.skills.map((s) => (
                    <span key={s} className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-white/5 text-text-secondary">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <span className="text-[10px] font-bold text-white uppercase block">Introduction Message</span>
              <p className="text-xs text-text-secondary leading-relaxed bg-black/45 p-4 rounded-xl border border-white/5 mt-2 whitespace-pre-line max-h-36 overflow-y-auto">
                {selectedApp.message || "No cover message provided."}
              </p>
            </div>

            <div className="border-t border-white/5 pt-6 mt-6 flex justify-between items-center">
              <button
                onClick={() => triggerMockDownload(selectedApp)}
                className="inline-flex items-center gap-1 bg-signal/15 text-signal hover:bg-signal/25 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-signal/25"
              >
                <FileSpreadsheet size={14} /> Download Resume
              </button>
              
              <button
                onClick={() => setSelectedApp(null)}
                className="text-xs text-text-secondary hover:text-white font-bold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  // Helper trigger function
  function jobSubmitHandler(e: React.FormEvent) {
    handleJobSubmit(e);
  }
}
