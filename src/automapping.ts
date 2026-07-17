export type Constructor<T> = new (...args: any[]) => T;

export type AutoMapper<Domain, Db> = {
  toDomain(row: Db): Domain;
  toDb(entity: Domain): Db;
};

export class EntityMapping<Domain, Db> {
  toDomain!: (row: Db) => Domain;
  toDb!: (domain: Domain) => Db;
  private typeHints = new Map<keyof Db, string>();

  autoMap(domainClass: Constructor<Domain>, dbFields: (keyof Db)[]) {
    this.toDomain = (row: Db) => {
      const values = dbFields.map((field) => {
        const value = (row as any)[field];
        const hint = this.typeHints.get(field);

        if (hint === 'number' && value !== null && value !== undefined) {
          const numericValue = typeof value === 'number' ? value : Number(value);
          return Number.isNaN(numericValue) ? value : numericValue;
        }

        return value;
      });
      return new domainClass(...values);
    };

    this.toDb = (domain: Domain) => {
      const obj = {} as Db;
      for (const field of dbFields) {
        const value = (domain as any)[field];
        this.typeHints.set(field, typeof value);
        (obj as any)[field] = value;
      }
      return obj;
    };
  }

  withMapping(mapper: {
    toDomain: (row: Db) => Domain;
    toDb: (domain: Domain) => Db;
  }) {
    this.toDomain = mapper.toDomain;
    this.toDb = mapper.toDb;
  }
}
