import type { SignInBody, SignUpBody } from "./user.dto";
import {
	getHashByEmail,
	getUserIdByEmail,
	insertUser,
} from "./user.repository";

const SIMULATE_ENV_PEPPER = "some_random_pepper_value";

type CreateUserResult =
	| { ok: true }
	| {
			ok: false;
			error: "email_exists" | "invalid_email_format" | "internal_error";
	  };

type SignInResult =
	| { ok: true }
	| {
			ok: false;
			error: "invalid_credentials" | "invalid_email_format" | "internal_error";
	  };

export async function signUp(payload: SignUpBody): Promise<CreateUserResult> {
	try {
		const { email, username, password } = payload;
		if (!emailFormatIsValid(email))
			return { ok: false, error: "invalid_email_format" };

		const selectResult = getUserIdByEmail(email);
		if (selectResult) return { ok: false, error: "email_exists" };

		const id = Bun.randomUUIDv7();
		const password_hash = await Bun.password.hash(
			password + SIMULATE_ENV_PEPPER,
		);
		insertUser({ id, email, username, password_hash });

		return { ok: true };
	} catch (error) {
		console.error("Error creating user:", error);
		return { ok: false, error: "internal_error" };
	}
}

export async function signIn(payload: SignInBody): Promise<SignInResult> {
	try {
		const { email, password } = payload;
		//check email format
		if (!emailFormatIsValid(email))
			return { ok: false, error: "invalid_email_format" };

		const hashStored = getHashByEmail(email);
		if (!hashStored) return { ok: false, error: "invalid_credentials" };

		const credentialsValid = await Bun.password.verify(
			password + SIMULATE_ENV_PEPPER,
			hashStored,
		);

		if (!credentialsValid) return { ok: false, error: "invalid_credentials" };
		// send ok and token
		return { ok: true };
	} catch (error) {
		console.error("Error signing in:", error);
		return { ok: false, error: "internal_error" };
	}
}

function emailFormatIsValid(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}
