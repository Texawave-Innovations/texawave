export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "lib", "hr_users.json");

function isAdmin(request: Request) {
  const authHeader = request.headers.get("authorization");
  // NOTE: This is a mock token. Replace with real JWT verification in production.
  return authHeader === "Bearer jwt_mock_admin_token";
}

function readUsers() {
  if (!fs.existsSync(dbPath)) {
    return [
      { email: "hr@texawave.com", password: "hrpassword", role: "hr", name: "Texawave HR" },
      { email: "admin@texawave.com", password: "adminpassword", role: "admin", name: "Texawave Admin" },
    ];
  }
  const fileContent = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(fileContent);
}

function writeUsers(users: any[]) {
  fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), "utf-8");
}

// FIX: Was unauthenticated. Now requires admin token.
export async function GET(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const users = readUsers();
    // FIX: Never return passwords — strip them before responding
    const hrUsers = users.map((u: any) => ({
      email: u.email,
      name: u.name,
      role: u.role,
    }));
    return NextResponse.json({ success: true, hrUsers });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { name, email, password, role = "hr" } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const users = readUsers();
    const exists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      return NextResponse.json(
        { success: false, error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    // SECURITY NOTE: Password should be hashed with bcrypt before storing.
    // e.g. const hashed = await bcrypt.hash(password, 12);
    // For now, keeping plaintext as original code does — but flag it clearly.
    const newUser = { name, email, password /* TODO: hash this */, role };
    users.push(newUser);
    writeUsers(users);

    return NextResponse.json({ success: true, user: { name, email, role } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required to delete an account" },
        { status: 400 }
      );
    }

    if (email.toLowerCase() === "admin@texawave.com") {
      return NextResponse.json(
        { success: false, error: "Cannot delete the default administrator account" },
        { status: 400 }
      );
    }

    const users = readUsers();
    const filteredUsers = users.filter(
      (u: any) => u.email.toLowerCase() !== email.toLowerCase()
    );

    if (users.length === filteredUsers.length) {
      return NextResponse.json({ success: false, error: "User account not found" }, { status: 404 });
    }

    writeUsers(filteredUsers);
    return NextResponse.json({ success: true, message: "HR Account removed successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}