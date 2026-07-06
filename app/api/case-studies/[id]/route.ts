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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = isAdmin(request);

    const studies = readCaseStudies();
    const index = studies.findIndex((s: any) => s.id === id || s.slug === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Case study not found" }, { status: 404 });
    }

    const study = studies[index];

    // If not published and not admin, return 404 or unauthorized
    if (study.status !== "Published" && !admin) {
      return NextResponse.json({ success: false, error: "Case study not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, caseStudy: study });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch case study" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const studies = readCaseStudies();
    const filtered = studies.filter((s: any) => s.id !== id && s.slug !== id);

    if (studies.length === filtered.length) {
      return NextResponse.json({ success: false, error: "Case study not found" }, { status: 404 });
    }

    writeCaseStudies(filtered);

    return NextResponse.json({
      success: true,
      message: "Case study deleted successfully"
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete case study" },
      { status: 500 }
    );
  }
}
