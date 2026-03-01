import { db } from "@/db";
import type { SignUpBody } from "./users.models";

export function createUser(payload: SignUpBody): boolean {
	const { email, username, password } = payload;
	const result = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
	if (result) {
		return false;
	}

	db.prepare(
		"INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?) RETURNING id",
	).run(email, username, password);
	return true;
}
