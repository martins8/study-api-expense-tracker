import { describe, expect, it } from "bun:test";
import { db } from "../src/db/index.js";

describe("Database test suite", () => {
	it("should connect to the database", () => {
		const result = db.query("SELECT 1 AS value").get() as { value: number };
		expect(result).toBeDefined();
		expect(result.value).toBe(1);
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
		expect(columnNames).toEqual(
			expect.arrayContaining(["id", "category", "amount", "updated_at"]),
		);
	});
});
