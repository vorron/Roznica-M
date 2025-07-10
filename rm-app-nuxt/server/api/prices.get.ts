import { Pool } from "pg";
import { sub } from "date-fns";
import { defineEventHandler } from "h3"; // Явный импорт

export interface PriceData {
  price: number;
  timestamp: Date;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const range = query.range || "month";

  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432", 10),
  });

  let whereClause = "";
  const now = new Date();

  switch (range) {
    case "day":
      whereClause = `WHERE timestamp > '${sub(now, { days: 1 }).toISOString()}'`;
      break;
    case "week":
      whereClause = `WHERE timestamp > '${sub(now, { weeks: 1 }).toISOString()}'`;
      break;
    case "month":
      whereClause = `WHERE timestamp > '${sub(now, { months: 1 }).toISOString()}'`;
      break;
    case "year":
      whereClause = `WHERE timestamp > '${sub(now, { years: 1 }).toISOString()}'`;
      break;
    case "custom":
      if (query.start && query.end) {
        whereClause = `WHERE timestamp BETWEEN '${query.start}' AND '${query.end}'`;
      }
      break;
  }

  const sql = `SELECT price, timestamp FROM bitcoin_price ${whereClause} ORDER BY timestamp ASC`;

  try {
    const res = await pool.query<PriceData>(sql);
    return res.rows;
  } catch (err) {
    console.error("Database error:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Database query failed",
      data: err,
    });
  } finally {
    await pool.end();
  }
});
