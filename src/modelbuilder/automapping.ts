export type Constructor<T> = new (...args: any[]) => T;

export type AutoMapper<Domain, Db> = {
  toDomain(row: Db): Domain;
  toDb(entity: Domain): Db;
};

export class EntityMapping<Domain, Db> {
  toDomain!: (row: Db) => Domain;
  toDb!: (domain: Domain) => Db;

  autoMap(domainClass: Constructor<Domain>, dbFields: (keyof Db)[]) {
    this.toDomain = (row: Db) => {
      const values = dbFields.map((field) => (row as any)[field]);
      return new domainClass(...values);
    };

    this.toDb = (domain: Domain) => {
      const obj = {} as Db;
      for (const field of dbFields) {
        (obj as any)[field] = (domain as any)[field];
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
