'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetFormData, EXPENSE_CATEGORIES } from '@/lib/types';
import { toast } from 'sonner';

interface BudgetFormProps {
    onSubmit: (data: BudgetFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function BudgetForm({
    onSubmit,
    onCancel,
    isLoading = false
}: BudgetFormProps) {
    const [formData, setFormData] = useState<BudgetFormData>({
        month: new Date().toISOString().slice(0, 7), // YYYY-MM format
        category: '',
        amount: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.month) {
            newErrors.month = 'Month is required';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
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
            toast.success('Budget set successfully!');
        } catch (error) {
            toast.error('Failed to set budget', {
                description: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    const handleInputChange = (field: keyof BudgetFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">
                    Set Monthly Budget
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Month</label>
                        <Input
                            type="month"
                            value={formData.month}
                            onChange={(e) => handleInputChange('month', e.target.value)}
                            className={errors.month ? 'border-red-500' : ''}
                        />
                        {errors.month && (
                            <p className="text-sm text-red-500">{errors.month}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                                }`}
                        >
                            <option value="">Select a category</option>
                            {EXPENSE_CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="text-sm text-red-500">{errors.category}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Budget Amount</label>
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
                            {isLoading ? 'Setting...' : 'Set Budget'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 