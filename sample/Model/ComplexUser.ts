export class Profile {
  constructor(
    public readonly displayName: string,
    public readonly age: number
  ) {}
}

export class ComplexUser {
  constructor(
    public readonly id: string | number,
    public readonly name: string,
    public readonly profile: Profile
  ) {}
}
