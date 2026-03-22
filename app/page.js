"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const PHASES = [
  {
    name: "Phase 1",
    sessions: 8,
    exercises: [
      { order: "A1", name: "Rolling Feet", reps: "90s /side", tempo: "—", sets: 2, rest: "As needed", video: "https://link.matthewismith.com/rolling-feet", type: "time", target: "90s" },
      { order: "A2", name: "Calf Stretch — SL Standing", reps: "90s", tempo: "—", sets: 3, rest: "As needed", video: "https://link.matthewismith.com/calfstretch-standing", type: "time", target: "90s" },
      { order: "B1", name: "Sciatic Nerve — Ankle Floss", reps: "8", tempo: "3s up / 3s down", sets: 3, rest: "60s+", video: "https://link.matthewismith.com/sciatic-ankle-floss", type: "reps", target: "8" },
      { order: "C1", name: "Pike Block Crush — Leg Elev.", reps: "3", tempo: "10s hold", sets: 1, rest: "60s+", video: "https://link.matthewismith.com/leg-elevated-pike-block-crush", type: "reps", target: "3" },
      { order: "C2", name: "Pike Lift CRACR — Leg Elev.", reps: "5", tempo: "Contract 5s / Lift-Relax 5s", sets: 3, rest: "60s+", video: "https://link.matthewismith.com/leg-elevated-pike-lift-cracr", type: "reps", target: "5" },
    ],
  },
  {
    name: "Phase 2",
    sessions: 8,
    exercises: [
      { order: "A1", name: "Donkey Calf Stretch — SL", reps: "90s", tempo: "—", sets: 3, rest: "As needed", video: "https://link.matthewismith.com/calfstretch-donkey", type: "time", target: "90s" },
      { order: "A2", name: "Your Pigeon Variation", reps: "30s", tempo: "—", sets: 3, rest: "60s+", video: "https://link.matthewismith.com/pigeon-variation", type: "time", target: "30s" },
      { order: "B1", name: "Sciatic Nerve — Knee Floss", reps: "8", tempoRaw: [3, 1, 3, 1], boldIdx: 2, tempo: null, sets: 3, rest: "60s+", video: "https://link.matthewismith.com/sciatic-knee-floss", type: "reps", target: "8" },
      { order: "C1", name: "Pike Block Crush — Standing", reps: "8", tempo: "3s lift 3s rest ×2", sets: 3, rest: "90s+", video: "https://link.matthewismith.com/pike-block-crush-standing", type: "reps", target: "8" },
      { order: "D1", name: "Pike Active Lifts — Seated", reps: "8", tempo: "3s lift 3s rest ×2", sets: 3, rest: "90s+", video: "https://link.matthewismith.com/pike-active-lifts-seated", type: "reps", target: "8" },
    ],
  },
  {
    name: "Phase 3",
    sessions: 8,
    exercises: [
      { order: "A1", name: "Knee Ext. Calf Stretch — SL", reps: "8", tempo: "3s", sets: 3, rest: "60s+", video: "https://link.matthewismith.com/calfstretch-knee-extension", type: "reps", target: "8" },
      { order: "B1", name: "Sciatic Nerve — Ankle Glide", reps: "6", tempoRaw: [3, 1, 3, 1], boldIdx: 2, tempo: null, sets: 3, rest: "90s+", video: "https://link.matthewismith.com/sciatic-ankle-glide", type: "reps", target: "6" },
      { order: "C1", name: "Pike Good Morning — B-Stance", reps: "8", tempoRaw: [3, 3, 1, 0], boldIdx: 0, tempo: null, sets: 3, rest: "60s+", video: "https://link.matthewismith.com/pike-good-morning-bstance", type: "reps", target: "8" },
      { order: "C2", name: "Pike Active Lifts — Seated SL", reps: "5", tempoRaw: [1, 1, 1, 5], boldIdx: 3, tempo: null, sets: 3, rest: "60s+", video: "https://link.matthewismith.com/pike-active-lifts-seated", type: "reps", target: "5" },
    ],
  },
];

function formatTime(s) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

function TempoDisplay({ exercise }) {
  if (exercise.tempoRaw) {
    const syms = ["\u2303", "\u2013", "\u2304", "\u2013"];
    const boldIdx = exercise.boldIdx ?? -1;
    return (
      <span style={{ display: "inline-flex", gap: 0, alignItems: "center" }}>
        {exercise.tempoRaw.map((val, i) => {
          const isBold = i === boldIdx;
          return (
            <span key={i} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", minWidth: 13 }}>
              <span style={{ fontSize: 7, lineHeight: 1, color: isBold ? "#4A5D4A" : "#ccc" }}>{syms[i]}</span>
              <span style={{ fontSize: 11, fontWeight: isBold ? 700 : 400, color: isBold ? "#4A5D4A" : "#aaa" }}>{val}</span>
            </span>
          );
        })}
      </span>
    );
  }
  if (exercise.tempo === "—") return null;
  return <span>{exercise.tempo}</span>;
}

function SetRow({ setNum, exercise, value, onChange, showMeasure }) {
  const isTime = exercise.type === "time";
  const inputStyle = (filled) => ({
    flex: 1,
    padding: "10px 6px",
    fontSize: 16,
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    background: filled ? "#fff" : "#fafafa",
    textAlign: "center",
    outline: "none",
    fontFamily: "inherit",
    minWidth: 0,
  });
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 4 }}>
      <div style={{ width: 24, fontSize: 11, color: "#6B8E6B", fontWeight: 700, textAlign: "center", flexShrink: 0 }}>
        {setNum}
      </div>
      <input type="text" inputMode={isTime ? "text" : "numeric"} placeholder={exercise.target} value={value.reps}
        onChange={(e) => onChange({ ...value, reps: e.target.value })} style={{ ...inputStyle(value.reps), flex: 1.5 }} />
      <input type="text" inputMode="decimal" placeholder="kg" value={value.weight}
        onChange={(e) => onChange({ ...value, weight: e.target.value })} style={inputStyle(value.weight)} />
      {showMeasure && (
        <input type="text" placeholder="cm/°" value={value.measurement}
          onChange={(e) => onChange({ ...value, measurement: e.target.value })} style={inputStyle(value.measurement)} />
      )}
    </div>
  );
}

function ExerciseCard({ exercise, sets, onSetChange }) {
  const [showMeasure, setShowMeasure] = useState(false);
  const hasMeasure = sets.some((s) => s.measurement);
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "14px 12px", marginBottom: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span style={{ background: "#4A5D4A", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, flexShrink: 0 }}>
              {exercise.order}
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {exercise.name}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "#999", lineHeight: 1.5, display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
            <span>{exercise.reps}{exercise.type === "reps" ? " reps" : ""}</span>
            {(exercise.tempo || exercise.tempoRaw) && <><span>·</span><TempoDisplay exercise={exercise} /></>}
            <span>·</span><span>{exercise.sets} sets</span>
            <span>·</span><span>{exercise.rest}</span>
          </div>
        </div>
        <a href={exercise.video} target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#6B8E6B", textDecoration: "none", padding: "3px 7px", border: "1px solid #c0d4c0", borderRadius: 6, flexShrink: 0, marginLeft: 6 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#6B8E6B"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          Video
        </a>
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 10, marginBottom: 3, paddingLeft: 24 }}>
        <div style={{ flex: 1.5, fontSize: 9, color: "#bbb", textAlign: "center", textTransform: "uppercase", letterSpacing: 0.5 }}>
          {exercise.type === "time" ? "Time" : "Reps"}
        </div>
        <div style={{ flex: 1, fontSize: 9, color: "#bbb", textAlign: "center", textTransform: "uppercase", letterSpacing: 0.5 }}>Wt</div>
        {(showMeasure || hasMeasure) && (
          <div style={{ flex: 1, fontSize: 9, color: "#bbb", textAlign: "center", textTransform: "uppercase", letterSpacing: 0.5 }}>Meas</div>
        )}
        <button onClick={() => setShowMeasure(!showMeasure)}
          style={{ background: "none", border: "none", fontSize: 9, color: showMeasure || hasMeasure ? "#6B8E6B" : "#ccc", cursor: "pointer", padding: "0 2px", fontFamily: "inherit" }}>
          {showMeasure || hasMeasure ? "−" : "+"}📏
        </button>
      </div>
      {sets.map((setVal, i) => (
        <SetRow key={i} setNum={i + 1} exercise={exercise} value={setVal}
          onChange={(v) => onSetChange(i, v)} showMeasure={showMeasure || hasMeasure} />
      ))}
    </div>
  );
}

function ProgressBar({ allData, completedSessions }) {
  function isSessionDone(pi, si) {
    const key = `${pi}-${si + 1}`;
    if (completedSessions.has(key)) return true;
    const data = allData[key];
    if (!data) return false;
    return PHASES[pi].exercises.some((_, exIdx) => {
      const sets = data[exIdx];
      return sets && sets.some((s) => s.reps);
    });
  }
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
      {PHASES.map((phase, pi) => (
        <div key={pi} style={{ flex: 1, display: "flex", gap: 1.5 }}>
          {Array.from({ length: phase.sessions }, (_, si) => (
            <div key={si} style={{
              flex: 1, height: 5, borderRadius: 2,
              background: isSessionDone(pi, si) ? "#a8d5a8" : "rgba(255,255,255,0.15)",
              transition: "background 0.3s",
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function HistoryPage({ allData }) {
  return (
    <div style={{ padding: 12 }}>
      {PHASES.map((phase, pi) => (
        <div key={pi} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#4A5D4A", marginBottom: 8 }}>{phase.name}</div>
          {phase.exercises.map((ex, exIdx) => {
            const sessions = [];
            for (let s = 1; s <= phase.sessions; s++) {
              const key = `${pi}-${s}`;
              const data = allData[key];
              if (data && data[exIdx]) {
                const sets = data[exIdx];
                const filled = sets.filter((st) => st.reps);
                if (filled.length > 0) sessions.push({ num: s, sets: filled });
              }
            }
            if (sessions.length === 0) return null;
            return (
              <div key={exIdx} style={{ background: "#fff", borderRadius: 10, padding: 12, marginBottom: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ background: "#4A5D4A", color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3 }}>{ex.order}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{ex.name}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {sessions.map(({ num, sets }) => (
                    <div key={num} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                      <span style={{ color: "#999", fontWeight: 600, minWidth: 24 }}>S{num}</span>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {sets.map((st, si) => (
                          <span key={si} style={{ background: "#e8ede8", padding: "2px 8px", borderRadius: 4, fontSize: 11, color: "#333" }}>
                            {st.reps}{ex.type === "time" ? "" : "r"}
                            {st.weight ? ` × ${st.weight}kg` : ""}
                            {st.measurement ? ` · ${st.measurement}` : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {phase.exercises.every((_, exIdx) => {
            for (let s = 1; s <= phase.sessions; s++) {
              const key = `${pi}-${s}`;
              if (allData[key] && allData[key][exIdx]) return false;
            }
            return true;
          }) && (
            <div style={{ color: "#ccc", fontSize: 13, fontStyle: "italic", padding: 8 }}>No sessions logged yet</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("workout");
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [sessionNum, setSessionNum] = useState(1);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutFinished, setWorkoutFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showPhaseSelect, setShowPhaseSelect] = useState(false);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef(null);
  const saveTimerRef = useRef(null);
  const lastSavedRef = useRef(null);

  const [allData, setAllData] = useState({});
  const [completedSessions, setCompletedSessions] = useState(new Set());

  const phase = PHASES[phaseIdx];
  const dataKey = `${phaseIdx}-${sessionNum}`;
  const sessionData = allData[dataKey] || {};

  function getSets(exIdx) {
    if (sessionData[exIdx]) return sessionData[exIdx];
    return Array.from({ length: phase.exercises[exIdx].sets }, () => ({ reps: "", weight: "", measurement: "" }));
  }

  function updateSet(exIdx, setIdx, newVal) {
    setAllData((prev) => {
      const prevSession = prev[dataKey] || {};
      const prevSets = prevSession[exIdx] || getSets(exIdx);
      const newSets = [...prevSets];
      newSets[setIdx] = newVal;
      return { ...prev, [dataKey]: { ...prevSession, [exIdx]: newSets } };
    });
  }

  // --- API: Load all sessions on mount ---
  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((data) => {
        const completed = new Set();
        data.sessions.forEach((s) => {
          if (s.completed) completed.add(`${s.phase}-${s.session}`);
        });
        setCompletedSessions(completed);
      })
      .catch(() => {});
  }, []);

  // --- API: Load set data when phase/session changes ---
  useEffect(() => {
    fetch(`/api/sessions/${phaseIdx}/${sessionNum}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.sets && data.sets.length > 0) {
          const rebuilt = {};
          data.sets.forEach((row) => {
            const exIdx = phase.exercises.findIndex((e) => e.name === row.exercise_name);
            if (exIdx === -1) return;
            if (!rebuilt[exIdx]) {
              rebuilt[exIdx] = Array.from({ length: phase.exercises[exIdx].sets }, () => ({
                reps: "", weight: "", measurement: "",
              }));
            }
            rebuilt[exIdx][row.set_number - 1] = {
              reps: row.reps_or_time || "",
              weight: row.weight || "",
              measurement: row.measurement || "",
            };
          });
          setAllData((prev) => ({ ...prev, [dataKey]: rebuilt }));
        }
        if (data.session) {
          if (data.session.started_at && !data.session.completed) {
            setWorkoutStarted(true);
            setWorkoutFinished(false);
            const start = new Date(data.session.started_at);
            setElapsed(Math.floor((Date.now() - start.getTime()) / 1000));
            timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
          }
          if (data.session.completed) {
            setWorkoutFinished(true);
            setWorkoutStarted(true);
            if (data.session.started_at && data.session.ended_at) {
              const start = new Date(data.session.started_at);
              const end = new Date(data.session.ended_at);
              setElapsed(Math.floor((end.getTime() - start.getTime()) / 1000));
            }
          }
        }
      })
      .catch(() => {});

    return () => clearInterval(timerRef.current);
  }, [phaseIdx, sessionNum]);

  // --- API: Debounced auto-save ---
  const saveSets = useCallback(
    (currentData) => {
      const sets = [];
      Object.entries(currentData).forEach(([exIdx, exSets]) => {
        const exercise = phase.exercises[parseInt(exIdx)];
        if (!exercise) return;
        exSets.forEach((s, setIdx) => {
          if (s.reps) {
            sets.push({
              exercise_name: exercise.name,
              set_number: setIdx + 1,
              reps_or_time: s.reps,
              weight: s.weight,
              measurement: s.measurement,
            });
          }
        });
      });

      setSaving(true);
      fetch(`/api/sessions/${phaseIdx}/${sessionNum}/sets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sets }),
      })
        .then(() => {
          lastSavedRef.current = JSON.stringify(currentData);
        })
        .catch(() => {})
        .finally(() => setSaving(false));
    },
    [phaseIdx, sessionNum, phase.exercises]
  );

  useEffect(() => {
    const currentData = allData[dataKey];
    if (!currentData) return;

    const serialized = JSON.stringify(currentData);
    if (serialized === lastSavedRef.current) return;

    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveSets(currentData), 2000);

    return () => clearTimeout(saveTimerRef.current);
  }, [allData, dataKey, saveSets]);

  // --- Workout controls ---
  function startWorkout() {
    setWorkoutStarted(true);
    setWorkoutFinished(false);
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    fetch(`/api/sessions/${phaseIdx}/${sessionNum}/start`, { method: "POST" }).catch(() => {});
  }

  function endWorkout() {
    clearInterval(timerRef.current);
    setWorkoutFinished(true);
    setCompletedSessions((prev) => new Set([...prev, dataKey]));
    fetch(`/api/sessions/${phaseIdx}/${sessionNum}/end`, { method: "POST" }).catch(() => {});
    // Force-save any pending data immediately
    clearTimeout(saveTimerRef.current);
    const currentData = allData[dataKey];
    if (currentData) saveSets(currentData);
  }

  function resetWorkout() {
    setWorkoutStarted(false);
    setWorkoutFinished(false);
    setElapsed(0);
    clearInterval(timerRef.current);
    lastSavedRef.current = null;
  }

  const canGoPrev = !(phaseIdx === 0 && sessionNum === 1);
  const canGoNext = !(phaseIdx === PHASES.length - 1 && sessionNum === phase.sessions);

  function goPrev() {
    if (sessionNum > 1) setSessionNum(sessionNum - 1);
    else if (phaseIdx > 0) { setPhaseIdx(phaseIdx - 1); setSessionNum(PHASES[phaseIdx - 1].sessions); }
    resetWorkout();
  }

  function goNext() {
    if (sessionNum < phase.sessions) setSessionNum(sessionNum + 1);
    else if (phaseIdx < PHASES.length - 1) { setPhaseIdx(phaseIdx + 1); setSessionNum(1); }
    resetWorkout();
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  const filledSets = phase.exercises.reduce((acc, _, exIdx) => acc + getSets(exIdx).filter((s) => s.reps).length, 0);
  const totalSets = phase.exercises.reduce((acc, ex) => acc + ex.sets, 0);

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#f2f2f2", minHeight: "100vh", maxWidth: 480, margin: "0 auto" }}>
      {/* Sticky header */}
      <div style={{ background: "#4A5D4A", padding: "10px 14px 8px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => { setShowPhaseSelect(!showPhaseSelect); if (view === "history") { setView("workout"); setShowPhaseSelect(false); } }}
            style={{ background: "none", border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
            {view === "history" ? "History" : `P${phaseIdx + 1} — Session ${sessionNum}`} ▾
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {saving && (
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Saving...</span>
            )}
            {workoutStarted && view === "workout" && (
              <span style={{ color: workoutFinished ? "#a8d5a8" : "#fff", fontSize: 18, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                {formatTime(elapsed)}
              </span>
            )}
          </div>
        </div>
        <ProgressBar allData={allData} completedSessions={completedSessions} />
      </div>

      {/* Nav tabs */}
      <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #eee" }}>
        <button onClick={() => setView("workout")}
          style={{ flex: 1, padding: "10px 0", border: "none", borderBottom: view === "workout" ? "2px solid #4A5D4A" : "2px solid transparent", background: "none", fontSize: 13, fontWeight: 600, color: view === "workout" ? "#4A5D4A" : "#aaa", cursor: "pointer", fontFamily: "inherit" }}>
          Workout
        </button>
        <button onClick={() => setView("history")}
          style={{ flex: 1, padding: "10px 0", border: "none", borderBottom: view === "history" ? "2px solid #4A5D4A" : "2px solid transparent", background: "none", fontSize: 13, fontWeight: 600, color: view === "history" ? "#4A5D4A" : "#aaa", cursor: "pointer", fontFamily: "inherit" }}>
          History
        </button>
      </div>

      {/* Phase/Session selector */}
      {showPhaseSelect && view === "workout" && (
        <>
          <div onClick={() => setShowPhaseSelect(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 5 }} />
          <div style={{ background: "#fff", borderBottom: "1px solid #ddd", padding: 14, position: "relative", zIndex: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#4A5D4A" }}>Select Session</span>
              <button onClick={() => setShowPhaseSelect(false)}
                style={{ background: "none", border: "none", fontSize: 18, color: "#999", cursor: "pointer", padding: "0 4px", lineHeight: 1, fontFamily: "inherit" }}>
                ×
              </button>
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              {PHASES.map((p, i) => (
                <button key={i} onClick={() => { setPhaseIdx(i); setSessionNum(1); resetWorkout(); }}
                  style={{ flex: 1, padding: "7px 0", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    background: phaseIdx === i ? "#4A5D4A" : "#e8ede8", color: phaseIdx === i ? "#fff" : "#4A5D4A", fontFamily: "inherit" }}>
                  {p.name}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {Array.from({ length: phase.sessions }, (_, i) => i + 1).map((s) => {
                const key = `${phaseIdx}-${s}`;
                const hasData = completedSessions.has(key) || (allData[key] && Object.keys(allData[key]).length > 0);
                const isActive = sessionNum === s;
                const bg = isActive ? "#4A5D4A" : hasData ? "#6B8E6B" : "#f0f0f0";
                const fg = isActive || hasData ? "#fff" : "#333";
                return (
                  <button key={s} onClick={() => { setSessionNum(s); setShowPhaseSelect(false); resetWorkout(); }}
                    style={{ width: 40, height: 40, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                      background: bg, color: fg, fontFamily: "inherit", position: "relative" }}>
                    {s}
                    {hasData && !isActive && (
                      <span style={{ position: "absolute", top: 2, right: 3, fontSize: 8, lineHeight: 1 }}>&#10003;</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Content */}
      {view === "workout" ? (
        <div style={{ padding: 10 }}>
          {!workoutFinished ? (
            <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "stretch" }}>
              <button onClick={goPrev} disabled={!canGoPrev}
                style={{ width: 46, border: "none", borderRadius: 10, background: canGoPrev ? "#888" : "#e0e0e0", color: canGoPrev ? "#fff" : "#bbb", fontSize: 18, cursor: canGoPrev ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "inherit" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              {!workoutStarted ? (
                <button onClick={startWorkout}
                  style={{ flex: 1, padding: 13, background: "#4A5D4A", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Start Workout
                </button>
              ) : (
                <button onClick={endWorkout}
                  style={{ flex: 1, padding: 13, background: "#c0392b", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  End Workout — {formatTime(elapsed)}
                </button>
              )}
              <button onClick={goNext} disabled={!canGoNext}
                style={{ width: 46, border: "none", borderRadius: 10, background: canGoNext ? "#888" : "#e0e0e0", color: canGoNext ? "#fff" : "#bbb", fontSize: 18, cursor: canGoNext ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "inherit" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: 10 }}>
              <div style={{ background: "#d4e8d4", borderRadius: 12, padding: 14, textAlign: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 13, color: "#4A5D4A", fontWeight: 600 }}>Workout Complete!</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#4A5D4A", margin: "2px 0" }}>{formatTime(elapsed)}</div>
                <div style={{ fontSize: 12, color: "#6B8E6B" }}>{filledSets}/{totalSets} sets logged</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={goPrev} disabled={!canGoPrev}
                  style={{ width: 46, height: 42, border: "none", borderRadius: 10, background: canGoPrev ? "#888" : "#e0e0e0", color: canGoPrev ? "#fff" : "#bbb", fontSize: 18, cursor: canGoPrev ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "inherit" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <button onClick={goNext} disabled={!canGoNext}
                  style={{ flex: 1, height: 42, border: "none", borderRadius: 10, background: canGoNext ? "#4A5D4A" : "#f0f0f0", color: canGoNext ? "#fff" : "#ccc", fontSize: 14, fontWeight: 600, cursor: canGoNext ? "pointer" : "default", fontFamily: "inherit" }}>
                  Next Session →
                </button>
              </div>
            </div>
          )}
          {phase.exercises.map((ex, exIdx) => (
            <ExerciseCard key={`${phaseIdx}-${exIdx}`} exercise={ex} sets={getSets(exIdx)}
              onSetChange={(setIdx, v) => updateSet(exIdx, setIdx, v)} />
          ))}
          <div style={{ height: 40 }} />
        </div>
      ) : (
        <HistoryPage allData={allData} />
      )}
    </div>
  );
}
