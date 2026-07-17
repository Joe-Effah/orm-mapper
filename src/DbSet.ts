import { eq } from 'drizzle-orm';
 import { modelBuilder } from './modelbuilder/modelbuilder';
import { users } from '../sample/drizzle/users';

export class DbSet<TDomain, TDb> {
  private added: TDomain[] = [];
  private updated: TDomain[] = [];
  private removed: TDomain[] = [];
  private trackedEntities: TDomain[] = [];

  constructor(
    private readonly domainClass: new (...args: any[]) => TDomain,
    private readonly table: any,
    private readonly db: any
  ) {}

  //Works
  add(entity: TDomain) {
    this.added.push(entity);
    this.trackEntity(entity);
  }

  update(entity: TDomain) {
    if (!this.updated.includes(entity)) {
      this.updated.push(entity);
    }
    this.trackEntity(entity);
  }

  //Works
  remove(entity: TDomain) {
    this.removed.push(entity);
  }

private trackEntity(entity: TDomain) {
    if (!this.trackedEntities.includes(entity)) {
      this.trackedEntities.push(entity);
    }
  }

  //Works
    async findById(id: string | number): Promise<TDomain | undefined> {
        const mapper = modelBuilder.getMapping<TDomain>(this.domainClass);
        const row = await this.db.select().from(this.table).where(eq(this.table.id, id)).limit(1).execute();
        if (row.length === 0) {
          return undefined;
        }

        const entity = mapper.toDomain(row[0]);
        this.trackEntity(entity);
        return entity;
    }
    
//Works
  async toArray(): Promise<TDomain[]> {
    const mapper = modelBuilder.getMapping<TDomain>(this.domainClass);
    const rows = await this.db.select().from(this.table);
    const entities = rows.map(mapper.toDomain);
    entities.forEach((entity) => this.trackEntity(entity));
    return entities;
  }

  async find(predicate: (entity: TDomain) => boolean): Promise<TDomain[]> {
    const all = await this.toArray();
    return all.filter(predicate);
  }

    //Works
  async flushChanges() {
    const mapper = modelBuilder.getMapping<TDomain>(this.domainClass);

    for (const entity of this.added) {
      const dbObj = mapper.toDb(entity);
      await this.db.insert(this.table).values(dbObj);
    }

    const entitiesToUpdate = [...this.updated];
    for (const entity of this.trackedEntities) {
      if (!this.added.includes(entity) && !this.removed.includes(entity) && !entitiesToUpdate.includes(entity)) {
        entitiesToUpdate.push(entity);
      }
    }

    for (const entity of entitiesToUpdate) {
      const dbObj = mapper.toDb(entity);
      await this.db
        .update(this.table)
        .set(dbObj)
        .where(eq(this.table.id, (dbObj as any).id));
    }

    for (const entity of this.removed) {
      const dbObj = mapper.toDb(entity);
      await this.db
        .delete(this.table)
        .where(eq(this.table.id, (dbObj as any).id));
    }

    this.added = [];
    this.updated = [];
    this.removed = [];
    this.trackedEntities = [];
  }
}