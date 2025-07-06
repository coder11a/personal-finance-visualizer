'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Budget, BudgetFormData } from '@/lib/types';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { BudgetForm } from './BudgetForm';

interface BudgetManagerProps {
    month: string;
    onBudgetUpdate: () => void;
}

export function BudgetManager({ month, onBudgetUpdate }: BudgetManagerProps) {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingBudgets, setIsLoadingBudgets] = useState(true);

    const fetchBudgets = async () => {
        try {
            const response = await fetch(`/api/budgets?month=${month}`);
            if (!response.ok) {
                throw new Error('Failed to fetch budgets');
            }
            const data = await response.json();
            setBudgets(data);
        } catch (error) {
            console.error('Error fetching budgets:', error);
            toast.error('Failed to fetch budgets');
        } finally {
            setIsLoadingBudgets(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, [month]);

    const handleAddBudget = async (data: BudgetFormData) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add budget');
            }

            setShowForm(false);
            fetchBudgets();
            onBudgetUpdate();
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteBudget = async (id: string) => {
        if (!confirm('Are you sure you want to delete this budget?')) {
            return;
        }

        try {
            const response = await fetch(`/api/budgets/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete budget');
            }

            toast.success('Budget deleted successfully!');
            fetchBudgets();
            onBudgetUpdate();
        } catch (error) {
            toast.error('Failed to delete budget', {
                description: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    const formatMonth = (monthString: string) => {
        const [year, month] = monthString.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    };

    if (showForm) {
        return (
            <div className="space-y-4">
                <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="mb-4"
                >
                    ← Back to Budgets
                </Button>
                <BudgetForm
                    onSubmit={handleAddBudget}
                    onCancel={() => setShowForm(false)}
                    isLoading={isLoading}
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Monthly Budgets</h2>
                    <p className="text-sm text-slate-500">{formatMonth(month)}</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Budget
                </Button>
            </div>

            {isLoadingBudgets ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="pt-6">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
                                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : budgets.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center text-slate-500">
                            <p>No budgets set for {formatMonth(month)}</p>
                            <p className="text-sm">Add your first budget to start tracking</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {budgets.map((budget) => (
                        <Card key={budget._id} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-slate-700 dark:text-slate-300">
                                            {budget.category}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Budget: ₹{budget.amount.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteBudget(budget._id!)}
                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
} 