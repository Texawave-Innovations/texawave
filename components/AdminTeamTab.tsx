"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Trash2, Edit, ArrowUp, ArrowDown, Linkedin, 
  Upload, User, Shield, Check, Loader2, AlertCircle, Mail, Eye, EyeOff, Archive
} from "lucide-react";
import { ref, onValue, set, update, remove } from "firebase/database";
import { db } from "@/lib/firebase";

// Schema Definitions
interface CoFounder {
  id: string;
  name: string;
  role: string;
  department: string;
  description: string;
  photoUrl: string;
  linkedin: string;
  order: number;
  active: boolean;
  email?: string;
  experience?: string;
}

interface Department {
  id: string;
  name: string;
  key: string;
}

type TabType = "cofounders" | "departments";

export default function AdminTeamTab() {
  const [activeTab, setActiveTab] = useState<TabType>("cofounders");
  
  // Data states
  const [cofounders, setCofounders] = useState<CoFounder[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Status states
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Common/shared form fields
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [deptName, setDeptName] = useState(""); // specifically for Departments tab
  const [selectedDept, setSelectedDept] = useState("");
  const [bio, setBio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  // Fetch all team data
  useEffect(() => {
    const teamRef = ref(db, "team");
    setLoading(true);
    const unsubscribe = onValue(teamRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        
        // 2. CoFounders
        if (data.leadership && data.leadership.cofounders) {
          const loadedCofounders = Object.entries(data.leadership.cofounders).map(([key, val]: [string, any]) => ({
            id: key,
            ...val
          }));
          loadedCofounders.sort((a, b) => (a.order || 0) - (b.order || 0));
          setCofounders(loadedCofounders);
        } else {
          setCofounders([]);
        }

        // 3. Departments
        if (data.departments) {
          const loadedDepts = Object.entries(data.departments).map(([key, val]: [string, any]) => ({
            id: key,
            ...val
          }));
          setDepartments(loadedDepts);
        } else {
          setDepartments([]);
        }
      } else {
        setCofounders([]);
        setDepartments([]);
      }
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError("Failed to sync team data with Firebase Realtime Database.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Set default selected department once loaded
  useEffect(() => {
    if (departments.length > 0 && !selectedDept) {
      setSelectedDept(departments[0].name);
    }
  }, [departments]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  const resetForm = () => {
    setEditId(null);
    setName("");
    setRole("");
    setDeptName("");
    setSelectedDept(departments.length > 0 ? departments[0].name : "");
    setBio("");
    setLinkedin("");
    setEmail("");
    setExperience("");
    setPhotoUrl("");
    setError(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (item: any) => {
    resetForm();
    setEditId(item.id);
    setName(item.name || "");
    setRole(item.role || "");
    setSelectedDept(item.department || (departments.length > 0 ? departments[0].name : ""));
    setBio(item.description || item.bio || "");
    setLinkedin(item.linkedin || "");
    setEmail(item.email || "");
    setExperience(item.experience || "");
    setPhotoUrl(item.photoUrl || "");
    setShowModal(true);
  };

  // Image Upload helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/case-studies/upload", {
        method: "POST",
        headers: {
          "Authorization": "Bearer jwt_mock_admin_token"
        },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setPhotoUrl(data.url);
        setSuccess("Profile photo uploaded successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || "Failed to upload image.");
      }
    } catch (err) {
      setError("Network error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  // Save Modal Forms (CoFounders, Employees)
  const handleSubmitModalForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (activeTab === "cofounders") {
        if (!name || !role) throw new Error("Name and Role are required.");
        const cofounderId = editId || `cofounder-${Date.now()}`;
        const targetCofounder = cofounders.find(c => c.id === editId);
        
        const payload = {
          name,
          role,
          department: selectedDept,
          description: bio,
          photoUrl: photoUrl || "",
          linkedin: linkedin || "",
          email: email || "",
          experience: experience || "",
          order: targetCofounder ? targetCofounder.order : cofounders.length + 1,
          active: targetCofounder ? targetCofounder.active : true
        };
        await set(ref(db, `team/leadership/cofounders/${cofounderId}`), payload);
        setSuccess(editId ? "Co-Founder updated!" : "Co-Founder added!");
      }

      setShowModal(false);
      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  // Add Department Form (instant execution)
  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName) return;

    setSubmitting(true);
    setError(null);
    try {
      const key = deptName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
      const deptId = `dept-${Date.now()}`;
      await set(ref(db, `team/departments/${deptId}`), {
        name: deptName,
        key
      });
      setDeptName("");
      setSuccess(`Department "${deptName}" added!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to add department.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Action
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;
    setError(null);

    try {
      let path = "";
      if (activeTab === "cofounders") path = `team/leadership/cofounders/${id}`;
      else if (activeTab === "departments") path = `team/departments/${id}`;

      await remove(ref(db, path));
      setSuccess(`Removed "${name}" successfully.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to remove entry.");
    }
  };

  // Visibility Toggle Action
  const handleToggleActive = async (item: any) => {
    try {
      let path = "";
      if (activeTab === "cofounders") path = `team/leadership/cofounders/${item.id}`;

      await update(ref(db, path), { active: !item.active });
    } catch (err: any) {
      setError(err.message || "Failed to update visibility.");
    }
  };

  // Reorder Actions
  const handleReorder = async (index: number, direction: "up" | "down") => {
    const list = [...cofounders];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    // Swap
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // Save ordering
    try {
      const updates: Record<string, any> = {};
      list.forEach((item, idx) => {
        updates[`${item.id}/order`] = idx + 1;
      });

      let path = "";
      if (activeTab === "cofounders") path = "team/leadership/cofounders";

      await update(ref(db, path), updates);
    } catch (err: any) {
      setError(err.message || "Failed to save new order.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Team Management</h1>
          <p className="text-text-secondary text-sm mt-1">
            Configure leadership, custom divisions, employee grids, and internships for the redesigned About page.
          </p>
        </div>
        
        <div className="flex items-center gap-3">

          {activeTab !== "departments" && (
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-[#8CC63F] px-5 py-2.5 font-bold text-black hover:bg-[#a8eb90] hover:shadow-[0_0_20px_rgba(140,198,63,0.3)] transition-all text-xs uppercase tracking-wider shadow-lg"
            >
              <Plus size={16} /> Add Member
            </button>
          )}
        </div>
      </div>

      {/* Sub tabs navigation */}
      <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-3">
        {(["cofounders", "departments"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              resetForm();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
              activeTab === tab
                ? "bg-[#8CC63F] text-black border-transparent shadow-[0_0_15px_rgba(140,198,63,0.2)]"
                : "bg-white/[0.02] dark:bg-white/[0.02] bg-neutral-100 border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-white/[0.05]"
            }`}
          >
            {tab === "cofounders" ? "Co-Founders" : tab}
          </button>
        ))}
      </div>

      {success && (
        <div className="p-4 bg-green-950/20 border border-[#8CC63F]/20 text-xs text-[#8CC63F] rounded-2xl flex items-center gap-2">
          <Check size={16} /> <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-500/20 text-xs text-red-400 rounded-2xl flex items-center gap-2">
          <AlertCircle size={16} /> <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-text-secondary">
          <Loader2 size={36} className="animate-spin text-[#8CC63F] mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest font-mono">Retrieving team hierarchy...</p>
        </div>
      ) : (
        <>

          {/* TAB 2: CO-FOUNDERS */}
          {activeTab === "cofounders" && (
            <div className="dashboard-card bg-[#111] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-white/[0.01] text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono">
                      <th className="px-6 py-4">Order</th>
                      <th className="px-6 py-4">Co-Founder</th>
                      <th className="px-6 py-4">Role & Div</th>
                      <th className="px-6 py-4">Visibility</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-xs">
                    {cofounders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 font-mono text-neutral-500">
                          No Co-Founders created yet. Click "Add Member" to create one.
                        </td>
                      </tr>
                    ) : (
                      cofounders.map((cf, index) => (
                        <tr key={cf.id} className="hover:bg-white/[0.02] border-b border-white/[0.04]">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-neutral-400 font-semibold w-4 text-center">{index + 1}</span>
                              <div className="flex flex-col">
                                <button
                                  onClick={() => handleReorder(index, "up")}
                                  disabled={index === 0}
                                  className="p-1 text-neutral-500 hover:text-black dark:hover:text-white disabled:opacity-20 transition-all"
                                >
                                  <ArrowUp size={11} />
                                </button>
                                <button
                                  onClick={() => handleReorder(index, "down")}
                                  disabled={index === cofounders.length - 1}
                                  className="p-1 text-neutral-500 hover:text-black dark:hover:text-white disabled:opacity-20 transition-all"
                                >
                                  <ArrowDown size={11} />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {cf.photoUrl ? (
                                <img src={cf.photoUrl} alt={cf.name} className="h-10 w-10 rounded-full object-cover border border-white/10" />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center font-mono font-bold text-neutral-500 text-xs">
                                  {cf.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <h4 className="font-bold text-white text-sm">{cf.name}</h4>
                                <div className="flex flex-wrap gap-2 items-center mt-0.5">
                                  {cf.linkedin && (
                                    <a href={cf.linkedin} target="_blank" rel="noreferrer" className="text-[#8CC63F] hover:underline text-[10px] font-mono inline-flex items-center gap-1">
                                      <Linkedin size={8} /> linkedin
                                    </a>
                                  )}
                                  {cf.email && (
                                    <span className="text-neutral-400 text-[10px] font-mono inline-flex items-center gap-1">
                                      <Mail size={8} /> {cf.email}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-white font-medium">{cf.role}</div>
                            <div className="text-neutral-400 text-[10px] font-mono mt-0.5">{cf.department}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleActive(cf)}
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider font-mono border transition-all ${
                                cf.active !== false
                                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                                  : "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"
                              }`}
                            >
                              {cf.active !== false ? <Eye size={10} /> : <EyeOff size={10} />}
                              {cf.active !== false ? "Visible" : "Hidden"}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleOpenEditModal(cf)} className="p-2 rounded-xl bg-white/[0.03] hover:bg-[#8CC63F]/15 hover:text-[#8CC63F] transition-all text-neutral-400">
                                <Edit size={13} />
                              </button>
                              <button onClick={() => handleDelete(cf.id, cf.name)} className="p-2 rounded-xl bg-white/[0.03] hover:bg-red-500/15 hover:text-red-400 transition-all text-neutral-400">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: DEPARTMENTS */}
          {activeTab === "departments" && (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Add form */}
              <form onSubmit={handleAddDepartment} className="dashboard-card bg-[#111] border border-white/[0.08] rounded-2xl p-5 space-y-4 self-start">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider font-mono">Create Division</h3>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary font-mono">Department Title</label>
                  <input
                    type="text"
                    required
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    placeholder="Embedded Engineering"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8CC63F]"
                  />
                  <p className="text-[9px] text-neutral-500 font-mono">
                    Note: A unique URL filter key will be automatically created (e.g. "embedded-engineering").
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#8CC63F] px-4 py-2.5 font-bold text-black hover:bg-[#a8eb90] disabled:opacity-50 transition-all text-xs font-mono uppercase tracking-wider"
                >
                  <Plus size={14} /> Add Division
                </button>
              </form>

              {/* Department Table */}
              <div className="md:col-span-2 dashboard-card bg-[#111] border border-white/[0.08] rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-white/[0.01] text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono">
                      <th className="px-6 py-4">Department Name</th>
                      <th className="px-6 py-4">Filter Key</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-xs">
                    {departments.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-10 font-mono text-neutral-500">
                          No departments defined.
                        </td>
                      </tr>
                    ) : (
                      departments.map((dept) => (
                        <tr key={dept.id} className="hover:bg-white/[0.02]">
                          <td className="px-6 py-4 font-bold text-white">{dept.name}</td>
                          <td className="px-6 py-4 font-mono text-neutral-400">{dept.key}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDelete(dept.id, dept.name)}
                              className="p-2 rounded-xl bg-white/[0.03] hover:bg-red-500/15 hover:text-red-400 transition-all text-neutral-400"
                              title="Delete Division"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}




        </>
      )}

      {/* CREATE / EDIT MODAL FOR LEADERSHIP, EMPLOYEES & INTERNS */}
      {showModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-lenis-prevent>
          <div className="dashboard-modal bg-[#0f0f0f] border border-white/10 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl animate-scale-in text-left">
            <form onSubmit={handleSubmitModalForm} className="flex flex-col max-h-[85vh]">
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/10 bg-white/[0.01] flex items-center justify-between shrink-0">
                <h3 className="font-display font-bold text-white text-lg">
                  {editId ? "Edit Entry" : `Add New ${activeTab === "cofounders" ? "Co-Founder" : "Employee"}`}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-text-secondary hover:text-black dark:hover:text-white transition-colors font-semibold text-xs uppercase font-mono"
                >
                  Cancel
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-mono">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Arun Kumar"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8CC63F]"
                    />
                  </div>

                  {/* Role/Position */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-mono">Role / Designation *</label>
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Firmware Engineer"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8CC63F]"
                    />
                  </div>
                </div>

                {/* Department selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-mono">Division / Department *</label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#8CC63F]"
                  >
                    {departments.length === 0 ? (
                      <option value="">No custom departments (seed database first)</option>
                    ) : (
                      departments.map((dept) => (
                        <option key={dept.id} value={dept.name} className="bg-[#111] text-white">
                          {dept.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-mono">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@texawave.com"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8CC63F]"
                  />
                </div>

                {/* LinkedIn Link (leadership/employees) */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-mono">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8CC63F]"
                  />
                </div>



                {/* Photo uploader */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-mono">Profile Photo</label>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="shrink-0">
                      {photoUrl ? (
                        <div className="relative group h-14 w-14">
                          <img
                            src={photoUrl}
                            alt="Preview"
                            className="h-14 w-14 rounded-full object-cover border-2 border-[#8CC63F]"
                          />
                          <button
                            type="button"
                            onClick={() => setPhotoUrl("")}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Plus size={10} className="rotate-45" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-white/[0.04] border border-dashed border-white/20 flex items-center justify-center text-neutral-500">
                          <User size={24} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={photoUrl}
                          onChange={(e) => setPhotoUrl(e.target.value)}
                          placeholder="Image URL or upload"
                          className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8CC63F]"
                        />
                        <label className="cursor-pointer shrink-0 inline-flex items-center justify-center gap-1.5 bg-[#8CC63F]/10 hover:bg-[#8CC63F]/20 border border-[#8CC63F]/20 rounded-xl px-4 text-xs font-bold text-[#8CC63F] transition-colors">
                          {uploading ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <>
                              <Upload size={13} />
                              <span>Upload</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/10 bg-white/[0.01] flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-bold text-xs uppercase tracking-wider font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#8CC63F] text-black hover:bg-[#a8eb90] transition-all font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 hover:shadow-[0_0_15px_rgba(140,198,63,0.3)]"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check size={14} /> Save Record
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
