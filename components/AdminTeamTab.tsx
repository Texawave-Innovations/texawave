"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Trash2, Edit, ArrowUp, ArrowDown, Linkedin, 
  Upload, User, Shield, Check, Loader2, AlertCircle, RefreshCw 
} from "lucide-react";
import { ref, onValue, set, update, remove, get } from "firebase/database";
import { db } from "@/lib/firebase";

interface TeamMember {
  id: string;
  name: string;
  department: string;
  role: string;
  description: string;
  skills: string[];
  experience: string;
  linkedinUrl: string;
  profileImage: string;
  displayOrder: number;
  active?: boolean;
}

const DEPARTMENTS = [
  "Software Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Procurement",
  "IoT Engineering",
  "Product Design"
];

export default function AdminTeamTab() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [profileImage, setProfileImage] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const teamRef = ref(db, "team");
    const unsubscribe = onValue(teamRef, (snapshot) => {
      setLoading(true);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedTeam = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name || "",
          department: data[key].department || "",
          role: data[key].designation || "",
          description: data[key].description || "",
          skills: data[key].skills || [],
          experience: data[key].experience || "",
          linkedinUrl: data[key].linkedin || "",
          profileImage: data[key].imageUrl || "",
          displayOrder: data[key].order || 0,
          active: data[key].active !== undefined ? data[key].active : true
        }));

        // Sort by order ascending
        loadedTeam.sort((a, b) => a.displayOrder - b.displayOrder);
        setTeam(loadedTeam);
      } else {
        setTeam([]);
      }
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError("Failed to fetch team members from Firebase.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
    setEditingMember(null);
    setName("");
    setDepartment(DEPARTMENTS[0]);
    setRole("");
    setDescription("");
    setSkills("");
    setExperience("");
    setLinkedinUrl("");
    setProfileImage("");
    setError(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setDepartment(member.department);
    setRole(member.role);
    setDescription(member.description);
    setSkills(member.skills.join(", "));
    setExperience(member.experience);
    setLinkedinUrl(member.linkedinUrl);
    setProfileImage(member.profileImage);
    setError(null);
    setShowModal(true);
  };

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
        setProfileImage(data.url);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !department || !role) {
      setError("Name, Department, and Designation are required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const skillsArray = skills
      ? skills.split(",").map(s => s.trim()).filter(Boolean)
      : [];

    const payload = {
      name,
      department,
      role,
      description,
      skills: skillsArray,
      experience,
      linkedinUrl,
      profileImage,
    };

    try {
      const memberId = editingMember ? editingMember.id : `team-${Date.now()}`;
      const memberRef = ref(db, `team/${memberId}`);

      const memberData = {
        name,
        department,
        designation: role,
        description: description || "",
        skills: skillsArray,
        experience: experience || "",
        linkedin: linkedinUrl || "",
        imageUrl: profileImage || "",
        order: editingMember ? editingMember.displayOrder : team.length + 1,
        active: editingMember ? (editingMember.active !== undefined ? editingMember.active : true) : true
      };

      await set(memberRef, memberData);

      setSuccess(editingMember ? "Team member updated!" : "Team member added!");
      setShowModal(false);
      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save team member.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the team?`)) return;

    setError(null);
    try {
      await remove(ref(db, `team/${id}`));
      setSuccess(`${name} removed from the team.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete team member.");
    }
  };

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= team.length) return;

    const newTeam = [...team];
    
    // Swap items
    const temp = newTeam[index];
    newTeam[index] = newTeam[targetIdx];
    newTeam[targetIdx] = temp;

    // Recalculate displayOrder values
    const updatedTeam = newTeam.map((member, idx) => ({
      ...member,
      displayOrder: idx + 1
    }));

    setTeam(updatedTeam);

    try {
      const firebasePayload: Record<string, any> = {};
      updatedTeam.forEach((member) => {
        firebasePayload[member.id] = {
          name: member.name,
          department: member.department,
          designation: member.role,
          description: member.description,
          skills: member.skills,
          experience: member.experience,
          linkedin: member.linkedinUrl,
          imageUrl: member.profileImage,
          order: member.displayOrder,
          active: member.active !== undefined ? member.active : true
        };
      });

      await set(ref(db, "team"), firebasePayload);
    } catch (err: any) {
      setError(err.message || "Failed to save display order.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Team Management</h1>
          <p className="text-text-secondary text-sm mt-1">
            Administer the Texawave engineering, design, and procurement team members displayed on the About page.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#8CC63F] px-5 py-3 font-bold text-black hover:bg-[#a8eb90] hover:shadow-[0_0_20px_rgba(140,198,63,0.3)] transition-all self-start sm:self-center text-xs uppercase tracking-wider shadow-lg"
        >
          <Plus size={16} /> Add Team Member
        </button>
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
          <p className="text-xs font-bold uppercase tracking-widest font-mono">Loading team records...</p>
        </div>
      ) : team.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-[#111]">
          <User className="mx-auto text-neutral-600 mb-3" size={40} />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Team Members Found</h3>
          <p className="text-xs text-text-secondary mt-1">Add your first team member to display them on the About page.</p>
        </div>
      ) : (
        <div className="dashboard-card bg-[#111] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.01] text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono">
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Department & Role</th>
                  <th className="px-6 py-4">Experience & Skills</th>
                  <th className="px-6 py-4">Visibility</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs">
                {team.map((member, index) => (
                  <tr key={member.id} className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.04]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-neutral-400 font-semibold w-5 text-center">{index + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleReorder(index, "up")}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/20 disabled:opacity-20 disabled:pointer-events-none transition-all"
                            title="Move Up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            onClick={() => handleReorder(index, "down")}
                            disabled={index === team.length - 1}
                            className="p-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/20 disabled:opacity-20 disabled:pointer-events-none transition-all"
                            title="Move Down"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {member.profileImage ? (
                          <img
                            src={member.profileImage}
                            alt={member.name}
                            className="h-10 w-10 rounded-full object-cover border border-white/10 shadow-sm transition-transform duration-300 hover:scale-110"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#1E3A0E] to-[#0A0F0D] border border-white/10 flex items-center justify-center text-[#8CC63F] font-bold text-xs uppercase font-mono shadow-sm">
                            {member.name ? member.name.split(" ").filter(Boolean).map(n => n[0]).join("").slice(0, 2) : "TM"}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-white text-sm">{member.name}</h4>
                          {member.linkedinUrl && (
                            <a
                              href={member.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#8CC63F]/5 hover:bg-[#8CC63F]/15 text-[#8CC63F] border border-[#8CC63F]/10 hover:border-[#8CC63F]/30 mt-1 text-[9px] transition-all font-medium font-mono"
                            >
                              <Linkedin size={9} />
                              <span>LinkedIn</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white font-medium text-sm">{member.role}</div>
                      <div className="text-neutral-400 text-xs mt-0.5 font-mono">{member.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      {member.experience && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-semibold bg-[#8CC63F]/10 text-[#8CC63F] border border-[#8CC63F]/20 font-mono tracking-wider uppercase">
                          {member.experience}
                        </span>
                      )}
                      {member.skills && member.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1.5 max-w-[320px]">
                          {member.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-[9px] font-mono rounded bg-white/[0.04] text-neutral-300 border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[10px] text-neutral-500 font-mono mt-1">No skills specified</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={async () => {
                          try {
                            const memberRef = ref(db, `team/${member.id}`);
                            await update(memberRef, { active: !member.active });
                          } catch (err: any) {
                            setError(err.message || "Failed to update visibility.");
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono border transition-all ${
                          member.active !== false
                            ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                            : "bg-neutral-500/10 text-neutral-400 border-neutral-500/20 hover:bg-neutral-500/20"
                        }`}
                        title={member.active !== false ? "Click to Hide" : "Click to Show"}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${member.active !== false ? "bg-green-400 animate-pulse" : "bg-neutral-400"}`} />
                        {member.active !== false ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(member)}
                          className="p-2 rounded-xl bg-white/[0.03] hover:bg-[#8CC63F]/15 hover:text-[#8CC63F] border border-white/5 hover:border-[#8CC63F]/35 transition-all text-neutral-400"
                          title="Edit Profile"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id, member.name)}
                          className="p-2 rounded-xl bg-white/[0.03] hover:bg-red-500/15 hover:text-red-400 border border-white/5 hover:border-red-500/35 transition-all text-neutral-400"
                          title="Delete Profile"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-lenis-prevent>
          <div className="dashboard-modal bg-[#0f0f0f] border border-white/10 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl animate-scale-in text-left">
            <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
              {/* Fixed Header */}
              <div className="px-6 py-5 border-b border-white/10 bg-white/[0.01] flex items-center justify-between shrink-0">
                <h3 className="font-display font-bold text-white text-lg">
                  {editingMember ? "Edit Team Member" : "Add Team Member"}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-text-secondary hover:text-white transition-colors font-semibold text-xs uppercase"
                >
                  Cancel
                </button>
              </div>
              
              {/* Scrollable Fields */}
              <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-mono">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Arun Kumar"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8CC63F] focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(140,198,63,0.15)] transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-mono">Department *</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#8CC63F] focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(140,198,63,0.15)] transition-all duration-200"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept} className="bg-[#111] text-white">{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-mono">Designation / Role *</label>
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Full Stack Developer"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8CC63F] focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(140,198,63,0.15)] transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-mono">Experience Badge</label>
                    <input
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="3+ Years"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8CC63F] focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(140,198,63,0.15)] transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Profile Photo Uploader Section */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-mono">Profile Photo</label>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="shrink-0">
                      {profileImage ? (
                        <div className="relative group h-14 w-14">
                          <img
                            src={profileImage}
                            alt="Preview"
                            className="h-14 w-14 rounded-full object-cover border-2 border-[#8CC63F]"
                          />
                          <button
                            type="button"
                            onClick={() => setProfileImage("")}
                            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            title="Remove photo"
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
                          value={profileImage}
                          onChange={(e) => setProfileImage(e.target.value)}
                          placeholder="Image URL or upload a file"
                          className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8CC63F] transition-colors"
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
                      <p className="text-[10px] text-neutral-500 font-mono">
                        Recommended: Square image (e.g., 400x400px)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-mono">LinkedIn URL</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8CC63F] focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(140,198,63,0.15)] transition-all duration-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-mono">Skills Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, NodeJS, AWS, IoT"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8CC63F] focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(140,198,63,0.15)] transition-all duration-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-mono">Short Bio/Services Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe key engineering focus areas or accomplishments..."
                    rows={3}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8CC63F] focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(140,198,63,0.15)] transition-all duration-200 resize-none"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-950/30 border border-red-500/20 text-[11px] text-red-400 rounded-xl flex items-center gap-2">
                    <AlertCircle size={14} /> <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Fixed Footer */}
              <div className="px-6 py-4 border-t border-white/10 bg-white/[0.01] flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-bold text-xs uppercase tracking-wider"
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
                      <Check size={14} /> Save Member
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
