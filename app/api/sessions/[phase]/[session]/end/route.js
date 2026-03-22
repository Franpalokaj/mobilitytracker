import sql from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { phase, session } = await params;
  const p = parseInt(phase);
  const s = parseInt(session);
  const userId = request.nextUrl.searchParams.get("u") || "default";

  const rows = await sql`
    UPDATE workout_sessions
    SET completed = true, ended_at = NOW()
    WHERE user_id = ${userId} AND phase = ${p} AND session = ${s}
    RETURNING id
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json({ id: rows[0].id });
}
