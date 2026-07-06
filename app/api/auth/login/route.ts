import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Load users from the mock database file
    const dbPath = path.join(process.cwd(), "lib", "hr_users.json");
    let users = [];
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, "utf-8");
      users = JSON.parse(data);
    } else {
      users = [
        {
          email: "hr@texawave.com",
          password: "hrpassword",
          role: "hr",
          name: "Texawave HR"
        },
        {
          email: "admin@texawave.com",
          password: "adminpassword",
          role: "admin",
          name: "Texawave Admin"
        }
      ];
    }

    // Match candidate
    const user = users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      return NextResponse.json({
        success: true,
        token: `jwt_mock_${user.role}_token`,
        role: user.role,
        name: user.name
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "An error occurred during authentication" },
      { status: 500 }
    );
  }
}
