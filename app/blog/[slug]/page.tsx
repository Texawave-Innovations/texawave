import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { notFound } from "next/navigation";
import { PageChrome } from "@/components/PageChrome";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

type BlogPostProps = {
  params: Promise<{ slug: string }>;
};

async function getBlogPost(slug: string) {
  try {
    const snapshot = await get(ref(db, "blogs"));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const posts = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
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
        readTime: data[key].readTime || "4 min read",
        slug: data[key].slug || key
      }));
      
      const found = posts.find(p => p.slug === slug || p.id === slug);
      if (found && (found.status === "approved" || found.status === "featured" || found.status === "intern-spotlight")) {
        return found;
      }
    }
  } catch (error) {
    console.error("Error fetching blog post:", error);
  }
  return null;
}

export async function generateMetadata({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return {
    title: post?.title || "Blog | Texawave",
    description: post?.shortDescription || "Texawave hardware product development insights.",
    alternates: {
      canonical: `/blog/${slug}`
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const formattedDate = post.submittedAt 
    ? new Date(post.submittedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    : "";

  return (
    <PageChrome>
      <article className="bg-bg-primary px-5 py-20 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-5 pointer-events-none" />
        <div className="mx-auto max-w-3xl relative z-10">
          <Link href="/blog" className="btn-premium inline-flex items-center gap-2 font-bold text-signal mb-10">
            <ArrowLeft size={18} /> Back to blog
          </Link>
          
          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden mb-10 border border-white/15 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
            </div>
          )}

          <p className="text-small-text font-black uppercase tracking-[0.16em] text-copper mb-4">
            {post.category}
          </p>
          
          <h1 className="text-hero sm:text-4xl lg:text-5xl font-black font-display text-text-primary leading-[1.2] mb-6">
            {post.title}
          </h1>

          {/* Author Meta Section */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-y border-white/10 mb-10 text-xs text-text-secondary">
            <div className="flex items-center gap-3">
              {post.authorPhoto ? (
                <img 
                  src={post.authorPhoto} 
                  alt={post.name} 
                  className="w-10 h-10 rounded-full object-cover border border-white/10" 
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary">
                  <User size={18} />
                </div>
              )}
              <div>
                <h4 className="font-bold text-text-primary">{post.name}</h4>
                <p className="text-[10px] text-text-secondary">{post.organization || "Contributor"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <Calendar size={14} className="text-[#8CC63F]" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <Clock size={14} className="text-[#14B8A6]" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <p className="text-body-large text-text-secondary leading-relaxed mb-8 italic border-l-4 border-[#8CC63F]/50 pl-4 font-medium">
            {post.shortDescription}
          </p>

          {/* Main Body Content */}
          <div 
            className="prose prose-lg max-w-none text-text-secondary dark:prose-invert prose-headings:text-text-primary prose-a:text-[#8CC63F] prose-strong:text-text-primary leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </PageChrome>
  );
}
