import type { CreateExpenseDto, UpdateExpenseDto } from "./expense.dto";
import {
	clearCategories,
	deleteExpense,
	getExpenseByIdAndUser,
	insertExpense,
	linkCategory,
	listExpenses,
	updateExpenseRecord,
} from "./expense.repository";

function toDateString(d: Date): string {
    return d.toISOString().replace("T", " ").slice(0, 19);
}

export function createExpenseService(user_id: string, dto: CreateExpenseDto) {
	const id = Bun.randomUUIDv7();
	insertExpense({ id, user_id, name: dto.name, amount: dto.amount });
	if (dto.categories) {
		for (const category of dto.categories) {
			linkCategory(id, category);
		}
	}
	return id;
}

export function updateExpenseService(
	user_id: string,
	id: string,
	dto: UpdateExpenseDto,
) {
	const current = getExpenseByIdAndUser(id, user_id);
	if (!current) return false;

	updateExpenseRecord({ id, user_id, name: dto.name, amount: dto.amount });

	if (dto.categories !== undefined) {
		clearCategories(id);
		for (const category of dto.categories) {
			linkCategory(id, category);
		}
	}
	return true;
}

export function deleteExpenseService(user_id: string, id: string) {
	return deleteExpense(id, user_id);
}

export function getExpensesService(
	user_id: string,
	filterMode?: string,
	startDate?: string,
	endDate?: string,
) {
	let start: Date | undefined;
	let end: Date | undefined = endDate ? new Date(endDate) : undefined;

	if (filterMode === "past_week") {
		start = new Date();
		start.setDate(start.getDate() - 7);
	} else if (filterMode === "past_month") {
		start = new Date();
		start.setMonth(start.getMonth() - 1);
	} else if (filterMode === "last_3_months") {
		start = new Date();
		start.setMonth(start.getMonth() - 3);
	} else if (startDate) {
		start = new Date(startDate);
	}

	const sqlStart = start ? toDateString(start) : undefined;
	const sqlEnd = end ? toDateString(end) : undefined;

	return listExpenses(user_id, { startDate: sqlStart, endDate: sqlEnd });
}
