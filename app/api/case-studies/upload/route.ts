import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function isAdmin(request: Request) {
  const authHeader = request.headers.get("authorization");
  return authHeader === "Bearer jwt_mock_admin_token";
}

// Allowed image MIME types
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
// Max file size: 5 MB
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  //Require admin auth
  if (!isAdmin(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only JPEG, PNG, WebP, and GIF images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "File size must be under 5 MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Sanitize filename
    const sanitizedFilename = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .toLowerCase();

    // Add unique prefix to avoid overrides
    const filename = `${Date.now()}_${sanitizedFilename}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}