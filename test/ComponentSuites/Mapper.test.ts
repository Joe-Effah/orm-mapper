import { test, expect } from "bun:test";
import { DbContext } from "../../sample/dbcontext/DatabaseContext";
import { UserFactory } from "../Abstractions/Factories/UserFactory";
import { assertUserShape } from "../Abstractions/AssertionHelpers/assertUser";

test("should map simple object properties", async () => {
  const db = new DbContext();

  // Test: Add a user and save changes
  const user7 = UserFactory.create({ id: '3300673', name: 'Alice', email: 'alice@example.com', role: 'Role' });
  db.users.add(user7);
  await db.saveChanges();

  // Test: Retrieve all users
  const users = await db.users.toArray();
  expect(users.length).toBeGreaterThan(0);
  expect(users.some(u => u.id === '3300673')).toBe(true);
});

test("should find user by id", async () => {
  const db = new DbContext();

  // Add a user first
  const user = UserFactory.create({ id: '3300663', name: 'Bob', email: 'bob@example.com', role: 'Admin' });
  db.users.add(user);
  await db.saveChanges();

  // Test: Find user by id
  const foundUser = await db.users.findById('3300663');
  expect(foundUser).toBeDefined();
  expect(foundUser?.name).toBe('Bob');
  expect(foundUser?.email).toBe('bob@example.com');
});

test("should update user email", async () => {
  const db = new DbContext();

  // Add a user
  const user = UserFactory.create({ id: '3300664', name: 'Charlie', email: 'charlie@example.com', role: 'User' });
  db.users.add(user);
  await db.saveChanges();

  // Find and update
  const foundUser = await db.users.findById('3300664');
  expect(foundUser).toBeDefined();
  foundUser!.updateEmail('newemail@example.com');
  
  expect(foundUser!.email).toBe('newemail@example.com');
});

test("should preserve numeric ids when persisted and reloaded", async () => {
  const db = new DbContext();

  const numericId = 42;
  const user = UserFactory.create({ id: numericId as any, name: 'Integer', email: 'integer@example.com', role: 'User' });
  db.users.add(user);
  await db.saveChanges();

  const persistedUsers = await db.users.toArray();
  const persistedUser = persistedUsers.find((value) => value.name === 'Integer');

  expect(persistedUser).toBeDefined();
  expect(typeof persistedUser?.id).toBe('number');
});