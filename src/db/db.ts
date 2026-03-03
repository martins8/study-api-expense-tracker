import Database from "bun:sqlite";

const isTest = process.env.NODE_ENV === "test";

let db: Database;
if (isTest) {
	console.log("\n🛢️  Test env: Using test.db");
	db = new Database("./test.db");
} else {
	console.log("\n🛢️  Dev env: Using dev.db ");
	db = new Database("./dev.db");
}

db.run("PRAGMA busy_timeout = 2000");

export { db };
