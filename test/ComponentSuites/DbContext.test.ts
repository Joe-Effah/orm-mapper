import { test, expect } from "bun:test";
import { User } from "../../sample/Model/User";
import { DbContext } from "../../sample/dbcontext/DatabaseContext";

// Simple custom numeric ID generator (monotonic, file-scoped)
const nextId = (() => {
  let counter = Date.now();
  return () => (++counter).toString();
})();

test("should map simple object properties", async () => {
  const db = new DbContext();

  // Test: Add a user and save changes
  const id = nextId();
  const user7 = new User(id, 'Alice', 'alice@example.com', 'Role');
  db.users.add(user7);
  await db.saveChanges();

  // Test: Retrieve all users
  const users = await db.users.toArray();
  expect(users.length).toBeGreaterThan(0);
  expect(users.some(u => u.id === id)).toBe(true);
});

test("should find user by id", async () => {
  const db = new DbContext();

  // Add a user first
  const id = nextId();
  const user = new User(id, 'Bob', 'bob@example.com', 'Admin');
  db.users.add(user);
  await db.saveChanges();

  // Test: Find user by id
  const foundUser = await db.users.findById(id);
  expect(foundUser).toBeDefined();
  expect(foundUser?.name).toBe('Bob');
  expect(foundUser?.email).toBe('bob@example.com');
});

test("should update user email", async () => {
  const db = new DbContext();

  // Add a user
  const id = nextId();
  const user = new User(id, 'Charlie', 'charlie@example.com', 'User');
  db.users.add(user);
  await db.saveChanges();

  // Find and update
  const foundUser = await db.users.findById(id);
  expect(foundUser).toBeDefined();
  foundUser!.updateEmail('newemail@example.com');
  
  expect(foundUser!.email).toBe('newemail@example.com');
});

test("should remove user from dbcontext", async () => {
  const db = new DbContext();

  // Add a user
  const id = nextId();
  const user = new User(id, 'David', 'david@example.com', 'User');
  db.users.add(user);
  await db.saveChanges();

  // Remove the user
  db.users.remove(user);
  await db.saveChanges();

  // Verify user is deleted
  const deletedUser = await db.users.findById(id);
  expect(deletedUser).toBeUndefined();
});

test("should add multiple users and retrieve them", async () => {
  const db = new DbContext();
  const initialCount = (await db.users.toArray()).length;

  // Add multiple users with generated IDs
  const id1 = nextId();
  const id2 = nextId();
  const id3 = nextId();
  const user1 = new User(id1, 'Eve', 'eve@example.com', 'User');
  const user2 = new User(id2, 'Frank', 'frank@example.com', 'Admin');
  const user3 = new User(id3, 'Grace', 'grace@example.com', 'User');

  db.users.add(user1);
  db.users.add(user2);
  db.users.add(user3);
  await db.saveChanges();

  // Verify all users are persisted
  const users = await db.users.toArray();
  expect(users.length).toBeGreaterThanOrEqual(initialCount + 3);
  expect(users.some(u => u.id === id1)).toBe(true);
  expect(users.some(u => u.id === id2)).toBe(true);
  expect(users.some(u => u.id === id3)).toBe(true);
});

test("should handle user properties correctly", async () => {
  const db = new DbContext();

  // Create a user with specific properties
  const id = nextId();
  const user = new User(id, 'Henry', 'henry@example.com', 'Admin');
  
  // Verify properties
  expect(user.id).toBe(id);
  expect(user.name).toBe('Henry');
  expect(user.email).toBe('henry@example.com');
  expect(user.role).toBe('Admin');

  // Add and retrieve
  db.users.add(user);
  await db.saveChanges();

  const retrieved = await db.users.findById(id);
  expect(retrieved?.id).toBe(id);
  expect(retrieved?.name).toBe('Henry');
  expect(retrieved?.email).toBe('henry@example.com');
  expect(retrieved?.role).toBe('Admin');
});

test("should return undefined when finding non-existent user", async () => {
  const db = new DbContext();

  // Generate an ID that we won't create and verify it's not found
  const nonExistentId = nextId();
  const nonExistentUser = await db.users.findById(nonExistentId);
  expect(nonExistentUser).toBeUndefined();
});

test("should persist changes across multiple save operations", async () => {
  const db = new DbContext();

  // Add first user and save
  const id1 = nextId();
  const user1 = new User(id1, 'Ivy', 'ivy@example.com', 'User');
  db.users.add(user1);
  await db.saveChanges();

  // Add second user and save
  const id2 = nextId();
  const user2 = new User(id2, 'Jack', 'jack@example.com', 'Admin');
  db.users.add(user2);
  await db.saveChanges();

  // Verify both users exist
  const user1Retrieved = await db.users.findById(id1);
  const user2Retrieved = await db.users.findById(id2);

  expect(user1Retrieved?.name).toBe('Ivy');
  expect(user2Retrieved?.name).toBe('Jack');
});

test("should handle empty users array gracefully", async () => {
  const db = new DbContext();

  // Get all users (should be an array, even if empty or populated)
  const users = await db.users.toArray();
  expect(Array.isArray(users)).toBe(true);
  expect(users.length).toBeGreaterThanOrEqual(0);
});
