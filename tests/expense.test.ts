import { describe, expect, it, beforeAll } from "bun:test";
import { app } from "@/index";

describe("EXPENSES TESTS", () => {
	let token = "";
	const email = `test_expense_${Date.now()}@example.com`;

	beforeAll(async () => {
		await app.handle(
			new Request("http://localhost/api/users/sign-up", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					username: "tester",
					password: "password123",
				}),
			}),
		);

		const response = await app.handle(
			new Request("http://localhost/api/users/sign-in", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					password: "password123",
				}),
			}),
		);
		const loginData = await response.json() as { token: string };
		token = loginData.token;
	});

	it("/expenses should be need jwt token to be accessed and return a list of expenses", async () => {
		const response = await app.handle(
			new Request("http://localhost/api/expenses", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		);
		expect(response.status).toBe(200);
	});

	it("POST /api/expenses should return 201 when creating expense", async () => {
		const response = await app.handle(
			new Request("http://localhost/api/expenses", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					name: "create a test expense",
					amount: 200,
					categories: ["Groceries"],
				}),
			}),
		);
		expect(response.status).toBe(201);
	});
});
