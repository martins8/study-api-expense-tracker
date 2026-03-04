import { Elysia, status } from "elysia";
import { AuthModel } from "./user.dto";
import { signIn, signUp } from "./user.service";

export const users = new Elysia({ prefix: "api/users" })
	.use(AuthModel)
	.post(
		"/sign-up",
		async ({ body }) => {
			const result = await signUp(body);
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
				201: "sucessAuthRes",
				400: "errorRes",
				422: "errorRes",
				500: "errorRes",
			},
		},
	)
	.post(
		"/sign-in",
		async ({ body }) => {
			const result = await signIn(body);
			if (result.ok) {
				return status(200, {
					message: "User authentication successful",
					token: "fake",
				});
			}
			const statusMap = {
				invalid_credentials: status(401, {
					message: "Invalid email or password",
					code: 401,
				}),
				invalid_email_format: status(400, {
					message: "Invalid email format",
					code: 400,
				}),
				internal_error: status(500, {
					message: "Internal server error",
					code: 500,
				}),
			};

			return statusMap[result.error];
		},
		{
			body: "signIn",
			response: {
				200: "sucessAuthRes",
				400: "errorRes",
				401: "errorRes",
				500: "errorRes",
			},
		},
	);
