import { neon } from "@neondatabase/serverless";

function getSQL() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  return neon(process.env.DATABASE_URL);
}

// Lazy init — only connects when an API route actually calls sql``
let _sql;
export default function sql(...args) {
  if (!_sql) _sql = getSQL();
  return _sql(...args);
}
