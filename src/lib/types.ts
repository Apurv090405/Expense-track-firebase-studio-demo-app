
export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string; // ISO 8601 format
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
}

export interface Investment {
    id: string;
    name: string;
    type: string;
    quantity: number;
    purchasePrice: number;
    currentPrice: number;
}

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate?: string;
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Housing',
  'Utilities',
  'Entertainment',
  'Health',
  'Shopping',
  'Other',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
