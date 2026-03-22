import sql from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { phase, session } = await params;
  const p = parseInt(phase);
  const s = parseInt(session);

  const rows = await sql`
    UPDATE workout_sessions
    SET completed = false, ended_at = NULL
    WHERE phase = ${p} AND session = ${s}
    RETURNING id, started_at
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json({ id: rows[0].id, started_at: rows[0].started_at });
}
