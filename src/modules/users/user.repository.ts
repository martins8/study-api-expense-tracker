import { db } from "@/infra/db";

export interface InsertUserData {
	id: string;
	email: string;
	username: string;
	password_hash: string;
}

export interface UserCredentials {
	email: string;
	password_hash: string;
}

type UserIdResult = {
	id: string;
} | null;

export function insertUser(data: InsertUserData): void {
	const { id, email, username, password_hash } = data;
	db.prepare(
		"INSERT INTO users (id, email, username, password_hash) VALUES (?, ?, ?, ?)",
	).run(id, email, username, password_hash);
}

export function getUserIdByEmail(email: string): string | null {
	const result = db
		.prepare("SELECT id FROM users WHERE email = ?")
		.get(email) as UserIdResult;
	return result ? result.id : null;
}

export function getHashByEmail(email: string): string | null {
	const result = db
		.prepare("SELECT password_hash FROM users WHERE email = ?")
		.get(email) as { password_hash: string } | null;
	return result ? result.password_hash : null;
}
