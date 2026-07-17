import { EntityMapping, type AutoMapper, type Constructor } from "./automapping";

class ModelBuilder {
  private mappings = new Map<Function, EntityMapping<any, any>>();

  entity<Domain, Db>(
    domainClass: Constructor<Domain>,
    table: any
  ): EntityMapping<Domain, Db> {
    const mapping = new EntityMapping<Domain, Db>();

    const dbFields = Object.keys(table) as (keyof Db)[];
    mapping.autoMap(domainClass, dbFields);

    this.mappings.set(domainClass, mapping);
    return mapping;
  }

  configureEntity<Domain, Db>(
    domainClass: Constructor<Domain>,
    table: any,
    mapper: {
      toDomain: (row: Db) => Domain;
      toDb: (domain: Domain) => Db;
    }
  ): EntityMapping<Domain, Db> {
    const mapping = this.entity(domainClass, table);
    mapping.withMapping(mapper);
    return mapping;
  }

  getMapping<T>(cls: Constructor<T>): AutoMapper<T, any> {
    return this.mappings.get(cls)!;
  }
}

export const modelBuilder:ModelBuilder = new ModelBuilder();