import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ref, get, set, runTransaction } from "firebase/database";
import { db } from "@/lib/firebase";

const dbPath = path.join(process.cwd(), "lib", "case_studies.json");

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
      if (fs.existsSync(dbPath)) {
        const fileContent = fs.readFileSync(dbPath, "utf-8");
        const studies = JSON.parse(fileContent);
        for (const study of studies) {
          await set(ref(db, `caseStudies/${study.id}`), study);
        }
        return studies;
      }
    }
  } catch (err) {
    console.error("Error reading case studies from Firebase in views API", err);
    // Fallback to local JSON file
    if (fs.existsSync(dbPath)) {
      try {
        const fileContent = fs.readFileSync(dbPath, "utf-8");
        return JSON.parse(fileContent);
      } catch (fileErr) {
        console.error("Error reading case studies file fallback in views API", fileErr);
      }
    }
  }
  return [];
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const studies = await getCaseStudiesFromDb();
    const study = studies.find((s: any) => s.id === id || s.slug === id);

    if (!study) {
      return NextResponse.json({ success: false, error: "Case study not found" }, { status: 404 });
    }

    const viewsRef = ref(db, `caseStudies/${study.id}/views`);
    let newViews = 1;
    await runTransaction(viewsRef, (currentValue) => {
      const current = currentValue || 0;
      newViews = current + 1;
      return newViews;
    });

    return NextResponse.json({ success: true, views: newViews });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update views" },
      { status: 500 }
    );
  }
}
