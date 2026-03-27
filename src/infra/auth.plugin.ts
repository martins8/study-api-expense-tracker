import { jwt } from "@elysiajs/jwt";

export const authSetup = jwt({
	name: "jwt",
	secret: process.env.JWT_SECRET || "super-secret-key",
});
