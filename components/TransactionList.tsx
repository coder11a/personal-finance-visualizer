'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Transaction, TransactionFormData } from '@/lib/types';
import { toast } from 'sonner';
import { Edit, Trash2, Plus } from 'lucide-react';
import { TransactionForm } from './TransactionForm';

interface TransactionListProps {
    transactions: Transaction[];
    onTransactionUpdate: () => void;
}

export function TransactionList({ transactions, onTransactionUpdate }: TransactionListProps) {
    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddTransaction = async (data: TransactionFormData) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to add transaction');
            }

            setShowForm(false);
            onTransactionUpdate();
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditTransaction = async (data: TransactionFormData) => {
        if (!editingTransaction?._id) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/transactions/${editingTransaction._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update transaction');
            }

            setEditingTransaction(null);
            onTransactionUpdate();
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTransaction = async (id: string) => {
        if (!confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        try {
            const response = await fetch(`/api/transactions/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete transaction');
            }

            toast.success('Transaction deleted successfully!');
            onTransactionUpdate();
        } catch (error) {
            toast.error('Failed to delete transaction', {
                description: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
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
                    ← Back to Transactions
                </Button>
                <TransactionForm
                    onSubmit={handleAddTransaction}
                    onCancel={() => setShowForm(false)}
                    isLoading={isLoading}
                />
            </div>
        );
    }

    if (editingTransaction) {
        return (
            <div className="space-y-4">
                <Button
                    variant="outline"
                    onClick={() => setEditingTransaction(null)}
                    className="mb-4"
                >
                    ← Back to Transactions
                </Button>
                <TransactionForm
                    transaction={editingTransaction}
                    onSubmit={handleEditTransaction}
                    onCancel={() => setEditingTransaction(null)}
                    isLoading={isLoading}
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Transactions</h2>
                <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Transaction
                </Button>
            </div>

            {transactions.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">
                            No transactions yet. Add your first transaction to get started!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                    {transactions.map((transaction) => (
                        <Card key={transaction._id} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-1">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium">
                                                {transaction.description}
                                            </span>
                                            {transaction.category && (
                                                <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                                                    {transaction.category}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(transaction.date)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                                }`}
                                        >
                                            {transaction.type === 'income' ? '+' : '-'}
                                            {formatCurrency(transaction.amount)}
                                        </span>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setEditingTransaction(transaction)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteTransaction(transaction._id!)}
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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