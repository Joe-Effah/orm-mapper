import { test, expect } from "bun:test";
import { DbContext } from "../../sample/dbcontext/DatabaseContext";
import { UserFactory } from "../Abstractions/Factories/UserFactory";

test("should return an integer id after save and reload in a user workflow", async () => {
  const db = new DbContext();
  const user = UserFactory.create({ id: 101, name: "Integer Workflow", email: "workflow-integer@example.com", role: "Admin" });

  db.users.add(user);
  await db.saveChanges();

  const reloaded = await db.users.findById(101 as any);

  expect(reloaded).toBeDefined();
  expect(typeof reloaded?.id).toBe("number");
  expect(reloaded?.id).toBe(101);
});
