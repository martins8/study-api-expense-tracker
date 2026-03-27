import { Elysia, t } from "elysia";
import { authSetup } from "../../infra/auth.plugin";
import { ExpenseModel } from "./expense.dto";
import {
	createExpenseService,
	deleteExpenseService,
	getExpensesService,
	updateExpenseService,
} from "./expense.service";

export const expenses = new Elysia({ prefix: "api/expenses" })
	.use(authSetup)
	.use(ExpenseModel)
	.derive(async ({ jwt, headers }) => {
		const auth = headers.authorization;
		const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
		if (!token) {
			return { user_id: "" };
		}
		const payload = await jwt.verify(token);
		if (!payload || !payload.sub) {
			return { user_id: "" };
		}
		return { user_id: payload.sub as string };
	})
	.onBeforeHandle(({ user_id, set }) => {
		if (!user_id) {
			set.status = 401;
			return { message: "Unauthorized" };
		}
	})
	.post(
		"/",
		({ body, user_id, set }) => {
			const id = createExpenseService(user_id, body);
			set.status = 201;
			return { id, message: "Expense created" };
		},
		{ body: "createExpense" },
	)
	.get(
		"/",
		({ query, user_id }) => {
			return getExpensesService(
				user_id,
				query.filter,
				query.startDate,
				query.endDate,
			);
		},
		{
			query: t.Object({
				filter: t.Optional(t.String()),
				startDate: t.Optional(t.String()),
				endDate: t.Optional(t.String()),
			}),
		},
	)
	.patch(
		"/:id",
		({ params, body, user_id, set }) => {
			const ok = updateExpenseService(user_id, params.id, body);
			if (!ok) {
				set.status = 404;
				return { message: "Expense not found" };
			}
			return { message: "Expense updated" };
		},
		{ body: "updateExpense", params: t.Object({ id: t.String() }) },
	)
	.delete(
		"/:id",
		({ params, user_id, set }) => {
			const ok = deleteExpenseService(user_id, params.id);
			if (!ok) {
				set.status = 404;
				return { message: "Expense not found" };
			}
			return { message: "Expense deleted" };
		},
		{ params: t.Object({ id: t.String() }) },
	);
