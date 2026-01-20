import { NextRequest, NextResponse } from "next/server";

// Proxy to backend API for available courses
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    
    // Backend API URL (adjust if needed)
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/courses`;

    console.log(`[API Route] Fetching from: ${backendUrl}`);

    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`[API Route] Backend error: ${res.status}`);
      return NextResponse.json(
        { success: false, message: `Backend error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log(`[API Route] Success, returning ${Array.isArray(data?.data) ? data.data.length : 0} courses`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Route] Error:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
