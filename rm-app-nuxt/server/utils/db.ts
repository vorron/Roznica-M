import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  max: 20, 
  idleTimeoutMillis: 30000,
});

export const query = (text: string, params?: unknown[]) => pool.query(text, params);
