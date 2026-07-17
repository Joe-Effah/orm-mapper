import { test, expect } from "bun:test";
import { ConfiguredComplexDbContext } from "../../sample/dbcontext/ConfiguredComplexDbContext";
import { ComplexUser, Profile } from "../../sample/Model/ComplexUser";

class ConfiguredComplexUserDbContext extends ConfiguredComplexDbContext {}

test("should preserve nested object values through save and reload workflows", async () => {
  const db = new ConfiguredComplexUserDbContext();
  const user = new ComplexUser(7007, "Nested Workflow", new Profile("Nesting", 29));

  db.users.add(user as any);
  await db.saveChanges();

  const reloaded = await db.users.findById(7007 as any);

  expect(reloaded).toBeDefined();
  expect(reloaded?.profile.displayName).toBe("Nesting");
  expect(reloaded?.profile.age).toBe(29);
});
