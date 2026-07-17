import { test, expect } from "bun:test";
import { ConfiguredComplexDbContext } from "../../sample/dbcontext/ConfiguredComplexDbContext";
import { ComplexUser, Profile } from "../../sample/Model/ComplexUser";

class ComplexUserDbContext extends ConfiguredComplexDbContext {}

test("should support manually configured complex object mapping", async () => {
  const db = new ComplexUserDbContext();
  const user = new ComplexUser(9001, "Configured User", new Profile("Alias", 33));

  db.users.add(user as any);
  await db.saveChanges();

  const saved = await db.users.findById(9001 as any);

  expect(saved).toBeDefined();
  expect(saved?.name).toBe("Configured User");
  expect(saved?.profile.displayName).toBe("Alias");
  expect(saved?.profile.age).toBe(33);
});
