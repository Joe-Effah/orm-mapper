import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import path from 'node:path';

const dbPath = process.env.DB_PATH ?? './mydb.sqlite';
const resolvedDbPath = path.resolve(dbPath);

let cachedDb: ReturnType<typeof drizzle> | undefined;
let initialized = false;

function ensureSchema(sqlite: Database) {
  if (initialized) {
    return;
  }

  sqlite.run('DROP TABLE IF EXISTS users');
  sqlite.run(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);

  initialized = true;
}

export function getDrizzleDb() {
  if (!cachedDb) {
    const sqlite = new Database(resolvedDbPath);
    ensureSchema(sqlite);
    cachedDb = drizzle(sqlite);
  }

  return cachedDb;
}

export const drizzleDb = getDrizzleDb();

