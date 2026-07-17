import { Database } from 'bun:sqlite';
import { getDrizzleDb } from "../drizzle/databaseConfiguration";
import { complexUsers } from "../../test/Abstractions/Mocks/ComplexUserTable";
import { ComplexUser } from "../Model/ComplexUser";
import { DbSet } from "../../src/DbSet";
import { modelBuilder } from "../../src/modelbuilder";

function ensureComplexUsersTable() {
  const sqlite = new Database('./mydb.sqlite');
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS complex_users (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      profile_name TEXT,
      profile_age TEXT
    )
  `);
  sqlite.run('DELETE FROM complex_users');
}

export class ConfiguredComplexDbContext {
  readonly users: DbSet<ComplexUser, typeof complexUsers>;

  constructor() {
    ensureComplexUsersTable();

    modelBuilder.configureEntity(ComplexUser, complexUsers, {
      toDomain: (row) => new ComplexUser(row.id, row.name, { displayName: row.profileName, age: Number(row.profileAge) }),
      toDb: (domain: ComplexUser) => ({
        id: domain.id,
        name: domain.name,
        profileName: domain.profile.displayName,
        profileAge: String(domain.profile.age),
      })
    });

    this.users = new DbSet(ComplexUser, complexUsers, getDrizzleDb());
  }

  async saveChanges(): Promise<void> {
    await this.users.flushChanges();
  }
}
