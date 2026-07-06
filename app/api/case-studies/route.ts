import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "lib", "case_studies.json");

function readCaseStudies() {
  if (!fs.existsSync(dbPath)) {
    return [];
  }
  const fileContent = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(fileContent);
}

function writeCaseStudies(data: any[]) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
}

function isAdmin(request: Request) {
  const authHeader = request.headers.get("authorization");
  return authHeader === "Bearer jwt_mock_admin_token";
}

export async function GET(request: Request) {
  try {
    const studies = readCaseStudies();
    const admin = isAdmin(request);
    
    // If not admin, only return published ones
    const filtered = admin ? studies : studies.filter((s: any) => s.status === "Published");
    
    return NextResponse.json({ success: true, caseStudies: filtered });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch case studies" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const {
      title,
      category,
      heroImage,
      problemStatement,
      challenges,
      solution,
      hardwareEngineering,
      softwareEngineering,
      mechanicalEngineering,
      resultsImpact,
      gallery = [],
      relatedIds = [],
      status = "Draft"
    } = body;
    
    if (!title || !category) {
      return NextResponse.json(
        { success: false, error: "Title and Category are required" },
        { status: 400 }
      );
    }
    
    const studies = readCaseStudies();
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
      
    // Check if slug already exists
    if (studies.some((s: any) => s.slug === slug)) {
      return NextResponse.json(
        { success: false, error: "A case study with a similar title already exists." },
        { status: 400 }
      );
    }
    
    const newStudy = {
      id: slug,
      slug,
      title,
      category,
      heroImage: heroImage || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      problemStatement: problemStatement || "",
      challenges: challenges || "",
      solution: solution || "",
      hardwareEngineering: hardwareEngineering || "",
      softwareEngineering: softwareEngineering || "",
      mechanicalEngineering: mechanicalEngineering || "",
      resultsImpact: resultsImpact || "",
      gallery: gallery || [],
      relatedIds: relatedIds || [],
      status,
      views: 0,
      comments: []
    };
    
    studies.push(newStudy);
    writeCaseStudies(studies);
    
    return NextResponse.json({ success: true, caseStudy: newStudy });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create case study" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const {
      id,
      title,
      category,
      heroImage,
      problemStatement,
      challenges,
      solution,
      hardwareEngineering,
      softwareEngineering,
      mechanicalEngineering,
      resultsImpact,
      gallery,
      relatedIds,
      status
    } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required for update" },
        { status: 400 }
      );
    }
    
    const studies = readCaseStudies();
    const index = studies.findIndex((s: any) => s.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Case study not found" },
        { status: 404 }
      );
    }
    
    const currentStudy = studies[index];
    
    // Regenerate slug if title changes
    let newSlug = currentStudy.slug;
    if (title && title !== currentStudy.title) {
      newSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }
    
    studies[index] = {
      ...currentStudy,
      slug: newSlug,
      title: title ?? currentStudy.title,
      category: category ?? currentStudy.category,
      heroImage: heroImage ?? currentStudy.heroImage,
      problemStatement: problemStatement ?? currentStudy.problemStatement,
      challenges: challenges ?? currentStudy.challenges,
      solution: solution ?? currentStudy.solution,
      hardwareEngineering: hardwareEngineering ?? currentStudy.hardwareEngineering,
      softwareEngineering: softwareEngineering ?? currentStudy.softwareEngineering,
      mechanicalEngineering: mechanicalEngineering ?? currentStudy.mechanicalEngineering,
      resultsImpact: resultsImpact ?? currentStudy.resultsImpact,
      gallery: gallery ?? currentStudy.gallery,
      relatedIds: relatedIds ?? currentStudy.relatedIds,
      status: status ?? currentStudy.status
    };
    
    writeCaseStudies(studies);
    
    return NextResponse.json({ success: true, caseStudy: studies[index] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update case study" },
      { status: 500 }
    );
  }
}
