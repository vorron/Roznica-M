import { defineEventHandler } from "h3";
import { sub } from "date-fns";
import { query } from "~/server/utils/db";
import { z } from "zod";

const rangeSchema = z.object({
  range: z.enum(["day", "week", "month", "year", "custom"]).default("month"),
  start: z.string().optional(),
  end: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const rawQuery = getQuery(event);
  const result = rangeSchema.safeParse(rawQuery);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid parameters",
      data: result.error.flatten(),
    });
  }

  const { range, start, end } = result.data;
  let whereClause = "";
  const params: (string | Date)[] = [];

  switch (range) {
    case "day":
      whereClause = "WHERE timestamp > $1";
      params.push(sub(new Date(), { days: 1 }).toISOString());
      break;
    case "week":
      whereClause = "WHERE timestamp > $1";
      params.push(sub(new Date(), { weeks: 1 }).toISOString());
      break;
    case "month":
      whereClause = "WHERE timestamp > $1";
      params.push(sub(new Date(), { months: 1 }).toISOString());
      break;
    case "year":
      whereClause = "WHERE timestamp > $1";
      params.push(sub(new Date(), { years: 1 }).toISOString());
      break;
    case "custom":
      if (start && end) {
        whereClause = "WHERE timestamp BETWEEN $1 AND $2";
        params.push(start, end);
      }
      break;
  }

  try {
    const sql = `SELECT price, timestamp FROM bitcoin_price ${whereClause} ORDER BY timestamp ASC`;
    const res = await query(sql, params);
    return res.rows;
  } catch (err) {
    console.error("Database error:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Database query failed",
    });
  }
});
