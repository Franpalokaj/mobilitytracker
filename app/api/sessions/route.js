import sql from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const userId = request.nextUrl.searchParams.get("u") || "default";
  const rows = await sql`
    SELECT phase, session, completed, started_at, ended_at
    FROM workout_sessions
    WHERE user_id = ${userId}
    ORDER BY phase, session
  `;
  return NextResponse.json({ sessions: rows });
}
