import type { SignUpBody } from "./user.dto";
import { getUserIdByEmail, insertUser } from "./user.repository";

type CreateUserResult =
	| { ok: true }
	| {
			ok: false;
			error: "email_exists" | "invalid_email_format" | "internal_error";
	  };

export async function createUser(
	payload: SignUpBody,
): Promise<CreateUserResult> {
	try {
		const { email, username, password } = payload;
		if (!emailFormatIsValid(email))
			return { ok: false, error: "invalid_email_format" };

		const selectResult = getUserIdByEmail(email);
		if (selectResult) return { ok: false, error: "email_exists" };

		const id = Bun.randomUUIDv7();
		const password_hash = await Bun.password.hash(password);
		insertUser({ id, email, username, password_hash });

		return { ok: true };
	} catch (error) {
		console.error("Error creating user:", error);
		return { ok: false, error: "internal_error" };
	}
}

function emailFormatIsValid(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}
