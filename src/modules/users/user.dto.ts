import { Elysia, t, type UnwrapSchema } from "elysia";

const signUpBody = t.Object({
	email: t.String(),
	username: t.String(),
	password: t.String({ minLength: 6 }),
});

const signInBody = t.Object({
	email: t.String(),
	password: t.String({ minLength: 6 }),
});

const sucessRes = t.Object({
	message: t.String(),
	token: t.String(),
});

const errorRes = t.Object({
	message: t.String(),
	code: t.Number(),
});

export type SignUpBody = UnwrapSchema<typeof signUpBody>;
export type SignInBody = UnwrapSchema<typeof signInBody>;
export type SucessAuthRes = UnwrapSchema<typeof sucessRes>;
export type ErrorRes = UnwrapSchema<typeof errorRes>;

export const AuthModel = new Elysia().model({
	signIn: signInBody,
	signUp: signUpBody,
	sucessAuthRes: sucessRes,
	errorRes: errorRes,
});
