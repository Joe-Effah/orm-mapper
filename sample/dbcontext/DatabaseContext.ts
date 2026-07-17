import { getDrizzleDb } from "../drizzle/databaseConfiguration";
import { users } from '../drizzle/users';
import { User } from "../Model/User";
import { DbSet } from "../../src/modelbuilder/DbSet";

import { modelBuilder } from "../../src/modelbuilder/modelbuilder";


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


