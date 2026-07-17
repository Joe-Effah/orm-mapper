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

## Complex object mapping

For nested or richer domain objects, you can manually configure how the object should be converted to and from the database shape.

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

## Notes

This project is still evolving and is currently focused on a simple, readable abstraction layer rather than a full production ORM feature set.
