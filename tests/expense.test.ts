import { describe, expect, it } from "bun:test";
import { app } from "@/index";

describe("EXPENSES TESTS", async () => {
	const response = await app.handle(
		new Request("http://localhost/api/users/sign-in", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: "test@example.com",
				password: "123456",
			}),
		}),
	);
	const loginData = await response.json();
	const token = loginData.token;

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

	it("/expenses/create route should be exist and not return 404", async () => {
		const response = await app.handle(
			new Request("http://localhost/api/expenses/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: "create a test expense",
					amount: "200",
					category: "Food",
				}),
			}),
		);
	});
});
