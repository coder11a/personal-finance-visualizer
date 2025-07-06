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

export interface Budget {
    _id?: string;
    month: string; // Format: "YYYY-MM"
    category: string;
    amount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BudgetFormData {
    month: string;
    category: string;
    amount: string;
}

export interface BudgetComparison {
    category: string;
    budget: number;
    actual: number;
    remaining: number;
    percentage: number;
    color: string;
}

export interface SpendingInsight {
    type: 'highest' | 'lowest' | 'trend' | 'category';
    title: string;
    description: string;
    value: string;
    icon: string;
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