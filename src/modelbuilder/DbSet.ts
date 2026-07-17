import { eq } from 'drizzle-orm';
 import { modelBuilder } from './modelbuilder';
import { users } from '../../sample/drizzle/users';

export class DbSet<TDomain, TDb> {
  private added: TDomain[] = [];
  private updated: TDomain[] = [];
  private removed: TDomain[] = [];

  constructor(
    private readonly domainClass: new (...args: any[]) => TDomain,
    private readonly table: any,
    private readonly db: any
  ) {}

  //Works
  add(entity: TDomain) {
    this.added.push(entity);
  }

  update(entity: TDomain) {
    this.updated.push(entity);
  }

  //Works
  remove(entity: TDomain) {
    this.removed.push(entity);
  }

//Works
    async findById(id: string): Promise<TDomain | undefined> {
        const mapper = modelBuilder.getMapping<TDomain>(this.domainClass);
        const row = await this.db.select().from(this.table).where(eq(this.table.id, id)).limit(1).execute();
        return row.length > 0 ? mapper.toDomain(row[0]) : undefined;
    }
    
//Works
  async toArray(): Promise<TDomain[]> {
    const mapper = modelBuilder.getMapping<TDomain>(this.domainClass);
    const rows = await this.db.select().from(this.table);
    return rows.map(mapper.toDomain);
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

    for (const entity of this.updated) {
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
  }
}