"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MessageSquare, Send, CheckCircle2, X } from "lucide-react";
import { motion } from "framer-motion";

function parseMarkdown(text: string) {
  if (!text) return "";
  
  let html = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  
  // Basic HTML Escaping
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
     
  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italic: *text*
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  
  // Headings
  html = html.replace(/^##\s+(.*?)$/gm, "<h2 class='markdown-h2'>$1</h2>");
  html = html.replace(/^#\s+(.*?)$/gm, "<h1 class='markdown-h1'>$1</h1>");
  
  const lines = html.split("\n");
  let result: string[] = [];
  let currentParagraph: string[] = [];
  let inList = false;
  let listItems: string[] = [];
  
  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      result.push(`<p>${currentParagraph.join(" ")}</p>`);
      currentParagraph = [];
    }
  };
  
  const flushList = () => {
    if (inList) {
      result.push(`<ul>${listItems.join("")}</ul>`);
      listItems = [];
      inList = false;
    }
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if heading
    const isHeading = trimmed.startsWith("<h1") || trimmed.startsWith("<h2");
    
    // Check if list item
    const listMatch = trimmed.match(/^[-*+]\s+(.*?)$/);
    
    if (isHeading) {
      flushParagraph();
      flushList();
      result.push(line);
    } else if (listMatch) {
      flushParagraph();
      if (!inList) {
        inList = true;
      }
      listItems.push(`<li>${listMatch[1]}</li>`);
    } else if (trimmed === "") {
      flushParagraph();
      flushList();
    } else {
      // Standard text line
      flushList();
      currentParagraph.push(line);
    }
  }
  
  flushParagraph();
  flushList();
  
  return result.join("\n");
}

interface Comment {
  id: string;
  userName: string;
  content: string;
  dateSubmitted: string;
  approved: boolean;
}

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
  comments: Comment[];
  relatedIds?: string[];
}

interface CaseStudyDetailClientProps {
  study: CaseStudy;
  relatedStudies: CaseStudy[];
}

import { ref, get, set, update, runTransaction, onValue } from "firebase/database";
import { db, auth } from "@/lib/firebase";

export function CaseStudyDetailClient({ study, relatedStudies }: CaseStudyDetailClientProps) {
  // Client states
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewsCount, setViewsCount] = useState(study.views || 0);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>(study.comments || []);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Form states
  const [commentName, setCommentName] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync views, likes and comments in real-time from Firebase RTDB
  useEffect(() => {
    // 1. Listen to Views Count
    const viewsRef = ref(db, `caseStudies/${study.id}/views`);
    const unsubscribeViews = onValue(viewsRef, (snapshot) => {
      if (snapshot.exists()) {
        setViewsCount(snapshot.val());
      }
    });

    // 2. Listen to Likes Count
    const likesRef = ref(db, `caseStudies/${study.id}/likes`);
    const unsubscribeLikes = onValue(likesRef, (snapshot) => {
      if (snapshot.exists()) {
        setLikesCount(snapshot.val());
      }
    });

    // 3. Listen to Comments
    const commentsRef = ref(db, `caseStudyComments/${study.id}`);
    const unsubscribeComments = onValue(commentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedComments = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setComments(loadedComments);
      } else {
        setComments(study.comments || []);
      }
    });

    return () => {
      unsubscribeViews();
      unsubscribeLikes();
      unsubscribeComments();
    };
  }, [study.id]);

  // Handle unique view tracking
  useEffect(() => {
    const recordUniqueView = async () => {
      const userId = auth.currentUser?.uid || "guest";
      const viewTrackerRef = ref(db, `caseStudyViews/${study.id}/${userId}`);
      try {
        const snap = await get(viewTrackerRef);
        if (!snap.exists()) {
          // Record the view uniquely
          await set(viewTrackerRef, true);

          // Update case study base data to ensure structure exists
          await update(ref(db, `caseStudies/${study.id}`), {
            title: study.title
          });

          // Safely increment via transaction
          const viewCountRef = ref(db, `caseStudies/${study.id}/views`);
          await runTransaction(viewCountRef, (currentValue) => {
            return (currentValue || 0) + 1;
          });
        }
      } catch (err) {
        console.error("Failed to record unique view count:", err);
      }
    };

    recordUniqueView();
  }, [study.id]);

  // Handle Like submission
  const handleLike = async () => {
    const userId = auth.currentUser?.uid || "guest";
    const likeTrackerRef = ref(db, `caseStudyLikes/${study.id}/${userId}`);
    try {
      const snap = await get(likeTrackerRef);
      if (snap.exists()) {
        showToast("You have already liked this case study.");
        return;
      }
      await set(likeTrackerRef, true);
      
      // Update case study base details to ensure node structure
      await update(ref(db, `caseStudies/${study.id}`), {
        title: study.title
      });

      // Safely increment via database transaction
      const likeCountRef = ref(db, `caseStudies/${study.id}/likes`);
      await runTransaction(likeCountRef, (currentValue) => {
        return (currentValue || 0) + 1;
      });
      showToast("Thank you for liking this case study!");
    } catch (err) {
      console.error("Failed to record unique like count:", err);
    }
  };

  // Handle Comment Submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentContent.trim()) return;

    setSubmitStatus("submitting");

    try {
      const commentId = `comment-${Date.now()}`;
      const newComment = {
        userName: commentName,
        content: commentContent,
        dateSubmitted: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }),
        approved: true
      };

      // Write directly to Firebase Database
      await set(ref(db, `caseStudyComments/${study.id}/${commentId}`), newComment);

      setCommentName("");
      setCommentContent("");
      setSubmitStatus("success");
      showToast("Comment submitted successfully!");
      setTimeout(() => setSubmitStatus("idle"), 4000);
    } catch (err) {
      console.error("Failed to submit comment", err);
      setSubmitStatus("error");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter approved comments
  const approvedComments = comments.filter((c) => c.approved);

  return (
    <div className="relative text-left case-study-detail-container">
      {/* Reading Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-[4px] bg-[#8CC63F] z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#111] border border-[#8CC63F]/30 text-white px-5 py-3 rounded-xl shadow-[0_0_24px_rgba(140,198,63,0.15)] flex items-center gap-2 animate-fade-in font-sans text-xs font-bold uppercase tracking-wider">
          <span className="h-2 w-2 rounded-full bg-[#8CC63F]" />
          {toastMessage}
        </div>
      )}

      {/* ── Hero section ── */}
      <section className="relative min-h-[50vh] bg-bg-secondary border-b border-white/5 px-5 py-24 flex items-center relative overflow-hidden">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-5 pointer-events-none" />
        
        <div className="relative mx-auto max-w-3xl w-full">
          <Link
            href="/case-studies"
            className="btn-premium mb-8 inline-flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-wider"
          >
            <ArrowLeft size={13} /> Back to Case Studies
          </Link>

          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full border border-signal/30 bg-[#8CC63F]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8CC63F]">
                {study.category}
              </span>
            </div>
            <h1 className="text-[32px] md:text-[40px] lg:text-[48px] font-black font-display text-white leading-tight">
              {study.title}
            </h1>
            
            {/* Quick Analytics Row */}
            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-[#A0A0A0] font-mono select-none">
              <span>VIEWS: <strong className="text-white font-semibold">{viewsCount}</strong></span>
              <span>COMMENTS: <strong className="text-[#E0E0E0] font-semibold">{approvedComments.length}</strong></span>
              <button 
                onClick={handleLike}
                className="group flex items-center gap-1.5 hover:text-[#8CC63F] text-[#A0A0A0] transition-colors border border-white/5 hover:border-[#8CC63F]/20 bg-white/5 hover:bg-[#8CC63F]/5 px-2.5 py-1 rounded-lg"
              >
                <span>LIKE:</span>
                <strong className="text-white group-hover:text-[#8CC63F] transition-colors">{likesCount}</strong>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Cover Image ── */}
      <section className="bg-bg-primary px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="relative h-[280px] sm:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#080808] shadow-crisp">
            <Image
              src={study.heroImage || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"}
              alt={study.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── Core Details Structure ── */}
      <section className="bg-bg-primary px-5 py-8 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-16 case-study-content-card">
          
          {/* Problem Statement */}
          <div data-reveal>
            <h2 className="text-[28px] lg:text-[32px] font-bold font-display text-white border-b border-white/5 pb-3 max-w-3xl">
              Problem Statement
            </h2>
            <div 
              className="mt-4 text-left markdown-content main-prose max-w-3xl"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(study.problemStatement) }}
            />
          </div>

          {/* Challenges */}
          {study.challenges && (
            <div data-reveal>
              <h2 className="text-[28px] lg:text-[32px] font-bold font-display text-white border-b border-white/5 pb-3 max-w-3xl">
                Key Challenges
              </h2>
              <div 
                className="mt-4 text-left markdown-content main-prose max-w-3xl"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(study.challenges) }}
              />
            </div>
          )}

          {/* Solution */}
          <div data-reveal>
            <h2 className="text-[28px] lg:text-[32px] font-bold font-display text-white border-b border-white/5 pb-3 max-w-3xl">
              The Solution
            </h2>
            <div 
              className="mt-4 text-left markdown-content main-prose max-w-3xl"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(study.solution) }}
            />
          </div>

          {/* Multi-disciplinary Engineering Breakdown */}
          <div className="grid gap-8 md:grid-cols-3 pt-6">
            {/* Mechanical Engineering */}
            {study.mechanicalEngineering && (
              <div className="case-study-tech-card bg-[#111] border border-white/15 rounded-2xl p-6 shadow-crisp" data-reveal>
                <span className="text-[10px] font-bold tracking-widest text-[#8CC63F] uppercase font-mono block mb-2">Mechanical</span>
                <div 
                  className="text-left markdown-content card-prose"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(study.mechanicalEngineering) }}
                />
              </div>
            )}

            {/* Hardware Engineering */}
            {study.hardwareEngineering && (
              <div className="case-study-tech-card bg-[#111] border border-white/15 rounded-2xl p-6 shadow-crisp" data-reveal>
                <span className="text-[10px] font-bold tracking-widest text-[#8CC63F] uppercase font-mono block mb-2">Electrical/PCB</span>
                <div 
                  className="text-left markdown-content card-prose"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(study.hardwareEngineering) }}
                />
              </div>
            )}

            {/* Software Engineering */}
            {study.softwareEngineering && (
              <div className="case-study-tech-card bg-[#111] border border-white/15 rounded-2xl p-6 shadow-crisp" data-reveal>
                <span className="text-[10px] font-bold tracking-widest text-[#8CC63F] uppercase font-mono block mb-2">Firmware/IoT</span>
                <div 
                  className="text-left markdown-content card-prose"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(study.softwareEngineering) }}
                />
              </div>
            )}
          </div>

          {/* Results & Impact */}
          <div className="case-study-results-card bg-gradient-to-r from-bg-secondary to-[#111] border border-white/10 rounded-2xl p-8 md:p-10 shadow-crisp max-w-3xl" data-reveal>
            <h2 className="text-[28px] lg:text-[32px] font-bold font-display text-white mb-4">
              ✨ Results & Business Impact
            </h2>
            <div 
              className="text-left markdown-content main-prose"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(study.resultsImpact) }}
            />
          </div>

          {/* Gallery Section */}
          {study.gallery && study.gallery.length > 0 && (
            <div data-reveal className="pt-6">
              <h2 className="text-[28px] lg:text-[32px] font-bold font-display text-white border-b border-white/5 pb-3 mb-6 max-w-3xl">
                Project Gallery
              </h2>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                {study.gallery && study.gallery.filter(Boolean).map((imgUrl, i) => (
                  <div 
                    key={i} 
                    onClick={() => setLightboxImage(imgUrl)}
                    className="relative h-40 w-full overflow-hidden rounded-xl border border-white/10 bg-[#080808] cursor-zoom-in transition-all duration-300 hover:border-white/30 hover:scale-[1.02]"
                  >
                    <Image
                      src={imgUrl}
                      alt={`Project snapshot ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}



          {/* Comments System */}
          <div className="space-y-8" data-reveal>
            <h2 className="text-[28px] lg:text-[32px] font-bold font-display text-white border-b border-white/5 pb-3 max-w-3xl">
              Discussion ({approvedComments.length})
            </h2>

            {/* List of comments */}
            <div className="space-y-4">
              {approvedComments.map((comment) => (
                <div key={comment.id} className="case-study-comment-card bg-[#111] border border-white/5 rounded-2xl p-5 text-xs text-left shadow-crisp">
                  <div className="flex justify-between items-center text-text-secondary border-b border-white/5 pb-2.5 mb-2.5 font-mono">
                    <span className="text-white font-bold font-sans">{comment.userName}</span>
                    <span>{comment.dateSubmitted}</span>
                  </div>
                  <p className="text-text-secondary leading-relaxed whitespace-pre-line text-[13px]">{comment.content}</p>
                </div>
              ))}

              {approvedComments.length === 0 && (
                <p className="text-text-secondary text-xs italic">No comments yet. Start the conversation below!</p>
              )}
            </div>

            {/* Add Comment Form */}
            <div className="case-study-comment-form bg-[#080808] border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-mono">Submit a comment</h3>
              
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 font-mono">Your Name</label>
                  <input
                    type="text"
                    required
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="w-full bg-bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#8CC63F] focus:outline-none"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 font-mono">Comment</label>
                  <textarea
                    required
                    rows={4}
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="w-full bg-bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#8CC63F] focus:outline-none resize-none"
                    placeholder="Write your constructive thoughts here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitStatus === "submitting"}
                  className="flex items-center gap-1.5 bg-[#8CC63F] text-black font-bold uppercase text-xs tracking-wider px-5 py-3 rounded-xl hover:bg-opacity-90 shadow-crisp transition-all font-mono"
                >
                  <Send size={12} /> {submitStatus === "submitting" ? "Sending..." : "Submit Comment"}
                </button>
              </form>

              {submitStatus === "success" && (
                <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-semibold">
                  <CheckCircle2 size={15} /> Your comment was added successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Case Studies ── */}
      {relatedStudies.length > 0 && (
        <section className="bg-bg-secondary border-t border-white/5 px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-xl font-bold font-display text-white mb-8 text-center sm:text-left">
              Related Case Studies
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {relatedStudies.slice(0, 2).map((study) => (
                <Link
                  key={study.id}
                  href={`/case-studies/${study.slug}`}
                  className="group block service-card-premium rounded-2xl border border-white/10 bg-[#111] overflow-hidden transition-all duration-300 hover:border-[#8CC63F]/30 hover:scale-[1.01] p-6 shadow-crisp"
                >
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#8CC63F] font-mono">
                    {study.category}
                  </span>
                  <h3 className="text-lg font-bold font-display text-white mt-2 group-hover:text-[#8CC63F] transition-colors leading-snug">
                    {study.title}
                  </h3>
                  <p className="mt-2 text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {study.problemStatement}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X size={20} />
          </button>
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <img 
              src={lightboxImage} 
              alt="Expanded snapshot" 
              className="object-contain max-w-full max-h-full rounded-lg border border-white/10 shadow-premium" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
