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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const studies = readCaseStudies();
    const index = studies.findIndex((s: any) => s.id === id || s.slug === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Case study not found" }, { status: 404 });
    }

    studies[index].views = (studies[index].views || 0) + 1;
    writeCaseStudies(studies);

    return NextResponse.json({ success: true, views: studies[index].views });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update views" },
      { status: 500 }
    );
  }
}
