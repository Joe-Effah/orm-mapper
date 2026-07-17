import { drizzle } from 'drizzle-orm/bun-sqlite';


export class DrizzleDbConnectionMock {
    private static instance: ReturnType<typeof drizzle> | undefined;

    public static getInstance() {
        if (!this.instance) {
            // create an in-repo sqlite test instance and register it with app code
            this.instance = drizzle("file:../../mydb_test.sqlite");
        }

        return this.instance;
    }

    public static reset() {
        this.instance = undefined;
        // Optionally restore default by not calling setDrizzleDb here; tests can set their own instance when needed.
    }
}