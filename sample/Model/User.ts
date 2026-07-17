
export class User {
  constructor(
    public readonly id: string | number,
    public readonly name: string,
    public  email: string,
    public readonly role: string
  ) {}

    updateEmail(newEmail: string): void {
    this.email = newEmail;
  }

}
