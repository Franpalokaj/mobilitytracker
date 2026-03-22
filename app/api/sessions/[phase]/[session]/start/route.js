import sql from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { phase, session } = await params;
  const p = parseInt(phase);
  const s = parseInt(session);
  const userId = request.nextUrl.searchParams.get("u") || "default";

  const rows = await sql`
    INSERT INTO workout_sessions (user_id, phase, session, started_at)
    VALUES (${userId}, ${p}, ${s}, NOW())
    ON CONFLICT (user_id, phase, session)
    DO UPDATE SET started_at = NOW(), completed = false, ended_at = NULL
    RETURNING id
  `;

  return NextResponse.json({ id: rows[0].id });
}
