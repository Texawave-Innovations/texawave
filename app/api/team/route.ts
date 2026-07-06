import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Endpoint deprecated. Team data is now managed via Firebase." },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    { success: false, error: "Endpoint deprecated. Team data is now managed via Firebase." },
    { status: 410 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: "Endpoint deprecated. Team data is now managed via Firebase." },
    { status: 410 }
  );
}
