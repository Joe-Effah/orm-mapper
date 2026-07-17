import { expect } from "bun:test";
import { User } from "../../../sample/Model/User";

export function assertUserShape(user: User | undefined, expected: Partial<User>) {
  expect(user).toBeDefined();

  if (!user) {
    return;
  }

  if (expected.id !== undefined) {
    expect(user.id).toBe(expected.id);
  }

  if (expected.name !== undefined) {
    expect(user.name).toBe(expected.name);
  }

  if (expected.email !== undefined) {
    expect(user.email).toBe(expected.email);
  }

  if (expected.role !== undefined) {
    expect(user.role).toBe(expected.role);
  }
}
