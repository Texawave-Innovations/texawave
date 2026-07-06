"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Plus, MessageSquare, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  category: string;
  heroImage: string;
  problemStatement: string;
  challenges: string;
  solution: string;
  hardwareEngineering: string;
  softwareEngineering: string;
  mechanicalEngineering: string;
  resultsImpact: string;
  gallery: string[];
  status: "Draft" | "Published";
  views: number;
  comments: any[];
}

interface CaseStudiesListProps {
  initialStudies: CaseStudy[];
  isAdmin?: boolean;
}

export function CaseStudiesList({ initialStudies, isAdmin: propIsAdmin = false }: CaseStudiesListProps) {
  const [studies, setStudies] = useState<CaseStudy[]>(initialStudies);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isAdmin, setIsAdmin] = useState(propIsAdmin);
  const categories = ["All", "Mechanical Engineering", "Electrical Engineering", "Software Engineering", "Procurement"];

  useEffect(() => {
    if (!propIsAdmin && typeof window !== "undefined") {
      const role = localStorage.getItem("texawave_role");
      setIsAdmin(role === "admin");
    }
  }, [propIsAdmin]);

  useEffect(() => {
    const csRef = ref(db, "caseStudies");
    const commentsRef = ref(db, "caseStudyComments");

    let loadedCS: any[] = [];
    let commentsObj: any = {};

    const updateCSState = () => {
      const mapped = loadedCS.map(cs => {
        const csComments = commentsObj[cs.id]
          ? Object.keys(commentsObj[cs.id]).map(key => ({ id: key, ...commentsObj[cs.id][key] }))
          : [];
        return {
          ...cs,
          comments: csComments,
          views: cs.views || 0,
          likes: cs.likes || 0
        };
      });
      setStudies(mapped);
    };

    const unsubscribeCS = onValue(csRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        loadedCS = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
      } else {
        loadedCS = initialStudies;
      }
      updateCSState();
    });

    const unsubscribeComments = onValue(commentsRef, (snapshot) => {
      if (snapshot.exists()) {
        commentsObj = snapshot.val();
      } else {
        commentsObj = {};
      }
      updateCSState();
    });

    return () => {
      unsubscribeCS();
      unsubscribeComments();
    };
  }, [initialStudies]);

  const filteredStudies = studies.filter((study) => {
    const matchesSearch =
      (study.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (study.problemStatement || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (study.category || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "All" || study.category === activeCategory;
    
    // Only show published case studies on the public list
    const matchesStatus = study.status === "Published";

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="w-full">
      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12" data-reveal>
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto justify-start">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`case-study-filter-btn px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border ${
                activeCategory === category
                  ? "bg-[#8CC63F]/15 border-[#8CC63F]/40 text-[#8CC63F] shadow-[0_0_12px_rgba(140,198,63,0.1)]"
                  : ""
              }`}
            >
              {category.replace(" Engineering", "")}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-3 flex items-center text-text-secondary">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Search case studies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="case-study-search-input w-full bg-white dark:bg-bg-secondary border border-[#E5E7EB] dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#010101] dark:text-white placeholder-text-secondary focus:border-[#8CC63F] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid of Case Studies */}
      <motion.div 
        layout
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredStudies.map((study) => (
            <Link
              href={`/case-studies/${study.slug}`}
              key={study.id}
              className="group block"
            >
              <motion.article
                layout
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.35 }}
                className="case-study-card relative flex flex-col justify-between rounded-2xl border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#111] overflow-hidden transition-all duration-300 shadow-sm dark:shadow-crisp h-full"
              >
                <div>
                  {/* Hero / Cover Image */}
                  <div className="case-study-card-image-bg relative h-48 w-full overflow-hidden border-b border-[#E5E7EB] dark:border-white/5 bg-[#F8F9FB] dark:bg-[#080808]">
                    <Image
                      src={study.heroImage || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"}
                      alt={study.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                    
                    {/* Category overlay pill */}
                    <span className="absolute top-4 left-4 rounded-full border border-signal/30 bg-black/55 backdrop-blur-md px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#8CC63F]">
                      {study.category}
                    </span>

                    {/* Status Indicator for Admin */}
                    {isAdmin && (
                      <span className={`absolute top-4 right-4 rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] flex items-center gap-1 ${
                        study.status === "Published" 
                          ? "bg-green-500/10 border-green-500/30 text-green-400" 
                          : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                      }`}>
                        <Shield size={9} /> {study.status}
                      </span>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="p-7">
                    <h3 className="case-study-title text-xl font-bold font-display text-[#010101] dark:text-white group-hover:text-[#8CC63F] transition-colors leading-snug">
                      {study.title}
                    </h3>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#8CC63F] font-mono">
                      Problem
                    </p>
                    <p className="mt-1 text-xs text-text-secondary line-clamp-3 leading-relaxed">
                      {study.problemStatement}
                    </p>
                  </div>
                </div>

                {/* Bottom stats row & CTA */}
                <div className="case-study-stats p-7 pt-0 border-t border-[#E5E7EB] dark:border-white/5 bg-[#F8F9FB] dark:bg-white/[0.01] flex items-center justify-between">
                  <div className="flex items-center gap-4 text-text-secondary text-[10px] font-mono font-bold">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare size={11} className="text-text-secondary" /> {study.comments?.filter((c: any) => c.approved).length || 0}
                    </span>
                  </div>
                  
                  <div
                    className="case-study-read-link inline-flex items-center gap-1.5 text-xs font-bold text-[#010101] dark:text-white group-hover:text-[#8CC63F] transition-all"
                  >
                    Read Study <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredStudies.length === 0 && (
        <div className="case-study-empty-state text-center py-20 border border-dashed border-[#E5E7EB] dark:border-white/10 rounded-2xl bg-white dark:bg-[#111]">
          <Search size={36} className="mx-auto text-text-secondary mb-4 opacity-50" />
          <h3 className="case-study-empty-title text-lg font-bold text-[#010101] dark:text-white font-display">No Case Studies Found</h3>
          <p className="text-text-secondary text-xs mt-1">Try relaxing your search terms or category filter.</p>
        </div>
      )}
    </div>
  );
}
