import { Pool } from "pg";
import type { QueryResultRow } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  max: 20,
  idleTimeoutMillis: 30000, // Закрыть подключения после 30 секунд бездействия
  connectionTimeoutMillis: 2000, // Время ожидания подключения
});

/**
 * Выполняет SQL-запрос к базе данных
 * @param text SQL-запрос
 * @param params Параметры запроса
 * @returns Результат выполнения запроса
 */
export const query = async <T extends QueryResultRow>(text: string, params?: unknown[]) => {
  try {
    return await pool.query<T>(text, params);
  } catch (err) {
    console.error("Ошибка в запросе к БД:", { text, params });
    throw err;
  }
};

process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});
