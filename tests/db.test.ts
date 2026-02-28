import { describe, expect, it } from "bun:test";
import { db } from "../src/db/index.js";

describe("Database test suite", () => {
	it("should connect to the database", () => {
		const result = db.query("SELECT 1 AS value").get() as { value: number };
		expect(result).toBeDefined();
		expect(result.value).toBe(1);
	});

	it("should have the users table", () => {
		const result = db
			.query(
				"SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
			)
			.get() as { name: string } | undefined;
		expect(result).toBeDefined();
		expect(result?.name).toBe("users");
	});

	it("table users should have correct columns", () => {
		const result = db.query("PRAGMA table_info(users)").all() as Array<{
			name: string;
		}>;
		const columnNames = result.map((row) => row.name);
		expect(columnNames).toEqual([
			"id",
			"username",
			"email",
			"password_hash",
			"created_at",
			"updated_at",
		]);
	});

	it("should have the expenses table", () => {
		const result = db
			.query(
				"SELECT name FROM sqlite_master WHERE type='table' AND name='expenses'",
			)
			.get() as { name: string } | undefined;
		expect(result).toBeDefined();
		expect(result?.name).toBe("expenses");
	});

	it("table expenses should have correct columns", () => {
		const result = db.query("PRAGMA table_info(expenses)").all() as Array<{
			name: string;
		}>;
		const columnNames = result.map((row) => row.name);
		expect(columnNames).toEqual([
			"id",
			"user_id",
			"name",
			"amount",
			"created_at",
			"updated_at",
		]);
	});

	it("should have the categories table", () => {
		const result = db
			.query(
				"SELECT name FROM sqlite_master WHERE type='table' AND name = 'categories'",
			)
			.get() as { name: string } | undefined;
		expect(result).toBeDefined();
		expect(result?.name).toBe("categories");
	});

	it("table categories should have correct columns", () => {
		const result = db.query("PRAGMA table_info(categories)").all() as Array<{
			name: string;
		}>;
		const columnNames = result.map((row) => row.name);
		expect(columnNames).toEqual(["id", "name"]);
	});
});
