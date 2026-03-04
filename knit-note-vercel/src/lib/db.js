import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Execute a parameterized query. Always pass user input via the params array
 * (e.g. query("select * from t where id = $1", [id])). Never interpolate
 * user input into the SQL string—this prevents SQL injection.
 */
export async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

