import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ref, get, set, update, remove } from "firebase/database";
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
    console.error("Error reading case studies from Firebase in comments API", err);
    // Fallback to local JSON file
    if (fs.existsSync(dbPath)) {
      try {
        const fileContent = fs.readFileSync(dbPath, "utf-8");
        return JSON.parse(fileContent);
      } catch (fileErr) {
        console.error("Error reading case studies file fallback in comments API", fileErr);
      }
    }
  }
  return [];
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

    const studies = await getCaseStudiesFromDb();
    const study = studies.find((s: any) => s.id === id || s.slug === id);

    if (!study) {
      return NextResponse.json({ success: false, error: "Case study not found" }, { status: 404 });
    }

    const commentId = `comm-${Date.now()}`;
    const newComment = {
      userName,
      content,
      dateSubmitted: new Date().toISOString().split("T")[0],
      approved: true
    };

    await set(ref(db, `caseStudyComments/${study.id}/${commentId}`), newComment);

    return NextResponse.json({ success: true, comment: { id: commentId, ...newComment } });
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

    const studies = await getCaseStudiesFromDb();
    const study = studies.find((s: any) => s.id === id || s.slug === id);

    if (!study) {
      return NextResponse.json({ success: false, error: "Case study not found" }, { status: 404 });
    }

    const commentRef = ref(db, `caseStudyComments/${study.id}/${commentId}`);
    const snapshot = await get(commentRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
    }

    await remove(commentRef);

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

    const studies = await getCaseStudiesFromDb();
    const study = studies.find((s: any) => s.id === id || s.slug === id);

    if (!study) {
      return NextResponse.json({ success: false, error: "Case study not found" }, { status: 404 });
    }

    const commentRef = ref(db, `caseStudyComments/${study.id}/${commentId}`);
    const snapshot = await get(commentRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ success: false, error: "Comment not found" }, { status: 404 });
    }

    await update(commentRef, { approved });

    return NextResponse.json({ success: true, comment: { id: commentId, ...snapshot.val(), approved } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to toggle comment approval" },
      { status: 500 }
    );
  }
}
