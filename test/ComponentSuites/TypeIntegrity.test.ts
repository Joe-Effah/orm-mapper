import { test, expect } from "bun:test";
import { DbContext } from "../../sample/dbcontext/DatabaseContext";
import { UserFactory } from "../Abstractions/Factories/UserFactory";

test("should preserve integer ids as numbers when mapped through the component layer", async () => {
  const db = new DbContext();
  const user = UserFactory.create({ id: 77, name: "Typed User", email: "typed@example.com", role: "User" });

  db.users.add(user);
  await db.saveChanges();

  const saved = await db.users.findById(77 as any);

  expect(saved).toBeDefined();
  expect(typeof saved?.id).toBe("number");
  expect(saved?.id).toBe(77);
});
