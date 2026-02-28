import Database from "bun:sqlite";

const isTest = process.env.NODE_ENV === "test";

let db: Database;
if (isTest) {
	console.log("\n🛢️  Test env: Using in-memory database");
	db = new Database(":memory:");
} else {
	console.log("\n🛢️  Dev env: Using file-based database ");
	db = new Database("./dev.db");
}

db.run("PRAGMA busy_timeout = 2000");

export { db };
