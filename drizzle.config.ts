// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/drizzle/users.ts",
  out: "./drizzle/gen",
  dialect: "sqlite",
  dbCredentials: {
    url: "./mydb.sqlite",
  },
});