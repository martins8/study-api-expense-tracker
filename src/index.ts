import { fromTypes, openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { users } from "./modules/users/user.controller";

const app = new Elysia()
	.use(
		openapi({
			references: fromTypes(),
		}),
	)
	.get("/", () => "Hello Elysia")
	.use(users);

export { app };

if (import.meta.main) {
	app.listen(3000);

	console.log(
		`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}
📙 docs: http://${app.server?.hostname}:${app.server?.port}/openapi`,
	);
}
