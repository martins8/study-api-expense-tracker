import { Elysia, status } from "elysia";
import { AuthModel } from "./user.dto";
import { createUser } from "./user.service";

export const users = new Elysia({ prefix: "api/users" })
	.use(AuthModel) // injeta os models
	.post(
		"/sign-up",
		async ({ body }) => {
			const result = await createUser(body);
			if (result.ok) {
				return status(201, {
					message: "User registration successful",
					token: "fake",
				});
			}
			const statusMap = {
				invalid_email_format: status(400, {
					message: "Invalid email format",
					code: 400,
				}),
				email_exists: status(422, {
					message: "Email already exists",
					code: 422,
				}),
				internal_error: status(500, {
					message: "Internal server error",
					code: 500,
				}),
			};
			return statusMap[result.error];
		},
		{
			body: "signUp",
			response: {
				201: "signUpRes",
				400: "errorRes",
				422: "errorRes",
				500: "errorRes",
			},
		},
	);
/*
	.post("/sign-in", ({ body }) => "teste", {
		body: "signIn",
		response: {
			200: "signInRes",
			401: "invalidCredentialsRes",
		},
		
	});*/
