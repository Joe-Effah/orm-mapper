import { DbContext } from "./dbcontext/DatabaseContext";
import { ConfiguredComplexDbContext } from "./dbcontext/ConfiguredComplexDbContext";
import { User } from "./Model/User";
import { ComplexUser, Profile } from "./Model/ComplexUser";

async function runSimpleExample() {
  const db = new DbContext();

  const user = new User("user-1", "Ada", "ada@example.com", "Admin");
  db.users.add(user);
  await db.saveChanges();

  const stored = await db.users.findById("user-1");
  console.log("Simple example:", stored);
}

async function runComplexExample() {
  const db = new ConfiguredComplexDbContext();

  const profile = new Profile("Ada Lovelace", 36);
  const user = new ComplexUser("complex-1", "Ada", profile);

  db.users.add(user as any);
  await db.saveChanges();

  const stored = await db.users.findById("complex-1");
  console.log("Complex example:", stored);
}

await runSimpleExample();
await runComplexExample();
