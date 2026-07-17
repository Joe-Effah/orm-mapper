import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey().notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    role: text('role').notNull(),
    profileName: text('profile_name'),
    profileAge: text('profile_age'),
});
