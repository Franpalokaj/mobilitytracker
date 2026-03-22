import sql from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await sql`
    SELECT phase, session, completed, started_at, ended_at
    FROM workout_sessions
    ORDER BY phase, session
  `;
  return NextResponse.json({ sessions: rows });
}
