import { Elysia, t, type UnwrapSchema } from "elysia";

const signUpBody = t.Object({
	email: t.String(),
	username: t.String(),
	password: t.String({ minLength: 6 }),
});

const signInBody = t.Object({
	username: t.String(),
	password: t.String({ minLength: 6 }),
});

const signUpRes = t.Object({
	message: t.String(),
	token: t.String(),
});

const signInRes = t.Object({
	message: t.String(),
	token: t.String(),
});

const ErrorRes = t.Object({
	message: t.String(),
	code: t.Number(),
});

export type SignUpBody = UnwrapSchema<typeof signUpBody>;
export type SignInBody = UnwrapSchema<typeof signInBody>;
export type SignUpRes = UnwrapSchema<typeof signUpRes>;
export type SignInRes = UnwrapSchema<typeof signInRes>;
export type InvalidCredentialsRes = UnwrapSchema<typeof ErrorRes>;
export type EmailAlreadyExistsRes = UnwrapSchema<typeof ErrorRes>;

export const AuthModel = new Elysia().model({
	signIn: signInBody,
	signUp: signUpBody,
	signUpRes: signUpRes,
	signInRes: signInRes,
	invalidCredentialsRes: ErrorRes,
	emailAlreadyExistsRes: ErrorRes,
});
