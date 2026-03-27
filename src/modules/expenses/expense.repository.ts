import { db } from "../../infra/db";

export interface CreateExpenseRecord {
	id: string;
	user_id: string;
	name: string;
	amount: number;
}
export interface UpdateExpenseRecord {
	id: string;
	user_id: string;
	name?: string;
	amount?: number;
}

export function insertExpense(data: CreateExpenseRecord) {
	db.prepare(
		"INSERT INTO expenses (id, user_id, name, amount) VALUES (?, ?, ?, ?)",
	).run(data.id, data.user_id, data.name, data.amount);
}

export function linkCategory(expense_id: string, category_name: string) {
	const categoryQuery = db.prepare(
		"SELECT id FROM categories WHERE name = ? COLLATE NOCASE",
	);
	const category = categoryQuery.get(category_name) as { id: number } | null;
	if (category) {
		db.prepare(
			"INSERT OR IGNORE INTO expense_categories (expense_id, category_id) VALUES (?, ?)",
		).run(expense_id, category.id);
	}
}

export function clearCategories(expense_id: string) {
	db.prepare("DELETE FROM expense_categories WHERE expense_id = ?").run(
		expense_id,
	);
}

export function getExpenseByIdAndUser(id: string, user_id: string) {
	return db
		.prepare("SELECT * FROM expenses WHERE id = ? AND user_id = ?")
		.get(id, user_id) as any;
}

export function listExpenses(
	user_id: string,
	filter?: { startDate?: string; endDate?: string },
) {
	let sql = "SELECT * FROM expenses WHERE user_id = ?";
	const params: any[] = [user_id];
	if (filter?.startDate) {
		sql += " AND created_at >= ?";
		params.push(filter.startDate);
	}
	if (filter?.endDate) {
		sql += " AND created_at <= ?";
		params.push(filter.endDate);
	}
	// get associated categories as well
	const rows = db.prepare(sql).all(...params) as any[];
	for (const row of rows) {
		const cats = db.prepare(`SELECT c.name FROM categories c
             JOIN expense_categories ec  ON ec.category_id = c.id
             WHERE ec.expense_id = ?`).all(row.id) as { name: string }[];
		row.categories = cats.map((c) => c.name);
	}
	return rows;
}

export function updateExpenseRecord(data: UpdateExpenseRecord) {
	const sets = [];
	const params: any[] = [];
	if (data.name !== undefined) {
		sets.push("name = ?");
		params.push(data.name);
	}
	if (data.amount !== undefined) {
		sets.push("amount = ?");
		params.push(data.amount);
	}
	if (sets.length > 0) {
		sets.push("updated_at = CURRENT_TIMESTAMP");
		params.push(data.id, data.user_id);
		db.prepare(
			`UPDATE expenses SET ${sets.join(", ")} WHERE id = ? AND user_id = ?`,
		).run(...params);
	}
}

export function deleteExpense(id: string, user_id: string) {
	const res = db
		.prepare("DELETE FROM expenses WHERE id = ? AND user_id = ?")
		.run(id, user_id);
	return res.changes > 0;
}
