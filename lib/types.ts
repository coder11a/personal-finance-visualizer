export interface Transaction {
    _id?: string;
    amount: number;
    description: string;
    date: string;
    type: 'income' | 'expense';
    category?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TransactionFormData {
    amount: string;
    description: string;
    date: string;
    type: 'income' | 'expense';
    category?: string;
}

export interface MonthlyData {
    month: string;
    expenses: number;
    income: number;
}

export interface CategoryData {
    category: string;
    amount: number;
    percentage: number;
    color: string;
}

// Predefined categories
export const EXPENSE_CATEGORIES = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Healthcare',
    'Education',
    'Housing',
    'Utilities',
    'Insurance',
    'Travel',
    'Gifts',
    'Other'
] as const;

export const INCOME_CATEGORIES = [
    'Salary',
    'Freelance',
    'Investment',
    'Business',
    'Gifts',
    'Other'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type IncomeCategory = typeof INCOME_CATEGORIES[number]; 