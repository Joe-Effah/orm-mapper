import { test, expect } from "bun:test";
import { DbContext } from "../../sample/dbcontext/DatabaseContext";
import { UserFactory } from "../Abstractions/Factories/UserFactory";
import { assertUserShape } from "../Abstractions/AssertionHelpers/assertUser";

test("should support a complete add-save-read workflow", async () => {
  const db = new DbContext();
  const user = UserFactory.create({
    name: "Workflow User",
    email: "workflow@example.com",
    role: "Admin"
  });

  db.users.add(user);
  await db.saveChanges();

  const stored = await db.users.findById(user.id as any);

  assertUserShape(stored, {
    id: user.id,
    name: "Workflow User",
    email: "workflow@example.com",
    role: "Admin"
  });
});

test("should preserve updates across save operations", async () => {
  const db = new DbContext();
  const user = UserFactory.create({ name: "Before", email: "before@example.com" });

  db.users.add(user);
  await db.saveChanges();

  const loaded = await db.users.findById(user.id as any);
  expect(loaded).toBeDefined();

  loaded!.updateEmail("after@example.com");
  await db.saveChanges();

  const reloaded = await db.users.findById(user.id as any);
  expect(reloaded?.email).toBe("after@example.com");
});
