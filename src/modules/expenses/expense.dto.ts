import { Elysia, t, type UnwrapSchema } from "elysia";

const createExpenseBody = t.Object({
	name: t.String(),
	amount: t.Number(),
	categories: t.Optional(t.Array(t.String())),
});

const updateExpenseBody = t.Object({
	name: t.Optional(t.String()),
	amount: t.Optional(t.Number()),
	categories: t.Optional(t.Array(t.String())),
});

export type CreateExpenseDto = UnwrapSchema<typeof createExpenseBody>;
export type UpdateExpenseDto = UnwrapSchema<typeof updateExpenseBody>;

export const ExpenseModel = new Elysia().model({
	createExpense: createExpenseBody,
	updateExpense: updateExpenseBody,
});
