import { User } from "../../../sample/Model/User";

export type UserOverrides = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
};

export class UserFactory {
  private static nextId = 1;

  static create(overrides: UserOverrides = {}): User {
    const id = overrides.id ?? `user-${UserFactory.nextId++}`;

    return new User(
      id as any,
      overrides.name ?? "Test User",
      overrides.email ?? "test@example.com",
      overrides.role ?? "User"
    );
  }

  static createMany(count: number, overrides: UserOverrides = {}): User[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}
