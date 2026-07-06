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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userName, content } = await request.json();

    if (!userName || !content) {
      return NextResponse.json(
        { success: false, error: "Username and comment content are required" },
        { status: 400 }
      );
    }

    const studies = readCaseStudies();
    const index = studies.findIndex((s: any) => s.id === id || s.slug === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Case study not found" }, { status: 404 });
    }

    const newComment = {
      id: `comm-${Date.now()}`,
      userName,
      content,
      dateSubmitted: new Date().toISOString().split("T")[0],
      approved: true
    };

    if (!studies[index].comments) {
      studies[index].comments = [];
    }

    studies[index].comments.push(newComment);
    writeCaseStudies(studies);

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit comment" },
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
    const { commentId } = await request.json();

    if (!commentId) {
      return NextResponse.json({ success: false, error: "Comment ID is required" }, { status: 400 });
    }

    const studies = readCaseStudies();
    const index = studies.findIndex((s: any) => s.id === id || s.slug === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Case study not found" }, { status: 404 });
    }

    const initialCount = studies[index].comments?.length || 0;
    studies[index].comments = (studies[index].comments || []).filter(
      (c: any) => c.id !== commentId
    );

    if (studies[index].comments.length === initialCount) {
      return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
    }

    writeCaseStudies(studies);

    return NextResponse.json({ success: true, message: "Comment deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete comment" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { commentId, approved } = await request.json();

    if (!commentId || approved === undefined) {
      return NextResponse.json(
        { success: false, error: "Comment ID and Approved flag are required" },
        { status: 400 }
      );
    }

    const studies = readCaseStudies();
    const index = studies.findIndex((s: any) => s.id === id || s.slug === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Case study not found" }, { status: 404 });
    }

    const comment = (studies[index].comments || []).find((c: any) => c.id === commentId);

    if (!comment) {
      return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
    }

    comment.approved = approved;
    writeCaseStudies(studies);

    return NextResponse.json({ success: true, comment });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to toggle comment approval" },
      { status: 500 }
    );
  }
}
