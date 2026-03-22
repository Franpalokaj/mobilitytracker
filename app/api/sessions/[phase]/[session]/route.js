import sql from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { phase, session } = await params;
  const p = parseInt(phase);
  const s = parseInt(session);

  const sessions = await sql`
    SELECT id, started_at, ended_at, completed
    FROM workout_sessions
    WHERE phase = ${p} AND session = ${s}
  `;

  if (sessions.length === 0) {
    return NextResponse.json({ session: null, sets: [] });
  }

  const ws = sessions[0];
  const sets = await sql`
    SELECT exercise_name, set_number, reps_or_time, weight, measurement
    FROM set_logs
    WHERE session_id = ${ws.id}
    ORDER BY exercise_name, set_number
  `;

  return NextResponse.json({ session: ws, sets });
}
