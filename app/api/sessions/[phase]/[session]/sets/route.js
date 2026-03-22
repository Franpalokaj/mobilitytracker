import sql from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { phase, session } = await params;
  const p = parseInt(phase);
  const s = parseInt(session);
  const userId = request.nextUrl.searchParams.get("u") || "default";
  const { sets } = await request.json();

  // Ensure session exists
  const sessionRows = await sql`
    INSERT INTO workout_sessions (user_id, phase, session)
    VALUES (${userId}, ${p}, ${s})
    ON CONFLICT (user_id, phase, session) DO UPDATE SET phase = ${p}
    RETURNING id
  `;
  const sessionId = sessionRows[0].id;

  // Delete old set logs
  await sql`DELETE FROM set_logs WHERE session_id = ${sessionId}`;

  // Insert new ones (only non-empty)
  const filtered = sets.filter((s) => s.reps_or_time);
  if (filtered.length > 0) {
    const exerciseNames = filtered.map((s) => s.exercise_name);
    const setNumbers = filtered.map((s) => s.set_number);
    const repsOrTimes = filtered.map((s) => s.reps_or_time || null);
    const weights = filtered.map((s) => s.weight || null);
    const measurements = filtered.map((s) => s.measurement || null);
    const sessionIds = filtered.map(() => sessionId);

    await sql`
      INSERT INTO set_logs (session_id, exercise_name, set_number, reps_or_time, weight, measurement)
      SELECT * FROM unnest(
        ${sessionIds}::int[],
        ${exerciseNames}::text[],
        ${setNumbers}::int[],
        ${repsOrTimes}::text[],
        ${weights}::text[],
        ${measurements}::text[]
      )
    `;
  }

  return NextResponse.json({ ok: true });
}
