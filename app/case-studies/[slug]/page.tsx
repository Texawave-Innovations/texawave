import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { PageChrome } from "@/components/PageChrome";
import { CaseStudyDetailClient } from "@/components/CaseStudyDetailClient";
import { ref, get, set } from "firebase/database";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCaseStudiesFromDb() {
  try {
    const csRef = ref(db, "caseStudies");
    const snapshot = await get(csRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
    } else {
      // Seed if database node is blank
      const dbPath = path.join(process.cwd(), "lib", "case_studies.json");
      if (fs.existsSync(dbPath)) {
        try {
          const fileContent = fs.readFileSync(dbPath, "utf-8");
          const studies = JSON.parse(fileContent);
          for (const study of studies) {
            await set(ref(db, `caseStudies/${study.id}`), study);
          }
          return studies;
        } catch (fileErr) {
          console.error("Error seeding case studies in slug page", fileErr);
        }
      }
    }
  } catch (err) {
    console.error("Error reading case studies from Firebase in detail page", err);
    // Fallback to local file
    const dbPath = path.join(process.cwd(), "lib", "case_studies.json");
    if (fs.existsSync(dbPath)) {
      try {
        const data = fs.readFileSync(dbPath, "utf-8");
        return JSON.parse(data);
      } catch (fileErr) {
        console.error("Error reading case studies file fallback in slug page", fileErr);
      }
    }
  }

  return [];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const studies = await getCaseStudiesFromDb();
  const study = studies.find((s: any) => s.slug === slug || s.id === slug);

  if (!study) return { 
    title: "Case Study | Texawave", 
    alternates: { canonical: `/case-studies/${slug}` } 
  };

  return {
    title: `${study.title} | Texawave Case Study`,
    description: study.problemStatement || study.solution,
    alternates: {
      canonical: `/case-studies/${slug}`
    }
  };
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const studies = await getCaseStudiesFromDb();
  const index = studies.findIndex((s: any) => s.slug === slug || s.id === slug);

  if (index === -1) {
    notFound();
  }

  const study = studies[index];

  // Prevent draft studies from loading publicly
  if (study.status !== "Published") {
    notFound();
  }

  // Get related studies (sharing category or just other published ones)
  let related = studies.filter(
    (s: any) => s.category === study.category && s.id !== study.id && s.status === "Published"
  );
  if (related.length === 0) {
    related = studies.filter((s: any) => s.id !== study.id && s.status === "Published");
  }

  return (
    <PageChrome>
      <CaseStudyDetailClient study={study} relatedStudies={related} />
    </PageChrome>
  );
}
