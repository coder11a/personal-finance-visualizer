'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, TransactionFormData, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/types';
import { toast } from 'sonner';

interface TransactionFormProps {
    transaction?: Transaction;
    onSubmit: (data: TransactionFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function TransactionForm({
    transaction,
    onSubmit,
    onCancel,
    isLoading = false
}: TransactionFormProps) {
    const [formData, setFormData] = useState<TransactionFormData>({
        amount: transaction?.amount.toString() || '',
        description: transaction?.description || '',
        date: transaction?.date || new Date().toISOString().split('T')[0],
        type: transaction?.type || 'expense',
        category: transaction?.category || '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
            toast.success(transaction ? 'Transaction updated successfully!' : 'Transaction added successfully!');
        } catch (error) {
            toast.error('Failed to save transaction', {
                description: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    const handleInputChange = (field: keyof TransactionFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">
                    {transaction ? 'Edit Transaction' : 'Add New Transaction'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={formData.type === 'expense' ? 'default' : 'outline'}
                                onClick={() => handleInputChange('type', 'expense')}
                                className="flex-1"
                            >
                                Expense
                            </Button>
                            <Button
                                type="button"
                                variant={formData.type === 'income' ? 'default' : 'outline'}
                                onClick={() => handleInputChange('type', 'income')}
                                className="flex-1"
                            >
                                Income
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Amount</label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => handleInputChange('amount', e.target.value)}
                            className={errors.amount ? 'border-red-500' : ''}
                        />
                        {errors.amount && (
                            <p className="text-sm text-red-500">{errors.amount}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input
                            type="text"
                            placeholder="Enter description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className={errors.description ? 'border-red-500' : ''}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            className={errors.date ? 'border-red-500' : ''}
                        />
                        {errors.date && (
                            <p className="text-sm text-red-500">{errors.date}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a category</option>
                            {(formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : (transaction ? 'Update' : 'Add')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 