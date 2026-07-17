import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const complexUsers = sqliteTable('complex_users', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  profileName: text('profile_name'),
  profileAge: text('profile_age'),
});
