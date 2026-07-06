"use client";

import React, { useState } from "react";
import {
  X,
  Upload,
  User,
  Mail,
  Building2,
  FileText,
  AlertCircle,
  Image as ImageIcon,
  Check
} from "lucide-react";

interface BlogSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const CATEGORIES = ["Software", "Electrical", "Mechanical", "Procurement", "Internship", "Industry Insights"];

export function BlogSubmitModal({ isOpen, onClose, onSubmit }: BlogSubmitModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    authorPhoto: "",
    title: "",
    category: "Software",
    coverImage: "",
    content: "",
    shortDescription: "",
    domain: "Embedded Systems",
    skills: "PLC, Embedded, PCB, Testing",
    duration: "Jan 2026 – May 2026"
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Insert Rich-Text Helper Tags
  const insertTag = (tagOpen: string, tagClose: string) => {
    const textarea = document.getElementById("blog-content-textarea") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = tagOpen + (selected || "formatted text") + tagClose;
    const newValue = text.substring(0, start) + replacement + text.substring(end);

    setFormData((prev) => ({ ...prev, content: newValue }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + (selected || "formatted text").length);
    }, 0);
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "authorPhoto" | "coverImage") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024 * 1.5) {
      setFormErrors((prev) => ({ ...prev, [field]: "Image must be less than 1.5MB" }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    };
    reader.readAsDataURL(file);
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Author Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.organization.trim()) {
      errors.organization = formData.category === "Internship" ? "College name is required" : "Organization is required";
    }
    if (!formData.title.trim()) errors.title = "Blog Title is required";
    if (!formData.content.trim()) errors.content = "Content is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onSubmit(formData);
    
    // Reset local state after submit
    setFormData({
      name: "",
      email: "",
      organization: "",
      authorPhoto: "",
      title: "",
      category: "Software",
      coverImage: "",
      content: "",
      shortDescription: "",
      domain: "Embedded Systems",
      skills: "PLC, Embedded, PCB, Testing",
      duration: "Jan 2026 – May 2026"
    });
    setFormErrors({});
  };

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-bg-primary/85 backdrop-blur-sm p-4 overflow-y-auto" data-lenis-prevent="true">
      <div className="relative w-full max-w-3xl rounded-2xl border border-border-primary bg-bg-secondary shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-left animate-fade-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border-primary p-6">
          <div>
            <h2 className="text-2xl font-black text-text-primary flex items-center gap-2">
              <Upload className="text-[#8CC63F]" size={24} /> Submit Your Article
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Share your knowledge. Once approved, it will be published in Community Contributions or Intern Spotlight.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-bg-primary text-text-secondary hover:text-text-primary transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Author Name */}
            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                Author Name <span className="text-copper">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-text-secondary" size={16} />
                <input
                  type="text"
                  placeholder="e.g. Alexander Chen"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-bg-primary border border-border-primary text-text-primary focus:border-[#8CC63F] outline-none rounded-xl py-3 pl-10 pr-4 text-sm transition"
                />
              </div>
              {formErrors.name && <p className="text-xs text-orange-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.name}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                Email Address <span className="text-copper">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-text-secondary" size={16} />
                <input
                  type="email"
                  placeholder="e.g. alex@aerotech.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-bg-primary border border-border-primary text-text-primary focus:border-[#8CC63F] outline-none rounded-xl py-3 pl-10 pr-4 text-sm transition"
                />
              </div>
              {formErrors.email && <p className="text-xs text-orange-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.email}</p>}
            </div>

            {/* Blog Category */}
            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                Article Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-bg-primary border border-border-primary text-text-primary focus:border-[#8CC63F] outline-none rounded-xl py-3 px-4 text-sm transition"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-bg-secondary text-text-primary">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Organization or College */}
            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                {formData.category === "Internship" ? "College Name *" : "Organization / Company *"}
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3.5 text-text-secondary" size={16} />
                <input
                  type="text"
                  placeholder={formData.category === "Internship" ? "e.g. IIT Madras" : "e.g. Stanford University / Texawave"}
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full bg-bg-primary border border-border-primary text-text-primary focus:border-[#8CC63F] outline-none rounded-xl py-3 pl-10 pr-4 text-sm transition"
                />
              </div>
              {formErrors.organization && <p className="text-xs text-orange-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.organization}</p>}
            </div>
          </div>

          {/* Dynamic Internship Fields */}
          {formData.category === "Internship" && (
            <div className="p-4 rounded-xl border border-border-primary bg-bg-primary/20 space-y-4">
              <h4 className="text-xs font-bold text-copper uppercase tracking-wider">Internship Details</h4>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className="block text-[10px] font-bold text-text-primary uppercase mb-2">Domain Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. Embedded Systems"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full bg-bg-primary border border-border-primary text-text-primary text-xs focus:border-[#8CC63F] outline-none rounded-lg py-2 px-3 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-primary uppercase mb-2">Skills (Comma Split)</label>
                  <input
                    type="text"
                    placeholder="e.g. PLC, Embedded, PCB"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full bg-bg-primary border border-border-primary text-text-primary text-xs focus:border-[#8CC63F] outline-none rounded-lg py-2 px-3 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-primary uppercase mb-2">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. Jan 2026 – May 2026"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-bg-primary border border-border-primary text-text-primary text-xs focus:border-[#8CC63F] outline-none rounded-lg py-2 px-3 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Blog Title */}
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
              Blog Title <span className="text-copper">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 text-text-secondary" size={16} />
              <input
                type="text"
                placeholder="e.g. Design Considerations for High-Frequency PCBs"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-bg-primary border border-border-primary text-text-primary focus:border-[#8CC63F] outline-none rounded-xl py-3 pl-10 pr-4 text-sm transition"
              />
            </div>
            {formErrors.title && <p className="text-xs text-orange-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.title}</p>}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
              Short Description (2-3 lines max)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. A brief overview of the article contents for the preview cards..."
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full bg-bg-primary border border-border-primary text-text-primary focus:border-[#8CC63F] outline-none rounded-xl p-3 text-sm transition"
            />
          </div>

          {/* Photo Uploads Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Author Photo */}
            <div className="border border-border-primary rounded-xl p-4 bg-bg-primary/40">
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                Author Profile Photo
              </label>
              <div className="flex items-center gap-4">
                {formData.authorPhoto ? (
                  <img
                    src={formData.authorPhoto}
                    alt="Preview"
                    className="w-12 h-12 rounded-full object-cover border border-[#8CC63F]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full border border-border-primary bg-bg-primary flex items-center justify-center text-text-secondary text-[10px]">
                    No Pic
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    id="author-photo-input"
                    onChange={(e) => handleImageUpload(e, "authorPhoto")}
                    className="hidden"
                  />
                  <label
                    htmlFor="author-photo-input"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-primary border border-border-primary hover:border-[#8CC63F] text-xs font-bold text-text-primary transition cursor-pointer"
                  >
                    <ImageIcon size={14} /> Upload Image
                  </label>
                  <p className="text-[10px] text-text-secondary mt-1">PNG, JPG up to 1.5MB. Auto placeholder if left empty.</p>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="border border-border-primary rounded-xl p-4 bg-bg-primary/40">
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                Blog Cover Image
              </label>
              <div className="flex items-center gap-4">
                {formData.coverImage ? (
                  <img
                    src={formData.coverImage}
                    alt="Preview"
                    className="w-16 h-10 object-cover rounded border border-[#8CC63F]"
                  />
                ) : (
                  <div className="w-16 h-10 border border-border-primary bg-bg-primary rounded flex items-center justify-center text-text-secondary text-[10px]">
                    No Cover
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    id="cover-image-input"
                    onChange={(e) => handleImageUpload(e, "coverImage")}
                    className="hidden"
                  />
                  <label
                    htmlFor="cover-image-input"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-primary border border-border-primary hover:border-[#8CC63F] text-xs font-bold text-text-primary transition cursor-pointer"
                  >
                    <ImageIcon size={14} /> Upload Image
                  </label>
                  <p className="text-[10px] text-text-secondary mt-1">PNG, JPG up to 1.5MB. Auto placeholder if left empty.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rich Text Editor Field */}
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
              Rich-Text Content <span className="text-copper">*</span>
            </label>

            {/* Editor Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-bg-primary border border-b-0 border-border-primary rounded-t-xl">
              <button
                type="button"
                onClick={() => insertTag("<strong>", "</strong>")}
                className="p-1.5 rounded hover:bg-bg-secondary text-xs font-bold text-text-secondary hover:text-text-primary transition"
                title="Bold"
              >
                Bold
              </button>
              <button
                type="button"
                onClick={() => insertTag("<em>", "</em>")}
                className="p-1.5 rounded hover:bg-bg-secondary text-xs italic text-text-secondary hover:text-text-primary transition"
                title="Italic"
              >
                Italic
              </button>
              <button
                type="button"
                onClick={() => insertTag("<h2>", "</h2>")}
                className="p-1.5 rounded hover:bg-bg-secondary text-xs font-bold text-text-secondary hover:text-text-primary transition"
                title="Heading 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertTag("<h3>", "</h3>")}
                className="p-1.5 rounded hover:bg-bg-secondary text-xs font-bold text-text-secondary hover:text-text-primary transition"
                title="Heading 3"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => insertTag("<ul>\n  <li>", "</li>\n</ul>")}
                className="p-1.5 rounded hover:bg-bg-secondary text-xs text-text-secondary hover:text-text-primary transition"
                title="Bullet List"
              >
                Bullet List
              </button>
              <button
                type="button"
                onClick={() => insertTag("<pre><code>", "</code></pre>")}
                className="p-1.5 rounded hover:bg-bg-secondary text-xs font-mono text-text-secondary hover:text-text-primary transition"
                title="Code Block"
              >
                Code Block
              </button>
            </div>

            <textarea
              id="blog-content-textarea"
              rows={8}
              placeholder="Start writing your rich-text article... You can use HTML tags or the formatting buttons above."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-bg-primary border border-border-primary text-text-primary focus:border-[#8CC63F] outline-none rounded-b-xl p-4 text-sm transition font-sans leading-relaxed"
            />
            {formErrors.content && <p className="text-xs text-orange-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {formErrors.content}</p>}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-primary">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-border-primary text-text-secondary hover:text-white text-sm font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#8CC63F] hover:bg-opacity-95 text-black text-sm font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Check size={16} /> Submit to Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
