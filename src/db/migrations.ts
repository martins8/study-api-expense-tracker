import { db } from ".";

const categories = [
	"Food",
	"Transport",
	"Entertainment",
	"Utilities",
	"Health",
];
export function migrate() {
	console.log("🛢️  Running database migrations...");
	db.run(`DROP TABLE IF EXISTS expense_categories;`);
	db.run(`DROP TABLE IF EXISTS categories;`);
	db.run(`DROP TABLE IF EXISTS expenses;`);
	db.run(`DROP TABLE IF EXISTS users;`);

	db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `);
	db.run(`
        CREATE TABLE IF NOT EXISTS expenses (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            amount REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
	db.run(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )
    `);
	db.run(`
        CREATE TABLE IF NOT EXISTS expense_categories (
            expense_id TEXT NOT NULL,
            category_id INTEGER NOT NULL,
            FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
            PRIMARY KEY (expense_id, category_id)
        )
    `);

	const insert = db.prepare(
		"INSERT OR IGNORE INTO categories (name) VALUES (?)",
	);
	for (const category of categories) {
		insert.run(category);
	}
}

if (import.meta.main) {
	migrate();
}
