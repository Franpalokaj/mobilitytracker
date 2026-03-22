CREATE TABLE workout_sessions (
  id SERIAL PRIMARY KEY,
  phase INTEGER NOT NULL,
  session INTEGER NOT NULL,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE set_logs (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES workout_sessions(id),
  exercise_name TEXT NOT NULL,
  set_number INTEGER NOT NULL,
  reps_or_time TEXT,
  weight TEXT,
  measurement TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_phase_session ON workout_sessions(phase, session);
