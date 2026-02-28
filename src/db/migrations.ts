import { db } from ".";

export function migrate() {
	console.log("🛢️  Running database migrations...");
	db.run(`
        DROP TABLE IF EXISTS expenses;
    `);
	db.run(`
        CREATE TABLE IF NOT EXISTS expenses (
            id TEXT PRIMARY KEY,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
}
