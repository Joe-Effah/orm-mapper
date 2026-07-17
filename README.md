# orm-mapper

orm-mapper is a lightweight TypeScript abstraction for working with Drizzle-backed data through a DbContext and DbSet style API.

It currently supports:
- simple entity mapping for basic models
- manual mapping configuration for complex nested objects
- basic CRUD-style operations through `DbContext`

## Install

```bash
bun install
```

## Run the sample

```bash
bun run sample/index.ts
```

## Basic usage

Here is a simple example of setting up a basic DbContext for a plain entity:

```ts
import { DbContext } from "./sample/dbcontext/DatabaseContext";
import { User } from "./sample/Model/User";

const db = new DbContext();
const user = new User("user-1", "Ada", "ada@example.com", "Admin");

db.users.add(user);
await db.saveChanges();

const stored = await db.users.findById("user-1");
console.log(stored);
```

This uses the default auto-mapping behavior from the model builder, so the domain model is mapped straight to the database table.

```ts
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



```

## Complex object mapping

For nested or richer domain objects, here is an example of setting up a configured DbContext with explicit mapping logic:

```ts
import { ConfiguredComplexDbContext } from "./sample/dbcontext/ConfiguredComplexDbContext";
import { ComplexUser, Profile } from "./sample/Model/ComplexUser";

const db = new ConfiguredComplexDbContext();
const profile = new Profile("Ada Lovelace", 36);
const user = new ComplexUser("complex-1", "Ada", profile);

db.users.add(user as any);
await db.saveChanges();

const stored = await db.users.findById("complex-1");
console.log(stored);
```
This version uses `modelBuilder.configureEntity(...)` with custom `toDomain` and `toDb` functions so a nested object like `profile` is flattened into table columns and restored correctly on read.

```ts
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
```
## Notes

This project is still evolving and is currently focused on a simple, readable abstraction layer rather than a full production ORM feature set.
