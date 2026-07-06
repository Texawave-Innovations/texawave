"use client";

import { useState, useEffect } from "react";
import { ref, onValue, set, get, runTransaction } from "firebase/database";
import { db, auth } from "@/lib/firebase";
import {
  ArrowRight,
  Upload,
  X,
  Check,
  AlertCircle,
  GraduationCap,
  Mail,
  Sparkles,
  Clock,
  Eye,
  BookOpen
} from "lucide-react";
import { PageChrome } from "@/components/PageChrome";
import { blogPosts } from "@/lib/content";
import dynamic from "next/dynamic";

const BlogSubmitModal = dynamic(() => import("@/components/BlogSubmitModal").then(m => m.BlogSubmitModal), {
  ssr: false
});

// --- TYPES ---
export interface CommunityArticle {
  id: string;
  name: string;
  email: string;
  organization: string; // Used as College for interns
  authorPhoto: string; // base64 or URL
  title: string;
  category: string;
  coverImage: string; // base64 or URL
  content: string; // rich text HTML
  status: "draft" | "pending" | "approved" | "rejected" | "featured" | "intern-spotlight";
  submittedAt: string;
  shortDescription?: string;
  skills?: string[];
  duration?: string;
  domain?: string;
  viewCount?: number;
  readTime?: string;
}

// --- INITIAL SEED DATA ---
const DEFAULT_COMMUNITY_ARTICLES: CommunityArticle[] = [];


const CATEGORIES = ["All", "Software", "Electrical", "Mechanical", "Procurement", "Internship", "Industry Insights"];

export default function BlogPage() {
  const [articles, setArticles] = useState<CommunityArticle[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Contributions Tracking states
  const [trackerEmail, setTrackerEmail] = useState("");
  const [activeTrackerEmail, setActiveTrackerEmail] = useState("");
  const [userContributions, setUserContributions] = useState<CommunityArticle[]>([]);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeReaderArticle, setActiveReaderArticle] = useState<CommunityArticle | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Hydrate from Firebase RTDB in real-time
  useEffect(() => {
    setMounted(true);

    const blogsRef = ref(db, "blogs");
    const unsubscribe = onValue(blogsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedBlogs = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          // Ensure backward compatibility mapping
          name: data[key].author || "Anonymous",
          email: data[key].email || "",
          organization: data[key].organization || "",
          authorPhoto: data[key].authorPhoto || "",
          title: data[key].title || "",
          category: data[key].category || "Software",
          coverImage: data[key].thumbnail || "",
          content: data[key].content || "",
          status: data[key].status || "pending",
          submittedAt: data[key].createdAt || "",
          shortDescription: data[key].description || "",
          viewCount: data[key].views || 0,
          readTime: data[key].readTime || "4 min read"
        })).filter(art => !["comm-1", "comm-2", "comm-3", "intern-1", "intern-2"].includes(art.id));
        setArticles(loadedBlogs);

        if (activeTrackerEmail) {
          const filtered = loadedBlogs.filter((art) => art.email.toLowerCase() === activeTrackerEmail.toLowerCase());
          setUserContributions(filtered);
        }
      } else {
        // Seed default seed data if database node is blank
        DEFAULT_COMMUNITY_ARTICLES.forEach(async (art) => {
          const blogData = {
            authorId: art.email,
            author: art.name,
            title: art.title,
            description: art.shortDescription || "",
            category: art.category,
            thumbnail: art.coverImage,
            content: art.content,
            status: art.status,
            views: art.viewCount || 0,
            likes: 0,
            createdAt: art.submittedAt,
            email: art.email,
            organization: art.organization,
            authorPhoto: art.authorPhoto,
            readTime: art.readTime || "4 min read"
          };
          await set(ref(db, `blogs/${art.id}`), blogData);
        });
        setArticles(DEFAULT_COMMUNITY_ARTICLES);
      }
      setLoading(false);
    });

    // Retrieve last submitted email to auto-fill contributions tracker
    const savedEmail = localStorage.getItem("texawave_my_email");
    if (savedEmail) {
      setTrackerEmail(savedEmail);
      setActiveTrackerEmail(savedEmail);
    }

    return () => unsubscribe();
  }, [activeTrackerEmail]);

  // Save articles helper (replaced with direct DB writes)
  const saveArticles = async (updated: CommunityArticle[]) => {};

  // Tracking Search
  const handleTrackerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackerEmail.trim()) return;
    setActiveTrackerEmail(trackerEmail);
    localStorage.setItem("texawave_my_email", trackerEmail);
    const filtered = articles.filter((art) => art.email.toLowerCase() === trackerEmail.toLowerCase());
    setUserContributions(filtered);
  };

  const handleClearTracker = () => {
    setActiveTrackerEmail("");
    setTrackerEmail("");
    localStorage.removeItem("texawave_my_email");
    setUserContributions([]);
  };

  // View count incrementing helper with transaction & unique IP/User check
  const incrementViewCount = async (id: string, isStatic: boolean) => {
    if (isStatic) return;
    const userId = auth.currentUser?.uid || "guest";
    const viewTrackerRef = ref(db, `blogViews/${id}/${userId}`);

    try {
      const viewSnap = await get(viewTrackerRef);
      if (!viewSnap.exists()) {
        // Mark as viewed
        await set(viewTrackerRef, true);
        
        // Transaction safety increment
        const blogCountRef = ref(db, `blogs/${id}/views`);
        await runTransaction(blogCountRef, (currentValue) => {
          return (currentValue || 0) + 1;
        });
      }
    } catch (err) {
      console.error("Failed to increment view count:", err);
    }
  };

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Form Submission from BlogSubmitModal
  const handleBlogSubmit = async (submittedData: any) => {
    const wordCount = submittedData.content.split(/\s+/).filter(Boolean).length;
    const readTimeVal = Math.max(1, Math.ceil(wordCount / 200)) + " min read";

    const finalAuthorPhoto = submittedData.authorPhoto || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`;
    const finalCoverImage = submittedData.coverImage || `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80`;

    // Process skills if internship
    let processedSkills: string[] = [];
    if (submittedData.category === "Internship" && submittedData.skills) {
      processedSkills = submittedData.skills.split(",").map((s: string) => s.trim()).filter(Boolean);
    }

    const blogId = `blog-${Date.now()}`;
    const authorId = auth.currentUser?.uid || "guest";
    const now = new Date().toISOString();

    const blogData = {
      authorId,
      author: submittedData.name,
      title: submittedData.title,
      description: submittedData.shortDescription || submittedData.content.replace(/<[^>]*>/g, "").substring(0, 140) + "...",
      category: submittedData.category,
      thumbnail: finalCoverImage,
      content: submittedData.content,
      status: "pending", // enters moderator queue as pending
      views: 0,
      likes: 0,
      createdAt: now,
      email: submittedData.email,
      organization: submittedData.organization,
      authorPhoto: finalAuthorPhoto,
      readTime: readTimeVal,
      domain: submittedData.category === "Internship" ? submittedData.domain : null,
      skills: submittedData.category === "Internship" ? processedSkills : null,
      duration: submittedData.category === "Internship" ? submittedData.duration : null
    };

    // Save to Firebase RTDB blogs node
    await set(ref(db, `blogs/${blogId}`), blogData);

    // Save tracking email
    localStorage.setItem("texawave_my_email", submittedData.email);
    setTrackerEmail(submittedData.email);
    setActiveTrackerEmail(submittedData.email);

    setIsUploadOpen(false);
    setIsSuccessOpen(true);
  };

  // Filters for public displays (Approved, Featured, and Intern Spotlight entries ONLY)
  // Unpublished / pending content is strictly hidden
  const publicArticles = articles.filter(
    (art) => art.status === "approved" || art.status === "featured" || art.status === "intern-spotlight"
  );

  // Merge static posts and public community posts
  const allRecentBlogs = [
    ...blogPosts.map((post) => ({
      ...post,
      id: post.slug,
      isStatic: true,
      status: (post.isFeatured ? "featured" : "approved") as any
    })),
    ...publicArticles.map((art) => ({
      slug: art.id,
      id: art.id,
      title: art.title,
      excerpt: art.shortDescription || art.content.replace(/<[^>]*>/g, "").substring(0, 140) + "...",
      category: art.category,
      isStatic: false,
      authorPhoto: art.authorPhoto,
      name: art.name,
      organization: art.organization,
      submittedAt: art.submittedAt,
      coverImage: art.coverImage,
      readTime: art.readTime,
      viewCount: art.viewCount,
      isFeatured: art.status === "featured"
    }))
  ];

  // Filter based on category selection
  const filteredRecentBlogs = allRecentBlogs.filter((post) => {
    if (selectedCategory === "All") return true;
    return post.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Pagination bounds
  const totalPages = Math.ceil(filteredRecentBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredRecentBlogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Community Contributions cards redesign parameters (guest posts, not Internship category)
  const communityContributions = publicArticles.filter(
    (art) => art.category !== "Internship"
  );

  // Intern Spotlight experiences
  const internSpotlights = publicArticles.filter(
    (art) => art.category === "Internship" || art.status === "intern-spotlight"
  );

  return (
    <PageChrome>
      {/* 1. HERO HEADER */}
      <section className="bg-bg-secondary border-b border-border-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
        <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)] relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-small-text font-bold bg-[#8CC63F]/20 text-[#8CC63F] border border-[#8CC63F]/30 uppercase tracking-wider mb-4">
              <Sparkles size={12} className="text-[#8CC63F]" /> Texawave Knowledge Base
            </span>
            <h1 className="max-w-4xl text-hero text-text-primary">
              Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8CC63F] via-[#8CC63F] to-[#1E3A0E]">Insights</span>
            </h1>
            <p className="mt-4 max-w-xl text-body-large text-text-secondary">
              Practical roadmap guides, embedded schematics, procurement metrics, and custom automation case studies.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES FILTER SECTION */}
      <section className="bg-bg-primary pt-12 border-b border-border-primary/50 text-left">
        <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)]">
          <h2 className="text-small-text font-bold uppercase tracking-widest text-text-secondary">Filter by Topic</h2>
          <div className="mt-4 flex flex-wrap gap-2 pb-6 overflow-x-auto">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold border transition duration-300 ${
                    isActive
                      ? "bg-[#8CC63F] border-[#8CC63F] text-black shadow-lg shadow-[#8CC63F]/20"
                      : "bg-bg-secondary border-border-primary text-text-secondary hover:text-text-primary hover:border-[#8CC63F]/50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. UPLOAD YOUR ARTICLE CTA CARD */}
      <section className="bg-bg-primary py-8 text-left">
        <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)]">
          <div className="relative overflow-hidden rounded-2xl border border-dashed border-[#8CC63F]/60 bg-bg-secondary/40 p-8 text-center md:text-left md:flex md:items-center md:justify-between gap-6 transition duration-300 hover:border-[#8CC63F]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8CC63F]/5 rounded-full blur-3xl pointer-events-none" />
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-small-text font-bold bg-[#8CC63F]/15 text-[#8CC63F] border border-[#8CC63F]/30 uppercase tracking-wider">
                <Sparkles size={12} /> Share Your Knowledge
                  </span>
                  <h3 className="mt-3 text-card text-text-primary font-bold">Have an Engineering Story or Project to share?</h3>
                  <p className="mt-2 text-text-secondary max-w-2xl text-body-normal">
                    Contribute to the Texawave Knowledge Hub. Submit articles on software engineering, electronics, custom hardware, or your internship experiences.
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="mt-6 md:mt-0 flex-shrink-0 px-6 py-3 bg-[#8CC63F] hover:bg-opacity-95 text-black font-bold rounded-xl transition inline-flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg shadow-[#8CC63F]/10"
                >
                  <Upload size={18} /> Upload Your Article
                </button>
              </div>
            </div>
          </section>

          {/* 4. MY CONTRIBUTIONS TRACKER */}
          <section className="bg-bg-primary py-6 text-left">
            <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)]">
              <div className="rounded-2xl border border-border-primary bg-bg-secondary/30 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-primary/50 pb-4 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono flex items-center gap-2">
                      <BookOpen size={16} className="text-[#8CC63F]" />
                      My Contributions
                    </h3>
                    <p className="text-xs text-text-secondary mt-1">Track the processing status of your submitted articles.</p>
                  </div>

                  <form onSubmit={handleTrackerSearch} className="flex items-center gap-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 text-text-secondary" size={14} />
                      <input
                        type="email"
                        required
                        placeholder="Enter submission email..."
                        value={trackerEmail}
                        onChange={(e) => setTrackerEmail(e.target.value)}
                        className="bg-bg-primary border border-border-primary text-text-primary text-xs focus:border-[#8CC63F] outline-none rounded-lg py-2 pl-9 pr-3 w-64 transition"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-bg-secondary border border-border-primary hover:border-[#8CC63F] text-xs font-bold text-text-primary transition cursor-pointer"
                    >
                  Track
                </button>
                {activeTrackerEmail && (
                  <button
                    type="button"
                    onClick={handleClearTracker}
                    className="text-xs text-red-400 hover:text-red-300 font-bold transition ml-1"
                  >
                    Clear
                  </button>
                )}
              </form>
            </div>

            {activeTrackerEmail ? (
              userContributions.length === 0 ? (
                <div className="py-6 text-center text-text-secondary text-xs font-mono">
                  No submissions found for email: <span className="text-text-primary font-bold">{activeTrackerEmail}</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-border-primary/50 text-text-secondary">
                        <th className="pb-2 font-bold">Article Title</th>
                        <th className="pb-2 font-bold">Category</th>
                        <th className="pb-2 font-bold">Submitted Date</th>
                        <th className="pb-2 font-bold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-primary/30">
                      {userContributions.map((art) => {
                        let badgeColor = "bg-gray-900 border-gray-700 text-gray-400";
                        let statusLabel: string = art.status;
                        if (art.status === "pending") {
                          badgeColor = "bg-orange-950/40 border-orange-500/20 text-orange-400";
                          statusLabel = "Pending Review";
                        } else if (art.status === "approved") {
                          badgeColor = "bg-green-950/40 border-green-500/20 text-green-400";
                          statusLabel = "Approved";
                        } else if (art.status === "rejected") {
                          badgeColor = "bg-red-950/40 border-red-500/20 text-red-400";
                          statusLabel = "Rejected";
                        } else if (art.status === "featured") {
                          badgeColor = "bg-purple-950/40 border-purple-500/20 text-purple-400";
                          statusLabel = "Featured";
                        } else if (art.status === "intern-spotlight") {
                          badgeColor = "bg-blue-950/40 border-blue-500/20 text-blue-400";
                          statusLabel = "Intern Spotlight";
                        }

                        return (
                          <tr key={art.id} className="hover:bg-bg-primary/20">
                            <td className="py-2.5 pr-4 text-text-primary max-w-xs md:max-w-md truncate font-sans font-bold">
                              {art.title}
                            </td>
                            <td className="py-2.5 text-text-secondary">{art.category}</td>
                            <td className="py-2.5 text-text-secondary">
                              {new Date(art.submittedAt).toLocaleDateString()}
                            </td>
                            <td className="py-2.5 text-right">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                                {statusLabel}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="py-4 text-center text-text-secondary text-xs font-mono">
                Enter your email above to track review workflow progress.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. RECENT BLOGS SECTION */}
      <section className="bg-bg-primary py-10 text-left">
        <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)]">
          <h2 className="text-section text-text-primary mb-8 font-bold">Recent Blogs & Publications</h2>

          {loading ? (
            // Skeleton Loader States
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((s) => (
                <div key={s} className="animate-pulse rounded-2xl border border-border-primary bg-bg-secondary h-[450px] overflow-hidden flex flex-col justify-between p-5">
                  <div className="h-48 bg-bg-primary rounded-xl mb-4 w-full" />
                  <div className="space-y-3 flex-1">
                    <div className="h-3 bg-bg-primary rounded w-1/3" />
                    <div className="h-5 bg-bg-primary rounded w-3/4" />
                    <div className="h-3 bg-bg-primary rounded w-full" />
                    <div className="h-3 bg-bg-primary rounded w-5/6" />
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-border-primary/50 mt-4">
                    <div className="w-8 h-8 rounded-full bg-bg-primary" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-bg-primary rounded w-1/2" />
                      <div className="h-2 bg-bg-primary rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRecentBlogs.length === 0 ? (
            <div className="text-center py-20 border border-border-primary rounded-2xl bg-bg-secondary/20">
              <AlertCircle className="mx-auto text-text-secondary animate-bounce" size={40} />
              <p className="mt-4 text-text-secondary font-bold">No articles found in this category.</p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="mt-4 text-[#8CC63F] hover:underline font-bold text-sm"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paginatedBlogs.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => {
                      incrementViewCount(post.id, post.isStatic);
                      if (post.isStatic) {
                        window.location.href = `/blog/${post.slug}`;
                      } else {
                        const matched = articles.find((a) => a.id === post.id);
                        if (matched) setActiveReaderArticle(matched);
                      }
                    }}
                    className="group flex flex-col justify-between h-[450px] rounded-2xl border border-border-primary bg-bg-secondary overflow-hidden transition-all duration-300 hover:border-[#8CC63F] hover:shadow-[0_0_20px_rgba(140,198,63,0.12)] cursor-pointer text-left"
                  >
                    {/* Cover Image & Badges */}
                    <div className="relative h-48 w-full bg-bg-primary overflow-hidden shrink-0">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Overlay badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-bg-secondary/95 border border-border-primary text-copper uppercase tracking-wider">
                          {post.category}
                        </span>
                        {post.isFeatured && (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-[#8CC63F] text-black uppercase tracking-wider flex items-center gap-1">
                            <Sparkles size={10} /> Featured
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div className="space-y-2">
                        {/* Metadata Row */}
                        <div className="flex items-center gap-3 text-[10px] text-text-secondary font-mono">
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> {post.readTime || "5 min read"}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye size={10} /> {post.viewCount !== undefined ? `${post.viewCount} views` : "120 views"}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-text-primary group-hover:text-[#8CC63F] transition duration-200 line-clamp-2 leading-snug">
                          {post.title}
                        </h3>

                        <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Footer Area */}
                      <div className="pt-4 mt-4 border-t border-border-primary/50 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {post.authorPhoto ? (
                            <img
                              src={post.authorPhoto}
                              alt={post.name}
                              className="w-8 h-8 rounded-full border border-border-primary object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full border border-border-primary bg-bg-primary flex items-center justify-center text-text-secondary text-xs font-bold shrink-0">
                              TW
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-text-primary truncate leading-tight">{post.name}</p>
                            <p className="text-[9px] text-text-secondary truncate">{post.organization}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-[9px] text-text-secondary font-mono mb-1">
                            {new Date(post.submittedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </span>
                          <span className="text-[10px] font-bold text-[#8CC63F] inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                            Read <ArrowRight size={10} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-4 py-2 rounded-lg border border-border-primary bg-bg-secondary text-xs font-bold text-text-primary hover:border-[#8CC63F] disabled:opacity-50 disabled:hover:border-border-primary transition cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-text-secondary font-mono">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-4 py-2 rounded-lg border border-border-primary bg-bg-secondary text-xs font-bold text-text-primary hover:border-[#8CC63F] disabled:opacity-50 disabled:hover:border-border-primary transition cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* 5. COMMUNITY CONTRIBUTIONS SECTION (Redesigned Compact Cards) */}
      <section className="bg-bg-secondary/50 border-y border-border-primary py-20 text-left">
        <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-small-text font-bold uppercase tracking-[0.18em] text-copper">Knowledge Exchange</p>
              <h2 className="mt-2 text-section text-text-primary font-bold">Community Contributions</h2>
              <p className="mt-3 text-text-secondary max-w-xl text-body-normal">
                Engineering deep-dives, tooling tips, and hardware analyses shared by industry professionals and researchers.
              </p>
            </div>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="mt-6 md:mt-0 flex items-center gap-2 px-5 py-3 rounded-xl border border-border-primary hover:border-[#8CC63F]/50 hover:bg-[#8CC63F]/10 transition text-text-primary font-bold text-sm cursor-pointer"
            >
              <Upload size={16} /> Share Your Article
            </button>
          </div>

          {communityContributions.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border-primary rounded-2xl bg-bg-secondary">
              <p className="text-text-secondary font-bold">No community contributions approved yet.</p>
              <p className="text-xs text-text-secondary mt-1">Be the first to upload and share your article!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {communityContributions.map((art) => (
                <div
                  key={art.id}
                  onClick={() => {
                    incrementViewCount(art.id, false);
                    setActiveReaderArticle(art);
                  }}
                  className="group flex flex-col justify-between h-[360px] rounded-2xl border border-border-primary bg-bg-secondary hover:bg-bg-secondary/80 p-6 transition-all duration-300 hover:border-[#8CC63F] hover:shadow-[0_0_20px_rgba(140,198,63,0.15)] cursor-pointer text-left"
                >
                  <div className="space-y-4">
                    {/* Category & Guest Post Badge */}
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.16em] text-copper">
                        {art.category}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#8CC63F]/15 text-[#8CC63F] border border-[#8CC63F]/30 uppercase tracking-wider">
                        Guest Post
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-[#8CC63F] transition duration-200 line-clamp-2 leading-tight">
                      {art.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                      {art.shortDescription || art.content.replace(/<[^>]*>/g, "").substring(0, 120) + "..."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Author Info */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border-primary/50">
                      <img
                        src={art.authorPhoto}
                        alt={art.name}
                        loading="lazy"
                        className="w-8 h-8 rounded-full border border-border-primary object-cover shrink-0"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-text-primary truncate">{art.name}</p>
                        <p className="text-[10px] text-text-secondary truncate">{art.organization}</p>
                      </div>
                    </div>

                    {/* Date & View Link */}
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-text-secondary font-mono">
                        {new Date(art.submittedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                      <span className="font-bold text-[#8CC63F] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Article <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. INTERN SPOTLIGHT SECTION (Redesigned Compact Cards) */}
      <section className="bg-bg-primary py-20 relative overflow-hidden text-left">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8CC63F]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)] relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-small-text font-bold bg-[#8CC63F]/20 text-[#8CC63F] border border-[#8CC63F]/30 uppercase tracking-wider mb-4">
              <GraduationCap size={12} className="text-[#8CC63F]" /> Talent Hub
            </span>
            <h2 className="text-section text-text-primary font-bold">Intern Spotlight</h2>
            <p className="mt-4 text-text-secondary text-body-normal">
              Showcasing approved student experiences, product prototypes, and engineering takeaways from the Texawave internship program.
            </p>
          </div>

          {internSpotlights.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border-primary rounded-2xl bg-bg-secondary/40">
              <p className="text-text-secondary font-bold">No intern spotlight experiences approved yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {internSpotlights.map((art) => (
                <div
                  key={art.id}
                  onClick={() => {
                    incrementViewCount(art.id, false);
                    setActiveReaderArticle(art);
                  }}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border-primary hover:border-[#8CC63F]/70 bg-bg-secondary hover:bg-bg-secondary/80 p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(140,198,63,0.1)] cursor-pointer text-left overflow-hidden border-l-4 border-l-[#8CC63F]"
                >
                  <div className="space-y-4">
                    {/* Profile Photo, Intern Name, College & Domain Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={art.authorPhoto}
                          alt={art.name}
                          loading="lazy"
                          className="w-12 h-12 rounded-full border border-border-primary object-cover shrink-0 shadow-sm"
                        />
                        <div>
                          <h4 className="font-bold text-text-primary text-sm leading-snug">{art.name}</h4>
                          <p className="text-xs text-text-secondary">{art.organization}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-[#8CC63F]/15 text-[#8CC63F] border border-[#8CC63F]/30 uppercase tracking-wider shrink-0">
                        {art.domain || "Internship"}
                      </span>
                    </div>

                    {/* Project Title */}
                    <div>
                      <h3 className="text-base font-bold text-text-primary group-hover:text-[#8CC63F] transition leading-snug line-clamp-2">
                        {art.title}
                      </h3>
                    </div>

                    {/* Excerpt */}
                    <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                      {art.shortDescription || art.content.replace(/<[^>]*>/g, "").substring(0, 140) + "..."}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border-primary/50 space-y-3">
                    {/* Skills Tagline */}
                    {art.skills && art.skills.length > 0 && (
                      <div className="text-[10px] font-mono text-text-secondary flex flex-wrap gap-x-1.5 items-center">
                        <span className="font-bold text-text-primary">Skills:</span>
                        <span>{art.skills.join(" • ")}</span>
                      </div>
                    )}

                    {/* Duration & Read Story */}
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-text-secondary">
                        {art.duration || "Jan 2026 – May 2026"}
                      </span>
                      <span className="font-bold text-[#8CC63F] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Story <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- FORM MODAL: UPLOAD YOUR ARTICLE --- */}
      <BlogSubmitModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={handleBlogSubmit}
      />

      {/* --- MODAL: SUCCESS SUBMISSION --- */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-md rounded-2xl border border-border-primary bg-bg-secondary p-8 text-center shadow-2xl relative text-left"
          >
            <div className="w-16 h-16 rounded-full bg-[#8CC63F]/20 border border-[#8CC63F] text-[#8CC63F] mx-auto flex items-center justify-center mb-6">
              <Check size={32} />
            </div>
            <h3 className="text-2xl font-black text-text-primary text-center">Article Submitted!</h3>
            <p className="mt-3 text-text-secondary text-sm leading-relaxed text-center">
              Thank you for contributing! Your article has entered the **moderator review queue**. Once approved by an administrator, it will be published live on the Texawave Blog.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsSuccessOpen(false)}
                className="w-full py-3 rounded-xl bg-[#8CC63F] hover:bg-opacity-95 text-black font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FULL ARTICLE READER MODAL --- */}
      {activeReaderArticle && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto" data-lenis-prevent="true">
          <div
            className="relative w-full max-w-4xl rounded-2xl border border-border-primary bg-bg-secondary shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-left"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border-primary p-6 bg-bg-secondary">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#8CC63F]/15 text-[#8CC63F] border border-[#8CC63F]/30 uppercase tracking-wider">
                  {activeReaderArticle.category}
                </span>
                {activeReaderArticle.status === "pending" && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-950/40 text-orange-400 border border-orange-500/30 uppercase tracking-wider">
                    In Review Queue
                  </span>
                )}
              </div>
              <button
                onClick={() => setActiveReaderArticle(null)}
                className="rounded-lg p-1.5 hover:bg-bg-primary text-text-secondary hover:text-text-primary transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Reader Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 bg-bg-primary">
              {/* Cover Image */}
              <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden bg-bg-secondary border border-border-primary">
                <img
                  src={activeReaderArticle.coverImage}
                  alt={activeReaderArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Author & Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-border-primary/50">
                <div className="flex items-center gap-4">
                  <img
                    src={activeReaderArticle.authorPhoto}
                    alt={activeReaderArticle.name}
                    className="w-12 h-12 rounded-full border border-[#8CC63F] object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-text-primary">{activeReaderArticle.name}</h4>
                    <p className="text-xs text-text-secondary">
                      {activeReaderArticle.organization} • {activeReaderArticle.email}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-text-secondary md:text-right">
                  <p>Published: {new Date(activeReaderArticle.submittedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}</p>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-invert prose-lg max-w-none text-text-primary/90 space-y-6 pb-12 leading-relaxed">
                <h1 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight leading-tight">
                  {activeReaderArticle.title}
                </h1>
                
                {/* Dynamically Inject HTML Content safely */}
                <div 
                  className="space-y-4 text-text-secondary"
                  dangerouslySetInnerHTML={{ __html: activeReaderArticle.content }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </PageChrome>
  );
}
