import fs from "fs";
import path from "path";
import { PageChrome } from "@/components/PageChrome";
import { CaseStudiesList } from "@/components/CaseStudiesList";
import { ref, get, set } from "firebase/database";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Engineering Case Studies & Portfolio",
  description: "Discover how Texawave delivers measurable results across custom mechanical design, PCB fabrication, and smart IoT engineering case studies.",
  alternates: {
    canonical: "/case-studies"
  }
};

export default async function CaseStudiesPage() {
  // Read case studies from Firebase with fallback and seeding
  let studies = [];
  try {
    const csRef = ref(db, "caseStudies");
    const snapshot = await get(csRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      studies = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
    } else {
      // Seed if database node is blank
      const dbPath = path.join(process.cwd(), "lib", "case_studies.json");
      if (fs.existsSync(dbPath)) {
        const fileContent = fs.readFileSync(dbPath, "utf-8");
        studies = JSON.parse(fileContent);
        for (const study of studies) {
          await set(ref(db, `caseStudies/${study.id}`), study);
        }
      }
    }
  } catch (err) {
    console.error("Error reading case studies from Firebase", err);
    // Fallback to local file
    const dbPath = path.join(process.cwd(), "lib", "case_studies.json");
    if (fs.existsSync(dbPath)) {
      try {
        const data = fs.readFileSync(dbPath, "utf-8");
        studies = JSON.parse(data);
      } catch (fileErr) {
        console.error("Error reading case studies file fallback", fileErr);
      }
    }
  }

  // Filter drafts on server render
  const publishedStudies = studies.filter((s: any) => s.status === "Published");

  return (
    <PageChrome>
      <section className="bg-bg-secondary border-b border-white/5 pt-36 pb-24 relative overflow-hidden">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-5 pointer-events-none" />
        <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)] relative z-10 text-left">
          <p className="text-small-text font-bold uppercase tracking-[0.18em] text-signal font-mono">Case studies</p>
          <h1 className="mt-4 max-w-4xl text-4xl sm:text-5xl lg:text-6xl text-text-primary leading-[1.15] font-display font-black tracking-tight">
            Engineering work shaped around <span className="text-[#8CC63F]">measurable outcomes.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-body-large text-text-secondary">
            Explore how Texawave delivers high-performance mechanical designs, custom PCBs, embedded systems, and connected IoT cloud platforms.
          </p>
        </div>
      </section>

      <section className="bg-bg-primary py-20 relative">
        <div className="mx-auto w-full max-w-[1400px] px-[clamp(1rem,4vw,4rem)]">
          <CaseStudiesList initialStudies={publishedStudies} />
        </div>
      </section>
    </PageChrome>
  );
}
