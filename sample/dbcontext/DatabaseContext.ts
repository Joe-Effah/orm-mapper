import { getDrizzleDb } from "../drizzle/databaseConfiguration";
import { users } from '../drizzle/users';
import { User } from "../Model/User";
import { DbSet } from "../../src/DbSet";
import { modelBuilder } from "../../src/modelbuilder";


export class DbContext {
  readonly users: DbSet<User, typeof users>;

  constructor() {
    modelBuilder.entity(User, users);
    this.users = new DbSet(User, users, getDrizzleDb());
  }

  async saveChanges(): Promise<void> {
    await this.users.flushChanges();
  }
}


