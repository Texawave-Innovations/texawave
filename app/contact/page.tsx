"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { PageChrome } from "@/components/PageChrome";
import { MapCard } from "@/components/MapCard";

interface FieldOption {
  value: string;
  label: string;
}

interface FieldConfigItem {
  name: string;
  label: string;
  required: boolean;
  type?: string;
  placeholder?: string;
  options?: FieldOption[];
}

const FIELD_CONFIG: FieldConfigItem[] = [
  { 
    name: "name", 
    label: "Name", 
    required: true,
    placeholder: "e.g., Jane Doe"
  },
  { 
    name: "company", 
    label: "Company", 
    required: false,
    placeholder: "e.g., Acme Corporation"
  },
  { 
    name: "country", 
    label: "Country", 
    required: false,
    placeholder: "e.g., United States"
  },
  { 
    name: "email", 
    label: "Email", 
    required: true, 
    type: "email",
    placeholder: "jane@company.com"
  },
  { 
    name: "serviceNeeded", 
    label: "Service Needed", 
    required: false,
    type: "select",
    options: [
      { value: "", label: "Select a service..." },
      { value: "Software & IoT Development", label: "Software & IoT Development" },
      { value: "Electrical Engineering / PCB Design", label: "Electrical Engineering / PCB Design" },
      { value: "End-to-End Product Design", label: "End-to-End Product Design" },
      { value: "Mechanical Engineering & Analysis", label: "Mechanical Engineering & Analysis" },
      { value: "Dedicated Engineering Team", label: "Dedicated Engineering Team" },
      { value: "Other", label: "Other Services" },
    ]
  },
  { 
    name: "projectStage", 
    label: "Project Stage", 
    required: false,
    type: "select",
    options: [
      { value: "", label: "Select project stage..." },
      { value: "Idea / Concept Phase", label: "Idea / Concept Phase" },
      { value: "Prototype / MVP Development", label: "Prototype / MVP Development" },
      { value: "Scale-Up / Feature Expansion", label: "Scale-Up / Feature Expansion" },
      { value: "Legacy Refactoring / Code Audit", label: "Legacy Refactoring / Code Audit" },
    ]
  },
  { 
    name: "budgetRange", 
    label: "Budget Range", 
    required: false,
    type: "select",
    options: [
      { value: "", label: "Select budget range..." },
      { value: "Under $10,000", label: "Under $10,000" },
      { value: "$10,000 - $25,000", label: "$10,000 - $25,000" },
      { value: "$25,000 - $50,000", label: "$25,000 - $50,000" },
      { value: "$50,000 - $100,000", label: "$50,000 - $100,000" },
      { value: "$100,000+", label: "$100,000+" },
    ]
  },
  { 
    name: "timeline", 
    label: "Timeline", 
    required: false,
    type: "select",
    options: [
      { value: "", label: "Select timeline..." },
      { value: "Immediate (< 1 month)", label: "Immediate (< 1 month)" },
      { value: "1 - 3 months", label: "1 - 3 months" },
      { value: "3 - 6 months", label: "3 - 6 months" },
      { value: "Flexible / Ongoing", label: "Flexible / Ongoing" },
    ]
  },
];

import { ref, set } from "firebase/database";
import { db, auth } from "@/lib/firebase";

export default function ContactPage() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const meetingId = `meeting-${Date.now()}`;
      const contactId = `contact-${Date.now()}`;
      const userId = auth.currentUser?.uid || "guest";
      const now = new Date().toISOString();

      const meetingData = {
        userId,
        name: formData.name || "",
        email: formData.email || "",
        company: formData.company || "",
        phone: formData.phone || "",
        service: formData.serviceNeeded || "General",
        date: formData.preferredDate || now.split("T")[0],
        time: formData.preferredTime || "12:00",
        message: formData.message || "",
        status: "pending",
        createdAt: now
      };

      const contactData = {
        name: formData.name || "",
        email: formData.email || "",
        company: formData.company || "",
        phone: formData.phone || "",
        message: formData.message || "",
        status: "new",
        createdAt: now
      };

      // Direct Firebase Realtime Database writes
      await set(ref(db, `meetings/${meetingId}`), meetingData);
      await set(ref(db, `contacts/${contactId}`), contactData);

      setSuccess(true);
      setFormData({});
      // Reset the actual form inputs
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageChrome>
      <section className="bg-bg-primary py-20 transition-colors duration-300">
        <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)] grid gap-10 lg:grid-cols-[1.18fr_0.82fr] items-start">
          
          {/* Left Column: Title, Description, and Form Card */}
          <div className="space-y-8">
            <div>
              <p className="text-small-text font-bold uppercase tracking-[0.18em] text-signal">
                Contact / Book a call
              </p>
              <h1 className="mt-3 text-hero text-ink leading-none">Ready to validate your Product Idea?</h1>
              <p className="mt-6 text-body-large text-graphite max-w-2xl">
                Share your project stage, technical needs, and launch goals. Texawave&apos;s
                engineering team will help you identify feasibility, risks, and the best next step.
              </p>
            </div>

            <div className="relative group/form">
              {/* Soft decorative blur glow effect behind the form */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-signal/15 to-teal-500/10 opacity-0 group-hover/form:opacity-100 blur-2xl transition-all duration-700 pointer-events-none" />
              
              <form
                onSubmit={handleSubmit}
                className="relative rounded-3xl border border-border-primary bg-bg-card p-6 shadow-premium md:p-8 transition-all duration-300"
              >
                {success && (
                  <div className="mb-6 flex items-start gap-3 rounded-xl bg-green-50/80 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 p-4">
                    <CheckCircle className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="font-bold text-green-800 dark:text-green-200 text-sm">Request received!</p>
                      <p className="text-green-700 dark:text-green-300/80 text-sm mt-0.5">
                        Thank you. The Texawave team will review your project details and reach out within 1–2 business days.
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50/80 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 p-4">
                    <AlertCircle className="text-red-600 dark:text-red-400 shrink-0" size={18} />
                    <p className="text-red-700 dark:text-red-300/80 text-sm">{error}</p>
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                  {FIELD_CONFIG.map(({ name, label, required, type, placeholder, options }) => (
                    <label key={name} className="flex flex-col gap-1.5 text-left">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1 font-display">
                        {label}
                        {required && <span className="text-red-500 font-bold">*</span>}
                      </span>
                      {type === "select" && options ? (
                        <select
                          className="w-full rounded-xl border border-border-primary bg-bg-primary px-4 py-3 text-sm font-medium text-text-primary outline-none transition-all duration-200 hover:border-signal/45 focus:border-signal focus:ring-4 focus:ring-signal/10 cursor-pointer"
                          name={name}
                          required={required}
                          value={formData[name] || ""}
                          onChange={handleChange}
                        >
                          {options.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-bg-card text-text-primary">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="w-full rounded-xl border border-border-primary bg-bg-primary px-4 py-3 text-sm font-medium text-text-primary placeholder:text-text-secondary/40 outline-none transition-all duration-200 hover:border-signal/45 focus:border-signal focus:ring-4 focus:ring-signal/10"
                          name={name}
                          type={type || "text"}
                          required={required}
                          placeholder={placeholder}
                          value={formData[name] || ""}
                          onChange={handleChange}
                        />
                      )}
                    </label>
                  ))}
                </div>

                <label className="mt-5 flex flex-col gap-1.5 text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1 font-display">
                    Message
                  </span>
                  <textarea
                    className="min-h-36 w-full rounded-xl border border-border-primary bg-bg-primary px-4 py-3 text-sm font-medium text-text-primary placeholder:text-text-secondary/40 outline-none transition-all duration-200 hover:border-signal/45 focus:border-signal focus:ring-4 focus:ring-signal/10 resize-y"
                    name="message"
                    placeholder="Tell us about your project goals, technical challenges, and timeline..."
                    value={formData["message"] || ""}
                    onChange={handleChange}
                  />
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-premium mt-6 w-full rounded-xl bg-signal px-6 py-4 font-black text-white border border-transparent flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(140,198,63,0.25)] hover:shadow-[0_6px_25px_rgba(140,198,63,0.4)] disabled:opacity-60 transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Book Free Feasibility Call"
                  )}
                </button>

                <p className="mt-4 text-xs leading-relaxed text-text-secondary">
                  Texawave will use your details only to respond to your project inquiry.
                </p>
              </form>
            </div>
          </div>

          {/* Right Column: Sticky Contact coordinates & Map Card */}
          <div className="lg:sticky lg:top-28 space-y-6">
            {/* Interactive coordinates card */}
            <div className="p-6 rounded-2xl border border-border-primary bg-bg-card/65 backdrop-blur-md shadow-crisp space-y-4 transition-all duration-300 hover:border-signal/30 hover:shadow-premium">
              <a
                href="mailto:contact@texawave.com"
                className="flex items-center gap-3.5 text-body-normal font-semibold text-graphite hover:text-signal transition-colors group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal/10 text-signal group-hover:bg-signal group-hover:text-white transition-colors duration-300 shrink-0">
                  <Mail size={20} />
                </div>
                contact@texawave.com
              </a>
              
              <a
                href="tel:+918680845604"
                className="flex items-center gap-3.5 text-body-normal font-semibold text-graphite hover:text-signal transition-colors group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal/10 text-signal group-hover:bg-signal group-hover:text-white transition-colors duration-300 shrink-0">
                  <Phone size={20} />
                </div>
                +91 8680845604
              </a>
              
              <div className="flex gap-3.5 items-start text-body-normal leading-7 text-graphite">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal/10 text-signal shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Office Address</h4>
                  <p className="text-sm font-semibold mt-0.5 text-text-primary">
                    93/206, Canal Bank Road,<br />
                    Indira Nagar, Adyar, Chennai - 600020
                  </p>
                </div>
              </div>
            </div>

            <div data-reveal>
              <MapCard />
            </div>
          </div>

        </div>
      </section>
    </PageChrome>
  );
}