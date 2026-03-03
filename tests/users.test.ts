import { describe, expect, it } from "bun:test";
import { app } from "../src/index.js";

const testEmail = `testuser+${Date.now()}@example.com`;

describe("GET /", () => {
	it("should return Elysia default log", async () => {
		const response = await app.handle(new Request("http://localhost/"));
		expect(response.status).toBe(200);
		expect(await response.text()).toBe("Hello Elysia");
	});
});

describe("Users test suite", () => {
	it("/sign-up should be exist and not return 404", async () => {
		const response = await app.handle(
			new Request("http://localhost/api/users/sign-up", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: "testuser",
					email: testEmail,
					password: "password123",
				}),
			}),
		);
		const payload = await response.json();
		expect(response.status).toBe(201);
		expect(payload).toEqual({
			message: "User registration successful",
			token: expect.any(String),
		});
	});

	it("/sign-up should return 400 if email format is invalid", async () => {
		const response = await app.handle(
			new Request("http://localhost/api/users/sign-up", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: "testuser",
					email: "invalid-email-format",
					password: "password123",
				}),
			}),
		);
		expect(response.status).toBe(400);
		expect(await response.json()).toEqual({
			message: "Invalid email format",
			code: 400,
		});
	});

	it("/sign-up should return 422 if email already exists", async () => {
		const response = await app.handle(
			new Request("http://localhost/api/users/sign-up", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: "testuser",
					email: testEmail,
					password: "password123",
				}),
			}),
		);
		expect(response.status).toBe(422);
		expect(await response.json()).toEqual({
			message: "Email already exists",
			code: 422,
		});
	});
});
