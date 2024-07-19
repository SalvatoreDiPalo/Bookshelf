import { Pool } from "pg";

import { env } from "@/libs/utils/envConfig";

const db = new Pool({
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT, // default Postgres port
  database: env.DB_NAME,
});

export const query = async (text: string, params: any[] = []) => {
  const start = Date.now();
  const res = await db.query(text, params);
  const duration = Date.now() - start;
  console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
};

export const getClient = () => {
  return db.connect();
};
